import { Model, Types } from 'mongoose';

export type ITaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ITask = {
  _id?: Types.ObjectId;
  taskId: string;
  telegramId: string;
  title: string;
  inputUrl?: string;
  status: ITaskStatus;
  resultData?: string;
  costPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
};
// 
export type TaskModel = Model<ITask, Record<string, unknown>>;
