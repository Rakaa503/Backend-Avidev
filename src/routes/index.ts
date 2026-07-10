import { Hono } from "hono";

import auth from "../modules/auth/auth.route";

const routes = new Hono();

routes.route("/auth", auth);

export default routes;