import { createMiddleware } from "hono/factory";
import { logger } from "avss-lite-Raka503";

export const loggerMiddleware = createMiddleware(
    async (c, next) => {
        const start = performance.now();

        await next();

        const duration = performance.now() - start;

        logger.info(
            [
                `requestId=${c.get("requestId") ?? "-"}`,
                `method=${c.req.method}`,
                `path=${c.req.path}`,
                `status=${c.res.status}`,
                `duration=${duration.toFixed(2)}ms`,
                `ip=${c.get("clientIp") ?? "-"}`,
                `userAgent=${c.req.header("user-agent") ?? "-"}`,
            ].join(" | ")
        );
    }
);