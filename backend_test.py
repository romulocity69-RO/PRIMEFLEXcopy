#!/usr/bin/env python3
"""
Backend Authentication Testing Script
Tests all auth endpoints with comprehensive scenarios
"""
import requests
import time
import json
from typing import Dict, Any

# Base URL from frontend/.env
BASE_URL = "https://musclefit-hub.preview.emergentagent.com/api"

# Generate unique email using timestamp
TIMESTAMP = int(time.time())
UNIQUE_EMAIL = f"teste+{TIMESTAMP}@example.com"

# Test data
TEST_USER = {
    "name": "Maria Teste",
    "email": UNIQUE_EMAIL,
    "password": "senha123"
}

# Colors for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

def print_test(test_name: str):
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST: {test_name}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")

def print_pass(message: str):
    print(f"{GREEN}✓ PASS: {message}{RESET}")

def print_fail(message: str):
    print(f"{RED}✗ FAIL: {message}{RESET}")

def print_info(message: str):
    print(f"{YELLOW}ℹ INFO: {message}{RESET}")

def check_user_response(user: Dict[str, Any], email: str, should_have_password: bool = False) -> bool:
    """Validate user object structure and content"""
    errors = []
    
    # Required fields
    if "id" not in user:
        errors.append("Missing 'id' field")
    if "name" not in user:
        errors.append("Missing 'name' field")
    if "email" not in user:
        errors.append("Missing 'email' field")
    elif user["email"] != email.lower():
        errors.append(f"Email not lowercased: expected '{email.lower()}', got '{user['email']}'")
    
    # Default values
    if user.get("plan") != "free":
        errors.append(f"Expected plan='free', got '{user.get('plan')}'")
    if user.get("is_admin") != False:
        errors.append(f"Expected is_admin=False, got '{user.get('is_admin')}'")
    if user.get("onboarding_done") != False:
        errors.append(f"Expected onboarding_done=False, got '{user.get('onboarding_done')}'")
    
    # Security: password/hash must NOT be present
    if "password" in user:
        errors.append("SECURITY ISSUE: 'password' field present in response")
    if "password_hash" in user:
        errors.append("SECURITY ISSUE: 'password_hash' field present in response")
    
    if errors:
        for error in errors:
            print_fail(error)
        return False
    return True

# Store token for subsequent tests
auth_token = None

# Test Results Summary
test_results = []

def run_test(test_name: str, test_func):
    """Run a test and track results"""
    global test_results
    print_test(test_name)
    try:
        result = test_func()
        test_results.append({"name": test_name, "passed": result})
        return result
    except Exception as e:
        print_fail(f"Exception: {str(e)}")
        test_results.append({"name": test_name, "passed": False})
        return False

# ============================================================================
# TEST 1: POST /api/auth/register - Successful registration
# ============================================================================
def test_register_success():
    global auth_token
    print_info(f"Registering user with email: {TEST_USER['email']}")
    
    response = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    print_info(f"Response: {json.dumps(data, indent=2)}")
    
    # Check token
    if "token" not in data:
        print_fail("Missing 'token' in response")
        return False
    auth_token = data["token"]
    print_pass(f"Token received: {auth_token[:20]}...")
    
    # Check user object
    if "user" not in data:
        print_fail("Missing 'user' in response")
        return False
    
    user = data["user"]
    if not check_user_response(user, TEST_USER["email"]):
        return False
    
    print_pass("Registration successful with correct user structure")
    return True

