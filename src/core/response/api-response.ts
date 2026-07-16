import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiResponse {
    static success<T>(
        c: Context,
        data: T,
        message = "Success",
        status: ContentfulStatusCode = 200
    ) {
        return c.json(
            {
                success: true,
                message,
                data,
            },
            status
        );
    }

    static created<T>(
        c: Context,
        data: T,
        message = "Created"
    ) {
        return ApiResponse.success(
            c,
            data,
            message,
            201
        );
    }

    static error(
        c: Context,
        message = "Error",
        status: ContentfulStatusCode = 400
    ) {
        return c.json(
            {
                success: false,
                message,
            },
            status
        );
    }

    static paginated<T>(
        c: Context,
        data: T,
        page: number,
        limit: number,
        total: number
    ) {
        return c.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
}