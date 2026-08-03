import { prisma } from "../../core/database/prisma";


export class DashboardRepository {


    async getTotalUsers() {
        return prisma.user.count();
    }


    async getTotalProducts() {
        return prisma.product.count();
    }


    async getTotalOrders() {
        return prisma.order.count();
    }


    async getTotalRevenue() {

        const result =
            await prisma.order.aggregate({

                _sum:{
                    total:true,
                },

            });


        return result._sum.total ?? 0;

    }



    async getMonthlyRevenue(){

        const orders =
            await prisma.order.findMany({

                select:{
                    total:true,
                    createdAt:true,
                },

            });


        const revenue:
            Record<string,number> = {};



        orders.forEach((order)=>{

            const month =
                order.createdAt.toLocaleString(
                    "en-US",
                    {
                        month:"short",
                    }
                );


            revenue[month] =
                (revenue[month] || 0)
                +
                order.total;

        });



        return Object.entries(revenue)
            .map(([month,revenue])=>({
                month,
                revenue,
            }));

    }





    async getMonthlyOrders(){

        const orders =
            await prisma.order.findMany({

                select:{
                    createdAt:true,
                },

            });


        const result:
            Record<string,number> = {};



        orders.forEach((order)=>{

            const month =
                order.createdAt.toLocaleString(
                    "en-US",
                    {
                        month:"short",
                    }
                );


            result[month] =
                (result[month] || 0)
                + 1;

        });



        return Object.entries(result)
            .map(([month,orders])=>({
                month,
                orders,
            }));

    }





    async getTopProducts(){

        const orders =
            await prisma.order.findMany({

                select:{
                    quantity:true,

                    product:{
                        select:{
                            name:true,
                        },
                    },
                },

            });



        const products:
            Record<string,number> = {};



        orders.forEach((order)=>{

            const name =
                order.product.name;


            products[name] =
                (products[name] || 0)
                +
                order.quantity;

        });



        return Object.entries(products)
            .map(([name,total])=>({
                name,
                total,
            }))
            .sort(
                (a,b)=>b.total-a.total
            )
            .slice(0,5);

    }




    async getRecentActivities(){

        return prisma.auditLog.findMany({

            orderBy:{
                createdAt:"desc",
            },


            take:10,

        });

    }


    async getUserById(id:number){

        return prisma.user.findUnique({

            where:{
                id,
            },


            select:{
                id:true,
                username:true,
                role:true,
                createdAt:true,
                updatedAt:true,
            },

        });

    }

}