"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidation = void 0;
const zod_1 = require("zod");
const createTaskZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        inputUrl: zod_1.z.string().optional(),
    }),
});
exports.TaskValidation = {
    createTaskZodSchema,
};
