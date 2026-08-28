# Setup Environment
FROM node:24-alpine AS hcmi-base

ENV ENV=dev

ARG ROOT_DIR=/hcmi
ARG API_DIR=$ROOT_DIR/api/
ARG CMS_DIR=$ROOT_DIR/cms/
ARG UI_DIR=$ROOT_DIR/ui/

WORKDIR $ROOT_DIR

COPY ./package.json ./yarn.lock $ROOT_DIR/
COPY ./api/package.json $API_DIR
COPY ./cms/package.json $CMS_DIR
COPY ./ui/package.json $UI_DIR

# Enables yarn
RUN corepack enable

# Install dependencies, then copy application files
RUN yarn global add pm2

RUN yarn

COPY . .

############
# HCMI API #
############
FROM hcmi-base AS hcmi-api

EXPOSE 5050

# Initialize OpenSearch
RUN yarn initializeEs


CMD ["yarn", "api"]

############
# HCMI CMS #
############
FROM hcmi-base AS hcmi-cms

EXPOSE 8080

# Run Mongo Variant table migrations
CMD ["sh", "-c", "yarn initializeMigrations && yarn cms"]

############
# HCMI  UI #
############
FROM hcmi-base AS hcmi-ui

EXPOSE 3000

# See https://vite.dev/config/server-options#server-host
CMD ["yarn", "ui", "--host"]
