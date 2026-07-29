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

const updateTaskStatus = async (
  taskId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<ITask | null> => {
  const task = await Task.findOneAndUpdate(
    { taskId },
    { status },
    { new: true }
  );

  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  if (status === 'completed') {
    const user = await User.findOneAndUpdate(
      { telegramId: task.telegramId },
      {
        $inc: {
          totalSuccess: 1,
          successToday: 1,
          inProgressCount: -1,
        },
      },
      { new: true }
    );

    await User.updateOne(
      { telegramId: task.telegramId, 'recentTasks.taskId': taskId },
      { $set: { 'recentTasks.$.status': 'completed' } }
    );

    const { BotService } = await import('../bot/bot.service');
    await BotService.sendTaskCompletionNotification({
      taskId: task.taskId,
      username: user?.username || '',
      serviceName: task.title,
      costPoints: task.costPoints,
    });
  }

  return task;
};

export const TaskService = {
  createTask,
  getMyTasks,
  getTaskById,
  updateTaskStatus,
};
