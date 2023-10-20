import { CONFIG } from './config';

// import { CONFIG } from '@/config';
import app from './app';

// import { logger } from '@/config/logger';

import { logger } from './config/logger';
import { AppDataSource } from './config/data-source';
const PORT = CONFIG.PORT || 1666;
const startServer = async (port: number) => {
    try {
        await AppDataSource.initialize()
        logger.info("Database connect successfully.")
        app.listen(port, () => {
            logger.info(`Server is running on ${port}`);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer(PORT as number);
