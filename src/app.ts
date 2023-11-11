import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { handleApplicationErrors } from './middlewares';
import { loadEnv, connectDb, disconnectDB } from '@/config';
import { participantRouter } from './routes';

loadEnv();

const app = express();

app
    .use(cors())
    .use(express.json())
    .get('/health', (req,res) => res.send("It's live and running"))
    .use('/participants', participantRouter)
    .use(handleApplicationErrors);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app)
}

export async function close(): Promise<void> {
    await disconnectDB();
}

export default app;