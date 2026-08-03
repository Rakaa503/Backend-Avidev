import { ReportsRepository } from "./reports.repository";

export class ReportsService {
    private repository = new ReportsRepository();

    async getReport() {
        const [
            summary,
            revenueChart,
            ordersTrend,
            customerGrowth,
            monthlyRevenue,
            topProducts,
            productMix,
            recentOrders,
        ] = await Promise.all([
            this.repository.getSummary(),
            this.repository.getRevenueChart(),
            this.repository.getOrdersTrend(),
            this.repository.getCustomerGrowth(),
            this.repository.getMonthlyRevenue(),
            this.repository.getTopProducts(),
            this.repository.getProductMix(),
            this.repository.getRecentOrders(),
        ]);

        return {
            report: {
                // Summary
                revenue: summary.revenue,
                subscriptions: summary.totalUsers,
                totalOrders: summary.totalOrders,
                totalProducts: summary.totalProducts,

                avgOrderValue:
                    summary.totalOrders === 0
                        ? 0
                        : Math.round(
                              summary.revenue /
                                  summary.totalOrders
                          ),

                retention: 70,
                churnRate: 1.4,

                // Charts
                revenueChart,
                ordersTrend,
                customerGrowth,
                monthlyRevenue,

                // Analytics
                topProducts,
                productMix,

                // Tables
                recentOrders: recentOrders.map(
                    (order) => ({
                        id: order.id,

                        customer:
                            order.user.username,

                        product:
                            order.product.name,

                        amount:
                            order.total,

                        status:
                            order.status,

                        createdAt:
                            order.createdAt,
                    })
                ),
            },
        };
    }
}