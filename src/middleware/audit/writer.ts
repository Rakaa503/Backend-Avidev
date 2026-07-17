import type { AuditLogData } from "./types";

import {
    ConsoleTransport,
    type AuditTransport,
} from "./transport";

const transports: AuditTransport[] = [
    new ConsoleTransport(),
];

export async function writeAudit(
    data: AuditLogData
) {
    for (const transport of transports) {
        await transport.write(data);
    }
}