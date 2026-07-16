import { createMiddleware } from "hono/factory";

import {
    rateLimit,
    type RateLimitConfig,
} from "avss-lite-Raka503";

const defaultConfig: RateLimitConfig = {
    enabled: true,
    windowMs: 60_000,
    maxRequests: 100,
};

export const createRateLimitMiddleware = (
    config: RateLimitConfig = defaultConfig
) =>
    createMiddleware(async (c, next) => {
        const ip =
            c.req.header("x-forwarded-for") ??
            c.req.header("x-real-ip") ??
            "unknown";

        const result = rateLimit(ip, config);

        c.header(
            "X-RateLimit-Remaining",
            result.remaining.toString()
        );

        if (!result.success) {
            c.header(
                "Retry-After",
                result.retryAfter.toString()
            );

            return c.json(
                {
                    success: false,
                    message: "Too Many Requests",
                },
                429
            );
        }

        await next();
    });

export const rateLimitMiddleware =
    createRateLimitMiddleware();