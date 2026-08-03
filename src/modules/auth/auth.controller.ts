import type { Context } from "hono";
import {
    deleteCookie,
    getCookie,
    setCookie,
} from "hono/cookie";

import { AuthService } from "./auth.service";

import {
    ChangePasswordSchema,
    LoginSchema,
    RegisterSchema,
} from "./auth.schema";

export class AuthController {
    private readonly service = new AuthService();

    /**
     * Register
     */
    async register(c: Context) {
        const body = await c.req.json();

        console.log("====================================");
        console.log("🚀 REGISTER REQUEST");
        console.log("====================================");
        console.log("[REGISTER] BODY:", body);

        const data = RegisterSchema.parse(body);

        const result = await this.service.register(
            data.username,
            data.password
        );

        setCookie(c, "refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        console.log("✅ REGISTER SUCCESS");
        console.log(
            "SET COOKIE:",
            c.res.headers.get("set-cookie")
        );

        return c.json(
            {
                user: result.user,
                accessToken: result.accessToken,
            },
            201
        );
    }

    /**
     * Login
     */
    async login(c: Context) {
        try {
            console.log("====================================");
            console.log("🚀 LOGIN REQUEST");
            console.log("====================================");

            const body = await c.req.json();

            console.log("[LOGIN] BODY:", body);

            const data = LoginSchema.parse(body);

            const result = await this.service.login(
                data.username,
                data.password
            );

            setCookie(c, "refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            console.log("✅ LOGIN SUCCESS");
            console.log(
                "SET COOKIE:",
                c.res.headers.get("set-cookie")
            );

            return c.json({
                user: result.user,
                accessToken: result.accessToken,
            });
        } catch (error) {
            console.log("❌ LOGIN FAILED");
            console.error(error);

            throw error;
        }
    }

    /**
     * Refresh Token
     */
    async refresh(c: Context) {
        console.log("====================================");
        console.log("🔄 REFRESH TOKEN REQUEST");
        console.log("====================================");

        console.log(
            "Cookie Header:",
            c.req.header("cookie")
        );

        const refreshToken = getCookie(
            c,
            "refreshToken"
        );

        console.log(
            "Refresh Token:",
            refreshToken
        );

        if (!refreshToken) {
            console.log("❌ COOKIE NOT FOUND");

            return c.json(
                {
                    success: false,
                    message: "Refresh token missing",
                },
                401
            );
        }

        console.log("✅ COOKIE FOUND");

        const result =
            await this.service.refresh(
                refreshToken
            );

        setCookie(c, "refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        console.log("✅ REFRESH SUCCESS");
        console.log(
            "NEW ACCESS TOKEN:",
            result.accessToken
        );
        console.log(
            "NEW REFRESH TOKEN:",
            result.refreshToken
        );

        console.log(
            "SET COOKIE:",
            c.res.headers.get("set-cookie")
        );

        return c.json({
            accessToken: result.accessToken,
        });
    }

    /**
     * Logout
     */
    async logout(c: Context) {
        const user = c.get("user");

        console.log("====================================");
        console.log("🚪 LOGOUT REQUEST");
        console.log("====================================");
        console.log("[LOGOUT] USER:", user);

        await this.service.logout(user.id);

        deleteCookie(c, "refreshToken", {
            path: "/",
        });

        console.log("✅ LOGOUT SUCCESS");

        return c.json({
            message: "Logout berhasil",
        });
    }

    /**
     * Current User
     */
    async me(c: Context) {
        const user = c.get("user");

        return c.json({
            user,
        });
    }

    /**
     * Change Password
     */
    async changePassword(c: Context) {
        const user = c.get("user");

        const body = await c.req.json();

        console.log("====================================");
        console.log("🔐 CHANGE PASSWORD");
        console.log("====================================");
        console.log("[USER]:", user);

        const data =
            ChangePasswordSchema.parse(body);

        const result =
            await this.service.changePassword(
                user.id,
                data.oldPassword,
                data.newPassword
            );

        console.log("✅ PASSWORD CHANGED");

        return c.json(result);
    }
}