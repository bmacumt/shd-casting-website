from tests.conftest import client


def test_list_categories():
    resp = client.get("/api/v1/categories")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert isinstance(data, list)
    assert len(data) >= 2
    assert "product_count" in data[0]
