import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    telegramId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    languageCode: {
      type: String,
      default: 'en',
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'user'],
      default: 'user',
    },
    mainBalance: {
      type: Number,
      default: 0,
    },
    referralBalance: {
      type: Number,
      default: 0,
    },
    totalSuccess: {
      type: Number,
      default: 0,
    },
    successToday: {
      type: Number,
      default: 0,
    },
    inProgressCount: {
      type: Number,
      default: 0,
    },
    costPerExtract: {
      type: Number,
      default: 1,
    },
    eligibleReferrals: {
      type: Number,
      default: 0,
    },
    notEligibleReferrals: {
      type: Number,
      default: 0,
    },
    pendingReferrals: {
      type: Number,
      default: 0,
    },
    referredBy: {
      type: String,
      default: null,
    },
    recentTasks: [
      {
        taskId: String,
        title: String,
        status: {
          type: String,
          enum: ['pending', 'processing', 'completed', 'failed'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const User = model<IUser, UserModel>('User', userSchema);
