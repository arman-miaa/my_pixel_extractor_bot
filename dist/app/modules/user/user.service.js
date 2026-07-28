"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const user_model_1 = require("./user.model");
const authOrCreateTelegramUser = async (payload) => {
    let user = await user_model_1.User.findOne({ telegramId: payload.telegramId });
    if (!user) {
        user = await user_model_1.User.create({
            telegramId: payload.telegramId,
            username: payload.username || '',
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            referredBy: payload.referredBy || null,
            mainBalance: 0,
            referralBalance: 0.80,
            eligibleReferrals: 3,
            notEligibleReferrals: 10,
            pendingReferrals: 0,
        });
        if (payload.referredBy && payload.referredBy !== payload.telegramId) {
            await user_model_1.User.findOneAndUpdate({ telegramId: payload.referredBy }, {
                $inc: { eligibleReferrals: 1, referralBalance: 0.50 },
            });
        }
    }
    else {
        if (payload.username || payload.firstName || payload.lastName) {
            user.username = payload.username || user.username;
            user.firstName = payload.firstName || user.firstName;
            user.lastName = payload.lastName || user.lastName;
            await user.save();
        }
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: user._id.toString(),
        telegramId: user.telegramId,
        role: user.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
        user,
    };
};
const getProfileByTelegramId = async (telegramId) => {
    const user = await user_model_1.User.findOne({ telegramId });
    if (!user) {
        throw new AppError_1.default(404, 'User not found');
    }
    return user;
};
const getAllUsers = async () => {
    return await user_model_1.User.find({});
};
const topupBalance = async (telegramId, amount) => {
    const user = await user_model_1.User.findOneAndUpdate({ telegramId }, { $inc: { mainBalance: amount } }, { new: true });
    if (!user) {
        throw new AppError_1.default(404, 'User not found');
    }
    return user;
};
exports.UserService = {
    authOrCreateTelegramUser,
    getProfileByTelegramId,
    getAllUsers,
    topupBalance,
};
