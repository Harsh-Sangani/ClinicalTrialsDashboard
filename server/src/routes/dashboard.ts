import { Router } from "express";

import { asyncHandler } from "../lib/async-handler";
import { revenueQuerySchema } from "../schemas/invoice.schema";
import { getDashboardSummary, getRevenueTrend } from "../services/dashboard.service";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    res.json(await getDashboardSummary());
  })
);

dashboardRouter.get(
  "/revenue",
  asyncHandler(async (req, res) => {
    const query = revenueQuerySchema.parse(req.query);
    res.json(await getRevenueTrend(query));
  })
);
