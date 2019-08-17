FROM node:alpine AS install

WORKDIR /opt/openbmclapi
RUN apk add build-base
ADD package-lock.json package.json tsconfig.json ./
RUN npm ci
ADD src .
RUN npm run build

FROM node:alpine AS build

WORKDIR /opt/openbmclapi
ADD package-lock.json package.json ./
COPY --from=install /opt/openbmclapi/dist ./dist

RUN npm ci --prod

ENV CLUSTER_PORT=4000
EXPOSE 4000
VOLUME /opt/openbmclapi/cache
CMD node dist/index
