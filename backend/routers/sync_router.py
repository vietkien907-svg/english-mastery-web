import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth
import srs

router = APIRouter(prefix="/api/sync", tags=["Offline Sync & Event Merging"])

class OfflineEventPayload(BaseModel):
    client_event_id: str
    item_id: str
    test_type: str = "recognition"
    rating: int # 1..4
    used_hint: bool = False
    response_time_ms: int = 0
    device_id: str = "offline_client"
    created_at_client: str # ISO datetime string

class BatchSyncRequest(BaseModel):
    device_id: str
    events: list[OfflineEventPayload]

@router.post("/events")
def sync_offline_events(req: BatchSyncRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    """
    Synchronizes offline queue of review events.
    Guarantees deterministic event processing, idempotency, and server-authoritative schedule update.
    """
    now = datetime.datetime.utcnow()
    processed_count = 0
    duplicate_count = 0
    updated_items = []
    
    # Sort events by client timestamp to ensure proper chronological replay
    sorted_events = sorted(req.events, key=lambda x: x.created_at_client)
    
    for evt in sorted_events:
        # Check idempotency
        existing = db.query(models.ReviewEvent).filter(
            models.ReviewEvent.client_event_id == evt.client_event_id
        ).first()
        if existing:
            duplicate_count += 1
            continue
            
        # Parse client event time
        try:
            client_dt = datetime.datetime.fromisoformat(evt.created_at_client.replace("Z", "+00:00"))
        except Exception:
            client_dt = now
            
        # Verify item exists
        item = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.id == evt.item_id).first()
        if not item:
            continue
            
        # Get progress
        progress = db.query(models.UserItemProgress).filter(
            models.UserItemProgress.user_id == current_user.id,
            models.UserItemProgress.item_id == evt.item_id,
            models.UserItemProgress.test_type == evt.test_type
        ).first()
        
        if not progress:
            progress = models.UserItemProgress(
                user_id=current_user.id,
                item_id=evt.item_id,
                test_type=evt.test_type,
                ease_factor=2.5,
                interval_days=0,
                repetitions=0,
                lapses=0,
                state="new"
            )
            db.add(progress)
            db.flush()
            
        calc = srs.calculate_sm2(
            current_ef=progress.ease_factor,
            current_reps=progress.repetitions,
            current_interval=progress.interval_days,
            current_lapses=progress.lapses,
            grade=evt.rating,
            used_hint=evt.used_hint,
            now=client_dt
        )
        
        progress.ease_factor = calc["ease_factor"]
        progress.repetitions = calc["repetitions"]
        progress.interval_days = calc["interval_days"]
        progress.lapses = calc["lapses"]
        progress.due_date = calc["due_date"]
        progress.last_reviewed = calc["last_reviewed"]
        progress.state = calc["state"]
        
        # Save event
        db_evt = models.ReviewEvent(
            client_event_id=evt.client_event_id,
            user_id=current_user.id,
            item_id=evt.item_id,
            test_type=evt.test_type,
            rating=evt.rating,
            response_time_ms=evt.response_time_ms,
            used_hint=evt.used_hint,
            device_id=evt.device_id,
            created_at_client=client_dt,
            received_at_server=now
        )
        db.add(db_evt)
        processed_count += 1
        updated_items.append(evt.item_id)

    db.commit()
    
    return {
        "success": True,
        "processed_events": processed_count,
        "duplicate_events": duplicate_count,
        "server_time": now.isoformat(),
        "updated_item_ids": updated_items
    }

# ================= CLOUD SYNC & CROSS-DEVICE PAIRING =================
import random
import json

class CloudSaveRequest(BaseModel):
    sync_key: str = ""
    payload: dict
    device_name: str = "Web Device"

class GenerateSyncCodeRequest(BaseModel):
    payload: dict
    device_name: str = "Phone"

class ClaimSyncCodeRequest(BaseModel):
    sync_code: str
    device_name: str = "Computer"

