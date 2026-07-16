import { createMiddleware } from "hono/factory";

import { logger } from "../../core/logger";

export const loggerMiddleware = createMiddleware(
    async (c, next) => {
        const start = performance.now();

        await next();

        const duration = performance.now() - start;

        const requestId =
            c.get("requestId") ?? "-";

        const clientIp =
            c.get("clientIp") ?? "-";

        const method = c.req.method;

        const path = c.req.path;

        const status = c.res.status;

        const userAgent =
            c.req.header("user-agent") ?? "-";

        logger.info(
            [
                `requestId=${requestId}`,
                `method=${method}`,
                `path=${path}`,
                `status=${status}`,
                `duration=${duration.toFixed(2)}ms`,
                `ip=${clientIp}`,
                `userAgent="${userAgent}"`,
            ].join(" | ")
        );
    }
);