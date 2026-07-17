const ignoredPaths = [
    "/",
    "/health",
    "/favicon.ico",
];

export function shouldAudit(
    method: string,
    path: string
): boolean {
    if (ignoredPaths.includes(path)) {
        return false;
    }

    if (method === "OPTIONS") {
        return false;
    }

    return true;
}