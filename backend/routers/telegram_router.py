import json
import urllib.request
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth

router = APIRouter(prefix="/api/telegram", tags=["Telegram Notifications"])

class TelegramTestRequest(BaseModel):
    bot_token: str
    chat_id: str
    message: str = ""

class TelegramSaveConfigRequest(BaseModel):
    bot_token: str
    chat_id: str
    remind_morning: bool = True
    remind_evening: bool = True
    remind_deadline: bool = True
    deadline_time: str = "21:30"
    is_active: bool = True

def send_telegram_message(bot_token: str, chat_id: str, text: str) -> dict:
    bot_token = bot_token.strip()
    chat_id = chat_id.strip()
    if not bot_token or not chat_id:
        return {"success": False, "error": "Thiếu Bot Token hoặc Chat ID"}
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "EnglishMasteryBot/1.0"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            if res_json.get("ok"):
                return {"success": True, "result": res_json.get("result")}
            return {"success": False, "error": res_json.get("description", "Lỗi gửi tin nhắn")}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_msg)
            desc = err_json.get("description", str(e))
        except Exception:
            desc = str(e)
        return {"success": False, "error": f"Lỗi Telegram ({e.code}): {desc}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/test")
def test_telegram_notification(req: TelegramTestRequest):
    """Gửi một tin nhắn thử nghiệm tới tài khoản Telegram của người dùng"""
    msg = req.message.strip() or (
        "🔔 <b>[TEST] English Mastery Hub</b>\n\n"
        "🎉 Chúc mừng bạn! Tính năng tự động thông báo qua Telegram đã kết nối thành công!\n\n"
        "⏰ Hàng ngày hệ thống sẽ tự động nhắc nhở bạn theo các mốc giờ:\n"
        "• 08:00 sáng: Mục tiêu ngày mới (20 từ vựng + 1 bài đọc)\n"
        "• 19:30 tối: Ôn tập từ vựng ngắt quãng (SRS)\n"
        "• Trước Deadline: Cảnh báo hoàn thành chỉ tiêu\n\n"
        "👉 Vào học ngay: https://english-mastery-web.onrender.com"
    )
    result = send_telegram_message(req.bot_token, req.chat_id, msg)
    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Không thể gửi tin nhắn Telegram.")
        )
    return {"message": "Tin nhắn thử nghiệm đã được gửi thành công tới Telegram của bạn!", "result": result}

@router.post("/save")
def save_telegram_config(
    req: TelegramSaveConfigRequest,
    db: Session = Depends(get_db)
):
    """Lưu cấu hình Telegram vào cơ sở dữ liệu"""
    setting = db.query(models.UserNotificationSetting).first()
    if not setting:
        setting = models.UserNotificationSetting(
            user_id=1,
            telegram_bot_token=req.bot_token.strip(),
            telegram_chat_id=req.chat_id.strip(),
            remind_morning=req.remind_morning,
            remind_evening=req.remind_evening,
            remind_deadline=req.remind_deadline,
            deadline_time=req.deadline_time,
            is_active=req.is_active
        )
        db.add(setting)
    else:
        setting.telegram_bot_token = req.bot_token.strip()
        setting.telegram_chat_id = req.chat_id.strip()
        setting.remind_morning = req.remind_morning
        setting.remind_evening = req.remind_evening
        setting.remind_deadline = req.remind_deadline
        setting.deadline_time = req.deadline_time
        setting.is_active = req.is_active
    db.commit()
    return {"message": "Đã lưu cấu hình thông báo Telegram thành công!"}

@router.get("/config")
def get_telegram_config(db: Session = Depends(get_db)):
    """Lấy cấu hình Telegram hiện tại"""
    setting = db.query(models.UserNotificationSetting).first()
    if not setting:
        return {
            "configured": False,
            "bot_token": "",
            "chat_id": "",
            "remind_morning": True,
            "remind_evening": True,
            "remind_deadline": True,
            "deadline_time": "21:30",
            "is_active": True
        }
    return {
        "configured": bool(setting.telegram_bot_token and setting.telegram_chat_id),
        "bot_token": setting.telegram_bot_token,
        "chat_id": setting.telegram_chat_id,
        "remind_morning": setting.remind_morning,
        "remind_evening": setting.remind_evening,
        "remind_deadline": setting.remind_deadline,
        "deadline_time": setting.deadline_time,
        "is_active": setting.is_active
    }

@router.post("/send-daily-reminder")
def trigger_daily_reminder(
    reminder_type: str = "daily", # morning, evening, deadline, daily
    db: Session = Depends(get_db)
):
    """Kích hoạt gửi thông báo tự động (dùng cho Background Runner hoặc Cronjob)"""
    setting = db.query(models.UserNotificationSetting).filter(models.UserNotificationSetting.is_active == True).first()
    if not setting or not setting.telegram_bot_token or not setting.telegram_chat_id:
        return {"status": "skipped", "reason": "Chưa cài đặt Telegram"}
    
    # Get due items count
    due_count = db.query(models.UserItemProgress).filter(models.UserItemProgress.state == "review").count() or 20
    user = db.query(models.User).first()
    streak = user.streak_count if user else 1
    
    if reminder_type == "morning":
        title = "🌅 <b>CHÀO NGÀY MỚI - MỤC TIÊU HÔM NAY</b>"
        body = f"Hôm nay bạn có <b>20 từ mới</b> và <b>1 bài đọc IELTS/VSTEP</b> cần chinh phục.\n🔥 Streak hiện tại: <b>{streak} ngày liên tiếp</b>!"
    elif reminder_type == "evening":
        title = "🌆 <b>NHẮC NHỞ ÔN TẬP BUỔI TỐI</b>"
        body = f"Bạn đang có <b>{due_count} từ vựng SRS</b> cần củng cố trước khi đi ngủ."
    elif reminder_type == "deadline":
        title = "🚨 <b>CẢNH BÁO SẮP HẾT HẠN DEADLINE HÔM NAY!</b>"
        body = f"Chỉ còn 30 phút nữa là tới deadline ({setting.deadline_time})! Đừng để đứt chuỗi streak <b>{streak} ngày</b> nhé!"
    else:
        title = "⏰ <b>ENGLISH MASTERY HUB - NHẮC NHỞ HỌC TẬP</b>"
        body = f"Bạn còn bài tập hôm nay chưa hoàn thành. Hãy mở ứng dụng ôn luyện ngay!"
        
    full_message = (
        f"{title}\n\n"
        f"{body}\n\n"
        f"👉 <b>Mở app luyện tập ngay:</b>\n"
        f"https://english-mastery-web.onrender.com"
    )
    
    res = send_telegram_message(setting.telegram_bot_token, setting.telegram_chat_id, full_message)
    return {"status": "sent", "telegram_result": res}
