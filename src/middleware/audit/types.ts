export type AuditAction =
    | "LOGIN"
    | "LOGOUT"
    | "REGISTER"
    | "CHANGE_PASSWORD"
    | "CREATE_USER"
    | "UPDATE_USER"
    | "DELETE_USER"
    | "CREATE_ORDER"
    | "UPDATE_ORDER"
    | "DELETE_ORDER"
    | "VIEW_DASHBOARD";

export interface AuditLogData {
    userId?: number;

    action: AuditAction;

    method: string;

    path: string;

    statusCode: number;

    ip?: string;

    userAgent?: string;

    requestId?: string;
}