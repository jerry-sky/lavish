#!/bin/bash

EXEC='pnpm exec --'
ECHO="printf \n\033[1m%s\033[0m\n\n"


# only check the validity of the code by default
PRETTIER_MODE='--check'
ESLINT_MODE=''
STYLELINT_MODE=''

# if an argument is passed try to fix issues
if [ -n "$1" ]; then
	PRETTIER_MODE='--write'
	ESLINT_MODE='--fix'
	STYLELINT_MODE='--fix'
fi

exit_code=0

$ECHO 'Prettier'
$EXEC prettier "$PRETTIER_MODE" --ignore-path .gitignore --plugin-search-dir=. model client server
[ "$?" -ne 0 ] && exit_code=1

$ECHO 'ESLint'
$EXEC eslint "$ESLINT_MODE" --ignore-path .gitignore --ext js,jsx,ts,tsx .
[ "$?" -ne 0 ] && exit_code=1

$ECHO 'StyleLint'
$EXEC stylelint "$STYLELINT_MODE" --ignore-path .gitignore {model,client,server}/*.{scss,svelte,html,ts}
[ "$?" -ne 0 ] && exit_code=1

exit $exit_code
