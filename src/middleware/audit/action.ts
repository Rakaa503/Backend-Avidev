export function getAuditAction(
    method: string,
    path: string
): string {
    if (method === "POST" && path === "/auth/login") {
        return "LOGIN";
    }

    if (method === "POST" && path === "/auth/register") {
        return "REGISTER";
    }

    if (method === "POST" && path === "/auth/logout") {
        return "LOGOUT";
    }

    if (method === "PATCH" && path === "/auth/change-password") {
        return "CHANGE_PASSWORD";
    }

    if (method === "POST" && path === "/orders") {
        return "CREATE_ORDER";
    }

    if (method === "PATCH" && path.startsWith("/orders/")) {
        return "UPDATE_ORDER";
    }

    if (method === "DELETE" && path.startsWith("/orders/")) {
        return "DELETE_ORDER";
    }

    if (method === "POST" && path === "/users") {
        return "CREATE_USER";
    }

    if (method === "PATCH" && path.startsWith("/users/")) {
        return "UPDATE_USER";
    }

    if (method === "DELETE" && path.startsWith("/users/")) {
        return "DELETE_USER";
    }

    if (method === "GET" && path === "/dashboard") {
        return "VIEW_DASHBOARD";
    }

    return "UNKNOWN";
}