import { DashboardRepository } from "./dashboard.repository";


export class DashboardService {

    private repository =
        new DashboardRepository();



    private getGreeting() {

        const hour =
            new Date().getHours();


        if (hour >= 4 && hour < 11)
            return "Selamat Pagi";


        if (hour >= 11 && hour < 15)
            return "Selamat Siang";


        if (hour >= 15 && hour < 18)
            return "Selamat Sore";


        return "Selamat Malam";

    }





    async overview(userId:number) {


        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentActivities,
            user,

        ] = await Promise.all([

            this.repository.getTotalUsers(),

            this.repository.getTotalProducts(),

            this.repository.getTotalOrders(),

            this.repository.getTotalRevenue(),

            this.repository.getRecentActivities(),

            this.repository.getUserById(userId),

        ]);




        return {

            greeting:
                this.getGreeting(),


            user,



            stats: {

                totalUsers,

                totalProducts,

                totalOrders,

                totalRevenue,

            },



            system: {

                status:"Healthy",

                api:"Online",

                database:"Connected",

                uptime:
                    process.uptime(),

                environment:
                    process.env.NODE_ENV,

            },



            recentActivities,

        };

    }







    // ==========================
    // ANALYTICS DASHBOARD
    // ==========================


    async getAnalytics() {


        const [

            monthlyRevenue,

            monthlyOrders,

            topProducts,


        ] = await Promise.all([


            this.repository.getMonthlyRevenue(),


            this.repository.getMonthlyOrders(),


            this.repository.getTopProducts(),


        ]);





        return {


            monthlyRevenue,


            monthlyOrders,


            topProducts,


        };


    }



}