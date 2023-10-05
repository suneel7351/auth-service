import { CONFIG } from './config';

// import { CONFIG } from '@/config';
import app from './app';

// import { logger } from '@/config/logger';

import { logger } from './config/logger';
const PORT = CONFIG.PORT || 1666;
const startServer = (port: number) => {
    try {
        app.listen(port, () => {
            logger.info(`Server is running on ${port}`);
        });
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
            logger.error(error);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer(PORT as number);
