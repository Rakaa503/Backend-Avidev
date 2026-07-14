import { Hono } from "hono";

import { UsersController } from "./users.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";



const users = new Hono();

const controller = new UsersController();

users.use("*", authMiddleware);

users.get(
    "/",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.index(c)
);

users.get(
    "/:id",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.show(c)
);

users.post(
    "/",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.store(c)
);

users.patch(
    "/:id",
    roleMiddleware("admin", "superadmin"),
    (c) => controller.update(c)
);

users.delete(
    "/:id",
    roleMiddleware("superadmin"),
    (c) => controller.destroy(c)
);

export default users;