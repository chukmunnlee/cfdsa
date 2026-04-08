FROM node:25-bookworm 

WORKDIR /app

COPY *.js .
COPY *.json .

RUN npm ci

ENV BGG_DB_USER=root BGG_DB_PASSWORD=changeit BGG_DB_HOST=db BGG_DB_PORT=3306
ENV BGG_PORT=5000

EXPOSE ${BGG_PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl localhost:${APP_PORT}/healthz || exit 1

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT node /app/main.js
