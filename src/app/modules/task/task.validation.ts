import { z } from 'zod';

const createTaskZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    inputUrl: z.string().optional(),
  }),
});

export const TaskValidation = {
  createTaskZodSchema,
};
