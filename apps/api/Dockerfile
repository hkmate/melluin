FROM node:24.14.0-alpine
LABEL authors="mate_herget"

COPY . ./melluin
WORKDIR ./melluin

RUN npm install -g pnpm@10.29.3

RUN echo "Install node modules"
RUN pnpm --filter common install --frozen-lockfile
RUN pnpm --filter api install --frozen-lockfile

RUN echo "Build the application"
RUN pnpm --filter api build

RUN chmod 755 ./dev-env/api-entrypoint.sh

ENTRYPOINT ["./dev-env/api-entrypoint.sh"]

EXPOSE 3000
