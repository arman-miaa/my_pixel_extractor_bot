import express from 'express';
import { ENUM_USER_ROLE } from '../../constants';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskController } from './task.controller';
import { TaskValidation } from './task.validation';

const router = express.Router();

router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(TaskValidation.createTaskZodSchema),
  TaskController.createTask
);

router.get(
  '/my-tasks',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TaskController.getMyTasks
);

router.get(
  '/:taskId',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TaskController.getTaskById
);

export const TaskRoutes = router;
