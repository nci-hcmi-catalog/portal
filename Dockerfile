# Setup Environment
FROM node:24-alpine AS hcmi-base

ARG ENV=dev
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
RUN ENV=$ENV yarn initializeEs

RUN cd $API_DIR && pm2 startOrRestart pm2.config.js --env $ENV

CMD ["yarn", "api"]

############
# HCMI CMS #
############
FROM hcmi-base AS hcmi-cms

EXPOSE 8080

# Var 1
# ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
# ARG MONGO_URL='mongodb://localhost:27017'

# Var 2
# ERROR: connect ECONNREFUSED 192.168.65.254:27017, connect ENETUNREACH fdc4:f303:9324::254:27017 [iPv6]
# Works in CMS Application
# ARG MONGO_URL='mongodb://host.docker.internal:27017'

# Var 3
# ERROR: connect ECONNREFUSED 127.0.0.1:27017 MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
#ARG MONGO_URL='mongodb://127.0.0.1:27017'

# Var 4
# ERROR: getaddrinfo ENOTFOUND mongo MongoServerSelectionError: getaddrinfo ENOTFOUND mongo
# Using docker service name
# ARG MONGO_URL='mongodb://mongo'
# ARG MONGO_URL=mongodb://mongo:27017
# ARG MONGO_URL=mongodb://hcmi-mongodb:27017
# ARG MONGO_URL=mongodb://mongodb:27017

# Run Mongo Variant table migrations
RUN MONGO_URL=$MONGO_URL yarn initializeMigrations

RUN cd $CMS_DIR && pm2 startOrRestart pm2.config.js --env $ENV

CMD ["yarn", "cms"]

############
# HCMI  UI #
############
FROM hcmi-base AS hcmi-ui

EXPOSE 3000

# See https://vite.dev/config/server-options#server-host
CMD ["yarn", "ui", "--host"]
