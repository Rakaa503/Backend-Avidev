import { Hono } from "hono";

import auth from "../modules/auth/auth.route";
import users from "../modules/users/users.route";
import orders from "../modules/orders/orders.route";
import dashboard from "../modules/dashboard/dashboard.route";

const routes = new Hono();

routes.route("/auth", auth);
routes.route("/users", users);
routes.route("/orders", orders);
routes.route("/dashboard", dashboard);

export default routes;