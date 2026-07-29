import express from 'express';
import { BotController } from './bot.controller';

const router = express.Router();

router.get('/status', BotController.getStatus);
router.post('/broadcast', BotController.broadcastToChannel);
router.post('/webhook', BotController.handleWebhook);
router.get('/set-webhook', BotController.setWebhook);

export const BotRoutes = router;
