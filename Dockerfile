# ----------------------
# STEP 1: Build Astro app
# ----------------------
FROM oven/bun:1.3.14-alpine AS builder

WORKDIR /app

# 1. Tangkap build-args dari GitHub Actions
ARG BASE_API_URL
ARG HOST

# 2. Jadikan Environment Variables agar terbaca saat proses `bun run build`
ENV BASE_API_URL=$BASE_API_URL
ENV HOST=$HOST

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy semua source code
COPY . .

# Build project untuk SSR
RUN bun run build


# ----------------------
# STEP 2: Run with Bun
# ----------------------
FROM oven/bun:1.3.14-alpine AS runner

WORKDIR /app

# 3. Tangkap lagi build-args untuk stage runner
ARG BASE_API_URL

# 4. Jadikan Environment Variables untuk runtime SSR
ENV BASE_API_URL=$BASE_API_URL

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

# Expose port yang sudah disamakan
EXPOSE 3000

# Jalankan SSR server menggunakan runtime Bun
CMD ["bun", "run", "./dist/server/entry.mjs"]