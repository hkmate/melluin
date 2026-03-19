#!/bin/bash

##
#   This script should be executed from the root of the project.
#   Normally, this is used only in deployment.
##

echo "Setup config"
cp ./web-config.json apps/web/src/assets/app-config.json

echo "Install node modules"
pnpm --filter common install
pnpm --filter web install

echo "Build the application"
pnpm --filter web build
