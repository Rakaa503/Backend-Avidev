import type { Context } from "hono";

import { ReportsService } from "./reports.service";

export class ReportsController {
    private service =
        new ReportsService();

    async index(c: Context) {
        const report =
            await this.service.getReport();

        return c.json(report);
    }
}