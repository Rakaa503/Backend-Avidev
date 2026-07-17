import type { AuditLogData } from "./types";

export function formatAudit(
    data: AuditLogData
): string {
    return [
        "[AUDIT]",
        `Request ID : ${data.requestId ?? "-"}`,
        `User ID    : ${data.userId ?? "-"}`,
        `Action     : ${data.action}`,
        `Method     : ${data.method}`,
        `Path       : ${data.path}`,
        `Status     : ${data.statusCode}`,
        `IP         : ${data.ip ?? "-"}`,
        `User Agent : ${data.userAgent ?? "-"}`,
        `Time       : ${new Date().toISOString()}`,
    ].join("\n");
}