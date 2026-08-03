import { Hono } from "hono";

import { DashboardController } from "./dashboard.controller";

import { authMiddleware } from "../../middleware/auth.middleware";


const dashboard = new Hono();


const controller =
    new DashboardController();



// Semua endpoint dashboard wajib login
dashboard.use(
    "*",
    authMiddleware
);



// GET /dashboard
dashboard.get(
    "/",
    (c) =>
        controller.overview(c)
);



// GET /dashboard/analytics
dashboard.get(
    "/analytics",
    (c) =>
        controller.analytics(c)
);



export default dashboard;