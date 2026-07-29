import { Telegraf, Markup } from 'telegraf';
import config from '../../config';
import { BOT_KEYBOARD_BUTTONS } from '../../constants';
import { buildProfileMessage, buildReferralMessage, buildTaskCompletionMessage, buildBroadcastMessage, buildForceJoinMessage } from '../../templates/telegramMessages';
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

const isMemberOfChat = async (bot: Telegraf, chatId: string, userId: number): Promise<boolean> => {
  if (!chatId) return true;
  try {
    const member = await bot.telegram.getChatMember(chatId, userId);
    return ['creator', 'administrator', 'member'].includes(member.status);
  } catch (error) {
    console.error(`Error checking membership for ${chatId} / ${userId}:`, error);
    return false;
  }
};

const buildJoinKeyboard = () => {
  const groupUsername = config.telegram.chat_group_id.replace('@', '');
  const channelUsername = config.telegram.app_channel_id.replace('@', '');

  const groupUrl = groupUsername.startsWith('http') ? groupUsername : `https://t.me/${groupUsername}`;
  const channelUrl = channelUsername.startsWith('http') ? channelUsername : `https://t.me/${channelUsername}`;

  return Markup.inlineKeyboard([
    [Markup.button.url('💬 Join Chat Group', groupUrl)],
    [Markup.button.url('📢 Join Channel', channelUrl)],
    [Markup.button.callback('🔄 Verify Join', 'check_join')],
  ]);
};

const ensureSubscription = async (bot: Telegraf, ctx: any): Promise<boolean> => {
  const userId = ctx.from?.id;
  if (!userId) return false;

  const joinedGroup = await isMemberOfChat(bot, config.telegram.chat_group_id, userId);
  const joinedChannel = await isMemberOfChat(bot, config.telegram.app_channel_id, userId);

  if (joinedGroup && joinedChannel) {
    return true;
  }

  const firstName = ctx.from?.first_name || '';
  await ctx.reply(buildForceJoinMessage(firstName), {
    parse_mode: 'Markdown',
    ...buildJoinKeyboard(),
  });
  return false;
};

