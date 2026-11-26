import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: { target: 'pino-pretty' },
});

const getLogger = (context) => logger.child({ context });

export default getLogger;
