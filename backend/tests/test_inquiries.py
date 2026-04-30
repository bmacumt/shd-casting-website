from tests.conftest import client


def test_submit_inquiry():
    resp = client.post("/api/v1/inquiries", json={
        "name": "张三",
        "email": "test@example.com",
        "message": "需要HT200材质，重量约20kg的机床底座",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["code"] == 200
    assert "inquiry_id" in data["data"]
    assert data["data"]["inquiry_id"].startswith("INQ-")


def test_submit_inquiry_missing_fields():
    resp = client.post("/api/v1/inquiries", json={"name": "张"})
    assert resp.status_code == 422


def test_submit_inquiry_bad_email():
    resp = client.post("/api/v1/inquiries", json={
        "name": "张三",
        "email": "not-an-email",
        "message": "这是一段测试消息需要至少十个字符",
    })
    assert resp.status_code == 422


def test_get_inquiry_status():
    resp = client.post("/api/v1/inquiries", json={
        "name": "张三",
        "email": "test@example.com",
        "message": "需要HT200材质，重量约20kg的机床底座",
    })
    inquiry_id = resp.json()["data"]["inquiry_id"]
    resp = client.get(f"/api/v1/inquiries/{inquiry_id}/status")
    assert resp.status_code == 200
    assert resp.json()["data"]["status"] == "pending"


def test_get_inquiry_status_not_found():
    resp = client.get("/api/v1/inquiries/INQ-9999-9999/status")
    assert resp.status_code == 404
