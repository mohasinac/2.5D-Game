# ── Dev stage — ts-node + nodemon, used by docker-compose for local dev ────────
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
EXPOSE 2567
CMD ["npx", "nodemon", "--exec", "ts-node", "server/index.ts"]

# ── Build stage — compiles TypeScript to /app/lib ───────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY server/ ./server/
COPY shared/ ./shared/
RUN npx tsc

# ── Production stage — lean runtime image ────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/lib ./lib
EXPOSE 2567
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:2567/health || exit 1
CMD ["node", "lib/server/index.js"]
