import { AppError } from "../../core/errors/app-error";

import {
    CreateProductDto,
    UpdateProductDto,
} from "./products.schema";

import { ProductsRepository } from "./products.repository";

interface GetAllProductsParams {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export class ProductsService {
    private readonly repository =
        new ProductsRepository();

    async getAll({
        search,
        category,
        status,
        page = 1,
        limit = 10,
    }: GetAllProductsParams) {
        return this.repository.findAll({
            search,
            category,
            status,
            page,
            limit,
        });
    }

    async getStats() {
        return this.repository.getStats();
    }

    async getById(id: number) {
        const product =
            await this.repository.findById(id);

        if (!product) {
            throw new AppError(
                "Product tidak ditemukan",
                404
            );
        }

        return product;
    }

    async create(
        data: CreateProductDto
    ) {
        return this.repository.create(data);
    }

    async update(
        id: number,
        data: UpdateProductDto
    ) {
        await this.getById(id);

        return this.repository.update(
            id,
            data
        );
    }

    async delete(id: number) {
        await this.getById(id);

        await this.repository.delete(id);

        return {
            success: true,
            message:
                "Product berhasil dihapus",
        };
    }
}