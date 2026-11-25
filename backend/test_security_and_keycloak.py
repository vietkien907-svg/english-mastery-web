import sys
import os
import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
from database import get_db, Base, engine
import models

client = TestClient(app)


class TestSecurityAndKeycloak(unittest.TestCase):
    def setUp(self):
        Base.metadata.create_all(bind=engine)
        db = next(get_db())
        u = db.query(models.User).filter(models.User.email == "kc_student_test@example.com").first()
        if u:
            db.delete(u)
            db.commit()

    def test_01_security_headers_present(self):
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get("X-Frame-Options"), "DENY")
        self.assertEqual(res.headers.get("X-Content-Type-Options"), "nosniff")

    def test_02_block_url_injection_and_write_methods_on_website_structure(self):
        # Block XSS in query param
        res1 = client.get("/?x=<script>alert(1)</script>")
        self.assertEqual(res1.status_code, 403)

        # Block path traversal
        res2 = client.get("/?file=../../etc/passwd")
        self.assertEqual(res2.status_code, 403)

        # Block PUT/DELETE attempts on website files
        res3 = client.put("/index.html", content="hacked")
        self.assertEqual(res3.status_code, 405)

    def test_03_keycloak_config_endpoint(self):
        res = client.get("/api/auth/keycloak/config")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("enabled", data)
        self.assertIn("realm", data)
        self.assertIn("client_id", data)

    def test_04_keycloak_callback_requires_referral_activation_on_first_login(self):
        from routers import keycloak_router

        fake_cfg = {
            "enabled": True,
            "server_url": "http://localhost:8080",
            "realm": "english-mastery",
            "client_id": "english-mastery-web",
            "require_referral": True
        }

        with patch.object(keycloak_router, "load_keycloak_config", return_value=fake_cfg), \
             patch.object(keycloak_router, "exchange_keycloak_code", return_value={"access_token": "kc_mock_token"}), \
             patch.object(keycloak_router, "fetch_keycloak_userinfo", return_value={
                 "email": "kc_student_test@example.com",
                 "name": "Học Viên Keycloak"
             }):
            res = client.post("/api/auth/keycloak/callback", json={
                "code": "mock_code_123",
                "code_verifier": "mock_verifier_123",
                "redirect_uri": "http://localhost:8000/"
            })
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertTrue(data["success"])
            self.assertTrue(data["needs_referral_activation"])
            token = data["token"]

            # Trying wrong referral code MUST fail
            bad_ref = client.post(
                "/api/auth/keycloak/activate-referral",
                json={"referral_code": "WRONG999"},
                headers={"Authorization": f"Bearer {token}"}
            )
            self.assertEqual(bad_ref.status_code, 400)

            # Active 1-time rotating code activates account and immediately burns it
            import referral_service
            referral_service.reset_rate_limiter()
            db = next(get_db())
            live_code = referral_service.ensure_active_code(db).code

            ok_ref = client.post(
                "/api/auth/keycloak/activate-referral",
                json={"referral_code": live_code},
                headers={"Authorization": f"Bearer {token}"}
            )
            self.assertEqual(ok_ref.status_code, 200)
            self.assertTrue(ok_ref.json()["activated"])
            self.assertEqual(ok_ref.json()["referred_by"], "tonguyenvu@265.com")

            # Live code must have rotated to a brand-new code
            next_code = referral_service.ensure_active_code(db).code
            self.assertNotEqual(live_code, next_code)

    def test_05_admin_login_audit_logs_change_password_and_global_leaderboard(self):
        # 1. Host admin login with VuAdmin@265
        login_res = client.post(
            "/api/auth/login",
            json={"email": "tonguyenvu@265.com", "password": "VuAdmin@265"},
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"}
        )
        self.assertEqual(login_res.status_code, 200)
        host_token = login_res.json()["token"]

        # 2. Verify /api/auth/login-logs filters out automated 'testclient' IP cleanly
        logs_res = client.get("/api/auth/login-logs", headers={"Authorization": f"Bearer {host_token}"})
        self.assertEqual(logs_res.status_code, 200)
        for row in logs_res.json()["logs"]:
            self.assertNotEqual(row["ip_address"], "testclient")

        # 3. Verify change-password works & restore VuAdmin@265
        cp1 = client.post(
            "/api/auth/change-password",
            json={"old_password": "VuAdmin@265", "new_password": "TempPass@999"},
            headers={"Authorization": f"Bearer {host_token}"}
        )
        self.assertEqual(cp1.status_code, 200)
        cp2 = client.post(
            "/api/auth/change-password",
            json={"old_password": "TempPass@999", "new_password": "VuAdmin@265"},
            headers={"Authorization": f"Bearer {host_token}"}
        )
        self.assertEqual(cp2.status_code, 200)

        # 4. Verify Global Server Leaderboard includes tier_label & devices
        lb_res = client.get("/api/stats/leaderboard")
        self.assertEqual(lb_res.status_code, 200)
        lb = lb_res.json()
        self.assertGreaterEqual(len(lb), 1)
        self.assertIn("tier_label", lb[0])
        self.assertIn("devices", lb[0])


if __name__ == "__main__":
    unittest.main()
