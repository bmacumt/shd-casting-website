# 产品 & 分类接口

## 产品接口

### GET /api/v1/products — 产品列表

参数: `page`, `pageSize`, `category_id`, `keyword`, `is_featured`, `sort`, `order`

响应含分页: `{ list, total, page, pageSize, totalPages }`

### GET /api/v1/products/featured — 推荐产品

返回 `is_featured=true` 的前 6 条产品。

### GET /api/v1/products/{id} — 产品详情

含 `related_products` 同分类推荐。

## 分类接口

### GET /api/v1/categories — 全部分类

每条含 `product_count` 该分类上架产品数量。

## 管理接口 (需 JWT)

- `POST /api/v1/admin/products` — 创建产品
- `PUT /api/v1/admin/products/{id}` — 更新产品
- `DELETE /api/v1/admin/products/{id}` — 删除产品
- `PATCH /api/v1/admin/products/batch` — 批量上下架

## 测试状态

| 测试用例 | 状态 |
|----------|------|
| 产品列表（默认分页） | PASSED |
| 分页参数 | PASSED |
| 分类筛选 | PASSED |
| 产品详情 + 推荐 | PASSED |
| 产品不存在 404 | PASSED |
| 推荐产品 | PASSED |
| 分类列表含计数 | PASSED |
| 产品 CRUD (创建/更新/删除) | PASSED |
