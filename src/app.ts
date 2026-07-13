import { Hono } from "hono";

import routes from "./routes";
import { securityMiddleware } from "./middleware/security.middleware";

const app = new Hono();

app.use("*", securityMiddleware);

app.get("/", (c) => c.text("ROOT"));

app.get("/health", (c) => c.text("HEALTH"));

app.get("/test-auth", (c) => c.text("TEST AUTH"));

app.route("/", routes);

export default app;