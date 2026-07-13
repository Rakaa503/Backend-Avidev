import { prisma } from "../../core/database/prisma";

export interface CreateOrderData {
    title: string;
    status: string;
    userId: number;
}

export interface UpdateOrderData {
    title?: string;
    status?: string;
    userId?: number;
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
}

export const ordersRepository = new OrdersRepository();