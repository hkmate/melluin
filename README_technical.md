# Melluin

## Install the project

There are a few step to make the project runnable:

- Set up the database: Go to the directory 'dev-end' and execute `docker-compose up -d`.
- Install node modules:
    - run `npm install` in both directory 'backend' and 'frontend'
    - run `npm run migrate` to execute flyway scripts in the newly created database

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
