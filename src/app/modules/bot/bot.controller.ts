import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BotService } from './bot.service';

const getStatus = catchAsync(async (req: Request, res: Response) => {
  const result = BotService.getStatus();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bot status retrieved successfully!',
    data: result,
  });
});

export const BotController = {
  getStatus,
};
