import { Hono } from "hono";

import auth from "../modules/auth/auth.route";
import users from "../modules/users/users.route";
import orders from "../modules/orders/orders.route";
import dashboard from "../modules/dashboard/dashboard.route";

const routes = new Hono();

const api = new Hono();

/**
 * API V1
 */
api.route("/auth", auth);
api.route("/users", users);
api.route("/orders", orders);
api.route("/dashboard", dashboard);

/**
 * Versioning
 */
routes.route("/api/v1", api);

export default routes;