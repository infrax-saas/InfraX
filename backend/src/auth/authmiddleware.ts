import { type Request, type Response, type NextFunction } from 'express';
import { verifyInfraXJwt } from './authutils';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyInfraXJwt(token);
    req.user = { userId: payload.userId, email: payload.email };
    next(); 
  } catch (error: any) {
    console.error('InfraX JWT verification failed:', error);
    return res.status(401).json({ message: `Unauthorized: ${error.message}` });
  }
};
