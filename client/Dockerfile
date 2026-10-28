FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci


FROM node:24-alpine AS builder

WORKDIR /app

# bake the rewrite destination into the build as well as runtime
ARG API_URL=http://localhost:3000
ENV API_URL=$API_URL

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

USER node

CMD ["npm", "start", "--", "-H", "0.0.0.0"]
