import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = async (): Promise<void> => {
  await mongoose.connect(ENV.MONGO_URI);
  console.log("Connected to MongoDB");
};

export default connectDB;
