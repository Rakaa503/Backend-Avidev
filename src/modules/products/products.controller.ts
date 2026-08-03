import type { Context } from "hono";

import { ProductsService } from "./products.service";

import {
    CreateProductSchema,
    UpdateProductSchema,
} from "./products.schema";

export class ProductsController {

    private readonly service =
        new ProductsService();

    /**
     * ==================================================
     * GET ALL PRODUCTS
     * ==================================================
     */
    async index(c: Context) {

        const search =
            c.req.query("search");

        const category =
            c.req.query("category");

        const status =
            c.req.query("status");

        const page = Number(
            c.req.query("page") ?? "1"
        );

        const limit = Number(
            c.req.query("limit") ?? "10"
        );

        const products =
            await this.service.getAll({
                search,
                category,
                status,
                page,
                limit,
            });

        return c.json(products);

    }

    /**
     * ==================================================
     * PRODUCT STATS
     * ==================================================
     */
    async stats(c: Context) {

        const stats =
            await this.service.getStats();

        return c.json(stats);

    }

    /**
     * ==================================================
     * GET PRODUCT BY ID
     * ==================================================
     */
    async show(c: Context) {

        const id = Number(
            c.req.param("id")
        );

        const product =
            await this.service.getById(id);

        return c.json(product);

    }

    /**
     * ==================================================
     * CREATE PRODUCT
     * ==================================================
     */
    async store(c: Context) {

        console.log("🔥 STORE HIT");

        const body =
            await c.req.json();

        console.log(
            "📦 BODY:",
            body
        );

        const data =
            CreateProductSchema.parse(
                body
            );

        console.log(
            "✅ VALID:",
            data
        );

        const product =
            await this.service.create(
                data
            );

        console.log(
            "🎉 CREATED:",
            product
        );

        return c.json(
            product,
            201
        );

    }

    /**
     * ==================================================
     * UPDATE PRODUCT
     * ==================================================
     */
    async update(c: Context) {

        const id = Number(
            c.req.param("id")
        );

        const body =
            await c.req.json();

        const data =
            UpdateProductSchema.parse(
                body
            );

        const product =
            await this.service.update(
                id,
                data
            );

        return c.json(product);

    }

    /**
     * ==================================================
     * DELETE PRODUCT
     * ==================================================
     */
    async destroy(c: Context) {

        const id = Number(
            c.req.param("id")
        );

        const result =
            await this.service.delete(id);

        return c.json(result);

    }

}