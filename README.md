# Melluin

### About this project

This application is made to help volunteers to administrate the visits they do in the local children hospital.
Check our website: [nevetnikek.hu](https://www.nevetnikek.hu)

## Install the project

To set up the project you should follow these few easy steps:

0. (Prepare) We use node version v24.14. As you may have seen we use `pnpm` instead of `npm`.
   If you don't have installed with `npm install -g pnpm@10.32.1`. For the following steps you should be at the root of
   the repository.

0. Start environment with docker:
    ```shell
    docker-compose -f dev-env/docker-compose.yml up -d
    ```
   This will create a postgres database in container 'pgdb' and a pgAdmin that could be available in `localhost:5050`.
   Its
   credentials are listed below.

0. Install node modules:
   ```shell
    pnpm install
   ```
0. Execute db migrations:
   ```shell
    pnpm --filter api migrate
    ```
   
Done.  

## About repo

This repo has 3 workspace:

- `apps/api`: NestJs project that are the backend of the whole application
- `apps/web`: Frontend project with Angular 21.
- `packages/common`: Utilities and interfaces/types used by both app.

## Run the application

### API

You can start the backend application with `pnpm start:api`, but for development mode you can use
`pnpm --filter api start:dev`. After you started it will listen in port 3000.

#### API doc

You can check or test the endpoints in a swagger doc: `localhost:3000/api`

### Web

You can start the frontend application with `pnpm start:web`. Now you can open it in `localhost:4200` (credentials
below).

## Credentials

Postgres database:

| name     | value          |
|----------|----------------|
| URL      | localhost:5432 |
| DB       | melluin        |
| USER     | root           |
| PASSWORD | root           |

PgAdmin:

| name              | value           |
|-------------------|-----------------|
| URL               | localhost:5050  |
| PG_ADMIN user     | admin@admin.com |
| PG_ADMIN password | root            |

On the first startup a default user will be created for the application:

| name                            | value |
|---------------------------------|-------|
| Melluin defualt user            | admin |
| Melluin defualt user's password | admin |

## Code checks

Code checks are executed in CI, but you should run them also before commit. 

- Eslint: `pnpm lint`
- Unit tests: `pnpm test`

These will be executed recursively in all package. 

## VCS

Please use the format of [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
As a scope use `web`, `api`, or `common` when you worked in just that. Please write a description to the commit. If you
have access to the project's jira board write the ticket's identifier
on the end of the commit message.

## Clear

If you need to remove all node-modules and built stuff, there is a shortcut:

```shell
pnpm clear
```

## Run API in docker

In case you want to test if api will work in the production environment you can build and run locally:

Build API docker image from __root__ directory. (Hint: Run `pnpm clean` before that).

```shell
docker build \
--progress=plain \
--network host \
-t melluinapi \
--build-arg USE_DEFAULT_CONFIG=true \
--file apps/api/Dockerfile \
.

```
Start the container from the image:

```shell
docker run --name melluin_api -it -d --network host melluinapi:latest
```
