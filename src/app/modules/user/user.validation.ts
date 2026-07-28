import { z } from 'zod';

const authTelegramZodSchema = z.object({
  body: z.object({
    telegramId: z.string({
      required_error: 'Telegram ID is required',
    }),
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    referredBy: z.string().optional(),
  }),
});

const updateProfileZodSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    languageCode: z.string().optional(),
  }),
});

const topupZodSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
  }),
});

export const UserValidation = {
  authTelegramZodSchema,
  updateProfileZodSchema,
  topupZodSchema,
};
