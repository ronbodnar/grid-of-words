# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.12.2

# Base image
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
RUN npm install --g nodemon
EXPOSE 3000

# Development stage
FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --include=dev
USER node
COPY . .
CMD ["npm", "run", "dev"]

# Production stage
FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=data/mongoX509.pem,target=data/mongoX509.pem \
    npm ci --omit=dev
USER node
COPY . .
CMD ["npm", "run", "prod"]