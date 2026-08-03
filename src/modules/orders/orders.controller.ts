import type { Context } from "hono";
import type { AuthUser } from "../../middleware/auth.middleware";

import { OrdersService } from "./orders.service";

import {
    CreateOrderSchema,
    UpdateOrderSchema,
} from "./orders.schema";


type Variables = {
    user: AuthUser;
};

type AppContext = Context<{
    Variables: Variables;
}>;


export class OrdersController {
    private readonly service: OrdersService;


    constructor() {
        this.service = new OrdersService();
    }


    /**
     * GET ALL ORDERS
     * Admin & Superadmin
     */
    async index(c: AppContext) {
        const page = Number(
            c.req.query("page") ?? 1
        );

        const limit = Number(
            c.req.query("limit") ?? 10
        );

        const search =
            c.req.query("search") ?? "";


        const result =
            await this.service.getAll({
                page,
                limit,
                search,
            });


        return c.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    }


    /**
     * GET ORDER BY ID
     * Admin & Superadmin
     */
    async show(c: AppContext) {
        const id = Number(
            c.req.param("id")
        );


        const order =
            await this.service.getById(id);


        return c.json({
            success: true,
            data: order,
        });
    }


    /**
     * CREATE ORDER
     * User, Admin, Superadmin
     */
    async store(c: AppContext) {
        const user = c.get("user");

        const body =
            await c.req.json();


        const data =
            CreateOrderSchema.parse(body);


        const order =
            await this.service.create(
                user.id,
                data
            );


        return c.json(
            {
                success: true,
                data: order,
            },
            201
        );
    }


    /**
     * GET CURRENT USER ORDERS
     */
    async myOrders(c: AppContext) {
        const user = c.get("user");


        const orders =
            await this.service.getMyOrders(
                user.id
            );


        return c.json({
            success: true,
            data: orders,
        });
    }


    /**
     * UPDATE ORDER
     * Admin & Superadmin
     */
    async update(c: AppContext) {
        const id = Number(
            c.req.param("id")
        );


        const body =
            await c.req.json();


        const data =
            UpdateOrderSchema.parse(body);


        const order =
            await this.service.update(
                id,
                data
            );


        return c.json({
            success: true,
            data: order,
        });
    }


    /**
     * DELETE ORDER
     * Superadmin
     */
    async destroy(c: AppContext) {
        const id = Number(
            c.req.param("id")
        );


        const result =
            await this.service.delete(id);


        return c.json({
            success: true,
            data: result,
        });
    }
}