import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { BotService } from "./app/modules/bot/bot.service";

let server: Server;

async function bootstrap() {
  try {
    // 1. Connect MongoDB
    await mongoose.connect(config.database_url);
    console.log("🛢️  Database connected successfully!");
  } catch (err) {
    console.error(
      "⚠️ MongoDB connection failed. Continuing without database for now:",
      err,
    );
  }

  try {
    // 2. Start Telegram Bot
    BotService.initializeBot();

    // 3. Start Express HTTP Server
    server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to launch Server:", err);
    process.exit(1);
  }

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
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
