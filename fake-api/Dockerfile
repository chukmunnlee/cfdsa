ARG VERSION=23

FROM node:${VERSION}

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY main.js .
COPY telemetry.js .

RUN npm ci

ENV PORT=3000 OTEL_PORT=9464

EXPOSE ${PORT} ${OTEL_PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl localhost:${PORT}/healthz || exit 1

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT node main.js

