# syntax=docker/dockerfile:1
#
# Three stages:
#   deps  — npm ci only. Caches on package*.json alone, so source edits never
#           reinstall dependencies.
#   dev   — Vite dev server (npm run dev already passes --host, so it binds 0.0.0.0
#           and is reachable from the test container as http://app:3000).
#   test  — official Playwright image; browsers are preinstalled at /ms-playwright.
#
# PLAYWRIGHT_VERSION must match the @playwright/test version in package.json.
# If they drift, the test container fails with "Executable doesn't exist" because
# the installed library looks for a browser build the image does not carry.
ARG PLAYWRIGHT_VERSION=1.64.0

# ── deps ──────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# Neither browser download is wanted in this layer:
#   puppeteer — only used by scripts/create-demo-arena.js, which runs on the host
#   playwright — the test stage gets browsers from the Microsoft base image
ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci

# ── dev ───────────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS dev
WORKDIR /app
ENV DOCKER=1 NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── test ──────────────────────────────────────────────────────────────────────
# Resolves against the global ARG above; do not re-declare it here, or it would
# bind to the preceding stage instead.
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble AS test
WORKDIR /app
ENV DOCKER=1 CI=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npx", "playwright", "test"]
