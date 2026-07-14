import type { Context } from "hono";

import { UsersService } from "./users.service";

import {
    CreateUserSchema,
    UpdateUserSchema,
} from "./users.schema";

export class UsersController {
    private readonly service: UsersService;

    constructor() {
        this.service = new UsersService();
    }

    async index(c: Context) {
        const page = Number(
            c.req.query("page") ?? 1
        );

        const limit = Number(
            c.req.query("limit") ?? 10
        );

        const users =
            await this.service.getAll(
                page,
                limit
            );

        return c.json(users);
    }

    async show(c: Context) {
        const id = Number(
            c.req.param("id")
        );

        const user =
            await this.service.getById(id);

        return c.json(user);
    }

    async store(c: Context) {
        const body = await c.req.json();

        const data =
            CreateUserSchema.parse(body);

        const user =
            await this.service.create(data);

        return c.json(user, 201);
    }

    async update(c: Context) {
        const id = Number(
            c.req.param("id")
        );

        const body = await c.req.json();

        const data =
            UpdateUserSchema.parse(body);

        const user =
            await this.service.update(
                id,
                data
            );

        return c.json(user);
    }

    async destroy(c: Context) {
        const id = Number(
            c.req.param("id")
        );

        const result =
            await this.service.delete(id);

        return c.json(result);
    }
}