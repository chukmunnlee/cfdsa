ARG VERSION=22

FROM node:${VERSION}

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY main.js .

RUN npm ci

ENV PORT=3000

EXPOSE ${PORT}

ENTRYPOINT node main.js v2

