# HCMI Portal

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
yarn fake <data_model> --length 10000 --index model --type model
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
