import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      id: string;
      role: string;
    };

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;