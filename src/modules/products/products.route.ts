import { Hono } from "hono";

import { ProductsController } from "./products.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

import { roleMiddleware } from "../../middleware/role.middleware";


const products = new Hono();

const controller =
    new ProductsController();


// Public
products.get(
    "/",
    (c) => controller.index(c)
);


products.get(
    "/:id",
    (c) => controller.show(c)
);


// Protected
products.use(
    "*",
    authMiddleware
);


// Admin + Superadmin
products.post(
    "/",
    roleMiddleware(
        "admin",
        "superadmin"
    ),
    (c) => controller.store(c)
);


products.patch(
    "/:id",
    roleMiddleware(
        "admin",
        "superadmin"
    ),
    (c) => controller.update(c)
);


// Superadmin only
products.delete(
    "/:id",
    roleMiddleware(
        "superadmin"
    ),
    (c) => controller.destroy(c)
);


export default products;