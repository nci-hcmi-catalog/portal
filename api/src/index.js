import createServer from '@arranger/server';

let server = createServer({
  esHost: process.env.ES_URL,
});

server.listen(process.env.PORT || 5050);
