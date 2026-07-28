"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const constants_1 = require("../../constants");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const task_controller_1 = require("./task.controller");
const task_validation_1 = require("./task.validation");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(constants_1.ENUM_USER_ROLE.USER, constants_1.ENUM_USER_ROLE.ADMIN, constants_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(task_validation_1.TaskValidation.createTaskZodSchema), task_controller_1.TaskController.createTask);
router.get('/my-tasks', (0, auth_1.default)(constants_1.ENUM_USER_ROLE.USER, constants_1.ENUM_USER_ROLE.ADMIN, constants_1.ENUM_USER_ROLE.SUPER_ADMIN), task_controller_1.TaskController.getMyTasks);
router.get('/:taskId', (0, auth_1.default)(constants_1.ENUM_USER_ROLE.USER, constants_1.ENUM_USER_ROLE.ADMIN, constants_1.ENUM_USER_ROLE.SUPER_ADMIN), task_controller_1.TaskController.getTaskById);
exports.TaskRoutes = router;
