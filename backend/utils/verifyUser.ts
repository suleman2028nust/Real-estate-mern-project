import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Extend the Express Request type to include the decoded user payload
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.access_token;

  if (!token) {
    next(errorHandler(401, 'Unauthorized'));
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      next(errorHandler(403, 'Forbidden'));
      return;
    }
    req.user = user;
    next();
  });
};
