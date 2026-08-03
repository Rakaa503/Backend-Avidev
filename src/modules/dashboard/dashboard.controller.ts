import type { Context } from "hono";

import { DashboardService } from "./dashboard.service";


export class DashboardController {

    private readonly service =
        new DashboardService();





    async overview(c: Context) {

        const authUser =
            c.get("user");


        const result =
            await this.service.overview(
                authUser.id
            );


        return c.json({

            success:true,

            data:result,

        });

    }







    // ==========================
    // ANALYTICS
    // ==========================


    async analytics(c: Context) {


        const result =
            await this.service.getAnalytics();



        return c.json({

            success:true,

            data:result,

        });


    }



}