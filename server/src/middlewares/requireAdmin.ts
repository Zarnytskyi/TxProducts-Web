import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate.js";

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};

export default requireAdmin;