FROM node:25 AS angular

WORKDIR /src

COPY *.json .
COPY public public
COPY src src

RUN npm i -g @angular/cli && npm ci && ng build

FROM caddy:2.11-alpine

WORKDIR /app

RUN mkdir html

COPY caddy/Caddyfile .
COPY caddy/error.html html
COPY --from=angular /src/dist/countingbook/browser/ html/

ENV CADDY_PORT=8080 CADDY_LOGFILE=/var/log/caddy

VOLUME /var/log/caddy

EXPOSE ${CADDY_PORT}

SHELL [ "/bin/sh", "-c" ]

ENTRYPOINT caddy run --config Caddyfile
