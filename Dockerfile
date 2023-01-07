# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.12.2

# Base image
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app
EXPOSE 3000

# Development stage
FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --include=dev

# Create logs directory and set permissions
RUN mkdir -p /app/logs && chmod -R 777 /app/logs

USER node
COPY . .
CMD ["npm", "run", "dev"]

# Production stage
FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --omit=dev

# Create logs directory and set permissions
RUN mkdir -p /app/logs && chmod -R 777 /app/logs

USER node
COPY . .
CMD ["npm", "run", "prod"]
