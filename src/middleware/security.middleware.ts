import type { MiddlewareHandler } from "hono";
import { createSecurity } from "avss-lite-Raka503";

const security = createSecurity();

export const securityMiddleware: MiddlewareHandler = async (c, next) => {

    // Security Headers
    const headers = security.headers
        .builder()
        .build();

    for (const [key, value] of Object.entries(headers)) {
        c.header(key, value);
    }


    // CORS
    const corsHeaders = security.cors.createHeaders();

    for (const [key, value] of Object.entries(corsHeaders)) {
        c.header(key, value);
    }


    await next();
};