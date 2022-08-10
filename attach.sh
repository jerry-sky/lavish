#!/bin/bash

container="$1"
container="${container:-server}"
comm="$2"
comm="${comm:-/bin/bash}"

if [ -z "$container" ]; then
	printf '\033[1m%s\033[0m\n' 'provide name of a container' >&2
	exit 1
fi

docker exec -it "lavish-$container" "$comm"
