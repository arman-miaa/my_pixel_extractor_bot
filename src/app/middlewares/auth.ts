import { NextFunction, Request, Response } from 'express';
import config from '../config';
import AppError from '../errorHelpers/AppError';
import { jwtHelpers } from '../helpers/jwtHelpers';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, 'You are not authorized');
    }

    let verifiedUser = null;
    try {
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret);
    } catch (err) {
      throw new AppError(403, 'Invalid or expired token');
    }

    req.user = verifiedUser as any;

    if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
      throw new AppError(403, 'Forbidden access! You do not have permissions');
    }

    next();
  });

export default auth;
