import { Request, Response } from 'express';

const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
};

export default notFound;
