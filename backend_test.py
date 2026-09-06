#!/usr/bin/env python3
"""
Comprehensive backend test for Glúteo Prime app.
Tests: Profile onboarding, Workout sessions, Premium checkout, Admin endpoints.
"""
import requests
import json
import time
import random
import string

# Base URL from frontend/.env REACT_APP_BACKEND_URL with /api prefix
BASE_URL = "https://musclefit-hub.preview.emergentagent.com/api"

# Admin credentials from backend/.env
ADMIN_EMAIL = "admin@gluteoprime.com"
ADMIN_PASSWORD = "prime123"

# Test results tracking
results = []

def log_test(test_name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    results.append({"test": test_name, "passed": passed, "details": details})
    print(f"{status}: {test_name}")
    if details:
        print(f"  Details: {details}")

def generate_unique_email():
    """Generate unique email for each test run"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"testuser_{random_str}_{int(time.time())}@example.com"

def test_profile_onboarding():
    """A) PROFILE - Test onboarding data persistence"""
    print("\n=== A) PROFILE ONBOARDING ===")
    
    # 1. Register a normal user with unique email
    user_email = generate_unique_email()
    register_data = {
        "name": "Test User",
        "email": user_email,
        "password": "testpass123"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=register_data, timeout=10)
        if resp.status_code != 200:
            log_test("A1: Register normal user", False, f"Status {resp.status_code}: {resp.text}")
            return None, None
        
        data = resp.json()
        token = data.get("token")
        user = data.get("user")
        
        if not token or not user:
            log_test("A1: Register normal user", False, "Missing token or user in response")
            return None, None
        
        log_test("A1: Register normal user", True, f"User ID: {user.get('id')}, Email: {user.get('email')}")
        
    except Exception as e:
        log_test("A1: Register normal user", False, f"Exception: {str(e)}")
        return None, None
    
    # 2. PUT /api/auth/profile with onboarding data
    profile_data = {
        "goal": "emagrecimento",
        "level": "intermediario",
        "weight": 62.5,
        "height": 168,
        "age": 29,
        "days_per_week": 4,
        "onboarding_done": True
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        resp = requests.put(f"{BASE_URL}/auth/profile", json=profile_data, headers=headers, timeout=10)
        if resp.status_code != 200:
            log_test("A2: Update profile with onboarding data", False, f"Status {resp.status_code}: {resp.text}")
            return token, user_email
        
        data = resp.json()
        updated_user = data.get("user", {})
        profile = updated_user.get("profile", {})
        
        # Verify all fields
        checks = [
            ("goal", profile.get("goal") == "emagrecimento"),
            ("level", profile.get("level") == "intermediario"),
            ("weight", profile.get("weight") == 62.5),
            ("height", profile.get("height") == 168),
            ("age", profile.get("age") == 29),
            ("days_per_week", profile.get("days_per_week") == 4),
            ("onboarding_done", profile.get("onboarding_done") == True),
            ("user.onboarding_done", updated_user.get("onboarding_done") == True)
        ]
        
        failed_checks = [name for name, check in checks if not check]
        
        if failed_checks:
            log_test("A2: Update profile with onboarding data", False, f"Failed checks: {failed_checks}. Profile: {profile}")
            return token, user_email
        
        log_test("A2: Update profile with onboarding data", True, f"All fields updated correctly")
        
    except Exception as e:
        log_test("A2: Update profile with onboarding data", False, f"Exception: {str(e)}")
        return token, user_email
    
    # 3. GET /api/auth/me to confirm persistence
    try:
        resp = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        if resp.status_code != 200:
            log_test("A3: Verify profile persistence (GET /me)", False, f"Status {resp.status_code}: {resp.text}")
            return token, user_email
        
        data = resp.json()
        persisted_user = data.get("user", {})
        persisted_profile = persisted_user.get("profile", {})
        
        # Verify persistence
        checks = [
            ("goal", persisted_profile.get("goal") == "emagrecimento"),
            ("weight", persisted_profile.get("weight") == 62.5),
            ("onboarding_done", persisted_profile.get("onboarding_done") == True)
        ]
        
        failed_checks = [name for name, check in checks if not check]
        
        if failed_checks:
            log_test("A3: Verify profile persistence (GET /me)", False, f"Failed checks: {failed_checks}")
            return token, user_email
        
        log_test("A3: Verify profile persistence (GET /me)", True, "Profile data persisted correctly")
        
    except Exception as e:
        log_test("A3: Verify profile persistence (GET /me)", False, f"Exception: {str(e)}")
    
    return token, user_email

def test_workout_sessions(user_token):
    """B) WORKOUT SESSIONS - Test training log functionality"""
    print("\n=== B) WORKOUT SESSIONS ===")
    
    if not user_token:
        print("Skipping workout sessions tests - no user token")
        return
    
    headers = {"Authorization": f"Bearer {user_token}"}
    
    # 2. POST /api/workouts/session/finish with volume calculation
    session_data = {
        "plan_id": "2.0",
        "workout_name": "Treino A · Glúteos + Quadríceps",
        "duration_seconds": 1800,
        "exercises": [
            {
                "name": "Hip Thrust",
                "series": [
                    {"weight": 45, "reps": 10},
                    {"weight": 45, "reps": 8}
                ]
            },
            {
                "name": "Agachamento",
                "series": [
                    {"weight": 30, "reps": 12}
                ]
            }
        ]
    }
    
    # Expected volume: 45*10 + 45*8 + 30*12 = 450 + 360 + 360 = 1170
    expected_volume = 1170
    expected_sets = 3
    
    try:
        resp = requests.post(f"{BASE_URL}/workouts/session/finish", json=session_data, headers=headers, timeout=10)
        if resp.status_code != 200:
            log_test("B2: POST /workouts/session/finish (volume calculation)", False, f"Status {resp.status_code}: {resp.text}")
            return
        
        data = resp.json()
        session_id = data.get("id")
        total_volume = data.get("total_volume")
        total_sets = data.get("total_sets")
        
        if not session_id:
            log_test("B2: POST /workouts/session/finish (volume calculation)", False, "Missing session id")
            return
        
        if total_sets != expected_sets:
            log_test("B2: POST /workouts/session/finish (volume calculation)", False, f"Expected {expected_sets} sets, got {total_sets}")
            return
        
        if total_volume != expected_volume:
            log_test("B2: POST /workouts/session/finish (volume calculation)", False, f"Expected volume {expected_volume}, got {total_volume}")
            return
        
        log_test("B2: POST /workouts/session/finish (volume calculation)", True, f"Session ID: {session_id}, Volume: {total_volume}, Sets: {total_sets}")
        
    except Exception as e:
        log_test("B2: POST /workouts/session/finish (volume calculation)", False, f"Exception: {str(e)}")
        return
    
    # 3. GET /api/workouts/sessions - list sessions
    try:
        resp = requests.get(f"{BASE_URL}/workouts/sessions", headers=headers, timeout=10)
        if resp.status_code != 200:
            log_test("B3: GET /workouts/sessions (list sessions)", False, f"Status {resp.status_code}: {resp.text}")
            return
        
        sessions = resp.json()
        
        if not isinstance(sessions, list):
            log_test("B3: GET /workouts/sessions (list sessions)", False, f"Expected list, got {type(sessions)}")
            return
        
        if len(sessions) < 1:
            log_test("B3: GET /workouts/sessions (list sessions)", False, f"Expected at least 1 session, got {len(sessions)}")
            return
        
        # Verify the session we just created is in the list
        found = any(s.get("id") == session_id for s in sessions)
        if not found:
            log_test("B3: GET /workouts/sessions (list sessions)", False, "Created session not found in list")
            return
        
        log_test("B3: GET /workouts/sessions (list sessions)", True, f"Found {len(sessions)} session(s)")
        
    except Exception as e:
        log_test("B3: GET /workouts/sessions (list sessions)", False, f"Exception: {str(e)}")
        return
    
    # 4. GET /api/workouts/progress - check stats
    try:
        resp = requests.get(f"{BASE_URL}/workouts/progress", headers=headers, timeout=10)
        if resp.status_code != 200:
            log_test("B4: GET /workouts/progress (stats)", False, f"Status {resp.status_code}: {resp.text}")
            return
        
        data = resp.json()
        total_sessions = data.get("total_sessions")
        total_volume = data.get("total_volume")
        best_volume = data.get("best_volume")
        
        if total_sessions < 1:
            log_test("B4: GET /workouts/progress (stats)", False, f"Expected total_sessions >= 1, got {total_sessions}")
            return
        
        if total_volume < expected_volume:
            log_test("B4: GET /workouts/progress (stats)", False, f"Expected total_volume >= {expected_volume}, got {total_volume}")
            return
        
        if best_volume < expected_volume:
            log_test("B4: GET /workouts/progress (stats)", False, f"Expected best_volume >= {expected_volume}, got {best_volume}")
            return
        
        log_test("B4: GET /workouts/progress (stats)", True, f"Sessions: {total_sessions}, Volume: {total_volume}, Best: {best_volume}")
        
    except Exception as e:
        log_test("B4: GET /workouts/progress (stats)", False, f"Exception: {str(e)}")

def test_user_isolation():
    """B5) Test user isolation - second user should not see first user's sessions"""
    print("\n=== B5) USER ISOLATION ===")
    
    # Register a second user
    user2_email = generate_unique_email()
    register_data = {
        "name": "Test User 2",
        "email": user2_email,
        "password": "testpass456"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=register_data, timeout=10)
        if resp.status_code != 200:
            log_test("B5: User isolation (register second user)", False, f"Status {resp.status_code}: {resp.text}")
            return
        
        data = resp.json()
        token2 = data.get("token")
        
        if not token2:
            log_test("B5: User isolation (register second user)", False, "Missing token")
            return
        
        # GET /api/workouts/sessions with second user's token
        headers2 = {"Authorization": f"Bearer {token2}"}
        resp = requests.get(f"{BASE_URL}/workouts/sessions", headers=headers2, timeout=10)
        
        if resp.status_code != 200:
            log_test("B5: User isolation (second user sessions)", False, f"Status {resp.status_code}: {resp.text}")
            return
        
        sessions = resp.json()
        
        if not isinstance(sessions, list):
            log_test("B5: User isolation (second user sessions)", False, f"Expected list, got {type(sessions)}")
            return
        
        if len(sessions) != 0:
            log_test("B5: User isolation (second user sessions)", False, f"Expected empty list, got {len(sessions)} sessions (user isolation FAILED)")
            return
        
        log_test("B5: User isolation (second user sessions)", True, "Second user sees empty list (isolation working)")
        
    except Exception as e:
        log_test("B5: User isolation", False, f"Exception: {str(e)}")

