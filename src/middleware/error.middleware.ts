import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

import { AppError } from "../core/errors/app-error";

export async function errorMiddleware(
    err: Error,
    c: Context
): Promise<Response> {
    if (err instanceof AppError) {
        return c.json(
            {
                success: false,
                message: err.message,
                data: null,
                errors: null,
            },
            err.status as ContentfulStatusCode
        );
    }

    if (err instanceof HTTPException) {
        return c.json(
            {
                success: false,
                message: err.message,
                data: null,
                errors: null,
            },
            err.status as ContentfulStatusCode
        );
    }

    console.error(err);

    return c.json(
        {
            success: false,
            message: "Internal Server Error",
            data: null,
            errors: null,
        },
        500 as ContentfulStatusCode
    );
}