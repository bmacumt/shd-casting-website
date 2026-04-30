# 后端初始化指南

## 环境要求

- Python 3.12+
- uv 包管理器
- MySQL 8.0 (本地 Docker 或远程)
- Node.js 18+ (前端开发)

## 初始化步骤

```bash
cd backend

# 1. 安装依赖
uv sync --dev

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 设置数据库连接、JWT 密钥、SMTP

# 3. 启动 MySQL (Docker)
docker run -d --name shd-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=shd_casting \
  -p 3307:3306 \
  mysql:8.0

# 4. 数据库迁移
uv run alembic upgrade head

# 5. 插入种子数据
uv run python -c "
from app.database import SessionLocal
from app.models.category import ProductCategory
from app.models.admin import Admin
from app.services.auth import hash_password
db = SessionLocal()
for n, e, s in [('灰铸铁','Grey Iron Casting',1),('球墨铸铁','Ductile Iron Casting',2),('铸钢件','Steel Casting',3),('铝合金','Aluminum Casting',4),('精密铸造','Precision Casting',5)]:
    if not db.query(ProductCategory).filter(ProductCategory.name==n).first():
        db.add(ProductCategory(name=n,name_en=e,sort_order=s))
if not db.query(Admin).filter(Admin.username=='admin').first():
    db.add(Admin(username='admin',password=hash_password('admin123'),role='super_admin'))
db.commit()
"

# 6. 启动开发服务器
uv run uvicorn app.main:app --reload --port 8000
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `uv run uvicorn app.main:app --reload` | 启动开发服务器 |
| `uv run pytest -v` | 运行全部测试 |
| `uv run alembic revision --autogenerate -m "desc"` | 生成迁移 |
| `uv run alembic upgrade head` | 执行迁移 |

## 端口配置

- 后端 API: `http://localhost:8000`
- API 文档: `http://localhost:8000/docs`
- MySQL: `localhost:3307`
- 前端 dev: `http://localhost:5173` (已配置 `/api` 代理到后端)