@router.post("/cloud-save")
def cloud_save(
    req: CloudSaveRequest,
    current_user: models.User = Depends(auth.get_optional_user),
    db: Session = Depends(get_db)
):
    key = req.sync_key.strip()
    if not key:
        if current_user:
            key = f"user_{current_user.id}"
        else:
            raise HTTPException(status_code=400, detail="Thiếu mã đồng bộ (sync_key).")

    vault = db.query(models.CloudSyncVault).filter(models.CloudSyncVault.sync_key == key).first()
    now = datetime.datetime.utcnow()
    payload_str = json.dumps(req.payload, ensure_ascii=False)

    if not vault:
        vault = models.CloudSyncVault(
            sync_key=key,
            user_id=current_user.id if current_user else None,
            payload_json=payload_str,
            device_name=req.device_name,
            updated_at=now
        )
        db.add(vault)
    else:
        vault.payload_json = payload_str
        vault.device_name = req.device_name
        vault.updated_at = now
        if current_user and not vault.user_id:
            vault.user_id = current_user.id

    # If logged in user, also update user's primary backup
    if current_user and key != f"user_{current_user.id}":
        user_vault = db.query(models.CloudSyncVault).filter(models.CloudSyncVault.sync_key == f"user_{current_user.id}").first()
        if not user_vault:
            user_vault = models.CloudSyncVault(
                sync_key=f"user_{current_user.id}",
                user_id=current_user.id,
                payload_json=payload_str,
                device_name=req.device_name,
                updated_at=now
            )
            db.add(user_vault)
        else:
            user_vault.payload_json = payload_str
            user_vault.updated_at = now

    db.commit()
    return {
        "success": True,
        "sync_key": key,
        "updated_at": now.isoformat(),
        "message": "Đã lưu dữ liệu lên đám mây an toàn."
    }

@router.get("/cloud-load")
def cloud_load(
    sync_key: str = "",
    current_user: models.User = Depends(auth.get_optional_user),
    db: Session = Depends(get_db)
):
    key = sync_key.strip()
    if not key and current_user:
        key = f"user_{current_user.id}"

    if not key:
        return {"success": False, "message": "Chưa có mã đồng bộ."}

    vault = db.query(models.CloudSyncVault).filter(models.CloudSyncVault.sync_key == key).first()
    if not vault and current_user:
        vault = db.query(models.CloudSyncVault).filter(models.CloudSyncVault.user_id == current_user.id).order_by(models.CloudSyncVault.updated_at.desc()).first()

    if not vault:
        return {"success": False, "message": f"Không tìm thấy dữ liệu đồng bộ cho mã '{key}'."}

    try:
        data = json.loads(vault.payload_json)
    except Exception:
        data = {}

    return {
        "success": True,
        "sync_key": vault.sync_key,
        "device_name": vault.device_name,
        "updated_at": vault.updated_at.isoformat() if vault.updated_at else "",
        "data": data
    }

@router.post("/generate-code")
def generate_sync_code(
    req: GenerateSyncCodeRequest,
    current_user: models.User = Depends(auth.get_optional_user),
    db: Session = Depends(get_db)
):
    # Generate random 6-digit PIN
    code = str(random.randint(100000, 999999))
    now = datetime.datetime.utcnow()
    payload_str = json.dumps(req.payload, ensure_ascii=False)

    vault = models.CloudSyncVault(
        sync_key=code,
        user_id=current_user.id if current_user else None,
        payload_json=payload_str,
        device_name=req.device_name,
        updated_at=now
    )
    db.add(vault)

    if current_user:
        user_vault = db.query(models.CloudSyncVault).filter(models.CloudSyncVault.sync_key == f"user_{current_user.id}").first()
        if not user_vault:
            user_vault = models.CloudSyncVault(
                sync_key=f"user_{current_user.id}",
                user_id=current_user.id,
                payload_json=payload_str,
                device_name=req.device_name,
                updated_at=now
            )
            db.add(user_vault)
        else:
            user_vault.payload_json = payload_str
            user_vault.updated_at = now

    db.commit()
    return {
        "success": True,
        "sync_code": code,
        "sync_key": code,
        "message": f"Mã đồng bộ {code} đã được tạo thành công!"
    }

@router.post("/claim-code")
def claim_sync_code(
    req: ClaimSyncCodeRequest,
    current_user: models.User = Depends(auth.get_optional_user),
    db: Session = Depends(get_db)
):
    code = req.sync_code.strip()
    if not code:
        raise HTTPException(status_code=400, detail="Vui lòng nhập mã đồng bộ.")

    vault = db.query(models.CloudSyncVault).filter(models.CloudSyncVault.sync_key == code).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Mã đồng bộ không chính xác hoặc đã hết hạn.")

    try:
        data = json.loads(vault.payload_json)
    except Exception:
        data = {}

    if current_user:
        vault.user_id = current_user.id
        db.commit()

    return {
        "success": True,
        "sync_code": code,
        "sync_key": code,
        "data": data,
        "message": "Đã lấy dữ liệu đồng bộ thành công!"
    }
