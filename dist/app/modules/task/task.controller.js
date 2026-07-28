"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const task_service_1 = require("./task.service");
const createTask = (0, catchAsync_1.default)(async (req, res) => {
    const telegramId = req.user?.telegramId;
    const result = await task_service_1.TaskService.createTask(telegramId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Task created successfully!',
        data: result,
    });
});
const getMyTasks = (0, catchAsync_1.default)(async (req, res) => {
    const telegramId = req.user?.telegramId;
    const result = await task_service_1.TaskService.getMyTasks(telegramId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tasks retrieved successfully!',
        data: result,
    });
});
const getTaskById = (0, catchAsync_1.default)(async (req, res) => {
    const { taskId } = req.params;
    const result = await task_service_1.TaskService.getTaskById(taskId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Task retrieved successfully!',
        data: result,
    });
});
exports.TaskController = {
    createTask,
    getMyTasks,
    getTaskById,
};
