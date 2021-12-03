# Stage 1
FROM node:16-bullseye-slim as builder

LABEL maintainer="Yefta Sutanto <yeftasutanto@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/nevrending/bagian-depan

RUN apt-get update && apt-get -qq -y install --no-install-recommends dh-autoreconf

COPY package.json /app/nevrending/bagian-depan/package.json
COPY yarn.lock /app/nevrending/bagian-depan/yarn.lock

WORKDIR /app/nevrending/bagian-depan

RUN yarn install

COPY . /app/nevrending/bagian-depan

ENV CI=true

RUN yarn build

# Stage 2
FROM nginx:alpine

LABEL maintainer="Yefta Sutanto <yeftasutanto@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/nevrending/bagian-depan

COPY --from=builder /app/nevrending/bagian-depan/build /usr/share/nginx/html
