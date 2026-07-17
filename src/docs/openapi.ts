import { tags } from "./tags";

export const openApiDocument = {
    openapi: "3.1.0",

    info: {
        title: "Backend AviDev API",
        version: "1.0.0",
        description: "Official REST API Documentation for Backend AviDev",
    },

    servers: [
        {
            url: "http://localhost:3000/api/v1",
            description: "Development",
        },
    ],

    tags,

    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },

    security: [
        {
            BearerAuth: [],
        },
    ],

    paths: {},
};