"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const authTelegramZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        telegramId: zod_1.z.string({
            required_error: 'Telegram ID is required',
        }),
        username: zod_1.z.string().optional(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        referredBy: zod_1.z.string().optional(),
    }),
});
const updateProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().optional(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        languageCode: zod_1.z.string().optional(),
    }),
});
const topupZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive('Amount must be positive'),
    }),
});
exports.UserValidation = {
    authTelegramZodSchema,
    updateProfileZodSchema,
    topupZodSchema,
};
