FROM node:22 AS builder

WORKDIR /src

COPY . .

RUN npm i -g @nestjs/cli
RUN npm ci && nest build

FROM node:22-slim

LABEL maintainer=chuklee

WORKDIR /app

COPY --from=builder /src/dist dist
COPY package*.json .

RUN npm ci --omit=dev

ENV PORT=3000 JWT_SECRET=changeit

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD curl -XGET localhost:${PORT}/healthz || exit 1

EXPOSE ${PORT}

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT node dist/main.js
