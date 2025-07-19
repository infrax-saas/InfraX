import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import cookie from "cookie";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { sub: string; email: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.infrax_token;

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
      sub: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

