import sys
import os
import unittest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
from database import get_db, Base, engine
import models

client = TestClient(app)

class TestReferralAndMultiAccount(unittest.TestCase):
    def setUp(self):
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)
        db = next(get_db())
        # Clean up any test users
        for email in ["student_no_ref@example.com", "student_wrong_ref@example.com", "student_valid_ref_device@example.com"]:
            u = db.query(models.User).filter(models.User.email == email).first()
            if u:
                db.delete(u)
        # Ensure Tô Nguyên Vũ exists with referral_code = 'NGUYENVU265' and streak = 14
        vu = db.query(models.User).filter(models.User.email == "tonguyenvu@265.com").first()
        if vu:
            vu.referral_code = "NGUYENVU265"
            vu.streak_count = 14
            vu.longest_streak = 14
        db.commit()

    def test_01_validate_referral_code(self):
        # Invalid code
        res = client.get("/api/auth/validate-referral?code=INVALID_CODE_999")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data.get("valid"))

        # Valid default code NGUYENVU265
        res = client.get("/api/auth/validate-referral?code=NGUYENVU265")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("valid"))
        self.assertEqual(data.get("referrer_name"), "Tô Nguyên Vũ")

    def test_02_register_without_referral_fails(self):
        res = client.post("/api/auth/register", json={
            "email": "student_no_ref@example.com",
            "password": "password123",
            "full_name": "No Ref Student",
            "referral_code": ""
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("mã giới thiệu", res.json().get("detail", "").lower())

    def test_03_register_with_wrong_referral_fails(self):
        res = client.post("/api/auth/register", json={
            "email": "student_wrong_ref@example.com",
            "password": "password123",
            "full_name": "Wrong Ref Student",
            "referral_code": "WRONG_CODE_XYZ"
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("mã giới thiệu", res.json().get("detail", "").lower())

    def test_04_register_with_valid_referral_succeeds(self):
        test_email = "student_valid_ref_device@example.com"
        # Clean up if existed
        db = next(get_db())
        existing = db.query(models.User).filter(models.User.email == test_email).first()
        if existing:
            db.delete(existing)
            db.commit()

        res = client.post("/api/auth/register", json={
            "email": test_email,
            "password": "password123",
            "full_name": "Thiết Bị Học Viên Mới",
            "target_exam": "IELTS",
            "referral_code": "NGUYENVU265"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))
        self.assertEqual(data["user"]["streak"], 1) # Fresh streak for new user
        self.assertEqual(data["user"]["referred_by"], "tonguyenvu@265.com")

    def test_05_update_and_validate_custom_referral_code(self):
        db = next(get_db())
        vu = db.query(models.User).filter(models.User.email == "tonguyenvu@265.com").first()
        vu.referral_code = "VUVIP88"
        db.commit()

        res = client.get("/api/auth/validate-referral?code=VUVIP88")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("valid"))
        self.assertEqual(data.get("referrer_name"), "Tô Nguyên Vũ")

if __name__ == "__main__":
    unittest.main()
