# ONTAS — one-command self-host image
# Build:  docker build -t ontas .
# Run:    docker run --rm -p 8080:8080 ontas
# Or:     docker compose up --build

FROM node:22-bookworm-slim AS build
WORKDIR /app

# Install dependencies first (better layer cache)
COPY package.json package-lock.json ./
RUN npm ci

# App source
COPY . .

# Production Node server (not Vercel preset)
ENV NITRO_PRESET=node-server
ENV NODE_ENV=production
RUN npm run build:node

# ---------- runtime ----------
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080

# Built Nitro node-server output
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
