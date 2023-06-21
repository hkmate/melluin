#!/bin/bash

echo "Setup environment variables to config"
node dev-env/set-frontend-config.js

echo "Install node modules"
npm install --prefix frontend

echo "Build the application"
npm run --prefix frontend build
