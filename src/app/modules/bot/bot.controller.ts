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

const broadcastToChannel = catchAsync(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  await BotService.sendChannelBroadcast(title || 'Announcement', content);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Broadcast sent to channel successfully!',
    data: null,
  });
});

export const BotController = {
  getStatus,
  broadcastToChannel,
};
