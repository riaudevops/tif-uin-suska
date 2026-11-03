# ----------------------
# STEP 1: Build Astro app
# ----------------------
FROM oven/bun:1.4.4-alpine AS builder

WORKDIR /app

# 1. Tangkap build-args dari GitHub Actions
ARG BASE_API_URL
ARG PUBLIC_BASE_ASSETS_URL
ARG HOST
# Server-side Directus token (not exposed to the browser)
ARG DIRECTUS_TOKEN

# 2. Jadikan Environment Variables agar terbaca saat proses `bun run build`
ENV BASE_API_URL=$BASE_API_URL
ENV PUBLIC_BASE_ASSETS_URL=$PUBLIC_BASE_ASSETS_URL
ENV HOST=$HOST
ENV DIRECTUS_TOKEN=$DIRECTUS_TOKEN

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy semua source code
COPY . .

# Build project untuk SSR
RUN bun run build


# ----------------------
# STEP 2: Run with Bun
# ----------------------
FROM oven/bun:1.4.4-alpine AS runner

WORKDIR /app

# 3. Tangkap lagi build-args untuk stage runner
ARG BASE_API_URL
ARG PUBLIC_BASE_ASSETS_URL
ARG DIRECTUS_TOKEN

# 4. Jadikan Environment Variables untuk runtime SSR
ENV BASE_API_URL=$BASE_API_URL
ENV PUBLIC_BASE_ASSETS_URL=$PUBLIC_BASE_ASSETS_URL
ENV DIRECTUS_TOKEN=$DIRECTUS_TOKEN

# --- TAMBAHKAN DUA BARIS INI ---
# Paksa Astro jalan di port 3000 dan terima trafik dari semua interface
ENV PORT=3000
ENV HOST=0.0.0.0
# -------------------------------

# Copy dependency files saja ke runner
COPY package.json bun.lock ./

# Install HANYA production dependencies
RUN bun install --frozen-lockfile --production

# Copy hasil build dari builder
COPY --from=builder /app/dist ./dist
# Entry server dengan security headers, rate limit, cache header + kompresi gzip
COPY --from=builder /app/server.mjs ./server.mjs
COPY --from=builder /app/security-headers.mjs ./security-headers.mjs
COPY --from=builder /app/rate-limit.mjs ./rate-limit.mjs
COPY --from=builder /app/package.json ./package.json

# Expose port yang sudah disamakan
EXPOSE 3000

# Jalankan SSR server menggunakan runtime Bun
CMD ["bun", "server.mjs"]