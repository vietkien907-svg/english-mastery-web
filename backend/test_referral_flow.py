import sys
import os
import unittest
from fastapi.testclient import TestClient

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
from database import get_db, Base, engine
import models
import referral_service

client = TestClient(app)


class TestRotatingOneTimeReferralFlow(unittest.TestCase):
    def setUp(self):
        Base.metadata.create_all(bind=engine)
        referral_service.reset_rate_limiter()
        db = next(get_db())
        for email in [
            "student_no_ref@example.com",
            "student_wrong_ref@example.com",
            "student_one_time_1@example.com",
            "student_one_time_2@example.com"
        ]:
            u = db.query(models.User).filter(models.User.email == email).first()
            if u:
                db.delete(u)
        db.commit()

    def test_01_static_old_code_rejected_and_active_code_format(self):
        db = next(get_db())
        active = referral_service.ensure_active_code(db)
        self.assertTrue(active.code.startswith("VU-"))
        self.assertEqual(len(active.code), 9)

        # Static old code NGUYENVU265 must be REJECTED
        res_old = client.get("/api/auth/validate-referral?code=NGUYENVU265")
        self.assertEqual(res_old.status_code, 200)
        self.assertFalse(res_old.json()["valid"])

        # Live active code must be VALID
        res_ok = client.get(f"/api/auth/validate-referral?code={active.code}")
        self.assertEqual(res_ok.status_code, 200)
        self.assertTrue(res_ok.json()["valid"])
        self.assertEqual(res_ok.json()["referrer_name"], "Tô Nguyên Vũ")

    def test_02_code_burns_on_first_use_and_auto_rotates(self):
        db = next(get_db())
        code_1 = referral_service.ensure_active_code(db).code

        # First student uses code_1 -> SUCCEEDS
        res1 = client.post("/api/auth/register", json={
            "email": "student_one_time_1@example.com",
            "password": "password123",
            "full_name": "Học Viên 1",
            "referral_code": code_1
        })
        self.assertEqual(res1.status_code, 200)
        self.assertTrue(res1.json()["success"])
        self.assertEqual(res1.json()["user"]["referred_by"], "tonguyenvu@265.com")

        # Second student trying to reuse code_1 -> REJECTED!
        res_reuse = client.post("/api/auth/register", json={
            "email": "student_one_time_2@example.com",
            "password": "password123",
            "full_name": "Học Viên 2",
            "referral_code": code_1
        })
        self.assertEqual(res_reuse.status_code, 400)
        self.assertIn("1 lần", res_reuse.json().get("detail", "").lower())

        # Verify server auto-rotated to a NEW different code_2
        code_2 = referral_service.ensure_active_code(db).code
        self.assertNotEqual(code_1, code_2)

        # Second student using code_2 -> SUCCEEDS!
        res2 = client.post("/api/auth/register", json={
            "email": "student_one_time_2@example.com",
            "password": "password123",
            "full_name": "Học Viên 2",
            "referral_code": code_2
        })
        self.assertEqual(res2.status_code, 200)
        self.assertTrue(res2.json()["success"])

    def test_03_brute_force_rate_limit_locks_after_5_wrong_attempts(self):
        for i in range(5):
            r = client.get(f"/api/auth/validate-referral?code=WRONG{i}")
            self.assertEqual(r.status_code, 200)
            self.assertFalse(r.json()["valid"])

        # 6th attempt from same IP must return 429 Too Many Requests
        r6 = client.get("/api/auth/validate-referral?code=WRONG6")
        self.assertEqual(r6.status_code, 429)


if __name__ == "__main__":
    unittest.main()