# ============================================================================
# TEST 2: POST /api/auth/register - Duplicate email (409)
# ============================================================================
def test_register_duplicate():
    print_info(f"Attempting to register with same email: {TEST_USER['email']}")
    
    response = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 409:
        print_fail(f"Expected 409, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    print_info(f"Response: {json.dumps(data, indent=2)}")
    print_pass("Duplicate email correctly rejected with 409")
    return True

# ============================================================================
# TEST 3: POST /api/auth/register - Invalid email (422)
# ============================================================================
def test_register_invalid_email():
    print_info("Testing invalid email format")
    
    invalid_data = {
        "name": "Test User",
        "email": "not-an-email",
        "password": "senha123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=invalid_data)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 422:
        print_fail(f"Expected 422, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    print_pass("Invalid email correctly rejected with 422")
    return True

# ============================================================================
# TEST 4: POST /api/auth/register - Short password (422)
# ============================================================================
def test_register_short_password():
    print_info("Testing password shorter than 6 characters")
    
    invalid_data = {
        "name": "Test User",
        "email": f"test{TIMESTAMP}@example.com",
        "password": "12345"  # Only 5 characters
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=invalid_data)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 422:
        print_fail(f"Expected 422, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    print_pass("Short password correctly rejected with 422")
    return True

# ============================================================================
# TEST 5: POST /api/auth/login - Successful login
# ============================================================================
def test_login_success():
    global auth_token
    print_info(f"Logging in with email: {TEST_USER['email']}")
    
    login_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    print_info(f"Response: {json.dumps(data, indent=2)}")
    
    # Check token
    if "token" not in data:
        print_fail("Missing 'token' in response")
        return False
    auth_token = data["token"]
    print_pass(f"Token received: {auth_token[:20]}...")
    
    # Check user object
    if "user" not in data:
        print_fail("Missing 'user' in response")
        return False
    
    user = data["user"]
    if not check_user_response(user, TEST_USER["email"]):
        return False
    
    print_pass("Login successful with correct user structure")
    return True

# ============================================================================
# TEST 6: POST /api/auth/login - Wrong password (401)
# ============================================================================
def test_login_wrong_password():
    print_info("Testing login with wrong password")
    
    login_data = {
        "email": TEST_USER["email"],
        "password": "wrongpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 401:
        print_fail(f"Expected 401, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    print_pass("Wrong password correctly rejected with 401")
    return True

# ============================================================================
# TEST 7: GET /api/auth/me - Without Authorization header (401)
# ============================================================================
def test_me_no_auth():
    print_info("Testing /me without Authorization header")
    
    response = requests.get(f"{BASE_URL}/auth/me")
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 401:
        print_fail(f"Expected 401, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    print_pass("Unauthorized request correctly rejected with 401")
    return True

# ============================================================================
# TEST 8: GET /api/auth/me - With valid Bearer token (200)
# ============================================================================
def test_me_with_auth():
    print_info("Testing /me with valid Bearer token")
    
    if not auth_token:
        print_fail("No auth token available")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    print_info(f"Response: {json.dumps(data, indent=2)}")
    
    if "user" not in data:
        print_fail("Missing 'user' in response")
        return False
    
    user = data["user"]
    if not check_user_response(user, TEST_USER["email"]):
        return False
    
    print_pass("GET /me successful with correct user data")
    return True

# ============================================================================
# TEST 9: PUT /api/auth/profile - Update profile (200)
# ============================================================================
def test_update_profile():
    print_info("Testing profile update")
    
    if not auth_token:
        print_fail("No auth token available")
        return False
    
    profile_data = {
        "weight": 58.5,
        "height": 165,
        "goal": "hipertrofia",
        "level": "iniciante",
        "onboarding_done": True
    }
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.put(f"{BASE_URL}/auth/profile", json=profile_data, headers=headers)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    print_info(f"Response: {json.dumps(data, indent=2)}")
    
    if "user" not in data:
        print_fail("Missing 'user' in response")
        return False
    
    user = data["user"]
    profile = user.get("profile", {})
    
    # Check profile fields
    errors = []
    if profile.get("weight") != 58.5:
        errors.append(f"Expected weight=58.5, got {profile.get('weight')}")
    if profile.get("height") != 165:
        errors.append(f"Expected height=165, got {profile.get('height')}")
    if profile.get("goal") != "hipertrofia":
        errors.append(f"Expected goal='hipertrofia', got {profile.get('goal')}")
    if profile.get("level") != "iniciante":
        errors.append(f"Expected level='iniciante', got {profile.get('level')}")
    if user.get("onboarding_done") != True:
        errors.append(f"Expected onboarding_done=True, got {user.get('onboarding_done')}")
    
    if errors:
        for error in errors:
            print_fail(error)
        return False
    
    print_pass("Profile updated successfully with correct values")
    return True

# ============================================================================
# TEST 10: GET /api/auth/me - Verify profile persisted (200)
# ============================================================================
def test_me_verify_profile():
    print_info("Testing /me to verify profile persistence")
    
    if not auth_token:
        print_fail("No auth token available")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    print_info(f"Response: {json.dumps(data, indent=2)}")
    
    user = data.get("user", {})
    profile = user.get("profile", {})
    
    # Verify persisted profile
    errors = []
    if profile.get("weight") != 58.5:
        errors.append(f"Expected weight=58.5, got {profile.get('weight')}")
    if user.get("onboarding_done") != True:
        errors.append(f"Expected onboarding_done=True, got {user.get('onboarding_done')}")
    
    if errors:
        for error in errors:
            print_fail(error)
        return False
    
    print_pass("Profile correctly persisted in database")
    return True

# ============================================================================
# TEST 11: GET /api/auth/me - Malformed token (401)
# ============================================================================
def test_me_malformed_token():
    print_info("Testing /me with malformed Bearer token")
    
    headers = {"Authorization": "Bearer garbage-token-12345"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 401:
        print_fail(f"Expected 401, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    print_pass("Malformed token correctly rejected with 401")
    return True

# ============================================================================
# SANITY CHECKS: Existing endpoints
# ============================================================================
def test_root_endpoint():
    print_info("Testing GET /api/")
    
    response = requests.get(f"{BASE_URL}/")
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        return False
    
    data = response.json()
    if data.get("message") != "Hello World":
        print_fail(f"Expected 'Hello World', got {data}")
        return False
    
    print_pass("Root endpoint working")
    return True

def test_payments_config():
    print_info("Testing GET /api/payments/config")
    
    response = requests.get(f"{BASE_URL}/payments/config")
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        return False
    
    data = response.json()
    if not data.get("configured"):
        print_fail("Mercado Pago not configured")
        return False
    
    print_pass("Payments config endpoint working")
    return True

def test_payments_checkout():
    print_info("Testing POST /api/payments/checkout")
    
    checkout_data = {
        "plan_id": "start",
        "period": "mensal",
        "email": "x@x.com",
        "origin": "https://musclefit-hub.preview.emergentagent.com"
    }
    
    response = requests.post(f"{BASE_URL}/payments/checkout", json=checkout_data)
    print_info(f"Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print_fail(f"Expected 200, got {response.status_code}")
        print_info(f"Response: {response.text}")
        return False
    
    data = response.json()
    if "preference_id" not in data or "checkout_url" not in data:
        print_fail("Missing preference_id or checkout_url")
        return False
    
    print_pass("Payments checkout endpoint working")
    return True

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================
if __name__ == "__main__":
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}BACKEND AUTHENTICATION TESTING{RESET}")
    print(f"{BLUE}Base URL: {BASE_URL}{RESET}")
    print(f"{BLUE}Unique Email: {UNIQUE_EMAIL}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    
    # Run all authentication tests
    run_test("1. POST /api/auth/register - Successful registration", test_register_success)
    run_test("2. POST /api/auth/register - Duplicate email (409)", test_register_duplicate)
    run_test("3. POST /api/auth/register - Invalid email (422)", test_register_invalid_email)
    run_test("4. POST /api/auth/register - Short password (422)", test_register_short_password)
    run_test("5. POST /api/auth/login - Successful login", test_login_success)
    run_test("6. POST /api/auth/login - Wrong password (401)", test_login_wrong_password)
    run_test("7. GET /api/auth/me - Without Authorization (401)", test_me_no_auth)
    run_test("8. GET /api/auth/me - With valid Bearer token (200)", test_me_with_auth)
    run_test("9. PUT /api/auth/profile - Update profile (200)", test_update_profile)
    run_test("10. GET /api/auth/me - Verify profile persisted (200)", test_me_verify_profile)
    run_test("11. GET /api/auth/me - Malformed token (401)", test_me_malformed_token)
    
    # Sanity checks for existing endpoints
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}SANITY CHECKS: Existing Endpoints{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    run_test("12. GET /api/ - Root endpoint", test_root_endpoint)
    run_test("13. GET /api/payments/config", test_payments_config)
    run_test("14. POST /api/payments/checkout", test_payments_checkout)
    
    # Print summary
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    
    passed = sum(1 for r in test_results if r["passed"])
    failed = sum(1 for r in test_results if not r["passed"])
    total = len(test_results)
    
    for result in test_results:
        status = f"{GREEN}✓ PASS{RESET}" if result["passed"] else f"{RED}✗ FAIL{RESET}"
        print(f"{status}: {result['name']}")
    
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}Total: {total} | Passed: {GREEN}{passed}{RESET} | Failed: {RED}{failed}{RESET}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)
