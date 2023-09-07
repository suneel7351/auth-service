import winston from 'winston';
import { CONFIG } from '.';

export const logger = winston.createLogger({
    level: CONFIG.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston.transports.Console({
            // format: winston.format.simple(),
            silent:
                CONFIG.ENVIRONMENT === 'test' ||
                CONFIG.ENVIRONMENT === 'production',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'application.log',
            level: 'info',
            silent: CONFIG.ENVIRONMENT === 'test',
        }),
    ],
});
