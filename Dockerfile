# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/finflex.db ./

EXPOSE 3000

# We use tsx to run the server.ts file directly in production as well
# given the environment supports it, or we could compile it.
# To ensure maximum compatibility with the environment's recommendation:
CMD ["npx", "tsx", "server.ts"]
