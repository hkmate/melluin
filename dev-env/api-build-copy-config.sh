#!/bin/bash

# SHOULD BE EXECUTED IN DOCKER BUILD!

if [ "$USE_DEFAULT_CONFIG" == "true" ]; then
    echo "Use default config.json "
else
    echo "Copy injected config to resources."
#    Render will place secret file to the root of the image at build time
    cp ./config.json apps/api/resources/server-config.json
fi
