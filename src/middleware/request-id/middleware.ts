import { createMiddleware } from "hono/factory";
import { randomUUID } from "crypto";

export const requestIdMiddleware = createMiddleware(
    async (c, next) => {
        const requestId = randomUUID();

        c.set("requestId", requestId);

        c.header("X-Request-ID", requestId);

        await next();
    }
);