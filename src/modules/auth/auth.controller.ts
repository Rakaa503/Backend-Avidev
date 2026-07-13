import type { Context } from "hono";

import { AuthService } from "./auth.service";

import {
    LoginSchema,
    RegisterSchema,
    RefreshSchema,
    ChangePasswordSchema,
} from "./auth.schema";


export class AuthController {
    private readonly service: AuthService;


    constructor() {
        this.service =
            new AuthService();
    }


    async register(c: Context) {
        const body =
            await c.req.json();

        const data =
            RegisterSchema.parse(body);


        const result =
            await this.service.register(
                data.username,
                data.password
            );


        return c.json(
            result,
            201
        );
    }


    async login(c: Context) {
        const body =
            await c.req.json();


        const data =
            LoginSchema.parse(body);


        const result =
            await this.service.login(
                data.username,
                data.password
            );


        return c.json(result);
    }


    async refresh(c: Context) {
        const body =
            await c.req.json();


        const data =
            RefreshSchema.parse(body);


        const result =
            await this.service.refresh(
                data.refreshToken
            );


        return c.json(result);
    }


    async logout(c: Context) {
        const user =
            c.get("user");


        const result =
            await this.service.logout(
                user.id
            );


        return c.json(result);
    }


    async me(c: Context) {
        const user =
            c.get("user");


        return c.json({
            user,
        });
    }


    async changePassword(c: Context) {
        const user =
            c.get("user");


        const body =
            await c.req.json();


        const data =
            ChangePasswordSchema.parse(body);


        const result =
            await this.service.changePassword(
                user.id,
                data.oldPassword,
                data.newPassword
            );


        return c.json(result);
    }
}