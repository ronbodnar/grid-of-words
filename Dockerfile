# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.12.2

# Base image
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
EXPOSE 3000

# Dependencies stage (cacheable)
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Lint & Test stage
FROM deps AS test
COPY . .
RUN npm run lint
RUN npm test

# Development stage
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install --save-dev nodemon
CMD ["npx", "nodemon", "--watch", ".", "--ext", "js,ts,tsx,json", "src/index.ts"]

# Production image
FROM base AS prod
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "prod"]