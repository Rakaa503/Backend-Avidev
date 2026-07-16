import { createMiddleware } from "hono/factory";

export const auditMiddleware = createMiddleware(
    async (c, next) => {
        await next();

        const method = c.req.method;

        if (
            method === "GET" ||
            method === "OPTIONS"
        ) {
            return;
        }

        const requestId =
            c.get("requestId") ?? "-";

        const user =
            c.get("user") ?? null;

        const ip =
            c.get("clientIp") ??
            "unknown";

        console.log("");

        console.log("[AUDIT]");

        console.log("Request ID :", requestId);

        console.log("User       :",
            user?.username ?? "Guest"
        );

        console.log("Role       :",
            user?.role ?? "-"
        );

        console.log("Method     :", method);

        console.log("Path       :", c.req.path);

        console.log("IP         :", ip);

        console.log("Status     :", c.res.status);

        console.log("Time       :", new Date().toISOString());

        console.log("");
    }
);