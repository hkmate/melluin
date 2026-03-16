FROM node:24.14.0 AS builder
LABEL authors="mate_herget"

COPY . ./melluin
WORKDIR ./melluin

ARG USE_DEFAULT_CONFIG="false"

RUN npm install -g pnpm@10.32.1

RUN bash ./dev-env/api-build-copy-config.sh

RUN echo "Install node modules"
RUN pnpm --filter common install --frozen-lockfile
RUN pnpm --filter api install --frozen-lockfile

RUN echo "Build the application"
RUN pnpm --filter api build

RUN echo "Execute migrations..."
RUN pnpm --filter api migrate

FROM node:24.14.0-alpine AS runner
COPY --from=builder ./melluin ./melluin
WORKDIR ./melluin

RUN chmod 755 ./dev-env/api-entrypoint.sh
RUN npm install -g pnpm@10.32.1

ENTRYPOINT ["./dev-env/api-entrypoint.sh"]

EXPOSE 3000
