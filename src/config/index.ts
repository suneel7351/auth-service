import { config } from 'dotenv';
import path from 'path'
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`) });

const { PORT, LOG_LEVEL, ENVIRONMENT, REFRESH_TOKEN_SECRET, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWKS_URI, PRIVATE_KEY } = process.env;
export const CONFIG = {
    PORT,
    LOG_LEVEL,
    ENVIRONMENT,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    REFRESH_TOKEN_SECRET,
    DB_NAME,
    JWKS_URI,
    PRIVATE_KEY
};