def test_session_security():
    """B6) Test security - GET /workouts/sessions without token should return 401"""
    print("\n=== B6) SESSION SECURITY ===")
    
    try:
        resp = requests.get(f"{BASE_URL}/workouts/sessions", timeout=10)
        
        if resp.status_code != 401:
            log_test("B6: Security (no token)", False, f"Expected 401, got {resp.status_code}")
            return
        
        log_test("B6: Security (no token)", True, "Correctly rejected with 401")
        
    except Exception as e:
        log_test("B6: Security (no token)", False, f"Exception: {str(e)}")

def test_premium_checkout():
    """C) PREMIUM AUTO-ACTIVATION - Test checkout creation"""
    print("\n=== C) PREMIUM CHECKOUT ===")
    
    # Create checkout for a new email
    prem_email = generate_unique_email()
    checkout_data = {
        "plan_id": "3d",
        "period": "mensal",
        "email": prem_email,
        "name": "Prem Teste",
        "origin": "https://musclefit-hub.preview.emergentagent.com"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/payments/checkout", json=checkout_data, timeout=10)
        
        if resp.status_code != 200:
            log_test("C7: POST /payments/checkout (premium)", False, f"Status {resp.status_code}: {resp.text}")
            return
        
        data = resp.json()
        preference_id = data.get("preference_id")
        checkout_url = data.get("checkout_url")
        external_reference = data.get("external_reference")
        
        if not preference_id:
            log_test("C7: POST /payments/checkout (premium)", False, "Missing preference_id")
            return
        
        if not checkout_url:
            log_test("C7: POST /payments/checkout (premium)", False, "Missing checkout_url")
            return
        
        if not external_reference:
            log_test("C7: POST /payments/checkout (premium)", False, "Missing external_reference")
            return
        
        log_test("C7: POST /payments/checkout (premium)", True, f"Checkout created. Preference: {preference_id}, External ref: {external_reference}")
        print(f"  NOTE: Transaction created with status 'pending'. Premium activation on approval is implemented in webhook/_apply_payment but requires real approved payment to observe.")
        
    except Exception as e:
        log_test("C7: POST /payments/checkout (premium)", False, f"Exception: {str(e)}")

def test_admin_endpoints():
    """D) ADMIN - Test admin login and endpoints"""
    print("\n=== D) ADMIN ENDPOINTS ===")
    
    # 8. Login as admin
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=10)
        
        if resp.status_code != 200:
            log_test("D8: Admin login", False, f"Status {resp.status_code}: {resp.text}")
            return None
        
        data = resp.json()
        admin_token = data.get("token")
        admin_user = data.get("user", {})
        is_admin = admin_user.get("is_admin")
        
        if not admin_token:
            log_test("D8: Admin login", False, "Missing token")
            return None
        
        if not is_admin:
            log_test("D8: Admin login", False, f"Expected is_admin=true, got {is_admin}")
            return None
        
        log_test("D8: Admin login", True, f"Admin logged in. Email: {admin_user.get('email')}, is_admin: {is_admin}")
        
    except Exception as e:
        log_test("D8: Admin login", False, f"Exception: {str(e)}")
        return None
    
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 9. GET /api/admin/stats
    try:
        resp = requests.get(f"{BASE_URL}/admin/stats", headers=admin_headers, timeout=10)
        
        if resp.status_code != 200:
            log_test("D9: GET /admin/stats", False, f"Status {resp.status_code}: {resp.text}")
        else:
            data = resp.json()
            required_keys = ["total_users", "premium_users", "free_users", "new_users_24h", 
                           "total_sessions", "sessions_today", "active_subscriptions", 
                           "revenue_total", "paid_transactions"]
            
            missing_keys = [k for k in required_keys if k not in data]
            
            if missing_keys:
                log_test("D9: GET /admin/stats", False, f"Missing keys: {missing_keys}")
            else:
                # Verify all values are numeric
                non_numeric = [k for k in required_keys if not isinstance(data[k], (int, float))]
                
                if non_numeric:
                    log_test("D9: GET /admin/stats", False, f"Non-numeric values: {non_numeric}")
                else:
                    log_test("D9: GET /admin/stats", True, f"Stats: {data}")
        
    except Exception as e:
        log_test("D9: GET /admin/stats", False, f"Exception: {str(e)}")
    
    # 10. GET /api/admin/users
    try:
        resp = requests.get(f"{BASE_URL}/admin/users", headers=admin_headers, timeout=10)
        
        if resp.status_code != 200:
            log_test("D10: GET /admin/users", False, f"Status {resp.status_code}: {resp.text}")
        else:
            users = resp.json()
            
            if not isinstance(users, list):
                log_test("D10: GET /admin/users", False, f"Expected list, got {type(users)}")
            else:
                # Verify user fields
                if len(users) > 0:
                    user = users[0]
                    required_fields = ["id", "name", "email", "plan", "is_admin"]
                    missing_fields = [f for f in required_fields if f not in user]
                    
                    if missing_fields:
                        log_test("D10: GET /admin/users", False, f"Missing fields: {missing_fields}")
                    else:
                        log_test("D10: GET /admin/users", True, f"Found {len(users)} users")
                else:
                    log_test("D10: GET /admin/users", True, f"Found {len(users)} users (empty)")
        
    except Exception as e:
        log_test("D10: GET /admin/users", False, f"Exception: {str(e)}")
    
    # 11. GET /api/admin/sessions
    try:
        resp = requests.get(f"{BASE_URL}/admin/sessions", headers=admin_headers, timeout=10)
        
        if resp.status_code != 200:
            log_test("D11: GET /admin/sessions", False, f"Status {resp.status_code}: {resp.text}")
        else:
            sessions = resp.json()
            
            if not isinstance(sessions, list):
                log_test("D11: GET /admin/sessions", False, f"Expected list, got {type(sessions)}")
            else:
                log_test("D11: GET /admin/sessions", True, f"Found {len(sessions)} sessions")
        
    except Exception as e:
        log_test("D11: GET /admin/sessions", False, f"Exception: {str(e)}")
    
    return admin_token

