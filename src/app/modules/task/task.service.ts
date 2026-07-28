import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { ITask } from './task.interface';
import { Task } from './task.model';

const createTask = async (
  telegramId: string,
  payload: { title: string; inputUrl?: string }
): Promise<ITask> => {
  const user = await User.findOne({ telegramId });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.mainBalance < user.costPerExtract) {
    throw new AppError(400, 'Insufficient balance to start task! Please topup balance.');
  }

  const taskId = `TASK-${Date.now()}`;
  const newTask = await Task.create({
    taskId,
    telegramId,
    title: payload.title,
    inputUrl: payload.inputUrl || '',
    status: 'processing',
    costPoints: user.costPerExtract,
  });

  await User.findOneAndUpdate(
    { telegramId },
    {
      $inc: { mainBalance: -user.costPerExtract, inProgressCount: 1 },
      $push: {
        recentTasks: {
          $each: [
            {
              taskId,
              title: payload.title,
              status: 'processing',
              createdAt: new Date(),
            },
          ],
          $slice: -5,
        },
      },
    }
  );

  return newTask;
};

const getMyTasks = async (telegramId: string): Promise<ITask[]> => {
  return await Task.find({ telegramId }).sort({ createdAt: -1 });
};

const getTaskById = async (taskId: string): Promise<ITask | null> => {
  return await Task.findOne({ taskId });
};

export const TaskService = {
  createTask,
  getMyTasks,
  getTaskById,
};
