#!/usr/bin/env bash
set -euo pipefail

# =============================
# Nuxt + Nginx 一键部署脚本（Docker Compose）
# - web: Nuxt SSR 容器，监听 3000
# - nginx: 反向代理容器，对外暴露 8080
# - DB/OSS 均在同一主机，默认直连本机 MongoDB
# =============================

# 项目根目录（脚本相对路径执行）
PROJECT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
cd "$PROJECT_DIR"

# 检查 Docker / Compose
if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] 未检测到 docker，请先安装 Docker."; exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "[ERROR] 未检测到 docker compose，请安装 Docker Compose v2."; exit 1
fi

# 生成 .env（如不存在），包含鉴权与数据库地址
ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "[INFO] 未找到 .env，自动生成默认配置"
  # 生成随机 JWT_SECRET（优先 openssl，其次 python）
  if command -v openssl >/dev/null 2>&1; then
    GEN_SECRET=$(openssl rand -hex 32)
  else
    GEN_SECRET=$(python - <<'PY'
import secrets
print(secrets.token_hex(32))
PY
)
  fi
  # 默认容器内通过 host.docker.internal 连接宿主机 MongoDB
  DB_URI_DEFAULT="mongodb://host.docker.internal:27017/nuxt_ep_app"
  cat > "$ENV_FILE" <<EOF
# 部署环境变量（可按需修改）
JWT_SECRET=${JWT_SECRET:-$GEN_SECRET}
MONGO_URI=${MONGO_URI:-$DB_URI_DEFAULT}
EOF
  echo "[INFO] 已生成 .env：JWT_SECRET 与 MONGO_URI"
else
  echo "[INFO] 检测到现有 .env，直接使用"
fi

# 本机 Mongo 端口探测（仅提示，不影响启动）
if command -v nc >/dev/null 2>&1; then
  if nc -z 127.0.0.1 27017; then
    echo "[CHECK] 检测到宿主机 MongoDB 端口 27017 已开启"
  else
    echo "[WARN] 未检测到本机 27017 端口开放，请确认 MongoDB 已启动"
  fi
fi

# 构建镜像并启动
echo "[INFO] 构建镜像 ..."
docker compose build

echo "[INFO] 启动服务 ..."
docker compose up -d

# 简单健康检查
echo "[INFO] 等待容器就绪 ..."
sleep 3

# 打印服务状态
docker compose ps

# 访问提示
IP_OR_DOMAIN="47.120.13.248"
PORT="8080"
echo "[DONE] 部署完成：请访问 http://${IP_OR_DOMAIN}:${PORT}"
