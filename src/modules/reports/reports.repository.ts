import { prisma } from "../../core/database/prisma";

export class ReportsRepository {
    async getSummary() {
        const [
            revenue,
            totalOrders,
            totalUsers,
            totalProducts,
        ] = await Promise.all([
            prisma.order.aggregate({
                _sum: {
                    total: true,
                },
                where: {
                    status: "completed",
                },
            }),

            prisma.order.count(),

            prisma.user.count(),

            prisma.product.count(),
        ]);

        return {
            revenue: revenue._sum.total ?? 0,
            totalOrders,
            totalUsers,
            totalProducts,
        };
    }

    async getRecentOrders() {
        return prisma.order.findMany({
            take: 5,

            orderBy: {
                createdAt: "desc",
            },

            include: {
                user: true,
                product: true,
            },
        });
    }

    async getRevenueChart() {
        const orders = await prisma.order.findMany({
            where: {
                status: "completed",
            },

            select: {
                total: true,
                createdAt: true,
            },

            orderBy: {
                createdAt: "asc",
            },
        });

        const grouped = new Map<
            string,
            {
                createdAt: string;
                total: number;
            }
        >();

        for (const order of orders) {
            const day = order.createdAt
                .toISOString()
                .split("T")[0];

            const current = grouped.get(day);

            if (current) {
                current.total += order.total;
            } else {
                grouped.set(day, {
                    createdAt: day,
                    total: order.total,
                });
            }
        }

        return [...grouped.values()];
    }

    async getOrdersTrend() {
        const orders = await prisma.order.findMany({
            where: {
                status: "completed",
            },

            select: {
                createdAt: true,
            },

            orderBy: {
                createdAt: "asc",
            },
        });

        const grouped = new Map<
            string,
            {
                createdAt: string;
                total: number;
            }
        >();

        for (const order of orders) {
            const day = order.createdAt
                .toISOString()
                .split("T")[0];

            const current = grouped.get(day);

            if (current) {
                current.total++;
            } else {
                grouped.set(day, {
                    createdAt: day,
                    total: 1,
                });
            }
        }

        return [...grouped.values()];
    }

    async getCustomerGrowth() {
        const users = await prisma.user.findMany({
            select: {
                createdAt: true,
            },

            orderBy: {
                createdAt: "asc",
            },
        });

        const grouped = new Map<
            string,
            {
                createdAt: string;
                total: number;
            }
        >();

        for (const user of users) {
            const day = user.createdAt
                .toISOString()
                .split("T")[0];

            const current = grouped.get(day);

            if (current) {
                current.total++;
            } else {
                grouped.set(day, {
                    createdAt: day,
                    total: 1,
                });
            }
        }

        return [...grouped.values()];
    }

    async getMonthlyRevenue() {
        const orders = await prisma.order.findMany({
            where: {
                status: "completed",
            },

            select: {
                total: true,
                createdAt: true,
            },

            orderBy: {
                createdAt: "asc",
            },
        });

        const grouped = new Map<
            string,
            {
                month: string;
                revenue: number;
            }
        >();

        for (const order of orders) {
            const month = order.createdAt.toLocaleString(
                "en-US",
                {
                    month: "short",
                    year: "numeric",
                }
            );

            const current = grouped.get(month);

            if (current) {
                current.revenue += order.total;
            } else {
                grouped.set(month, {
                    month,
                    revenue: order.total,
                });
            }
        }

        return [...grouped.values()];
    }

    async getTopProducts() {
        const products =
            await prisma.product.findMany({
                include: {
                    orders: true,
                },
            });

        return products
            .map((product) => ({
                id: product.id,
                name: product.name,
                sold: product.orders.length,
            }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);
    }

    async getProductMix() {
        const products =
            await prisma.product.findMany({
                include: {
                    orders: true,
                },
            });

        return products.map((product) => ({
            name: product.name,
            value: product.orders.length,
        }));
    }
}

export const reportsRepository =
    new ReportsRepository();