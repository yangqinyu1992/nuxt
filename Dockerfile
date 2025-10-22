# Multi-stage build for Nuxt 3 production
# Scheme A: connect to host MongoDB running on the same server

# ========== Builder stage ==========
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm i -g pnpm

# Only copy manifest first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ========== Runner stage ==========
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Bind address and default port (can be overridden at runtime)
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Install production deps
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output only
COPY --from=builder /app/.output ./.output

EXPOSE 3000
# Start Nitro server
CMD ["node", ".output/server/index.mjs"]