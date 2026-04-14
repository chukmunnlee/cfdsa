ARG NODE_VER=25-alpine3.23

FROM node:${NODE_VER} AS angular

ARG APP_VER=v1

WORKDIR /src

COPY client/*.json .
COPY client/public public
COPY client/src src

RUN cp src/index-${APP_VER}.html src/index.html
RUN cp src/app/app.${APP_VER}.html src/app/app.html

RUN npm ci && node_modules/.bin/ng build

FROM node:${NODE_VER} AS express
ARG APP_VER=v1

LABEL name="techshop"
LABEL version=${APP_VER}

WORKDIR /app

COPY server/*.json .
COPY server/*.js .

RUN mkdir public
COPY --from=angular /src/dist/client/browser/* public/

RUN npm ci

ENV PORT=3000

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT node main.js
