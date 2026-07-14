import { Hono } from "hono";

import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const dashboard = new Hono();

const controller = new DashboardController();

dashboard.use("*", authMiddleware);

dashboard.get(
    "/",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.index(c)
);

export default dashboard;