#!/bin/bash

if [ ! -f "server/.env" ] || [ ! -f "client/.env" ]; then
	echo 'no `.env.` file found, please refer to the README' >&2
	exit 1
fi

docker-compose build
docker-compose up --force-recreate
