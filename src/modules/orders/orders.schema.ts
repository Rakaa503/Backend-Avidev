import { z } from "zod";

export const CreateOrderSchema = z.object({
    productId: z.coerce
        .number()
        .int()
        .positive(),

    quantity: z.coerce
        .number()
        .int()
        .min(1, "Quantity minimal 1"),

    status: z
        .enum([
            "pending",
            "processing",
            "completed",
            "cancelled",
        ])
        .default("pending"),
});

export const UpdateOrderSchema = z.object({
    productId: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    quantity: z.coerce
        .number()
        .int()
        .min(1)
        .optional(),

    status: z
        .enum([
            "pending",
    "waiting_payment",
    "paid",
    "processing",
    "completed",
    "cancelled",
        ])
        .optional(),
});

export type CreateOrderInput = z.infer<
    typeof CreateOrderSchema
>;

export type UpdateOrderInput = z.infer<
    typeof UpdateOrderSchema
>;