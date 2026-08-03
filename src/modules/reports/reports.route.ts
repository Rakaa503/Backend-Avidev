import { Hono } from "hono";

import { ReportsController } from "./reports.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const reports = new Hono();

const controller =
    new ReportsController();

reports.use("*", authMiddleware);

reports.get(
    "/",
    roleMiddleware(
        "admin",
        "superadmin"
    ),
    (c) => controller.index(c)
);

export default reports;