# Melluin

## Install the project

### Setup with script

You can execute `npm run setup` in the root directory, and it will do everything you need. 
After that you could run the application as it described below.

If you're on Windows, well... the shell script won't do the trick. You have to do it manually.  

### Setup manually

There are a few step to make the project runnable:

- Set up the database: execute `docker-compose -f dev-env/docker-compose.yml up -d`.
- Install node modules:
    - execute `npm install --prefix backend`
    - execute `npm install --prefix frontend`
- To apply flyway scripts in the newly created database, execute `npm run --prefix backend migrate`

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

If you are not in developing, but just want to check the code, you could execute `npm run test` 
in the root directory. This will run all tests in both frontend and backend and returns error code 0 
only when both successful.

### Lint

You can execute `npm run lint` in both directories backend and frontend to run the tests. 

If you are not in developing, but just want to check the code, you could execute `npm run lint` 
in the root directory. This will run all tests in both frontend and backend and returns error code 0 
only when both successful.
 
## VCS

In the commit messages please use the format of [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
