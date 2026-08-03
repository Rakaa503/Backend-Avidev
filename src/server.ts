import "dotenv/config";

import { serve } from "@hono/node-server";

import app from "./app";

import { JWT } from "./core/auth";
import { env } from "./core/config";


/**
 * Initialize JWT
 */
JWT.configure({
    accessSecret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: "15m",
    refreshExpiresIn: "7d",
});


/**
 * Request Debug Logger
 */
app.use("*", async (c, next) => {
    console.log(
        `[${c.req.method}] ${c.req.path}`
    );

    await next();
});


const port = Number(env.PORT) || 3000;


console.log("====================================");
console.log("🚀 AviDev Backend Started");
console.log(`🌐 http://localhost:${port}`);
console.log("====================================");


serve({
    fetch: app.fetch,
    port,
});