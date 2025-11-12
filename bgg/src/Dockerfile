FROM node:24-bookworm AS angular

WORKDIR /src

RUN npm install -g @angular/cli

COPY client/*.json .
COPY client/public public
COPY client/src src

RUN npm ci && ng build

FROM node:24-bookworm 

WORKDIR /app

RUN mkdir public

COPY server/*.js .
COPY server/*.json .
COPY --from=angular /src/dist/client/browser/* public/

RUN npm ci

ENV BGG_DB_USER=root BGG_DB_PASSWORD=changeit BGG_DB_HOST=db BGG_DB_PORT=3306
ENV BGG_PORT=5000

EXPOSE ${BGG_PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl localhost:${APP_PORT}/healthz || exit 1

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT node /app/main.js
