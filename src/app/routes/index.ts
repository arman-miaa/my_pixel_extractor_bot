import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { TaskRoutes } from '../modules/task/task.route';
import { BotRoutes } from '../modules/bot/bot.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/task',
    route: TaskRoutes,
  },
  {
    path: '/bot',
    route: BotRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
