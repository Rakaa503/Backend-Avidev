import { z } from "zod";


export const CreateProductSchema =
    z.object({
        name: z
            .string()
            .min(3),

        price: z
            .number()
            .positive(),

        stock: z
            .number()
            .min(0),
    });


export const UpdateProductSchema =
    CreateProductSchema.partial();