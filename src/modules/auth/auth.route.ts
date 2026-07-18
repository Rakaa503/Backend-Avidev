import { Hono } from "hono";

import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const auth = new Hono();

const controller = new AuthController();

auth.get("/", (c) => c.text("AUTH OK"));

auth.post("/register", (c) =>
    controller.register(c)
);

auth.post("/login", (c) =>
    controller.login(c)
);

auth.post("/refresh", (c) =>
    controller.refresh(c)
);

auth.post(
    "/logout",
    authMiddleware,
    (c) =>
        controller.logout(c)
);

auth.get(
    "/me",
    authMiddleware,
    (c) =>
        controller.me(c)
);

auth.patch(
    "/change-password",
    authMiddleware,
    (c) =>
        controller.changePassword(c)
);

export default auth;