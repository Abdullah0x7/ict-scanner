from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "LiquidScan API is running"}

def test_waitlist():
    response = client.post("/waitlist", json={"email": "test@example.com"})
    assert response.status_code == 200
    assert response.json() == {"message": "Success", "email": "test@example.com"}

# Note: Testing the scan endpoint requires mocking yfinance to avoid external API calls during tests.
# For this simplified setup, we'll skip mocking but it's a recommended next step.
