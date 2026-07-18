import { z } from "zod";

const usernameSchema = z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(
        /^[a-zA-Z0-9_.-]+$/,
        "Username hanya boleh berisi huruf, angka, underscore (_), titik (.) dan strip (-)"
    );

export const RegisterSchema = z.object({
    username: usernameSchema,
    password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .max(100, "Password maksimal 100 karakter"),
});

export const LoginSchema = z.object({
    username: usernameSchema,
    password: z
        .string()
        .min(6, "Password minimal 6 karakter"),
});

export const RefreshSchema = z.object({
    refreshToken: z
        .string()
        .min(1, "Refresh token wajib diisi"),
});

export const ChangePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(6, "Password lama minimal 6 karakter"),
    newPassword: z
        .string()
        .min(6, "Password baru minimal 6 karakter")
        .max(100, "Password baru maksimal 100 karakter"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;