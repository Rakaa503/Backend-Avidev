import { Hono } from "hono";

import routes from "./routes";

import { requestIdMiddleware } from "./middleware/request-id";
import { securityMiddleware } from "./middleware/security.middleware";
import { ZodError } from "zod";
import { AppError } from "./core/errors/app-error";

import {
    rateLimitMiddleware,
    createRateLimitMiddleware,
} from "./middleware/rate-limit.middleware";

import { swagger } from "./docs/swagger";
import { openApiDocument } from "./docs/openapi";

const app = new Hono();
app.onError((err, c) => {
    if (err instanceof AppError) {
        return c.json(
            {
                success: false,
                message: err.message,
            },
            err.status as 400 | 401 | 403 | 404 | 409 | 422 | 500
        );
    }

    if (err instanceof ZodError) {
        return c.json(
            {
                success: false,
                message: "Validation failed",
                errors: err.issues,
            },
            400
        );
    }

    console.error(err);

    return c.json(
        {
            success: false,
            message: "Internal Server Error",
        },
        500
    );
});
/**
 * Global Error Handler
 */

/**
 * Request ID
 */
app.use("*", requestIdMiddleware);

/**
 * Global Rate Limit
 * 100 requests / 1 minute
 */
app.use("*", rateLimitMiddleware);

/**
 * Login Rate Limit
 * 5 requests / 1 minute
 */
app.use(
    "/api/v1/auth/login",
    createRateLimitMiddleware({
        enabled: true,
        windowMs: 60_000,
        maxRequests: 5,
    })
);

/**
 * Security Middleware
 */
app.use("*", securityMiddleware);

/**
 * Root
 */
app.get("/", (c) => c.text("Backend AviDev API"));

/**
 * Health Check
 */
app.get("/health", (c) => {
    return c.json({
        success: true,
        status: "ok",
        service: "Backend AviDev",
        version: "1.0.0",
        environment: process.env.NODE_ENV ?? "development",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

/**
 * OpenAPI JSON
 */
app.get("/openapi.json", (c) => {
    return c.json(openApiDocument);
});

/**
 * Swagger UI
 */
app.get("/docs", swagger);

/**
 * Test
 */
app.get("/test-auth", (c) => c.text("TEST AUTH"));

/**
 * API Routes
 */
app.route("/", routes);

export default app;