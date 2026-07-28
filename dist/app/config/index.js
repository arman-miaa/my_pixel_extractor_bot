"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    database_url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/telegram-bot-db',
    jwt: {
        secret: process.env.JWT_SECRET || 'supersecretjwtkey',
        expires_in: process.env.JWT_EXPIRES_IN || '7d',
    },
    telegram: {
        bot_token: process.env.TELEGRAM_BOT_TOKEN || '',
        bot_username: process.env.BOT_USERNAME || 'GeminiPixelExtractorBot',
    },
};
