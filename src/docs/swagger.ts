import { swaggerUI } from "@hono/swagger-ui";

export const swagger = swaggerUI({
    url: "/openapi.json",
});