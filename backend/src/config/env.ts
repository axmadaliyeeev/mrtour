import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string({ required_error: "MONGODB_URI is required" }),
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required" })
    .min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string({ required_error: "JWT_REFRESH_SECRET is required" })
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  ANTHROPIC_API_KEY: z.string({ required_error: "ANTHROPIC_API_KEY is required" }),
  FRONTEND_URL: z
    .string({ required_error: "FRONTEND_URL is required" })
    .url("FRONTEND_URL must be a valid URL"),
  CLOUDINARY_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.issues.map(
    (issue) => `  • ${issue.path.join(".")}: ${issue.message}`
  );
  console.error("\n❌  Invalid environment variables:\n" + formatted.join("\n") + "\n");
  process.exit(1);
}

export const env: Env = result.data;
