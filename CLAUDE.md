# 上海铸造有限公司官网 (SHD Casting)

B2B 企业官网，展示公司实力、产品目录，提供在线询价功能。

## 技术栈

| 层 | 技术 |
|---|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Python 3.12 + FastAPI + SQLAlchemy 2.0 + MySQL 8.0 |
| 包管理 | Frontend: pnpm / Backend: uv |
| 部署 | Docker + Nginx (阿里云 8.136.129.64) |

## 项目结构

```
website/
├── frontend/          # React 前端
│   ├── src/app/
│   │   ├── pages/     # HomePage, ProductsPage, AboutPage, ContactPage
│   │   └── components/
│   ├── public/images/
│   └── package.json
├── backend/           # FastAPI 后端
│   ├── app/
│   │   ├── main.py    # FastAPI 入口
│   │   ├── config.py  # 环境配置
│   │   ├── models/    # SQLAlchemy ORM
│   │   ├── schemas/   # Pydantic 验证
│   │   ├── routers/   # API 路由
│   │   └── services/  # 业务逻辑
│   ├── tests/         # pytest 测试
│   └── pyproject.toml
└── docs/              # 需求文档、API 文档、素材说明
```

## uv 环境 (Backend)

```bash
cd backend
uv sync                # 安装依赖
uv run uvicorn app.main:app --reload --port 8000   # 开发服务器
uv run pytest          # 运行测试
uv run alembic upgrade head   # 数据库迁移
```

## 前端开发

```bash
cd frontend
pnpm install
pnpm dev               # http://localhost:5173
pnpm build             # 生产构建
```

## API 规范

- Base URL: `/api/v1`
- 响应格式: `{"code": 200, "message": "success", "data": {...}}`
- 管理接口需 JWT: `Authorization: Bearer <token>`
- 详细文档: `docs/后端接口文档.md`

## 环境变量

后端 `.env` 文件（参考 `backend/.env.example`）：
- `DATABASE_URL` — MySQL 连接串
- `JWT_SECRET` — JWT 签名密钥
- `SMTP_*` — 邮件服务配置（163.com）

## 关键文档

- `docs/需求说明书.md` — 完整需求
- `docs/后端接口文档.md` — API 接口定义 + 数据库设计
- `docs/素材说明.md` — 图片资源规格
- `docs/服务器部署信息.md` — 服务器 & Docker 信息
