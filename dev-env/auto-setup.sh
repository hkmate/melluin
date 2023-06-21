#!/bin/bash

echo "Setup database and tools..."
docker-compose -f dev-env/docker-compose.yml up -d

echo "Install backend node-modules..."
npm install --prefix backend

echo "Install frontend node-modules..."
npm install --prefix frontend

echo "Initialize database tables and data..."
npm run --prefix backend migrate
