import type { Context } from "hono";

import { AuthService } from "./auth.service";
import {
    LoginSchema,
    RegisterSchema,
} from "./auth.schema";

import { AppError } from "../../core/errors/app-error";

export class AuthController {
    private readonly service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    async register(c: Context) {
        const body = await c.req.json();

        const data = RegisterSchema.parse(body);

        const result = await this.service.register(
            data.username,
            data.password
        );

        return c.json(result, 201);
    }

    async login(c: Context) {
        const body = await c.req.json();

        const data = LoginSchema.parse(body);

        const result = await this.service.login(
            data.username,
            data.password
        );

        return c.json(result);
    }

    async refresh(c: Context) {
        throw new AppError(
            "Refresh belum diimplementasikan",
            501
        );
    }

    async logout(c: Context) {
        const user = c.get("user");

        return c.json({
            message: "Logout berhasil",
            user,
        });
    }

    async me(c: Context) {
        const user = c.get("user");

        return c.json({
            user,
        });
    }

    async changePassword(c: Context) {
        throw new AppError(
            "Change password belum diimplementasikan",
            501
        );
    }
}