import { Hono } from "hono";

import { UsersController } from "./users.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const users = new Hono();

const controller = new UsersController();

users.use("*", authMiddleware);

users.get("/", (c) =>
    controller.index(c)
);

users.get("/:id", (c) =>
    controller.show(c)
);

users.post("/", (c) =>
    controller.store(c)
);

users.patch("/:id", (c) =>
    controller.update(c)
);

users.delete("/:id", (c) =>
    controller.destroy(c)
);

export default users;