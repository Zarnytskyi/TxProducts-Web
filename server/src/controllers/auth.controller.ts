import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../config/env.js";
import { AuthRequest } from "../middlewares/authenticate.js";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const createToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, ENV.JWT_SECRET, { expiresIn: "7d" });

const toUserResponse = (user: InstanceType<typeof User>): UserResponse => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email and password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = createToken(String(user._id), user.role);

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user: toUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = createToken(String(user._id), user.role);

    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user: toUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user: toUserResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};