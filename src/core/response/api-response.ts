import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiResponse {
    static success(
        c: Context,
        message: string,
        data: unknown = null,
        status: number = 200
    ) {
        return c.json(
            {
                success: true,
                message,
                data,
                errors: null,
            },
            status as ContentfulStatusCode
        );
    }

    static error(
        c: Context,
        message: string,
        status: number = 500,
        errors: unknown = null
    ) {
        return c.json(
            {
                success: false,
                message,
                data: null,
                errors,
            },
            status as ContentfulStatusCode
        );
    }
}