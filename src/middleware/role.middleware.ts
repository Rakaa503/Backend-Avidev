import { createMiddleware } from "hono/factory";

import { AppError } from "../core/errors/app-error";

import type { AuthUser } from "./auth.middleware";

type Variables = {
    user: AuthUser;
};

export const roleMiddleware = (
    ...allowedRoles: string[]
) =>
    createMiddleware<{
        Variables: Variables;
    }>(async (c, next) => {
        const user = c.get("user");

        if (!user) {
            throw new AppError(
                "Unauthorized",
                401
            );
        }

        if (!allowedRoles.includes(user.role)) {
            throw new AppError(
                "Forbidden",
                403
            );
        }

        await next();
    });