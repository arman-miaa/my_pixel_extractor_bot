"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = exports.mainKeyboard = void 0;
const telegraf_1 = require("telegraf");
const config_1 = __importDefault(require("../../config"));
const constants_1 = require("../../constants");
const telegramMessages_1 = require("../../templates/telegramMessages");
const user_service_1 = require("../user/user.service");
const task_service_1 = require("../task/task.service");
let botInstance = null;
let startTime = Date.now();
exports.mainKeyboard = telegraf_1.Markup.keyboard([
    [constants_1.BOT_KEYBOARD_BUTTONS.START_TASK, constants_1.BOT_KEYBOARD_BUTTONS.TOPUP_BALANCE],
    [constants_1.BOT_KEYBOARD_BUTTONS.REDEEM_VOUCHER, constants_1.BOT_KEYBOARD_BUTTONS.ORDER_QUERY],
    [constants_1.BOT_KEYBOARD_BUTTONS.MY_PROFILE, constants_1.BOT_KEYBOARD_BUTTONS.REFERRAL],
    [constants_1.BOT_KEYBOARD_BUTTONS.CREDIT_HISTORY, constants_1.BOT_KEYBOARD_BUTTONS.HELP_FAQ],
    [constants_1.BOT_KEYBOARD_BUTTONS.CHANGE_LANGUAGE],
]).resize();
const initializeBot = () => {
    if (!config_1.default.telegram.bot_token || config_1.default.telegram.bot_token.includes('YOUR_TELEGRAM_BOT_TOKEN')) {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN is not set or using placeholder. Telegraf bot start skipped.');
        return null;
    }
    const bot = new telegraf_1.Telegraf(config_1.default.telegram.bot_token);
    botInstance = bot;
    startTime = Date.now();
    bot.start(async (ctx) => {
        try {
            const telegramId = ctx.from.id.toString();
            const username = ctx.from.username || '';
            const firstName = ctx.from.first_name || '';
            const lastName = ctx.from.last_name || '';
            const startPayload = ctx.text?.split(' ')[1] || '';
            const referredBy = startPayload.startsWith('ref_') ? startPayload.replace('ref_', '') : undefined;
            await user_service_1.UserService.authOrCreateTelegramUser({
                telegramId,
                username,
                firstName,
                lastName,
                referredBy,
            });
            await ctx.reply(`👋 Welcome to *[BOT] Gemini Pixel Extractor*, ${firstName}!\n\nUse the menu buttons below to manage your profile, task extractions, and referrals.`, {
                parse_mode: 'Markdown',
                ...exports.mainKeyboard,
            });
        }
        catch (error) {
            console.error('Error handling /start:', error);
            ctx.reply('❌ An error occurred while starting the bot. Please try again.');
        }
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.MY_PROFILE, async (ctx) => {
        try {
            const telegramId = ctx.from.id.toString();
            const user = await user_service_1.UserService.getProfileByTelegramId(telegramId);
            if (!user) {
                await ctx.reply('❌ User profile not found. Please type /start first.');
                return;
            }
            const profileText = (0, telegramMessages_1.buildProfileMessage)(user, 168);
            await ctx.reply(profileText, {
                parse_mode: 'Markdown',
                ...exports.mainKeyboard,
            });
        }
        catch (error) {
            console.error('Error handling My Profile:', error);
            await ctx.reply('❌ Failed to retrieve profile.');
        }
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.REFERRAL, async (ctx) => {
        try {
            const telegramId = ctx.from.id.toString();
            const user = await user_service_1.UserService.getProfileByTelegramId(telegramId);
            if (!user) {
                await ctx.reply('❌ User profile not found. Please type /start first.');
                return;
            }
            const referralText = (0, telegramMessages_1.buildReferralMessage)(user, config_1.default.telegram.bot_username);
            await ctx.reply(referralText, {
                parse_mode: 'Markdown',
                ...exports.mainKeyboard,
            });
        }
        catch (error) {
            console.error('Error handling Referral:', error);
            await ctx.reply('❌ Failed to retrieve referral status.');
        }
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.START_TASK, async (ctx) => {
        try {
            const telegramId = ctx.from.id.toString();
            const user = await user_service_1.UserService.getProfileByTelegramId(telegramId);
            if (!user || user.mainBalance < user.costPerExtract) {
                await ctx.reply('⚠️ Insufficient points balance! Please topup balance or refer friends to earn points.', exports.mainKeyboard);
                return;
            }
            await task_service_1.TaskService.createTask(telegramId, {
                title: `Pixel Extraction ${Date.now()}`,
            });
            await ctx.reply('🚀 Task started successfully! Check status using 📦 Order Query.', exports.mainKeyboard);
        }
        catch (error) {
            await ctx.reply(`❌ ${error.message || 'Failed to start task.'}`, exports.mainKeyboard);
        }
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.TOPUP_BALANCE, async (ctx) => {
        await ctx.reply('💳 *Topup Balance*\n\nTo topup your balance, contact admin or use automated payment gateways.\nCurrently test topup is available via API `/api/v1/user/topup`.', {
            parse_mode: 'Markdown',
            ...exports.mainKeyboard,
        });
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.REDEEM_VOUCHER, async (ctx) => {
        await ctx.reply('🎟️ *Redeem Voucher*\n\nPlease enter your voucher code in chat to redeem points.', {
            parse_mode: 'Markdown',
            ...exports.mainKeyboard,
        });
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.ORDER_QUERY, async (ctx) => {
        try {
            const telegramId = ctx.from.id.toString();
            const tasks = await task_service_1.TaskService.getMyTasks(telegramId);
            if (tasks.length === 0) {
                await ctx.reply('📦 *Order Query*\n\nNo orders found for your account.', {
                    parse_mode: 'Markdown',
                    ...exports.mainKeyboard,
                });
                return;
            }
            const taskListText = tasks
                .slice(0, 5)
                .map((t) => `• *${t.taskId}*: ${t.title} [_${t.status}_]`)
                .join('\n');
            await ctx.reply(`📦 *Recent Orders:*\n\n${taskListText}`, {
                parse_mode: 'Markdown',
                ...exports.mainKeyboard,
            });
        }
        catch (error) {
            await ctx.reply('❌ Failed to fetch orders.');
        }
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.CREDIT_HISTORY, async (ctx) => {
        await ctx.reply('💰 *Credit History*\n\n• Initial Registration: +0.80 Referral Balance\n• Cost per Extract: -1 Point', {
            parse_mode: 'Markdown',
            ...exports.mainKeyboard,
        });
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.HELP_FAQ, async (ctx) => {
        await ctx.reply('💡 *Help & FAQ*\n\n1. How to earn points? Invite users using your referral link.\n2. How to extract pixels? Press 🚀 Start Task.\n3. Need support? Contact support team.', {
            parse_mode: 'Markdown',
            ...exports.mainKeyboard,
        });
    });
    bot.hears(constants_1.BOT_KEYBOARD_BUTTONS.CHANGE_LANGUAGE, async (ctx) => {
        await ctx.reply('🌐 *Change Language*\n\nCurrent Language: English 🇬🇧\n(More languages coming soon)', {
            parse_mode: 'Markdown',
            ...exports.mainKeyboard,
        });
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
        username: config_1.default.telegram.bot_username,
        uptime: Math.floor((Date.now() - startTime) / 1000),
    };
};
exports.BotService = {
    initializeBot,
    getStatus,
};
