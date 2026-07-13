import { prisma } from "../../core/database/prisma";

export interface CreateUserData {
    username: string;
    password: string;
    role: string;
}

export interface UpdateUserData {
    username?: string;
    password?: string;
    role?: string;
}

export class UsersRepository {
    async findAll() {
        return prisma.user.findMany({
            orderBy: {
                id: "desc",
            },
        });
    }

    async findById(id: number) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByUsername(username: string) {
        return prisma.user.findUnique({
            where: {
                username,
            },
        });
    }

    async create(data: CreateUserData) {
        return prisma.user.create({
            data,
        });
    }

    async update(
        id: number,
        data: UpdateUserData
    ) {
        return prisma.user.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: number) {
        return prisma.user.delete({
            where: {
                id,
            },
        });
    }
}

export const usersRepository = new UsersRepository();