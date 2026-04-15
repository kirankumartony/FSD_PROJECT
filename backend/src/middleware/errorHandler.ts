import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource does not exist',
  });
};
