import { prisma } from "../../core/database/prisma";

import {
    CreateProductDto,
    UpdateProductDto,
} from "./products.schema";

interface FindAllParams {
    search?: string;
    category?: string;
    status?: string;
    page: number;
    limit: number;
}

export class ProductsRepository {
    async findAll({
        search,
        category,
        status,
        page,
        limit,
    }: FindAllParams) {
        const where = {
            ...(search && {
                name: {
                    contains: search,
                    mode: "insensitive" as const,
                },
            }),

            ...(category && {
                category,
            }),

            ...(status && {
                status,
            }),
        };

        const [products, total] =
            await Promise.all([
                prisma.product.findMany({
                    where,

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip:
                        (page - 1) * limit,

                    take: limit,
                }),

                prisma.product.count({
                    where,
                }),
            ]);

        return {
            data: products,

            pagination: {
                total,

                page,

                limit,

                totalPages: Math.ceil(
                    total / limit
                ),
            },
        };
    }

    async findById(id: number) {
        return prisma.product.findUnique({
            where: {
                id,
            },
        });
    }

    async create(data: CreateProductDto) {
        return prisma.product.create({
            data,
        });
    }

    async update(
        id: number,
        data: UpdateProductDto
    ) {
        return prisma.product.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: number) {
        return prisma.product.delete({
            where: {
                id,
            },
        });
    }

    async getStats() {
        const [
            totalProducts,
            activeProducts,
            outOfStock,
            inventory,
        ] = await Promise.all([
            prisma.product.count(),

            prisma.product.count({
                where: {
                    status: "active",
                },
            }),

            prisma.product.count({
                where: {
                    stock: 0,
                },
            }),

            prisma.product.aggregate({
                _sum: {
                    stock: true,
                },
            }),
        ]);

        return {
            totalProducts,

            activeProducts,

            outOfStock,

            totalInventory:
                inventory._sum.stock ?? 0,
        };
    }
}