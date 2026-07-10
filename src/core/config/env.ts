import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),

    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32, "JWT_SECRET minimal 32 karakter"),

    JWT_REFRESH_SECRET: z
        .string()
        .min(32, "JWT_REFRESH_SECRET minimal 32 karakter"),
});

export const env = envSchema.parse(process.env);