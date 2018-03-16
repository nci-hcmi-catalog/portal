# HCMI Portal

### Quickstart

```
# install
make

# start api
PORT=<> yarn api

# start ui
yarn ui

# example api prod start command
ES_URL=http://es.hcmi.cancercollaboratory.org:9200 cd api && pm2 start npm --name api -- run start
```

#### Specs

https://wiki.oicr.on.ca/display/HCMI/HCMI+Spec+Guide
