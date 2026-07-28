import { Model, Types } from 'mongoose';

export type IUserTask = {
  taskId: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
};

export type IUser = {
  _id?: Types.ObjectId;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  role: 'super_admin' | 'admin' | 'user';
  mainBalance: number;
  referralBalance: number;
  totalSuccess: number;
  successToday: number;
  inProgressCount: number;
  costPerExtract: number;
  eligibleReferrals: number;
  notEligibleReferrals: number;
  pendingReferrals: number;
  referredBy?: string;
  recentTasks: IUserTask[];
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
