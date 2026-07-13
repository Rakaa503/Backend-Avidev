import { Hono } from "hono";

import { OrdersController } from "./orders.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const orders = new Hono();

const controller = new OrdersController();

orders.use("*", authMiddleware);

orders.get("/", (c) => controller.index(c));

orders.get("/:id", (c) => controller.show(c));

orders.post("/", (c) => controller.store(c));

orders.patch("/:id", (c) => controller.update(c));

orders.delete("/:id", (c) => controller.destroy(c));

export default orders;