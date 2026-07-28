"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const authTelegram = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.authOrCreateTelegramUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User authenticated successfully!',
        data: result,
    });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const telegramId = req.user?.telegramId;
    const result = await user_service_1.UserService.getProfileByTelegramId(telegramId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User profile retrieved successfully!',
        data: result,
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All users retrieved successfully!',
        data: result,
    });
});
const topupBalance = (0, catchAsync_1.default)(async (req, res) => {
    const telegramId = req.user?.telegramId;
    const { amount } = req.body;
    const result = await user_service_1.UserService.topupBalance(telegramId, amount);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Balance topped up successfully!',
        data: result,
    });
});
exports.UserController = {
    authTelegram,
    getMyProfile,
    getAllUsers,
    topupBalance,
};
