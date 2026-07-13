import { Hono } from "hono";

import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const dashboard = new Hono();

const controller = new DashboardController();

dashboard.use("*", authMiddleware);

dashboard.get("/", (c) => controller.index(c));

export default dashboard;