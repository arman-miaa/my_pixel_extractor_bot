"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const constants_1 = require("../../constants");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/auth-telegram', (0, validateRequest_1.default)(user_validation_1.UserValidation.authTelegramZodSchema), user_controller_1.UserController.authTelegram);
router.get('/profile', (0, auth_1.default)(constants_1.ENUM_USER_ROLE.USER, constants_1.ENUM_USER_ROLE.ADMIN, constants_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getMyProfile);
router.post('/topup', (0, auth_1.default)(constants_1.ENUM_USER_ROLE.USER, constants_1.ENUM_USER_ROLE.ADMIN, constants_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.topupZodSchema), user_controller_1.UserController.topupBalance);
router.get('/', (0, auth_1.default)(constants_1.ENUM_USER_ROLE.ADMIN, constants_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
exports.UserRoutes = router;
