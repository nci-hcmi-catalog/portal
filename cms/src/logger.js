import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const getLogger = context => logger.child({ context });

export default getLogger;
