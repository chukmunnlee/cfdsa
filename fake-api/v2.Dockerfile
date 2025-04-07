ARG VERSION=22

FROM node:${VERSION}

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY main.js .
COPY telemetry.js .

RUN npm ci

ENV PORT=3000 OTEL_PORT=9464

EXPOSE ${PORT} ${OTEL_PORT}

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT node main.js v2

