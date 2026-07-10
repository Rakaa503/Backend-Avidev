import { hashPassword, comparePassword } from "../../core/crypto/bcrypt";
import { signToken } from "../../core/auth/jwt";
import { AppError } from "../../core/errors/app-error";

import { AuthRepository } from "./auth.repository";

export class AuthService {
    private repository = new AuthRepository();

    async register(username: string, password: string) {
        const exists = await this.repository.findByUsername(username);

        if (exists) {
            throw new AppError("Username sudah digunakan", 400);
        }

        const hashedPassword = await hashPassword(password);

        const user = await this.repository.create({
            username,
            password: hashedPassword,
            role: "superadmin",
        });

        const token = signToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });

        // Hilangkan password sebelum dikirim ke client
        const { password: _, ...safeUser } = user;

        return {
            user: safeUser,
            token,
        };
    }

    async login(username: string, password: string) {
        const user = await this.repository.findByUsername(username);

        if (!user) {
            throw new AppError("Username atau Password salah", 401);
        }

        const valid = await comparePassword(password, user.password);

        if (!valid) {
            throw new AppError("Username atau Password salah", 401);
        }

        const token = signToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });

        // Hilangkan password sebelum dikirim ke client
        const { password: _, ...safeUser } = user;

        return {
            user: safeUser,
            token,
        };
    }
}