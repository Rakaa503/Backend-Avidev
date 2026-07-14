import { Hono } from "hono";

import { OrdersController } from "./orders.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const orders = new Hono();

const controller = new OrdersController();

orders.use("*", authMiddleware);

orders.get(
    "/",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.index(c)
);

orders.get(
    "/:id",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.show(c)
);

orders.post(
    "/",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.store(c)
);

orders.patch(
    "/:id",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.update(c)
);

orders.delete(
    "/:id",
    roleMiddleware("superadmin"),
    (c) => controller.destroy(c)
);

export default orders;