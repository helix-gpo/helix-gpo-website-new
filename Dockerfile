# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

# dependencies first - cached as long as package-lock.json does not change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# production for aws, docker for the local simulation against host.docker.internal
ARG BUILD_CONFIGURATION=production
RUN npx ng build --configuration $BUILD_CONFIGURATION

# ---- runtime ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# the server bundle already contains express and angular - no node_modules needed at runtime
COPY --from=build /app/dist/helix-gpo-website-new ./dist/helix-gpo-website-new

USER node
EXPOSE 4000
CMD ["node", "dist/helix-gpo-website-new/server/server.mjs"]