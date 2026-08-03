import { z } from "zod";

export const CreateProductSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),

    category: z.string().min(2, "Kategori wajib diisi"),

    description: z.string().min(5, "Deskripsi minimal 5 karakter"),

    price: z.number().positive(),

    stock: z.number().min(0),

    image: z.string().optional(),
});

export const UpdateProductSchema =
    CreateProductSchema.partial();

export type CreateProductDto =
    z.infer<typeof CreateProductSchema>;

export type UpdateProductDto =
    z.infer<typeof UpdateProductSchema>;