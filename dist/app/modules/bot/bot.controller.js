"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bot_service_1 = require("./bot.service");
const getStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = bot_service_1.BotService.getStatus();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Bot status retrieved successfully!',
        data: result,
    });
});
exports.BotController = {
    getStatus,
};
