import { Hono } from "hono";

import { ProductsController } from "./products.controller";

const products = new Hono();

const controller = new ProductsController();

/**
 * Product Statistics
 */
products.get("/stats", (c) =>
    controller.stats(c)
);

/**
 * Get All Products
 */
products.get("/", (c) =>
    controller.index(c)
);

/**
 * Get Product By ID
 */
products.get("/:id", (c) =>
    controller.show(c)
);

/**
 * Create Product
 */
products.post("/", (c) =>
    controller.store(c)
);

/**
 * Update Product
 */
products.put("/:id", (c) =>
    controller.update(c)
);

/**
 * Delete Product
 */
products.delete("/:id", (c) =>
    controller.destroy(c)
);

export default products;