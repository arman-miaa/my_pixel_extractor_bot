"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bot_controller_1 = require("./bot.controller");
const router = express_1.default.Router();
router.get('/status', bot_controller_1.BotController.getStatus);
exports.BotRoutes = router;
