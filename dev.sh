#!/bin/bash

if [ ! -f "server/.env" ] || [ ! -f "client/.env" ]; then
	echo 'no `.env.` file found, please refer to the README' >&2
	exit 1
fi

rm -rf server/dist
rm -rf client/dist
mkdir -p server/dist/server/src/
touch server/dist/server/src/index.js

docker-compose \
	-f docker-compose.yml \
	-f docker-compose-dev.yml \
	up \
	--force-recreate
