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
        self.assertEqual(len(active.code), 12)

        # Static old code NGUYENVU265 must be REJECTED
        res_old = client.get("/api/auth/validate-referral?code=NGUYENVU265")
        self.assertEqual(res_old.status_code, 200)
        self.assertFalse(res_old.json()["valid"])

        # Live active code (even pasted with mobile spaces!) must be VALID
        spaced_code = f"VU - {active.code[3:7]} {active.code[7:]}"
        res_ok = client.get(f"/api/auth/validate-referral?code={spaced_code}")
        self.assertEqual(res_ok.status_code, 200)
        self.assertTrue(res_ok.json()["valid"])
        self.assertEqual(res_ok.json()["referrer_name"], "Tô Nguyên Vũ")

        # Stateless HMAC code (simulating Render container restart before registration) MUST also work ONCE then burn!
        stateless_code = referral_service.generate_signed_code()
        res_stateless = client.get(f"/api/auth/validate-referral?code={stateless_code}")
        self.assertTrue(res_stateless.json()["valid"])

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

    def test_04_hmac_session_survives_render_container_restart(self):
        login_res = client.post("/api/auth/login", json={
            "email": "tonguyenvu@265.com",
            "password": "VuAdmin@265"
        })
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["token"]
        self.assertTrue(token.startswith("emhs1."))

        # Simulate Render container restart wiping UserSession table
        db = next(get_db())
        db.query(models.UserSession).delete()
        db.commit()
        db.close()

        # Token must STILL work seamlessly without 401!
        ref_res = client.get("/api/auth/referral-code", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(ref_res.status_code, 200)
        self.assertTrue(ref_res.json()["referral_code"].startswith("VU-"))

        # Explicit logout must permanently revoke the token
        out_res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(out_res.status_code, 200)
        after_out = client.get("/api/auth/referral-code", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(after_out.status_code, 401)

    def test_05_server_version_and_real_study_streak_logic(self):
        # 1. Check /api/version endpoint
        v_res = client.get("/api/version")
        self.assertEqual(v_res.status_code, 200)
        self.assertEqual(v_res.json()["version"], "103.0")
        self.assertIn("build_id", v_res.json())

        # Reset host streak to 0 (no study today yet) while keeping 280 words
        db = next(get_db())
        vu = db.query(models.User).filter(models.User.email == "tonguyenvu@265.com").first()
        vu.streak_count = 0
        vu.longest_streak = 0
        vu.last_active_date = ""
        db.commit()
        db.close()

        # 2. Login alone MUST NOT auto-increment streak!
        login_res = client.post("/api/auth/login", json={
            "email": "tonguyenvu@265.com",
            "password": "VuAdmin@265"
        })
        self.assertEqual(login_res.status_code, 200)
        self.assertEqual(login_res.json()["user"]["streak"], 0)
        token = login_res.json()["token"]

        me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["streak_count"], 0)

        # 3. Completing a real study task increments streak to 1 (once per day)
        st1 = client.post(
            "/api/auth/complete-study-day",
            json={"task_type": "speaking"},
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(st1.status_code, 200)
        self.assertEqual(st1.json()["streak"], 1)
        self.assertTrue(st1.json()["incremented"])

        st2 = client.post(
            "/api/auth/complete-study-day",
            json={"task_type": "flashcard"},
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(st2.status_code, 200)
        self.assertEqual(st2.json()["streak"], 1)
        self.assertFalse(st2.json()["incremented"])


if __name__ == "__main__":
    unittest.main()
