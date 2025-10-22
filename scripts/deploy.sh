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

# 工具函数：检测主机端口是否开放（优先 nc，备用 /dev/tcp）
is_port_open() {
  local host="$1" port="$2"
  if command -v nc >/dev/null 2>&1; then
    nc -z "$host" "$port" >/dev/null 2>&1
    return $?
  else
    (echo >/dev/tcp/$host/$port) >/dev/null 2>&1 && return 0 || return 1
  fi
}

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
  # 默认配置（可在 .env 中修改）
  cat > "$ENV_FILE" <<EOF
# 部署环境变量（可按需修改）
JWT_SECRET=${JWT_SECRET:-$GEN_SECRET}
# Mongo 服务配置（作为配置项，可更改）
MONGO_PORT=${MONGO_PORT:-3004}
MONGO_ROOT_USER=${MONGO_ROOT_USER:-root}
MONGO_ROOT_PASS=${MONGO_ROOT_PASS:-123456}
MONGO_DB_NAME=${MONGO_DB_NAME:-nuxt_ep_app}
# 应用连接串：容器内通过 host.docker.internal 访问宿主机的 MONGO_PORT
MONGO_URI=
EOF
  echo "[INFO] 已生成 .env：JWT_SECRET 与 Mongo 配置项（未写死 MONGO_URI）"
else
  echo "[INFO] 检测到现有 .env，直接使用"
fi
# 读取 .env 到环境变量
set -a
. "$ENV_FILE"
set +a
# 若未显式定义 MONGO_URI，则用上述配置项拼装默认连接串
if [ -z "${MONGO_URI:-}" ]; then
  DB_URI_DEFAULT="mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASS}@host.docker.internal:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin"
  printf "MONGO_URI=%s\n" "$DB_URI_DEFAULT" >> "$ENV_FILE"
  export MONGO_URI="$DB_URI_DEFAULT"
  echo "[INFO] 已写入默认 MONGO_URI 到 .env -> $MONGO_URI"
fi

# 允许通过环境变量跳过 Mongo 启动逻辑（例如已有稳定外部库）
SKIP_MONGO_START=${SKIP_MONGO_START:-0}

# 检测宿主机 Mongo 端口（按配置项 MONGO_PORT，默认 3004）
if [ "$SKIP_MONGO_START" = "1" ]; then
  echo "[INFO] 已设置 SKIP_MONGO_START=1，跳过 Mongo 检测与启动"
  MONGO_READY=1
elif is_port_open 127.0.0.1 "$MONGO_PORT"; then
  echo "[CHECK] 检测到宿主机 MongoDB ${MONGO_PORT} 已运行（不再启动容器版）"
  MONGO_READY=1
else
  echo "[WARN] 127.0.0.1:${MONGO_PORT} 未开放，将使用 docker compose 启动 mongo 服务"
  MONGO_READY=0
fi

# 如未就绪，使用 docker compose 启动 mongo（避免重复启动）
if [ "${MONGO_READY}" = "0" ] && [ "$SKIP_MONGO_START" != "1" ]; then
  echo "[INFO] 通过 docker compose 启动 mongo 服务（端口 ${MONGO_PORT}）"
  # 确保 docker-compose.yml 中存在 mongo 服务（已添加）
  docker compose up -d mongo
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
