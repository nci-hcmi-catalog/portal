const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const getLogger = context => {
  const output = logger.child({ context });
  output.audit = (data, action, message) => {
    output.trace({ audit: 'cms', action, data }, message);
  };
  return output;
};

module.exports = getLogger;
