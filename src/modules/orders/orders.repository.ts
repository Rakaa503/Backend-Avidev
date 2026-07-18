import { prisma } from "../../core/database/prisma";

export interface CreateOrderData {
    userId: number;
    productId: number;
    quantity: number;
    status: string;
}

export interface UpdateOrderData {
    userId?: number;
    productId?: number;
    quantity?: number;
    status?: string;
}

export class OrdersRepository {
    async findAll() {
        return prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                product: true,
            },
            orderBy: {
                id: "desc",
            },
        });
    }


    async findById(id: number) {
        return prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                product: true,
            },
        });
    }


    async findByUserId(userId: number) {
        return prisma.order.findMany({
            where: {
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                product: true,
            },
            orderBy: {
                id: "desc",
            },
        });
    }


    async create(data: CreateOrderData) {
        return prisma.order.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                product: true,
            },
        });
    }


    async update(
        id: number,
        data: UpdateOrderData
    ) {
        return prisma.order.update({
            where: {
                id,
            },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                product: true,
            },
        });
    }


    async delete(id: number) {
        return prisma.order.delete({
            where: {
                id,
            },
        });
    }


    async userExists(userId: number) {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        });
    }


    async productExists(productId: number) {
        return prisma.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                stock: true,
            },
        });
    }


    async decreaseStock(
        productId: number,
        quantity: number
    ) {
        return prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                stock: {
                    decrement: quantity,
                },
            },
        });
    }
}


export const ordersRepository = new OrdersRepository();