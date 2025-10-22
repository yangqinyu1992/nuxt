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

# 确保服务器根目录存在 /app 作为部署基础路径（带权限处理与回退）
DEPLOY_BASE="/app"
if [ ! -d "$DEPLOY_BASE" ]; then
  echo "[INFO] /app 不存在，正在创建..."
  if mkdir -p "$DEPLOY_BASE" 2>/dev/null; then
    echo "[INFO] 已创建 /app"
  elif command -v sudo >/dev/null 2>&1; then
    if sudo mkdir -p "$DEPLOY_BASE"; then
      echo "[INFO] 已使用 sudo 创建 /app"
    else
      echo "[WARN] sudo 创建 /app 失败，将回退到当前项目目录"
      DEPLOY_BASE="$PROJECT_DIR"
    fi
  else
    echo "[WARN] 无法创建 /app（可能需要权限），将回退到当前项目目录"
    DEPLOY_BASE="$PROJECT_DIR"
  fi
fi
# 若 /app 不可写，尝试调整权限；失败则回退
if [ ! -w "$DEPLOY_BASE" ]; then
  echo "[INFO] 检测到 $DEPLOY_BASE 不可写，尝试授予当前用户权限"
  if command -v sudo >/dev/null 2>&1; then
    sudo chown "$(whoami)":"$(whoami)" "$DEPLOY_BASE" 2>/dev/null || true
    sudo chmod 775 "$DEPLOY_BASE" 2>/dev/null || true
  fi
  if [ ! -w "$DEPLOY_BASE" ]; then
    echo "[WARN] 仍不可写，回退到项目目录作为数据路径"
    DEPLOY_BASE="$PROJECT_DIR"
  fi
fi

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
    GEN_SECRET=$(python -c 'import secrets; print(secrets.token_hex(32))')
  fi
  # 默认容器内通过 host.docker.internal 连接宿主机 MongoDB（含鉴权 root/123456，库名 nuxt_ep_app）
  DB_URI_DEFAULT="mongodb://root:123456@host.docker.internal:27017/nuxt_ep_app?authSource=admin"
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
    MONGO_READY=1
  else
    echo "[WARN] 未检测到本机 27017 端口开放，将尝试用 Docker 启动一个 MongoDB"
    MONGO_READY=0
  fi
else
  echo "[WARN] 未检测到 nc 命令，跳过端口探测"
  MONGO_READY=0
fi

# 如未就绪，尝试以 Docker 启动/恢复 MongoDB（避免重复启动）
if [ "${MONGO_READY}" = "0" ]; then
  # 将 Mongo 数据持久化到 /app/mongo_data（若可用），否则退回本工程目录
  DATA_DIR_BASE="${DEPLOY_BASE:-$PROJECT_DIR}"
  mkdir -p "$DATA_DIR_BASE/mongo_data"
  if docker ps -a --format '{{.Names}}' | grep -q '^host-mongo$'; then
    echo "[INFO] 发现已有容器 host-mongo，尝试启动它"
    docker start host-mongo || true
  else
    echo "[INFO] 启动新的 MongoDB 容器（host-mongo）于 27017"
    docker run -d \
      --name host-mongo \
      -p 27017:27017 \
      -v "$DATA_DIR_BASE/mongo_data:/data/db" \
      --restart unless-stopped \
      mongo:6
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
