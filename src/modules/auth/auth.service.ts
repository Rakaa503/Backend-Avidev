import {
    hashPassword,
    comparePassword,
} from "../../core/crypto/bcrypt";

import { JWT } from "../../core/auth";

import { AppError } from "../../core/errors/app-error";

import { AuthRepository } from "./auth.repository";

export class AuthService {
    private repository = new AuthRepository();

    async register(
        username: string,
        password: string
    ) {
        const exists =
            await this.repository.findByUsername(username);

        if (exists) {
            throw new AppError(
                "Username sudah digunakan",
                400
            );
        }

        const hashedPassword =
            await hashPassword(password);

        const user =
            await this.repository.create({
                username,
                password: hashedPassword,
                role: "user",
            });

        const accessToken =
            JWT.signAccessToken({
                id: user.id,
                username: user.username,
                role: user.role,
            });

        const refreshToken =
            JWT.signRefreshToken({
                id: user.id,
            });

        await this.repository.updateRefreshToken(
            user.id,
            refreshToken
        );

        const {
            password: _,
            refreshToken: __,
            ...safeUser
        } = user;

        return {
            user: safeUser,
            token: accessToken,
            accessToken,
            refreshToken,
        };
    }


    async login(
        username: string,
        password: string
    ) {
        const user =
            await this.repository.findByUsername(username);

        if (!user) {
            throw new AppError(
                "Username atau Password salah",
                401
            );
        }

        const valid =
            await comparePassword(
                password,
                user.password
            );

        if (!valid) {
            throw new AppError(
                "Username atau Password salah",
                401
            );
        }

        const accessToken =
            JWT.signAccessToken({
                id: user.id,
                username: user.username,
                role: user.role,
            });

        const refreshToken =
            JWT.signRefreshToken({
                id: user.id,
            });

        await this.repository.updateRefreshToken(
            user.id,
            refreshToken
        );

        const {
            password: _,
            refreshToken: __,
            ...safeUser
        } = user;

        return {
            user: safeUser,
            token: accessToken,
            accessToken,
            refreshToken,
        };
    }


    async refresh(
        refreshToken: string
    ) {
        let payload;

        try {
            payload =
                JWT.verifyRefreshToken(refreshToken);
        } catch {
            throw new AppError(
                "Refresh token tidak valid",
                401
            );
        }

        const user =
            await this.repository.findById(
                payload.id
            );

        if (!user) {
            throw new AppError(
                "User tidak ditemukan",
                404
            );
        }

        if (
            user.refreshToken !== refreshToken
        ) {
            throw new AppError(
                "Refresh token sudah tidak berlaku",
                401
            );
        }

        const accessToken =
            JWT.signAccessToken({
                id: user.id,
                username: user.username,
                role: user.role,
            });

        return {
            accessToken,
        };
    }


    async logout(id: number) {
        await this.repository.deleteRefreshToken(id);

        return {
            message: "Logout berhasil",
        };
    }


    async changePassword(
        id: number,
        oldPassword: string,
        newPassword: string
    ) {
        const user =
            await this.repository.findById(id);

        if (!user) {
            throw new AppError(
                "User tidak ditemukan",
                404
            );
        }

        const valid =
            await comparePassword(
                oldPassword,
                user.password
            );

        if (!valid) {
            throw new AppError(
                "Password lama salah",
                401
            );
        }

        const hashedPassword =
            await hashPassword(
                newPassword
            );

        await this.repository.updatePassword(
            id,
            hashedPassword
        );

        return {
            message:
                "Password berhasil diubah",
        };
    }
}