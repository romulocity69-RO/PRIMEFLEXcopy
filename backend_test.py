"""
Backend API tests for Mercado Pago payment integration.
Tests all payment endpoints using the production backend URL.
"""
import requests
import json
import time

# Base URL from frontend/.env REACT_APP_BACKEND_URL
BASE_URL = "https://musclefit-hub.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test basic root endpoint"""
    print("\n=== Testing GET /api/ ===")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("message") == "Hello World", f"Expected 'Hello World', got {data}"
        print("✅ PASS: Root endpoint working")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_payments_config():
    """Test GET /api/payments/config"""
    print("\n=== Testing GET /api/payments/config ===")
    try:
        response = requests.get(f"{BASE_URL}/payments/config", timeout=10)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert "public_key" in data, "Missing 'public_key' in response"
        assert "configured" in data, "Missing 'configured' in response"
        assert data["public_key"].startswith("APP_USR-"), f"Invalid public_key format: {data['public_key']}"
        assert data["configured"] == True, "Mercado Pago not configured"
        
        print("✅ PASS: Config endpoint working")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_payments_plans():
    """Test GET /api/payments/plans"""
    print("\n=== Testing GET /api/payments/plans ===")
    try:
        response = requests.get(f"{BASE_URL}/payments/plans", timeout=10)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Check required plans
        required_plans = ["start", "2.0", "3d"]
        for plan_id in required_plans:
            assert plan_id in data, f"Missing plan '{plan_id}'"
            plan = data[plan_id]
            assert "periods" in plan, f"Missing 'periods' in plan {plan_id}"
            
            # Check required periods
            required_periods = ["mensal", "trimestral", "semestral", "anual"]
            for period in required_periods:
                assert period in plan["periods"], f"Missing period '{period}' in plan {plan_id}"
                period_data = plan["periods"][period]
                assert "price" in period_data, f"Missing 'price' in {plan_id}/{period}"
                assert isinstance(period_data["price"], (int, float)), f"Price must be numeric in {plan_id}/{period}"
        
        print("✅ PASS: Plans endpoint working with correct structure")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_checkout_valid():
    """Test POST /api/payments/checkout with valid data (MAIN TEST - creates real MP preference)"""
    print("\n=== Testing POST /api/payments/checkout (VALID - Real Mercado Pago API call) ===")
    try:
        payload = {
            "plan_id": "2.0",
            "period": "trimestral",
            "email": "teste@example.com",
            "name": "Teste Prime",
            "origin": "https://musclefit-hub.preview.emergentagent.com"
        }
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/payments/checkout", json=payload, timeout=20)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error response: {response.text}")
            assert False, f"Expected 200, got {response.status_code}. Error: {response.text}"
        
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Validate response structure
        assert "preference_id" in data, "Missing 'preference_id'"
        assert "checkout_url" in data, "Missing 'checkout_url'"
        assert "external_reference" in data, "Missing 'external_reference'"
        assert "public_key" in data, "Missing 'public_key'"
        assert "amount" in data, "Missing 'amount'"
        assert "title" in data, "Missing 'title'"
        
        # Validate values
        assert data["preference_id"], "preference_id is empty"
        assert "mercadopago.com" in data["checkout_url"], f"Invalid checkout_url: {data['checkout_url']}"
        assert data["external_reference"].startswith("gp:2.0:trimestral:"), f"Invalid external_reference format: {data['external_reference']}"
        assert data["amount"] == 179.90, f"Expected amount 179.90, got {data['amount']}"
        assert "2.0" in data["title"] and "Trimestral" in data["title"], f"Invalid title: {data['title']}"
        
        print("✅ PASS: Checkout endpoint working - Real Mercado Pago preference created successfully!")
        print(f"✅ External Reference: {data['external_reference']}")
        
        # Return external_reference for subsequent tests
        return data["external_reference"]
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return None


