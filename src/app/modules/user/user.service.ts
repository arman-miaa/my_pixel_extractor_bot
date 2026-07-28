import config from '../../config';
import AppError from '../../errorHelpers/AppError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { IUser } from './user.interface';
import { User } from './user.model';

const authOrCreateTelegramUser = async (payload: {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  referredBy?: string;
}) => {
  let user = await User.findOne({ telegramId: payload.telegramId });

  if (!user) {
    user = await User.create({
      telegramId: payload.telegramId,
      username: payload.username || '',
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      referredBy: payload.referredBy || null,
      mainBalance: 0,
      referralBalance: 0.80,
      eligibleReferrals: 3,
      notEligibleReferrals: 10,
      pendingReferrals: 0,
    });

    if (payload.referredBy && payload.referredBy !== payload.telegramId) {
      await User.findOneAndUpdate(
        { telegramId: payload.referredBy },
        {
          $inc: { eligibleReferrals: 1, referralBalance: 0.50 },
        }
      );
    }
  } else {
    if (payload.username || payload.firstName || payload.lastName) {
      user.username = payload.username || user.username;
      user.firstName = payload.firstName || user.firstName;
      user.lastName = payload.lastName || user.lastName;
      await user.save();
    }
  }

  const accessToken = jwtHelpers.createToken(
    {
      id: user._id.toString(),
      telegramId: user.telegramId,
      role: user.role,
    },
    config.jwt.secret,
    config.jwt.expires_in
  );

  return {
    accessToken,
    user,
  };
};

const getProfileByTelegramId = async (telegramId: string): Promise<IUser | null> => {
  const user = await User.findOne({ telegramId });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
};

const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find({});
};

const topupBalance = async (telegramId: string, amount: number): Promise<IUser | null> => {
  const user = await User.findOneAndUpdate(
    { telegramId },
    { $inc: { mainBalance: amount } },
    { new: true }
  );
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
};

export const UserService = {
  authOrCreateTelegramUser,
  getProfileByTelegramId,
  getAllUsers,
  topupBalance,
};
