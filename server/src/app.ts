import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";

const app:Application = express();

app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
