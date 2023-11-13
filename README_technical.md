# Melluin

## Install the project

### Setup with script

You can execute `npm run setup` in the root directory, and it will do everything you need.
After that you could run the application as it described below.

This script will

- create docker container for database and admin tool for it
- install node modules in both frontend and backend
- run flyway migrations

### Setup manually

There are a few step to make the project runnable:

- Set up the database: execute `docker-compose -f dev-env/docker-compose.yml up -d`.
- Install node modules:
    - execute `npm install --prefix backend`
    - execute `npm install --prefix frontend`
- To apply flyway scripts in the newly created database, execute `npm run --prefix backend migrate`

### Credentials info

We use PostrgeSQL 10.23 because the DB provider what the deployed system use got only this old version.
The credentials of the local dev database:

| name                            | value           |
|---------------------------------|-----------------|
| URL                             | localhost:5432  |
| DB                              | melluin         |
| USER                            | root            |
| PASSWORD                        | root            |
| PG_ADMIN user                   | admin@admin.com |
| PG_ADMIN password               | root            |
| Melluin defualt user            | admin           |
| Melluin defualt user's password | admin           |

### Clear

If you need to remove all node-modules and build stuff, there is a shortcut: `npm run clear`.

## Run the application

### Backend

Go to the directory `backend` and execute:

```shell
npm run start:dev
```

This will start the app in the port 3000.

### Frontend

Go to the directory `frontend` and execute:

```shell
npm run start
```

This will start the app in the port 4200. You can check it in the browser: `localhost:4200`.

## Check code

### Tests

You can execute `npm run test` in both directories backend and frontend to run the tests.

Also, when you want to test whole codebase, you could run `npm run test`
in the root directory. This will run all tests in both frontend and backend and returns error code 0
only when both successful.

### Lint

You can execute `npm run lint` in both directories backend and frontend to run the tests.

Also, when you want to check whole codebase, you could run `npm run lint`
in the root directory. This will run all tests in both frontend and backend and returns error code 0
only when both successful.

## VCS

In the commit messages please use the format of [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
As a scope please use `fe` or `be` when you worked in just frontend or backend. If you worked in both leave the scope.
Please write a description to the commit. If you have access to the project's jira board write the ticket's identifier 
on the end of the commit message. 

We prefer straight git graph as possible so please, when it's not too complicated use `rebase`  instead of 
`merge` to update your feature branch to develop.    

## Development

Lot of conventions are checked by lint, so you'll find out what is good or not. Don't commit without the code 
checked by tests and lint.   

### Backend

To test the endpoints manually you can use Postman. There is a predefined collection and an environment
in directory dev-env/postman. You can import them.
When you add a new (or modify an existent) rest endpoint please update the collection!

### Frontend

In NgModule the imports should be ordered: 
1. Angular modules
1. *empty line*
1. Material modules
1. *empty line*
1. Other 3rd party modules
1. *empty line*
1. Our modules
In backend use the same concept but with NestJs modules.

In constructors for dependency injection use this order too. (Here empty lines are not needed).

