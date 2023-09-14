import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import cors from 'cors';
import { logger } from './config/logger';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.status(200).end('hello');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});
export default app;
