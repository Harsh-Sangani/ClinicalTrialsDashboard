import cors from "cors";
import express from "express";

import { env } from "./env";
import { errorHandler } from "./middleware/error";
import { contractsRouter } from "./routes/contracts";
import { dashboardRouter } from "./routes/dashboard";
import { healthRouter } from "./routes/health";
import { invoicesRouter } from "./routes/invoices";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/contracts", contractsRouter);
  app.use("/api/invoices", invoicesRouter);
  app.use("/api/dashboard", dashboardRouter);

  app.use(errorHandler);

  return app;
}
