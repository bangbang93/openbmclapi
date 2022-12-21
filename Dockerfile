FROM node:18-alpine AS install

WORKDIR /opt/openbmclapi
RUN apk add build-base
ADD package-lock.json package.json tsconfig.json ./
RUN npm ci
ADD src .
RUN npm run build

FROM node:18-bullseye-slim AS build

RUN apt-get update && \
    apt-get install -y \
    nginx

WORKDIR /opt/openbmclapi
ADD package-lock.json package.json ./
RUN npm ci --prod

COPY --from=install /opt/openbmclapi/dist ./dist
COPY nginx/ /opt/openbmclapi/nginx

ENV CLUSTER_PORT=4000
EXPOSE $CLUSTER_PORT
VOLUME /opt/openbmclapi/cache
CMD ["node", "--enable-source-maps", "dist/index.js"]
