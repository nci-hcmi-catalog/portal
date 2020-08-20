import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const getLogger = context => {
  const output = logger.child({ context });
  output.audit = (data, action, message) => {
    output.info({ audit: 'cms', action, data }, message);
  };
  return output;
};

export default getLogger;
