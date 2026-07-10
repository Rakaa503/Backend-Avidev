import { prisma } from "../../core/database/prisma";

export interface CreateUserData {
  username: string;
  password: string;
  role?: string;
}

export class AuthRepository {
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
      data: {
        username: data.username,
        password: data.password,
        role: data.role ?? "admin",
      },
    });
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | null
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }

  async updatePassword(
    id: number,
    password: string
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  async deleteRefreshToken(id: number) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}

export const authRepository = new AuthRepository();