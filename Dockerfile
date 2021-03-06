FROM node:14 AS base
RUN apt-get update && apt-get install -y nano vim dnsutils telnet

FROM base AS build
WORKDIR /build/
COPY package.json tsconfig.json yarn.lock ./
COPY ./src ./src/
RUN yarn && yarn build

FROM base
WORKDIR /wholebuzz/mapreduce/
COPY package.json tsconfig.json scripts/entrypoint.sh ./
COPY --from=build /build/dist ./dist/
RUN yarn install --production=true
ENTRYPOINT ["/wholebuzz/mapreduce/entrypoint.sh"]
