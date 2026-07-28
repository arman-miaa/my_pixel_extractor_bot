import express from 'express';
import { ENUM_USER_ROLE } from '../../constants';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/auth-telegram',
  validateRequest(UserValidation.authTelegramZodSchema),
  UserController.authTelegram
);

router.get('/profile', auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), UserController.getMyProfile);

router.post(
  '/topup',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.topupZodSchema),
  UserController.topupBalance
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