def test_admin_authorization(normal_user_token):
    """D12) Test admin authorization - normal user should get 403, no token should get 401"""
    print("\n=== D12) ADMIN AUTHORIZATION ===")
    
    # Test with normal user token (should get 403)
    if normal_user_token:
        headers = {"Authorization": f"Bearer {normal_user_token}"}
        try:
            resp = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
            
            if resp.status_code != 403:
                log_test("D12a: Admin auth (normal user)", False, f"Expected 403, got {resp.status_code}")
            else:
                log_test("D12a: Admin auth (normal user)", True, "Correctly rejected with 403")
        
        except Exception as e:
            log_test("D12a: Admin auth (normal user)", False, f"Exception: {str(e)}")
    else:
        log_test("D12a: Admin auth (normal user)", False, "No normal user token available")
    
    # Test without token (should get 401)
    try:
        resp = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
        
        if resp.status_code != 401:
            log_test("D12b: Admin auth (no token)", False, f"Expected 401, got {resp.status_code}")
        else:
            log_test("D12b: Admin auth (no token)", True, "Correctly rejected with 401")
    
    except Exception as e:
        log_test("D12b: Admin auth (no token)", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for r in results if r["passed"])
    failed = sum(1 for r in results if not r["passed"])
    total = len(results)
    
    print(f"\nTotal: {total} tests")
    print(f"Passed: {passed} ✅")
    print(f"Failed: {failed} ❌")
    
    if failed > 0:
        print("\nFailed tests:")
        for r in results:
            if not r["passed"]:
                print(f"  ❌ {r['test']}")
                if r["details"]:
                    print(f"     {r['details']}")
    
    print("\n" + "="*60)
    
    return passed, failed, total

if __name__ == "__main__":
    print("="*60)
    print("GLÚTEO PRIME BACKEND TEST SUITE")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_EMAIL}")
    print("="*60)
    
    # Run all tests
    user_token, user_email = test_profile_onboarding()
    test_workout_sessions(user_token)
    test_user_isolation()
    test_session_security()
    test_premium_checkout()
    admin_token = test_admin_endpoints()
    test_admin_authorization(user_token)
    
    # Print summary
    passed, failed, total = print_summary()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)
