import pino from 'pino';

// TODO: process.env.LOG_LEVEL ||
const logger = pino({ level: 'info' });

const getLogger = (context) => {
  const output = logger.child({ context });
  output.audit = (data, action, message) => {
    output.info({ audit: 'cms', action, data }, message);
  };
  return output;
};

export default getLogger;
