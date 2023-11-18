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

COPY . .

# Create logs directory and set permissions
#RUN mkdir -p /app/logs && chmod -R 777 /app/logs
#RUN chown -R node:node /app
#RUN mkdir /etc/letsencrypt && chown -R node:node /etc/letsencrypt
#USER node
#RUN chmod +x scripts/fix-permissions.sh
#ENTRYPOINT ["scripts/fix-permissions.sh"]

CMD ["npm", "run", "prod"]