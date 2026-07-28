"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => (0, catchAsync_1.default)(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError_1.default(401, 'You are not authorized');
    }
    let verifiedUser = null;
    try {
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new AppError_1.default(403, 'Invalid or expired token');
    }
    req.user = verifiedUser;
    if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError_1.default(403, 'Forbidden access! You do not have permissions');
    }
    next();
});
exports.default = auth;
