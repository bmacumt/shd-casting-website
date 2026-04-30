# 询价接口 (Inquiries)

## 接口列表

### POST /api/v1/inquiries — 提交询价

请求体：
```json
{ "name": "张三", "email": "test@example.com", "message": "需要HT200材质..." }
```

可选字段: `company`, `phone`, `product_category`, `quantity`

**特性：**
- Email 格式验证 (Pydantic EmailStr)
- 同一 IP 10 分钟内限 3 次提交
- 自动生成 inquiry_id (格式: INQ-YYYY-XXXX)
- 异步发送邮件通知（销售团队 + 客户确认）

### GET /api/v1/inquiries/{inquiry_id}/status — 查询状态

### 管理接口 (需 JWT)
- `GET /api/v1/admin/inquiries` — 列表（含筛选/搜索/分页/stats）
- `GET /api/v1/admin/inquiries/{id}` — 详情
- `PATCH /api/v1/admin/inquiries/{id}` — 更新状态
- `DELETE /api/v1/admin/inquiries/{id}` — 删除
- `GET /api/v1/admin/dashboard/stats` — 仪表盘统计

## 测试状态

| 测试用例 | 状态 |
|----------|------|
| 提交询价成功 | PASSED |
| 缺少必填字段 | PASSED |
| Email 格式验证 | PASSED |
| 查询询价状态 | PASSED |
| 询价不存在 | PASSED |

## 已知限制

- 邮件通知为 fire-and-forget，发送失败不阻塞请求
- 限流基于内存存储，服务重启后重置
