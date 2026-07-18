import { Hono } from "hono";

import { OrdersController } from "./orders.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const orders = new Hono();

const controller = new OrdersController();

orders.use("*", authMiddleware);

// Semua order (admin & superadmin)
orders.get(
    "/",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.index(c)
);

// Semua User Bisa Melihat Status Orders
orders.get(
    "/me",
    roleMiddleware("user", "admin", "superadmin"),
    (c) => controller.myOrders(c)
);

// Detail order (admin & superadmin)
orders.get(
    "/:id",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.show(c)
);

// User boleh membuat order
orders.post(
    "/",
    roleMiddleware("user", "admin", "superadmin"),
    (c) => controller.store(c)
);

// Admin & superadmin update order
orders.patch(
    "/:id",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.update(c)
);

// Hanya superadmin yang boleh delete
orders.delete(
    "/:id",
    roleMiddleware("superadmin"),
    (c) => controller.destroy(c)
);

export default orders;