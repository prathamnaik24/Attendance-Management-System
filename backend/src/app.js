import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Standard middlewares
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins dynamically in dev
  credentials: true
}));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API routes
app.use('/api', router);

// Central error handler (must be last)
app.use(errorHandler);

export default app;
