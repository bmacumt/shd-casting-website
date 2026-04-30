#!/bin/bash
# SHD Casting 部署脚本
# 用法: ./deploy.sh

set -e

SERVER="root@8.136.129.64"
REMOTE_DIR="/opt/shd-casting"

echo "=== 1. 构建前端 ==="
cd frontend
pnpm build
echo "前端构建完成"

echo "=== 2. 上传文件到服务器 ==="
# 创建远程目录
ssh $SERVER "mkdir -p $REMOTE_DIR/backend $REMOTE_DIR/frontend/dist"

# 上传 docker-compose 和 nginx 配置
scp docker-compose.yml $SERVER:$REMOTE_DIR/
scp frontend/nginx.conf $SERVER:$REMOTE_DIR/frontend/

# 上传前端构建产物
ssh $SERVER "rm -rf $REMOTE_DIR/frontend/dist/*"
scp -r frontend/dist/* $SERVER:$REMOTE_DIR/frontend/dist/

# 上传后端代码
rsync -avz --exclude='.venv' --exclude='__pycache__' --exclude='.env' backend/ $SERVER:$REMOTE_DIR/backend/

echo "=== 3. 服务器上构建 Docker 并启动 ==="
ssh $SERVER << 'REMOTE'
cd /opt/shd-casting

# 确保 .env 存在
if [ ! -f backend/.env ]; then
    echo "需要创建 backend/.env，请手动配置"
    exit 1
fi

# 修复 Docker 容器内的数据库连接地址
sed -i 's/localhost/host.docker.internal/g' backend/.env

# 确保阿里云安全组放行 8080 端口
echo "请确认阿里云安全组已放行 8080 端口"

# 构建并启动
docker compose up -d --build

echo "=== 部署完成 ==="
echo "前端: http://8.136.129.64:8080"
echo "后端 API: http://8.136.129.64:8080/api/v1"
REMOTE
