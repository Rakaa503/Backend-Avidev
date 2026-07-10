import "dotenv/config";

import { serve } from "@hono/node-server";
import app from "./app";

const port = Number(process.env.PORT) || 3000;

console.log("====================================");
console.log("🚀 AviDev Backend Started");
console.log(`🌐 http://localhost:${port}`);
console.log("====================================");

serve({
  fetch: app.fetch,
  port,
});