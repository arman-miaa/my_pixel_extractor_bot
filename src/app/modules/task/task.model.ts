import { Schema, model } from 'mongoose';
import { ITask, TaskModel } from './task.interface';

const taskSchema = new Schema<ITask, TaskModel>(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
    },
    telegramId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    inputUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    resultData: {
      type: String,
      default: '',
    },
    costPoints: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask, TaskModel>('Task', taskSchema);
