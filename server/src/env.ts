import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  // Public deployments leave this unset -> the API is read-only. Set to "true"
  // locally (or once auth lands) to allow POST/PATCH/DELETE.
  enableWrites: process.env.ENABLE_WRITES === "true",
};
