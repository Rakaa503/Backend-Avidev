import { z } from "zod";

export const CreateOrderSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title minimal 3 karakter")
        .max(100, "Title maksimal 100 karakter"),

    status: z
        .enum(["pending", "completed"])
        .default("pending"),

    userId: z.coerce
        .number()
        .int()
        .positive(),
});

export const UpdateOrderSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .optional(),

    status: z
        .enum(["pending", "completed"])
        .optional(),

    userId: z.coerce
        .number()
        .int()
        .positive()
        .optional(),
});

export type CreateOrderInput = z.infer<
    typeof CreateOrderSchema
>;

export type UpdateOrderInput = z.infer<
    typeof UpdateOrderSchema
>;