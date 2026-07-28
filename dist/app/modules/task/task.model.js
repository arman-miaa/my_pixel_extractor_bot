"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    taskId: {
        type: String,
        required: true,
        unique: true,
    },
    telegramId: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    inputUrl: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    resultData: {
        type: String,
        default: '',
    },
    costPoints: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
