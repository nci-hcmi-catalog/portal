# Setup Environment
FROM node:24-alpine AS hcmi-base

ARG ENV=prd
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
RUN ENV=$ENV npm run initializeEs

RUN cd $API_DIR && pm2 startOrRestart pm2.config.js --env $ENV

CMD ["yarn", "api"]

############
# HCMI CMS #
############
FROM hcmi-base AS hcmi-cms

EXPOSE 8080

# Run Mongo Variant table migrations
RUN npm run initializeMigrations

RUN cd $CMS_DIR && pm2 startOrRestart pm2.config.js --env $ENV

CMD ["yarn", "cms"]

############
# HCMI  UI #
############
FROM hcmi-base AS hcmi-ui

EXPOSE 3000

# See https://vite.dev/config/server-options#server-host
CMD ["yarn", "ui", "--host"]
