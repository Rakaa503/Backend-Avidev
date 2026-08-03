import type { MiddlewareHandler } from "hono";
import { createSecurity } from "avss-lite-Raka503";

const security = createSecurity();

export const securityMiddleware: MiddlewareHandler = async (
    c,
    next
) => {
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
     * NOTE:
     * CORS sudah ditangani oleh hono/cors di app.ts
     * Jangan set header CORS lagi di sini agar tidak bentrok.
     */

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
     * XSS Sanitization
     */
    if (
        c.req
            .header("content-type")
            ?.includes("application/json")
    ) {
        try {
            const body = await c.req.json();

            const sanitized =
                security.xss.sanitize(body);

            c.set(
                "sanitizedBody",
                sanitized
            );
        } catch {
            // ignore
        }
    }

    /**
     * CSRF
     * Aktifkan nanti setelah frontend selesai.
     */

    await next();
};