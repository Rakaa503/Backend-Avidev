import { Hono } from "hono";

import routes from "./routes";

import { requestIdMiddleware } from "./middleware/request-id";

import { securityMiddleware } from "./middleware/security.middleware";

import {
    rateLimitMiddleware,
    createRateLimitMiddleware,
} from "./middleware/rate-limit.middleware";

const app = new Hono();

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
    "/auth/login",
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
 * Health Check
 */
app.get("/", (c) => c.text("ROOT"));

app.get("/health", (c) => c.text("HEALTH"));

app.get("/test-auth", (c) => c.text("TEST AUTH"));

/**
 * Routes
 */
app.route("/", routes);

export default app;