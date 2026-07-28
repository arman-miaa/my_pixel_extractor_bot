import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskService } from './task.service';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const telegramId = req.user?.telegramId;
  const result = await TaskService.createTask(telegramId!, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Task created successfully!',
    data: result,
  });
});

const getMyTasks = catchAsync(async (req: Request, res: Response) => {
  const telegramId = req.user?.telegramId;
  const result = await TaskService.getMyTasks(telegramId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tasks retrieved successfully!',
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const result = await TaskService.getTaskById(taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task retrieved successfully!',
    data: result,
  });
});

export const TaskController = {
  createTask,
  getMyTasks,
  getTaskById,
};
