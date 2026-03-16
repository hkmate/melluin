#!/bin/sh

# SHOULD BE EXECUTED IN DOCKER CONTAINER!

CONTAINER_FIRST_STARTUP="CONTAINER_FIRST_STARTUP"
if [ ! -e /$CONTAINER_FIRST_STARTUP ]; then
    touch /$CONTAINER_FIRST_STARTUP

    echo "Copy injected config to resources."
    cp /etc/secrets/config.json apps/api/resources/server-config.json

    echo "Execute migrations and starting..."
    pnpm --filter api start:prod:with-migration

else
    echo "Starting..."
    pnpm --filter api start:prod
fi
