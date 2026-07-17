import type { AuditLogData } from "./types";
import { formatAudit } from "./formatter";

export interface AuditTransport {
    write(
        data: AuditLogData
    ): Promise<void> | void;
}

export class ConsoleTransport
    implements AuditTransport
{
    write(data: AuditLogData) {
        console.log(formatAudit(data));
    }
}