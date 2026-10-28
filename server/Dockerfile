FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build && npm prune --omit=dev


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]
