import express from 'express';
import { BotController } from './bot.controller';

const router = express.Router();

router.get('/status', BotController.getStatus);

export const BotRoutes = router;
