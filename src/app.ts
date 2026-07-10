import { Hono } from "hono";
import auth from "./modules/auth/auth.route";
import { securityMiddleware } from "./middleware/security.middleware";


const app = new Hono();


app.use("*", securityMiddleware);

app.get("/test-auth", (c) => c.text("TEST AUTH"));

app.get("/", (c) => c.text("ROOT"));

app.get("/health", (c) => c.text("HEALTH"));

app.route("/auth", auth);


export default app;