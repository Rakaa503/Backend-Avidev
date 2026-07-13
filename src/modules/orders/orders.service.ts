import { AppError } from "../../core/errors/app-error";

import { OrdersRepository } from "./orders.repository";

import type {
    CreateOrderInput,
    UpdateOrderInput,
} from "./orders.schema";

export class OrdersService {
    private readonly repository: OrdersRepository;

    constructor() {
        this.repository = new OrdersRepository();
    }

    async getAll() {
        return this.repository.findAll();
    }

    async getById(id: number) {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError("Order tidak ditemukan", 404);
        }

        return order;
    }

    async create(data: CreateOrderInput) {
        const user = await this.repository.userExists(
            data.userId
        );

        if (!user) {
            throw new AppError(
                "User tidak ditemukan",
                404
            );
        }

        return this.repository.create({
            title: data.title,
            status: data.status,
            userId: data.userId,
        });
    }

    async update(
        id: number,
        data: UpdateOrderInput
    ) {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(
                "Order tidak ditemukan",
                404
            );
        }

        if (data.userId !== undefined) {
            const user =
                await this.repository.userExists(
                    data.userId
                );

            if (!user) {
                throw new AppError(
                    "User tidak ditemukan",
                    404
                );
            }
        }

        return this.repository.update(id, {
            title: data.title,
            status: data.status,
            userId: data.userId,
        });
    }

    async delete(id: number) {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(
                "Order tidak ditemukan",
                404
            );
        }

        await this.repository.delete(id);

        return {
            message: "Order berhasil dihapus",
        };
    }
}