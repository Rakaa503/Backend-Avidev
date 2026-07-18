import type { Context } from "hono";

import { ProductsService } from "./products.service";

import {
    CreateProductSchema,
    UpdateProductSchema,
} from "./products.schema";


export class ProductsController {

    private readonly service: ProductsService;


    constructor() {
        this.service = new ProductsService();
    }


    async index(c: Context) {

        const products =
            await this.service.getAll();


        return c.json(products);
    }


    async show(c: Context) {

        const id =
            Number(
                c.req.param("id")
            );


        const product =
            await this.service.getById(id);


        return c.json(product);
    }


    async store(c: Context) {

        const body =
            await c.req.json();


        const data =
            CreateProductSchema.parse(body);


        const product =
            await this.service.create(data);


        return c.json(
            product,
            201
        );
    }


    async update(c: Context) {

        const id =
            Number(
                c.req.param("id")
            );


        const body =
            await c.req.json();


        const data =
            UpdateProductSchema.parse(body);


        const product =
            await this.service.update(
                id,
                data
            );


        return c.json(product);
    }


    async destroy(c: Context) {

        const id =
            Number(
                c.req.param("id")
            );


        const result =
            await this.service.delete(id);


        return c.json(result);
    }
}