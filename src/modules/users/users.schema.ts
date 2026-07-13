import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username minimal 3 karakter")
        .max(50, "Username maksimal 50 karakter"),

    password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .max(100, "Password maksimal 100 karakter"),

    role: z.enum(["admin", "superadmin", "user"]).default("user"),
});

export const UpdateUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username minimal 3 karakter")
        .max(50, "Username maksimal 50 karakter")
        .optional(),

    password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .max(100, "Password maksimal 100 karakter")
        .optional(),

    role: z
        .enum(["admin", "superadmin", "user"])
        .optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;