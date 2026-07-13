import type { Context } from "hono";

import { OrdersService } from "./orders.service";

import {
    CreateOrderSchema,
    UpdateOrderSchema,
} from "./orders.schema";

export class OrdersController {
    private readonly service: OrdersService;

    constructor() {
        this.service = new OrdersService();
    }

    async index(c: Context) {
        const orders = await this.service.getAll();

        return c.json(orders);
    }

    async show(c: Context) {
        const id = Number(c.req.param("id"));

        const order = await this.service.getById(id);

        return c.json(order);
    }

    async store(c: Context) {
        const body = await c.req.json();

        const data = CreateOrderSchema.parse(body);

        const order = await this.service.create(data);

        return c.json(order, 201);
    }

    async update(c: Context) {
        const id = Number(c.req.param("id"));

        const body = await c.req.json();

        const data = UpdateOrderSchema.parse(body);

        const order = await this.service.update(
            id,
            data
        );

        return c.json(order);
    }

    async destroy(c: Context) {
        const id = Number(c.req.param("id"));

        const result = await this.service.delete(id);

        return c.json(result);
    }
}