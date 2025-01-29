import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const payload = verifyJWT(token);

  if (!payload) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}; 