import { Telegraf, Markup } from 'telegraf';
import config from '../../config';
import { BOT_KEYBOARD_BUTTONS } from '../../constants';
import { buildProfileMessage, buildReferralMessage } from '../../templates/telegramMessages';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';

let botInstance: Telegraf | null = null;
let startTime: number = Date.now();

export const mainKeyboard = Markup.keyboard([
  [BOT_KEYBOARD_BUTTONS.START_TASK, BOT_KEYBOARD_BUTTONS.TOPUP_BALANCE],
  [BOT_KEYBOARD_BUTTONS.REDEEM_VOUCHER, BOT_KEYBOARD_BUTTONS.ORDER_QUERY],
  [BOT_KEYBOARD_BUTTONS.MY_PROFILE, BOT_KEYBOARD_BUTTONS.REFERRAL],
  [BOT_KEYBOARD_BUTTONS.CREDIT_HISTORY, BOT_KEYBOARD_BUTTONS.HELP_FAQ],
  [BOT_KEYBOARD_BUTTONS.CHANGE_LANGUAGE],
]).resize();

const initializeBot = (): Telegraf | null => {
  if (!config.telegram.bot_token || config.telegram.bot_token.includes('YOUR_TELEGRAM_BOT_TOKEN')) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN is not set or using placeholder. Telegraf bot start skipped.');
    return null;
  }

  const bot = new Telegraf(config.telegram.bot_token);
  botInstance = bot;
  startTime = Date.now();

  // /start command
  bot.start(async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const username = ctx.from.username || '';
      const firstName = ctx.from.first_name || '';
      const lastName = ctx.from.last_name || '';

      const startPayload = ctx.text?.split(' ')[1] || '';
      const referredBy = startPayload.startsWith('ref_') ? startPayload.replace('ref_', '') : undefined;

      await UserService.authOrCreateTelegramUser({
        telegramId,
        username,
        firstName,
        lastName,
        referredBy,
      });

      await ctx.reply(
        `👋 Welcome to *[BOT] Gemini Pixel Extractor*, ${firstName}!\n\nUse the menu buttons below to manage your profile, task extractions, and referrals.`,
        {
          parse_mode: 'Markdown',
          ...mainKeyboard,
        }
      );
    } catch (error) {
      console.error('Error handling /start:', error);
      ctx.reply('❌ An error occurred while starting the bot. Please try again.');
    }
  });

  // Handler for My Profile button
  bot.hears(BOT_KEYBOARD_BUTTONS.MY_PROFILE, async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const user = await UserService.getProfileByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('❌ User profile not found. Please type /start first.');
        return;
      }

      const profileText = buildProfileMessage(user, 168);
      await ctx.reply(profileText, {
        parse_mode: 'Markdown',
        ...mainKeyboard,
      });
    } catch (error) {
      console.error('Error handling My Profile:', error);
      await ctx.reply('❌ Failed to retrieve profile.');
    }
  });

  // Handler for Referral button
  bot.hears(BOT_KEYBOARD_BUTTONS.REFERRAL, async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const user = await UserService.getProfileByTelegramId(telegramId);
      if (!user) {
        await ctx.reply('❌ User profile not found. Please type /start first.');
        return;
      }

      const referralText = buildReferralMessage(user, config.telegram.bot_username);
      await ctx.reply(referralText, {
        parse_mode: 'Markdown',
        ...mainKeyboard,
      });
    } catch (error) {
      console.error('Error handling Referral:', error);
      await ctx.reply('❌ Failed to retrieve referral status.');
    }
  });

  // Handler for Start Task
  bot.hears(BOT_KEYBOARD_BUTTONS.START_TASK, async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const user = await UserService.getProfileByTelegramId(telegramId);

      if (!user || user.mainBalance < user.costPerExtract) {
        await ctx.reply('⚠️ Insufficient points balance! Please topup balance or refer friends to earn points.', mainKeyboard);
        return;
      }

      await TaskService.createTask(telegramId, {
        title: `Pixel Extraction ${Date.now()}`,
      });

      await ctx.reply('🚀 Task started successfully! Check status using 📦 Order Query.', mainKeyboard);
    } catch (error: any) {
      await ctx.reply(`❌ ${error.message || 'Failed to start task.'}`, mainKeyboard);
    }
  });

  // Handler for Topup Balance
  bot.hears(BOT_KEYBOARD_BUTTONS.TOPUP_BALANCE, async (ctx) => {
    await ctx.reply('💳 *Topup Balance*\n\nTo topup your balance, contact admin or use automated payment gateways.\nCurrently test topup is available via API `/api/v1/user/topup`.', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Redeem Voucher
  bot.hears(BOT_KEYBOARD_BUTTONS.REDEEM_VOUCHER, async (ctx) => {
    await ctx.reply('🎟️ *Redeem Voucher*\n\nPlease enter your voucher code in chat to redeem points.', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Order Query
  bot.hears(BOT_KEYBOARD_BUTTONS.ORDER_QUERY, async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const tasks = await TaskService.getMyTasks(telegramId);

      if (tasks.length === 0) {
        await ctx.reply('📦 *Order Query*\n\nNo orders found for your account.', {
          parse_mode: 'Markdown',
          ...mainKeyboard,
        });
        return;
      }

      const taskListText = tasks
        .slice(0, 5)
        .map((t) => `• *${t.taskId}*: ${t.title} [_${t.status}_]`)
        .join('\n');

      await ctx.reply(`📦 *Recent Orders:*\n\n${taskListText}`, {
        parse_mode: 'Markdown',
        ...mainKeyboard,
      });
    } catch (error) {
      await ctx.reply('❌ Failed to fetch orders.');
    }
  });

  // Handler for Credit History
  bot.hears(BOT_KEYBOARD_BUTTONS.CREDIT_HISTORY, async (ctx) => {
    await ctx.reply('💰 *Credit History*\n\n• Initial Registration: +0.80 Referral Balance\n• Cost per Extract: -1 Point', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Help & FAQ
  bot.hears(BOT_KEYBOARD_BUTTONS.HELP_FAQ, async (ctx) => {
    await ctx.reply('💡 *Help & FAQ*\n\n1. How to earn points? Invite users using your referral link.\n2. How to extract pixels? Press 🚀 Start Task.\n3. Need support? Contact support team.', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Change Language
  bot.hears(BOT_KEYBOARD_BUTTONS.CHANGE_LANGUAGE, async (ctx) => {
    await ctx.reply('🌐 *Change Language*\n\nCurrent Language: English 🇬🇧\n(More languages coming soon)', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Global Error Catch for Telegraf
  bot.catch((err: any, ctx) => {
    console.error(`❌ Telegraf error for ${ctx.updateType}:`, err);
  });

  // Fallback handler for unrecognized text messages
  bot.on('text', async (ctx) => {
    await ctx.reply(
      '🤖 Option not recognized. Please use the menu buttons below or type /start.',
      mainKeyboard
    );
  });

  bot.launch().then(() => {
    console.log('🤖 Telegram Bot launched successfully!');
  }).catch((err) => {
    console.error('❌ Failed to launch Telegram Bot:', err);
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};

const getStatus = () => {
  return {
    isRunning: !!botInstance,
    username: config.telegram.bot_username,
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };
};

export const BotService = {
  initializeBot,
  getStatus,
};
