import { Hono } from "hono";
import { cors } from "hono/cors";
import { ZodError } from "zod";

import routes from "./routes";

import { requestIdMiddleware } from "./middleware/request-id";
import { securityMiddleware } from "./middleware/security.middleware";

import { AppError } from "./core/errors/app-error";

import {
    rateLimitMiddleware,
    createRateLimitMiddleware,
} from "./middleware/rate-limit.middleware";

import { swagger } from "./docs/swagger";
import { openApiDocument } from "./docs/openapi";

const app = new Hono();

/**
 * Global Error Handler
 */
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
 * Request ID
 */
app.use("*", requestIdMiddleware);

/**
 * CORS
 */
app.use(
    "*",
    cors({
        origin: "http://localhost:3001",
        credentials: true,
        allowMethods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

/**
 * Global Rate Limit
 */
app.use("*", rateLimitMiddleware);

/**
 * Login Rate Limit
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
app.get("/", (c) => {
    return c.text("Backend AviDev API");
});

/**
 * Health
 */
app.get("/health", (c) => {
    return c.json({
        success: true,
        status: "ok",
        service: "Backend AviDev",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

/**
 * OpenAPI
 */
app.get("/openapi.json", (c) => {
    return c.json(openApiDocument);
});

/**
 * Swagger
 */
app.get("/docs", swagger);

/**
 * API Routes
 */
app.route("/", routes);

export default app;