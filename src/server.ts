import { Server } from "http";
import app from "./app";
import config from "./app/config";
import { connectDB } from "./app/db";
import { BotService } from "./app/modules/bot/bot.service";

let server: Server;

async function bootstrap() {
  await connectDB();

  try {
    // Start Telegram Bot
    BotService.initializeBot();

    // Start Express HTTP Server only in non-production/non-Vercel local environment
    if (!process.env.VERCEL) {
      server = app.listen(config.port, () => {
        console.log(`🚀 Server running on port http://localhost:${config.port}`);
      });
    }
  } catch (err) {
    console.error("❌ Failed to launch Server:", err);
  }
}

bootstrap();

export default app;
