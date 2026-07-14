import { hashPassword } from "../../core/crypto/bcrypt";

import { AppError } from "../../core/errors/app-error";

import { UsersRepository } from "./users.repository";

import type {
    CreateUserInput,
    UpdateUserInput,
} from "./users.schema";

export class UsersService {
    private readonly repository: UsersRepository;

    constructor() {
        this.repository = new UsersRepository();
    }

    async getAll(
        page: number,
        limit: number
    ) {
        const { users, total } =
            await this.repository.findAll(
                page,
                limit
            );

        const data = users.map(
            ({ password, refreshToken, ...user }) => user
        );

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(
                    total / limit
                ),
                hasNext:
                    page <
                    Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }

    async getById(id: number) {
        const user =
            await this.repository.findById(id);

        if (!user) {
            throw new AppError(
                "User tidak ditemukan",
                404
            );
        }

        const {
            password,
            refreshToken,
            ...safeUser
        } = user;

        return safeUser;
    }

    async create(data: CreateUserInput) {
        const exists =
            await this.repository.findByUsername(
                data.username
            );

        if (exists) {
            throw new AppError(
                "Username sudah digunakan",
                400
            );
        }

        const hashedPassword =
            await hashPassword(data.password);

        const user =
            await this.repository.create({
                username: data.username,
                password: hashedPassword,
                role: data.role,
            });

        const {
            password,
            refreshToken,
            ...safeUser
        } = user;

        return safeUser;
    }

    async update(
        id: number,
        data: UpdateUserInput
    ) {
        const user =
            await this.repository.findById(id);

        if (!user) {
            throw new AppError(
                "User tidak ditemukan",
                404
            );
        }

        if (
            data.username &&
            data.username !== user.username
        ) {
            const exists =
                await this.repository.findByUsername(
                    data.username
                );

            if (exists) {
                throw new AppError(
                    "Username sudah digunakan",
                    400
                );
            }
        }

        let password = data.password;

        if (password) {
            password =
                await hashPassword(password);
        }

        const updated =
            await this.repository.update(id, {
                username: data.username,
                password,
                role: data.role,
            });

        const {
            password: _,
            refreshToken,
            ...safeUser
        } = updated;

        return safeUser;
    }

    async delete(id: number) {
        const user =
            await this.repository.findById(id);

        if (!user) {
            throw new AppError(
                "User tidak ditemukan",
                404
            );
        }

        await this.repository.delete(id);

        return {
            message: "User berhasil dihapus",
        };
    }
}