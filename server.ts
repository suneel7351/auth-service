import { CONFIG } from './src/config';
// import { CONFIG } from '@/config';
import app from './src/app';
// import { logger } from '@/config/logger';

import { logger } from './src/config/logger';
const PORT = CONFIG.PORT || 1666;
const startServer = async (port: number) => {
    try {
        app.listen(port, () => {
            logger.info(`Server is running on ${port}`);
        });
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
            logger.error(`Something went wrong ,${error.message}`);
        }
    }
};

startServer(PORT as number);
