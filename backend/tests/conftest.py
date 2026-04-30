import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models import Inquiry, ProductCategory, Product, Admin
from app.services.auth import hash_password

TEST_DB_URL = "mysql+pymysql://root:root123@localhost:3307/shd_casting_test"

test_engine = create_engine(TEST_DB_URL, pool_recycle=3600)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestSession()
    for name, name_en, sort in [
        ("灰铸铁", "Grey Iron", 1),
        ("球墨铸铁", "Ductile Iron", 2),
    ]:
        if not db.query(ProductCategory).filter(ProductCategory.name == name).first():
            db.add(ProductCategory(name=name, name_en=name_en, sort_order=sort))
    if not db.query(Admin).filter(Admin.username == "admin").first():
        db.add(Admin(username="admin", password=hash_password("admin123"), role="super_admin"))
    cat = db.query(ProductCategory).first()
    if cat and not db.query(Product).first():
        db.add(Product(
            name="测试产品", category_id=cat.id, material="HT200",
            is_featured=True, is_active=True, sort_order=1,
        ))
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


def _override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db

client = TestClient(app)


@pytest.fixture
def admin_token():
    resp = client.post("/api/v1/admin/login", json={"username": "admin", "password": "admin123"})
    assert resp.status_code == 200
    return resp.json()["data"]["token"]
