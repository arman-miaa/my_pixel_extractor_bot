import { Response } from 'express';
import { IResponse } from '../interfaces';

const sendResponse = <T>(res: Response, data: IResponse<T>): void => {
  const responseData: IResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || undefined,
    data: data.data || null,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
