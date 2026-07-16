import { createMiddleware } from "hono/factory";
import { AppError } from "../core/errors/app-error";
import { JWT } from "../core/auth";

export interface AuthUser {
    id: number;
    username: string;
    role: string;
}

type Variables = {
    user: AuthUser;
};

export const authMiddleware = createMiddleware<{
    Variables: Variables;
}>(async (c, next) => {
    const authorization = c.req.header("Authorization");

    if (!authorization) {
        throw new AppError("Unauthorized", 401);
    }

    if (!authorization.startsWith("Bearer ")) {
        throw new AppError("Invalid token", 401);
    }

    const token = authorization.substring(7);

    try {
        const payload = JWT.verifyAccessToken(token);

        c.set("user", {
            id: payload.id,
            username: payload.username,
            role: payload.role,
        });

        await next();
    } catch {
        throw new AppError("Invalid or expired token", 401);
    }
});