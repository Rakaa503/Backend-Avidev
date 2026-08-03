import { prisma } from "../../core/database/prisma";
import type { Prisma } from "@prisma/client";


export interface CreateOrderData {
    userId: number;
    productId: number;
    quantity: number;
    status: string;
}


export interface UpdateOrderData {
    quantity?: number;
    status?: string;
}


export class OrdersRepository {


    async findAll(params: {
        page: number;
        limit: number;
        search: string;
    }) {
        const {
            page,
            limit,
            search,
        } = params;


        const skip =
            (page - 1) * limit;


        const where: Prisma.OrderWhereInput | undefined =
            search
                ? {
                    OR: [
                        {
                            user: {
                                is: {
                                    username: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },

                        {
                            product: {
                                is: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },

                        {
                            status: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : undefined;


        const [
            data,
            total,
        ] = await Promise.all([

            prisma.order.findMany({

                where,

                skip,

                take: limit,


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

            }),


            prisma.order.count({
                where,
            }),

        ]);


        return {

            data,


            pagination: {

                page,

                limit,

                total,


                totalPages:
                    Math.ceil(
                        total / limit
                    ),

            },

        };
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

        const product =
            await prisma.product.findUnique({

                where: {
                    id: data.productId,
                },

            });


        if (!product) {
            throw new Error(
                "Product tidak ditemukan"
            );
        }


        return prisma.order.create({

            data: {

                userId: data.userId,

                productId: data.productId,

                quantity: data.quantity,


                total: Math.round(
                    product.price *
                    data.quantity
                ),


                status: data.status,

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



    async update(
        id: number,
        data: UpdateOrderData
    ) {

        const oldOrder =
            await prisma.order.findUnique({

                where: {
                    id,
                },


                include: {
                    product: true,
                },

            });


        if (!oldOrder) {
            throw new Error(
                "Order tidak ditemukan"
            );
        }


        const quantity =
            data.quantity ??
            oldOrder.quantity;


        const total =
            Math.round(
                oldOrder.product.price *
                quantity
            );


        return prisma.order.update({

            where: {
                id,
            },


            data: {

                quantity,

                total,


                status:
                    data.status,

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


export const ordersRepository =
    new OrdersRepository();