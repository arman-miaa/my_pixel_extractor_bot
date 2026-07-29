import express from 'express';
import { BotController } from './bot.controller';

const router = express.Router();

router.get('/status', BotController.getStatus);
router.post('/broadcast', BotController.broadcastToChannel);

export const BotRoutes = router;
