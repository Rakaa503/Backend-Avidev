import { createMiddleware } from "hono/factory";
import { ZodError } from "zod";
import { AppError } from "../core/errors/app-error";

export const errorMiddleware = createMiddleware(
    async (c, next) => {
        try {
            await next();
        } catch (error) {
            console.log("========== ERROR MIDDLEWARE ==========");
            console.log("instanceof AppError:", error instanceof AppError);
            console.log("constructor:", (error as Error)?.constructor?.name);
            console.log("error:", error);
            console.log("======================================");

            if (error instanceof AppError) {
                return c.json(
                    {
                        success: false,
                        message: error.message,
                    },
                    {
                        status: error.status as
                            | 400
                            | 401
                            | 403
                            | 404
                            | 409
                            | 422
                            | 500,
                    }
                );
            }

            if (error instanceof ZodError) {
                return c.json(
                    {
                        success: false,
                        message: "Validation failed",
                        errors: error.issues,
                    },
                    {
                        status: 400,
                    }
                );
            }

            console.error(error);

            return c.json(
                {
                    success: false,
                    message: "Internal Server Error",
                },
                {
                    status: 500,
                }
            );
        }
    }
);