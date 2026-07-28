"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const task_model_1 = require("./task.model");
const createTask = async (telegramId, payload) => {
    const user = await user_model_1.User.findOne({ telegramId });
    if (!user) {
        throw new AppError_1.default(404, 'User not found');
    }
    if (user.mainBalance < user.costPerExtract) {
        throw new AppError_1.default(400, 'Insufficient balance to start task! Please topup balance.');
    }
    const taskId = `TASK-${Date.now()}`;
    const newTask = await task_model_1.Task.create({
        taskId,
        telegramId,
        title: payload.title,
        inputUrl: payload.inputUrl || '',
        status: 'processing',
        costPoints: user.costPerExtract,
    });
    await user_model_1.User.findOneAndUpdate({ telegramId }, {
        $inc: { mainBalance: -user.costPerExtract, inProgressCount: 1 },
        $push: {
            recentTasks: {
                $each: [
                    {
                        taskId,
                        title: payload.title,
                        status: 'processing',
                        createdAt: new Date(),
                    },
                ],
                $slice: -5,
            },
        },
    });
    return newTask;
};
const getMyTasks = async (telegramId) => {
    return await task_model_1.Task.find({ telegramId }).sort({ createdAt: -1 });
};
const getTaskById = async (taskId) => {
    return await task_model_1.Task.findOne({ taskId });
};
exports.TaskService = {
    createTask,
    getMyTasks,
    getTaskById,
};
