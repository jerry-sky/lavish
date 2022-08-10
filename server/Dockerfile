FROM node:16-buster

SHELL ["/bin/bash", "-c"]


WORKDIR /wrk
ADD pnpm-lock.yaml .


WORKDIR /wrk/server
ADD server/package.json .

# install package manager
RUN npm -g i "pnpm@$(npm info pnpm version)"

# install dependencies
RUN pnpm i


# prepare database schema
ADD server/prisma prisma
RUN pnpm prisma generate

# build
ADD model ../model
ADD server/src src
ADD server/tsconfig.json .
ADD tsconfig.json ..
RUN pnpm build

ADD server/.env .

ENTRYPOINT pnpm run prod
