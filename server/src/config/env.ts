import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const ENV = {
  JWT_SECRET: getEnv("JWT_SECRET"),
  MONGO_URI: getEnv("MONGO_URI"),
  CLIENT_URL: getEnv("CLIENT_URL"),
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
};