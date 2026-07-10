import type { Context, Next } from "hono";

import { logger } from "avss-lite-Raka503";

export async function loggerMiddleware(
    c: Context,
    next: Next
): Promise<void> {
    const start = Date.now();

    await next();

    const duration = Date.now() - start;

    const method = c.req.method;
    const path = c.req.path;
    const status = c.res.status;

    const ip =
        c.req.header("x-forwarded-for") ??
        c.req.header("x-real-ip") ??
        "unknown";

    const userAgent =
        c.req.header("user-agent") ?? "unknown";

    logger.access(
        `${method} ${path} ${status} ${duration}ms IP=${ip} UA="${userAgent}"`
    );
}