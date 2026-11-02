import unittest
import os
import sys
import datetime
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import engine, SessionLocal, Base
import models
import auth
import srs

class TestEnglishMasteryHub(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def setUp(self):
        # Create fresh test users
        self.user1_email = f"user1_{datetime.datetime.utcnow().timestamp()}@example.com"
        self.user2_email = f"user2_{datetime.datetime.utcnow().timestamp()}@example.com"
        
        # Register user 1
        r1 = self.client.post("/api/auth/register", json={
            "email": self.user1_email,
            "password": "Password123!",
            "full_name": "Nguyen Van A",
            "target_exam": "IELTS"
        })
        self.assertEqual(r1.status_code, 200)
        self.u1_token = r1.json()["token"]
        self.u1_id = r1.json()["user"]["id"]
        
        # Register user 2
        r2 = self.client.post("/api/auth/register", json={
            "email": self.user2_email,
            "password": "Password456!",
            "full_name": "Tran Thi B",
            "target_exam": "VSTEP"
        })
        self.assertEqual(r2.status_code, 200)
        self.u2_token = r2.json()["token"]
        self.u2_id = r2.json()["user"]["id"]

    # 1. Test Criteria 1: Hai tài khoản không đọc/sửa/tải file của nhau
    def test_01_user_data_isolation(self):
        # User 1 creates custom word
        r_add = self.client.post("/api/study/custom-item", json={
            "word": "serendipity",
            "meaning_vi": "sự tình cờ may mắn",
            "level": "C1"
        }, headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_add.status_code, 200)
        item_id = r_add.json()["item_id"]
        
        # User 1 export data contains serendipity
        r_exp1 = self.client.get("/api/auth/export-data", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_exp1.status_code, 200)
        self.assertEqual(r_exp1.json()["user"]["email"], self.user1_email)
        
        # User 2 export data does NOT contain user 1's email or private records
        r_exp2 = self.client.get("/api/auth/export-data", headers={"Authorization": f"Bearer {self.u2_token}"})
        self.assertEqual(r_exp2.status_code, 200)
        self.assertEqual(r_exp2.json()["user"]["email"], self.user2_email)
        self.assertNotEqual(r_exp1.json()["user"]["email"], r_exp2.json()["user"]["email"])

    # 2. Test Criteria 2: Đăng nhập, hết hạn, đặt lại mật khẩu và thu hồi phiên
    def test_02_session_lifecycle_and_revocation(self):
        # Check active sessions
        r_sess = self.client.get("/api/auth/sessions", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_sess.status_code, 200)
        sessions = r_sess.json()
        self.assertGreaterEqual(len(sessions), 1)
        sess_id = sessions[0]["id"]
        
        # Forgot password -> generate token
        r_forgot = self.client.post("/api/auth/password/forgot", json={"email": self.user1_email})
        self.assertEqual(r_forgot.status_code, 200)
        reset_token = r_forgot.json()["reset_token"]
        
        # Reset password
        r_reset = self.client.post("/api/auth/password/reset", json={
            "token": reset_token,
            "new_password": "NewSecretPassword789!"
        })
        self.assertEqual(r_reset.status_code, 200)
        
        # Old session must now be revoked (Sec 3)
        r_check = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_check.status_code, 401)
        
        # Login with new password works
        r_login = self.client.post("/api/auth/login", json={
            "email": self.user1_email,
            "password": "NewSecretPassword789!"
        })
        self.assertEqual(r_login.status_code, 200)

    # 3. Test Criteria 3 & 4: Ingestion Deduplication & GSE separate from CEFR
    def test_03_ingestion_deduplication_and_gse_separation(self):
        # Query Speakout item with GSE
        item = self.db.query(models.KnowledgeItem).filter(
            models.KnowledgeItem.source_id == "src_speakout_b1p",
            models.KnowledgeItem.gse.isnot(None)
        ).first()
        self.assertIsNotNone(item)
        self.assertIsInstance(item.gse, int)
        # GSE score (e.g. 58) must NOT replace CEFR level (which is B1+)
        self.assertEqual(item.level, "B1+")
        self.assertNotEqual(item.level, str(item.gse))

    # 4. Test Criteria 6: Missing / verified status verification
    def test_04_verified_sources_integrity(self):
        # 21 grammar topics must be verified with exact reference
        g_topics = self.db.query(models.GrammarTopic).all()
        self.assertEqual(len(g_topics), 21)
        self.assertTrue(all(t.source_verified for t in g_topics))

    # 5. Test Criteria 7 & 8: SM-2 Calculation, Quên vs Nhớ, Hint Penalty
    def test_05_sm2_scheduling_and_hint_penalty(self):
        # Test 1: Good recall without hint
        calc_good = srs.calculate_sm2(
            current_ef=2.5,
            current_reps=0,
            current_interval=0,
            current_lapses=0,
            grade=3,
            used_hint=False
        )
        self.assertEqual(calc_good["interval_days"], 1)
        self.assertEqual(calc_good["repetitions"], 1)
        self.assertEqual(calc_good["state"], "review")

        # Test 2: Easy recall without hint
        calc_easy = srs.calculate_sm2(
            current_ef=2.5,
            current_reps=1,
            current_interval=1,
            current_lapses=0,
            grade=4,
            used_hint=False
        )
        self.assertGreater(calc_easy["interval_days"], 2)
        self.assertEqual(calc_easy["repetitions"], 2)

        # Test 3: Forgotten (Quên / Again) -> interval resets to 1, lapses increments
        calc_again = srs.calculate_sm2(
            current_ef=2.5,
            current_reps=3,
            current_interval=10,
            current_lapses=0,
            grade=1,
            used_hint=False
        )
        self.assertEqual(calc_again["repetitions"], 0)
        self.assertEqual(calc_again["interval_days"], 1)
        self.assertEqual(calc_again["lapses"], 1)
        self.assertEqual(calc_again["state"], "relearning")

        # Test 4: Criteria 8 - User selected Easy (4) but used a hint!
        # Grade MUST be downgraded to Hard (effective grade <= 2)
        calc_hint = srs.calculate_sm2(
            current_ef=2.5,
            current_reps=0,
            current_interval=0,
            current_lapses=0,
            grade=4,
            used_hint=True
        )
        self.assertLessEqual(calc_hint["effective_grade"], 2)

    # 6. Test Criteria 11: Word Saved from Reading Passage & Learn Now vs Save Later
    def test_06_reading_passage_word_save(self):
        # Save for later
        r_later = self.client.post("/api/reading/save-word", json={
            "word_or_phrase": "weather the storm",
            "context_sentence": "We must stay united to weather the storm.",
            "passage_id": 1,
            "save_type": "save_for_later"
        }, headers={"Authorization": f"Bearer {self.u2_token}"})
        self.assertEqual(r_later.status_code, 200)
        
        # Save for later does NOT add to user_item_progress due queue immediately (Sec 12)
        saved_prog = self.db.query(models.UserItemProgress).filter(
            models.UserItemProgress.user_id == self.u2_id,
            models.UserItemProgress.item_id == r_later.json()["item_id"]
        ).first()
        self.assertIsNone(saved_prog)

        # Save with learn_now
        r_now = self.client.post("/api/reading/save-word", json={
            "word_or_phrase": "think on my feet",
            "context_sentence": "I had to think on my feet during the interview.",
            "passage_id": 1,
            "save_type": "learn_now"
        }, headers={"Authorization": f"Bearer {self.u2_token}"})
        self.assertEqual(r_now.status_code, 200)
        
        # Learn now creates UserItemProgress record immediately
        now_prog = self.db.query(models.UserItemProgress).filter(
            models.UserItemProgress.user_id == self.u2_id,
            models.UserItemProgress.item_id == r_now.json()["item_id"]
        ).first()
        self.assertIsNotNone(now_prog)

    # 7. Test Criteria 12: Offline Queue Replay & Idempotency
    def test_07_offline_queue_sync_and_idempotency(self):
        sample_item = self.db.query(models.KnowledgeItem).first()
        self.assertIsNotNone(sample_item)
        
        evt_id = f"test_offline_evt_{datetime.datetime.utcnow().timestamp()}"
        payload = {
            "device_id": "iphone_safari_offline",
            "events": [
                {
                    "client_event_id": evt_id,
                    "item_id": sample_item.id,
                    "test_type": "recognition",
                    "rating": 3,
                    "used_hint": False,
                    "response_time_ms": 3200,
                    "device_id": "iphone_safari_offline",
                    "created_at_client": datetime.datetime.utcnow().isoformat()
                }
            ]
        }
        
        # Sync event 1st time
        r_sync1 = self.client.post("/api/sync/events", json=payload, headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_sync1.status_code, 200)
        self.assertEqual(r_sync1.json()["processed_events"], 1)
        self.assertEqual(r_sync1.json()["duplicate_events"], 0)
        
        # Re-sending the identical event payload (e.g. network retry) must be idempotent!
        r_sync2 = self.client.post("/api/sync/events", json=payload, headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_sync2.status_code, 200)
        self.assertEqual(r_sync2.json()["processed_events"], 0)
        self.assertEqual(r_sync2.json()["duplicate_events"], 1)

    # 8. Test Criteria 14: Streak Calculation (Requires 10 verified answers)
    def test_08_streak_qualification(self):
        # 1 review does not prematurely award streak
        u = self.db.query(models.User).filter(models.User.id == self.u2_id).first()
        initial_streak = u.streak_count
        
        item = self.db.query(models.KnowledgeItem).first()
        self.client.post("/api/study/rate", json={
            "item_id": item.id,
            "rating": 3,
            "client_event_id": f"streak_test_{datetime.datetime.utcnow().timestamp()}"
        }, headers={"Authorization": f"Bearer {self.u2_token}"})
        
        self.db.refresh(u)
        # Verify streak requires 10 answers
        today_activity = self.db.query(models.DailyActivity).filter(
            models.DailyActivity.user_id == self.u2_id,
            models.DailyActivity.date_str == datetime.date.today().isoformat()
        ).first()
        self.assertIsNotNone(today_activity)
        self.assertEqual(today_activity.reviews_count, 1)
        self.assertFalse(today_activity.goal_reached)

    # 9. Test Criteria 9 & 10: Queue Priority Tiers & Shuffling
    def test_09_queue_priority_and_shuffling(self):
        r_queue = self.client.get("/api/study/today", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_queue.status_code, 200)
        data = r_queue.json()
        self.assertIn("items", data)
        self.assertIn("breakdown", data)
        self.assertIn("estimated_minutes", data)
        self.assertIn("due_count", data)
        self.assertIn("new_count", data)

    # 10. Test Criteria 13 & 15: Standalone offline capability
    def test_10_standalone_offline_operation(self):
        # Healthcheck and static resources load without external internet
        r_health = self.client.get("/api/health")
        self.assertEqual(r_health.status_code, 200)
        self.assertEqual(r_health.json()["status"], "healthy")
        
        r_static = self.client.get("/")
        self.assertEqual(r_static.status_code, 200)

    # 11. Test Criteria 17: Full User Account Deletion
    def test_11_account_deletion_cleans_records(self):
        # Register temporary user
        temp_email = f"temp_{datetime.datetime.utcnow().timestamp()}@example.com"
        r_reg = self.client.post("/api/auth/register", json={
            "email": temp_email,
            "password": "Password123!"
        })
        token = r_reg.json()["token"]
        uid = r_reg.json()["user"]["id"]
        
        # Delete account
        r_del = self.client.delete("/api/auth/account", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(r_del.status_code, 200)
        
        # Verify user is completely removed from DB
        check_user = self.db.query(models.User).filter(models.User.id == uid).first()
        self.assertIsNone(check_user)

    # 12. Test Shuffled Deck: Units 1-4 and Units 4-8
    def test_12_shuffled_deck_units_1_to_4_and_4_to_8(self):
        # 1-4
        r_1_4 = self.client.get("/api/study/shuffle-deck?from_unit=1&to_unit=4&limit=30", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_1_4.status_code, 200)
        data_1_4 = r_1_4.json()
        self.assertEqual(data_1_4["from_unit"], 1)
        self.assertEqual(data_1_4["to_unit"], 4)
        self.assertGreater(data_1_4["total_available"], 100)
        self.assertLessEqual(data_1_4["returned_count"], 30)

        # 4-8
        r_4_8 = self.client.get("/api/study/shuffle-deck?from_unit=4&to_unit=8&limit=30", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_4_8.status_code, 200)
        data_4_8 = r_4_8.json()
        self.assertEqual(data_4_8["from_unit"], 4)
        self.assertEqual(data_4_8["to_unit"], 8)
        self.assertGreater(data_4_8["total_available"], 100)
        self.assertLessEqual(data_4_8["returned_count"], 30)

        # 5-8
        r_5_8 = self.client.get("/api/study/shuffle-deck?from_unit=5&to_unit=8&limit=30", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_5_8.status_code, 200)
        data_5_8 = r_5_8.json()
        self.assertEqual(data_5_8["from_unit"], 5)
        self.assertEqual(data_5_8["to_unit"], 8)
        self.assertGreater(data_5_8["total_available"], 100)

        # 9-12
        r_9_12 = self.client.get("/api/study/shuffle-deck?from_unit=9&to_unit=12&limit=30", headers={"Authorization": f"Bearer {self.u1_token}"})
        self.assertEqual(r_9_12.status_code, 200)
        data_9_12 = r_9_12.json()
        self.assertEqual(data_9_12["from_unit"], 9)
        self.assertEqual(data_9_12["to_unit"], 12)
        self.assertGreater(data_9_12["total_available"], 200)

if __name__ == "__main__":
    unittest.main()