const initializeBot = (): Telegraf | null => {
  if (!config.telegram.bot_token || config.telegram.bot_token.includes('YOUR_TELEGRAM_BOT_TOKEN')) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN is not set or using placeholder. Telegraf bot start skipped.');
    return null;
  }

  const bot = new Telegraf(config.telegram.bot_token);
  botInstance = bot;
  startTime = Date.now();

  // Action for Verify Join button
  bot.action('check_join', async (ctx) => {
    try {
      const userId = ctx.from.id;
      const firstName = ctx.from.first_name || '';

      const joinedGroup = await isMemberOfChat(bot, config.telegram.chat_group_id, userId);
      const joinedChannel = await isMemberOfChat(bot, config.telegram.app_channel_id, userId);

      if (joinedGroup && joinedChannel) {
        await ctx.answerCbQuery('✅ Verification successful!');
        await ctx.reply(
          `👋 Welcome to *[BOT] Arman Bot*, ${firstName}!\n\nUse the menu buttons below to manage your profile, task extractions, and referrals.`,
          {
            parse_mode: 'Markdown',
            ...mainKeyboard,
          }
        );
      } else {
        await ctx.answerCbQuery('⚠️ You have not joined both the group and channel yet!', { show_alert: true });
      }
    } catch (error) {
      console.error('Error handling check_join action:', error);
      await ctx.answerCbQuery('❌ Verification error. Please try again.');
    }
  });

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

      const isSubscribed = await ensureSubscription(bot, ctx);
      if (!isSubscribed) return;

      await ctx.reply(
        `👋 Welcome to *[BOT] Arman Bot*, ${firstName}!\n\nUse the menu buttons below to manage your profile, task extractions, and referrals.`,
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
      if (!(await ensureSubscription(bot, ctx))) return;

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
      if (!(await ensureSubscription(bot, ctx))) return;

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
      if (!(await ensureSubscription(bot, ctx))) return;

      const telegramId = ctx.from.id.toString();
      const user = await UserService.getProfileByTelegramId(telegramId);

      if (!user || user.mainBalance < user.costPerExtract) {
        await ctx.reply('⚠️ Insufficient points balance! Please topup balance or refer friends to earn points.', mainKeyboard);
        return;
      }

      const task = await TaskService.createTask(telegramId, {
        title: `Extract Offer Link 18M`,
      });

      await ctx.reply(`🚀 *Task #${task.taskId} Started!*\nProcessing extraction... Check status in [CHAT] group shortly.`, {
        parse_mode: 'Markdown',
        ...mainKeyboard,
      });

      // Simulate extraction completion after 3 seconds & post to group!
      setTimeout(async () => {
        try {
          await TaskService.updateTaskStatus(task.taskId, 'completed');
        } catch (err) {
          console.error('Error completing simulated task:', err);
        }
      }, 3000);
    } catch (error: any) {
      await ctx.reply(`❌ ${error.message || 'Failed to start task.'}`, mainKeyboard);
    }
  });

  // Handler for Topup Balance
  bot.hears(BOT_KEYBOARD_BUTTONS.TOPUP_BALANCE, async (ctx) => {
    if (!(await ensureSubscription(bot, ctx))) return;
    await ctx.reply('💳 *Topup Balance*\n\nTo topup your balance, contact admin or use automated payment gateways.\nCurrently test topup is available via API `/api/v1/user/topup`.', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Redeem Voucher
  bot.hears(BOT_KEYBOARD_BUTTONS.REDEEM_VOUCHER, async (ctx) => {
    if (!(await ensureSubscription(bot, ctx))) return;
    await ctx.reply('🎟️ *Redeem Voucher*\n\nPlease enter your voucher code in chat to redeem points.', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Order Query
  bot.hears(BOT_KEYBOARD_BUTTONS.ORDER_QUERY, async (ctx) => {
    try {
      if (!(await ensureSubscription(bot, ctx))) return;

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
    if (!(await ensureSubscription(bot, ctx))) return;
    await ctx.reply('💰 *Credit History*\n\n• Initial Registration: 0 Points\n• Per Eligible Referral: +0.50 Points\n• Cost per Extract: -1 Point', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Help & FAQ
  bot.hears(BOT_KEYBOARD_BUTTONS.HELP_FAQ, async (ctx) => {
    if (!(await ensureSubscription(bot, ctx))) return;
    await ctx.reply('💡 *Help & FAQ*\n\n1. How to earn points? Invite users using your referral link.\n2. How to extract pixels? Press 🚀 Start Task.\n3. Need support? Contact support team.', {
      parse_mode: 'Markdown',
      ...mainKeyboard,
    });
  });

  // Handler for Change Language
  bot.hears(BOT_KEYBOARD_BUTTONS.CHANGE_LANGUAGE, async (ctx) => {
    if (!(await ensureSubscription(bot, ctx))) return;
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
    if (!(await ensureSubscription(bot, ctx))) return;
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

const sendTaskCompletionNotification = async (task: {
  taskId: string;
  username?: string;
  serviceName?: string;
  costPoints?: number;
}) => {
  if (!botInstance) {
    console.warn('⚠️ Bot instance not initialized. Cannot send task completion notification.');
    return;
  }
  const groupId = config.telegram.chat_group_id;
  if (!groupId) {
    console.log('ℹ️ TELEGRAM_CHAT_GROUP_ID not configured. Skipping group notification.');
    return;
  }

  try {
    const message = buildTaskCompletionMessage(task);
    await botInstance.telegram.sendMessage(groupId, message, {
      parse_mode: 'Markdown',
    });
    console.log(`✅ Posted completion notification for task #${task.taskId} to group ${groupId}`);
  } catch (error) {
    console.error(`❌ Failed to send group notification for task #${task.taskId}:`, error);
  }
};

const sendChannelBroadcast = async (title: string, content: string) => {
  if (!botInstance) {
    throw new Error('Bot instance not initialized.');
  }
  const channelId = config.telegram.app_channel_id;
  if (!channelId) {
    throw new Error('TELEGRAM_APP_CHANNEL_ID is not configured in .env');
  }

  const message = buildBroadcastMessage(title, content);
  await botInstance.telegram.sendMessage(channelId, message, {
    parse_mode: 'Markdown',
  });
  console.log(`📢 Broadcast sent successfully to channel ${channelId}`);
};

export const BotService = {
  initializeBot,
  getStatus,
  sendTaskCompletionNotification,
  sendChannelBroadcast,
};