def test_checkout_invalid_plan():
    """Test POST /api/payments/checkout with invalid plan_id"""
    print("\n=== Testing POST /api/payments/checkout (INVALID PLAN) ===")
    try:
        payload = {
            "plan_id": "gold",  # Invalid plan
            "period": "trimestral",
            "email": "teste@example.com",
            "name": "Teste",
            "origin": "https://musclefit-hub.preview.emergentagent.com"
        }
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/payments/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("✅ PASS: Invalid plan correctly rejected with 400")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_checkout_invalid_period():
    """Test POST /api/payments/checkout with invalid period"""
    print("\n=== Testing POST /api/payments/checkout (INVALID PERIOD) ===")
    try:
        payload = {
            "plan_id": "2.0",
            "period": "weekly",  # Invalid period
            "email": "teste@example.com",
            "name": "Teste",
            "origin": "https://musclefit-hub.preview.emergentagent.com"
        }
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/payments/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("✅ PASS: Invalid period correctly rejected with 400")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_checkout_missing_email():
    """Test POST /api/payments/checkout with missing email"""
    print("\n=== Testing POST /api/payments/checkout (MISSING EMAIL) ===")
    try:
        payload = {
            "plan_id": "2.0",
            "period": "trimestral",
            # Missing email
            "name": "Teste",
            "origin": "https://musclefit-hub.preview.emergentagent.com"
        }
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/payments/checkout", json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code in [400, 422], f"Expected 400 or 422, got {response.status_code}"
        print(f"✅ PASS: Missing email correctly rejected with {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_status_endpoint(external_reference):
    """Test GET /api/payments/status/{external_reference}"""
    print(f"\n=== Testing GET /api/payments/status/{external_reference} ===")
    try:
        response = requests.get(f"{BASE_URL}/payments/status/{external_reference}", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error response: {response.text}")
            assert False, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Validate transaction document
        assert data.get("external_reference") == external_reference, "External reference mismatch"
        assert data.get("status") == "pending", f"Expected status 'pending', got {data.get('status')}"
        assert data.get("amount") == 179.90, f"Expected amount 179.90, got {data.get('amount')}"
        assert data.get("plan_id") == "2.0", f"Expected plan_id '2.0', got {data.get('plan_id')}"
        assert data.get("period") == "trimestral", f"Expected period 'trimestral', got {data.get('period')}"
        
        print("✅ PASS: Status endpoint working - Transaction found with correct data")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_status_endpoint_not_found():
    """Test GET /api/payments/status/{external_reference} with nonexistent reference"""
    print("\n=== Testing GET /api/payments/status/nonexistent-ref (NOT FOUND) ===")
    try:
        response = requests.get(f"{BASE_URL}/payments/status/nonexistent-ref-12345", timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✅ PASS: Nonexistent reference correctly returns 404")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_verify_endpoint(external_reference):
    """Test GET /api/payments/verify?external_reference=..."""
    print(f"\n=== Testing GET /api/payments/verify?external_reference={external_reference} ===")
    try:
        response = requests.get(
            f"{BASE_URL}/payments/verify",
            params={"external_reference": external_reference},
            timeout=20
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error response: {response.text}")
            assert False, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Validate transaction (status likely still pending since no payment was made)
        assert data.get("external_reference") == external_reference, "External reference mismatch"
        assert "status" in data, "Missing 'status' field"
        print(f"Transaction status: {data.get('status')}")
        
        print("✅ PASS: Verify endpoint working - Searched Mercado Pago API successfully")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_webhook_payment_type():
    """Test POST /api/payments/webhook with payment type"""
    print("\n=== Testing POST /api/payments/webhook (PAYMENT TYPE) ===")
    try:
        payload = {
            "type": "payment",
            "data": {"id": "123456"}
        }
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/payments/webhook?type=payment",
            json=payload,
            timeout=10
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert data.get("received") == True, "Expected 'received': true"
        
        print("✅ PASS: Webhook endpoint working for payment type (signature validation disabled)")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_webhook_non_payment_type():
    """Test POST /api/payments/webhook with non-payment type"""
    print("\n=== Testing POST /api/payments/webhook (NON-PAYMENT TYPE) ===")
    try:
        payload = {
            "type": "plan",
            "data": {"id": "789"}
        }
        print(f"Request payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/payments/webhook",
            json=payload,
            timeout=10
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert data.get("received") == True, "Expected 'received': true"
        
        print("✅ PASS: Webhook endpoint working for non-payment type")
        return True
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 80)
    print("MERCADO PAGO PAYMENT BACKEND API TESTS")
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    
    results = {}
    external_ref = None
    
    # Test 1: Root endpoint
    results["root_endpoint"] = test_root_endpoint()
    
    # Test 2: Config endpoint
    results["payments_config"] = test_payments_config()
    
    # Test 3: Plans endpoint
    results["payments_plans"] = test_payments_plans()
    
    # Test 4: Valid checkout (MAIN TEST - creates real MP preference)
    external_ref = test_checkout_valid()
    results["checkout_valid"] = external_ref is not None
    
    # Test 5: Invalid plan validation
    results["checkout_invalid_plan"] = test_checkout_invalid_plan()
    
    # Test 6: Invalid period validation
    results["checkout_invalid_period"] = test_checkout_invalid_period()
    
    # Test 7: Missing email validation
    results["checkout_missing_email"] = test_checkout_missing_email()
    
    # Test 8: Status endpoint (only if we have external_ref)
    if external_ref:
        results["status_endpoint"] = test_status_endpoint(external_ref)
    else:
        print("\n⚠️ SKIP: Status endpoint test (no external_reference from checkout)")
        results["status_endpoint"] = None
    
    # Test 9: Status endpoint not found
    results["status_not_found"] = test_status_endpoint_not_found()
    
    # Test 10: Verify endpoint (only if we have external_ref)
    if external_ref:
        results["verify_endpoint"] = test_verify_endpoint(external_ref)
    else:
        print("\n⚠️ SKIP: Verify endpoint test (no external_reference from checkout)")
        results["verify_endpoint"] = None
    
    # Test 11: Webhook payment type
    results["webhook_payment"] = test_webhook_payment_type()
    
    # Test 12: Webhook non-payment type
    results["webhook_non_payment"] = test_webhook_non_payment_type()
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result is True else ("❌ FAIL" if result is False else "⚠️ SKIP")
        print(f"{status}: {test_name}")
    
    print("=" * 80)
    print(f"Total: {total} | Passed: {passed} | Failed: {failed} | Skipped: {skipped}")
    print("=" * 80)
    
    if failed > 0:
        print("\n❌ SOME TESTS FAILED")
        return 1
    else:
        print("\n✅ ALL TESTS PASSED")
        return 0


if __name__ == "__main__":
    exit(main())
