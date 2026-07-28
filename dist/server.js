"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const bot_service_1 = require("./app/modules/bot/bot.service");
let server;
async function bootstrap() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log("🛢️  Database connected successfully!");
    }
    catch (err) {
        console.error("⚠️ MongoDB connection failed. Continuing without database for now:", err);
    }
    try {
        bot_service_1.BotService.initializeBot();
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 Server running on port http://localhost:${config_1.default.port}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to launch Server:", err);
        process.exit(1);
    }
    const exitHandler = () => {
        if (server) {
            server.close(() => {
                console.log("Server closed");
                process.exit(1);
            });
        }
        else {
            process.exit(1);
        }
    };
    const unexpectedErrorHandler = (error) => {
        console.error("Unexpected Error:", error);
        exitHandler();
    };
    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);
    process.on("SIGTERM", () => {
        console.log("SIGTERM received");
        if (server) {
            server.close();
        }
    });
}
bootstrap();
