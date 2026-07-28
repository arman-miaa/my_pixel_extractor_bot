import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const authTelegram = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.authOrCreateTelegramUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User authenticated successfully!',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const telegramId = req.user?.telegramId;
  const result = await UserService.getProfileByTelegramId(telegramId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users retrieved successfully!',
    data: result,
  });
});

const topupBalance = catchAsync(async (req: Request, res: Response) => {
  const telegramId = req.user?.telegramId;
  const { amount } = req.body;
  const result = await UserService.topupBalance(telegramId!, amount);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Balance topped up successfully!',
    data: result,
  });
});

export const UserController = {
  authTelegram,
  getMyProfile,
  getAllUsers,
  topupBalance,
};
