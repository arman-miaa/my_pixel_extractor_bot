"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const task_route_1 = require("../modules/task/task.route");
const bot_route_1 = require("../modules/bot/bot.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/task',
        route: task_route_1.TaskRoutes,
    },
    {
        path: '/bot',
        route: bot_route_1.BotRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
