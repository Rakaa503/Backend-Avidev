import { prisma } from "../../core/database/prisma";

export class DashboardService {
    async getStats() {
        const [
            totalUsers,
            totalOrders,
            pendingOrders,
            completedOrders,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.order.count({
                where: {
                    status: "pending",
                },
            }),
            prisma.order.count({
                where: {
                    status: "completed",
                },
            }),
        ]);

        return {
            totalUsers,
            totalOrders,
            pendingOrders,
            completedOrders,
        };
    }
}