import type { MiddlewareHandler } from "hono";
import { createSecurity } from "avss-lite-Raka503";

const security = createSecurity();

export const securityMiddleware: MiddlewareHandler = async (c, next) => {
    /**
     * Security Headers
     */
    const headers = security.headers
        .builder()
        .build();

    for (const [key, value] of Object.entries(headers)) {
        c.header(key, value);
    }

    /**
     * CORS
     */
    const corsHeaders = security.cors.createHeaders();

    for (const [key, value] of Object.entries(corsHeaders)) {
        c.header(key, value);
    }

    /**
     * Trusted Proxy
     */
    const proxy = security.proxy.info({
        "x-forwarded-for": c.req.header("x-forwarded-for"),
        "x-forwarded-host": c.req.header("x-forwarded-host"),
        "x-forwarded-proto": c.req.header("x-forwarded-proto"),
    });

    c.set("clientIp", proxy.clientIp);

    c.set(
        "trustedProxy",
        security.proxy.trusted(proxy.clientIp)
    );

    /**
     * XSS
     */
    if (
        c.req.header("content-type")?.includes("application/json")
    ) {
        try {
            const body = await c.req.json();

            const sanitized = security.xss.sanitize(body);

            c.set("sanitizedBody", sanitized);
        } catch {
            // Ignore jika body kosong
        }
    }

    /**
     * CSRF
     *
     * Nanti kita aktifkan setelah frontend selesai.
     */

    await next();
};