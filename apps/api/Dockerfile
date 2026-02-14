FROM node:20.9.0
LABEL authors="mate"

WORKDIR ../
COPY . .

# SETUP THESE WHEN CREATE A CONTAINER!
ARG DB_HOST="localhost"
ARG DB_PORT="5432"
ARG DB_NAME="melluin"
ARG DB_USERNAME="melluin_user"
ARG DB_SSL="false"
ARG DB_PASSWORD=""
ARG SECRET_KEY="secret"

ENV ENV_DB_HOST=${DB_HOST}
ENV ENV_DB_NAME=${DB_NAME}
ENV ENV_DB_PORT=${DB_PORT}
ENV ENV_DB_SSL=${DB_SSL}
ENV ENV_DB_USERNAME=${DB_USERNAME}
ENV ENV_DB_PASSWORD=${DB_PASSWORD}
ENV ENV_SECRET_KEY=${SECRET_KEY}


RUN echo "Setup environment variables to config"
RUN node dev-env/.set-backend-config.js

RUN echo "Install node modules"
RUN pnpm install

RUN echo "Build the application"
RUN pnpm --filter api build

RUN echo "Initialize database tables and data..."
RUN pnpm --filter api  migrate

CMD pnpm --filter api start:prod

EXPOSE 3000
