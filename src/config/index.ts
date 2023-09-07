import { config } from 'dotenv';
config();

const { PORT, LOG_LEVEL, ENVIRONMENT } = process.env;
export const CONFIG = {
    PORT,
    LOG_LEVEL,
    ENVIRONMENT,
};
