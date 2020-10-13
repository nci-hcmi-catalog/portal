# HCMI Searchable Catalog. 

This is a mono-repo containing the [HCMI Portal UI](ui), [CMS server](cms), and [Arranger API server](api).

## Development

To work on this project, running the UI, CMS, and API on a local device, make sure your device has the dependencies listed below and then follow the steps in the [Configuration](#Configuration), [Migrations](#Migrations), and [Quickstart](#Quickstart) sections.

### Dependencies

* Elasticsearch - Needs to be installed and running on the default port (9200)
* MongoDB - Does not need to be installed locally, but if not local update all config file references to mongo location.

### Configuration

### Migrations

First time setup will require variants being loaded into mongo via a migration in the `cms/variant-migrations` folder. Migrations require the global installation of the migrate-mongo package, `npm i -g migrate-mongo`. for more information visit https://www.npmjs.com/package/migrate-mongo.

To run the required migrations:

```
cd cms/variant-migrations
migrate-mongo up -f config.js
```

### Quickstart

```
# install
make

# start api
PORT=<> yarn api

# start ui
SKIP_PREFLIGHT_CHECK=true yarn ui

# example api prod start command
ES_URL=http://es.hcmi.cancercollaboratory.org:9200 cd api && pm2 start npm --name api -- run start

# Print elasticsearch mapping
yarn mapping <data_model> --name model

# Create and populate elasticsearch index from mapping
# --host defaults to localhost:9200
yarn fake <data_model> --length 10000 --index model --type model --host <es_uri>
```

#### Specs

https://wiki.oicr.on.ca/display/HCMI/HCMI+Spec+Guide

#### API Tech

* [@arranger/server](https://github.com/overture-stack/arranger/tree/master/modules/server) (ships with express, socket.io)

#### UI Tech

* [create-react-app](https://github.com/facebook/create-react-app)
* [@arranger/components](https://github.com/overture-stack/arranger/tree/master/modules/components)
* [react-router](https://reacttraining.com/react-router/web/guides/philosophy)
* [emotion css-in-js](https://emotion.sh/docs)
* [styled-system](https://github.com/jxnblk/styled-system)
* [react-component-component](https://www.npmjs.com/package/react-component-component)
