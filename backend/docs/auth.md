# 管理员认证

## 接口

### POST /api/v1/admin/login — 登录

请求: `{ "username": "admin", "password": "admin123" }`

响应: `{ token, expires_in, admin: { id, username, role } }`

**安全机制：**
- 密码 bcrypt 加密 (rounds=10)
- 连续失败 5 次锁定 30 分钟
- JWT Token 有效期 24 小时

### POST /api/v1/admin/refresh-token — 刷新 Token

需 Header: `Authorization: Bearer <token>`

### POST /api/v1/admin/logout — 退出

## 角色权限

| 角色 | 权限 |
|------|------|
| super_admin | 全部权限 |
| sales | 查看/处理询价 |
| editor | 管理产品 |

## 默认管理员

- 用户名: `admin`
- 密码: `admin123`
- 角色: `super_admin`

**生产环境请务必修改密码。**

## 测试状态

| 测试用例 | 状态 |
|----------|------|
| 登录成功 | PASSED |
| 密码错误 401 | PASSED |
| Token 刷新 | PASSED |
| 未认证访问拦截 | PASSED |
