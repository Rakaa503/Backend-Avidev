import type { Context } from "hono";

import { DashboardService } from "./dashboard.service";

export class DashboardController {
    private readonly service: DashboardService;

    constructor() {
        this.service = new DashboardService();
    }

    async index(c: Context) {
        const stats = await this.service.getStats();

        return c.json(stats);
    }
}