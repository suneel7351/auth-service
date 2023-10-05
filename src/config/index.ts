import { config } from 'dotenv';
import path from 'path'
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { PORT, LOG_LEVEL, ENVIRONMENT, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
export const CONFIG = {
    PORT,
    LOG_LEVEL,
    ENVIRONMENT,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME
};
