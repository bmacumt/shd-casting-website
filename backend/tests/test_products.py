from tests.conftest import client


def test_list_products():
    resp = client.get("/api/v1/products")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert "list" in data
    assert "total" in data
    assert data["page"] == 1


def test_list_products_pagination():
    resp = client.get("/api/v1/products?page=1&pageSize=5")
    assert resp.status_code == 200
    assert resp.json()["data"]["pageSize"] == 5


def test_list_products_filter_category():
    resp = client.get("/api/v1/products?category_id=1")
    assert resp.status_code == 200


def test_get_product_detail():
    resp = client.get("/api/v1/products")
    items = resp.json()["data"]["list"]
    if items:
        resp = client.get(f"/api/v1/products/{items[0]['id']}")
        assert resp.status_code == 200
        assert "related_products" in resp.json()["data"]


def test_get_product_not_found():
    resp = client.get("/api/v1/products/99999")
    assert resp.status_code == 404


def test_featured_products():
    resp = client.get("/api/v1/products/featured")
    assert resp.status_code == 200
    assert isinstance(resp.json()["data"], list)
