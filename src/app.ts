import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import routes from './app/routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 Telegram Bot API Server is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// Application API routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(globalErrorHandler);

// Handle 404 routes
app.use(notFound);

export default app;
