from tests.conftest import client


def test_login_success():
    resp = client.post("/api/v1/admin/login", json={
        "username": "admin",
        "password": "admin123",
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert "token" in data
    assert data["admin"]["username"] == "admin"


def test_login_wrong_password():
    resp = client.post("/api/v1/admin/login", json={
        "username": "admin",
        "password": "wrong",
    })
    assert resp.status_code == 401


def test_refresh_token(admin_token):
    resp = client.post(
        "/api/v1/admin/refresh-token",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert "token" in resp.json()["data"]


def test_unauthorized_access():
    resp = client.get("/api/v1/admin/inquiries")
    assert resp.status_code in (401, 403)


def test_admin_list_inquiries(admin_token):
    resp = client.get(
        "/api/v1/admin/inquiries",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert "stats" in resp.json()["data"]


def test_admin_dashboard(admin_token):
    resp = client.get(
        "/api/v1/admin/dashboard/stats",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert "today_inquiries" in data
    assert "trend" in data


def test_admin_product_crud(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    resp = client.post("/api/v1/admin/products", json={
        "name": "新产品",
        "category_id": 1,
        "material": "HT200",
        "is_active": True,
    }, headers=headers)
    assert resp.status_code == 200
    product_id = resp.json()["data"]["id"]

    resp = client.put(f"/api/v1/admin/products/{product_id}", json={
        "name": "更新产品",
        "category_id": 1,
        "material": "HT300",
    }, headers=headers)
    assert resp.status_code == 200

    resp = client.delete(f"/api/v1/admin/products/{product_id}", headers=headers)
    assert resp.status_code == 200
