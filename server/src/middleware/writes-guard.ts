import type { RequestHandler } from "express";

import { env } from "../env";

// Blocks mutating requests unless ENABLE_WRITES=true. Keeps public deployments
// read-only while preserving the write routes for the future auth pass.
export const guardWrites: RequestHandler = (req, res, next) => {
  if (req.method === "GET" || env.enableWrites) {
    next();
    return;
  }
  res.status(403).json({ error: "This API is read-only" });
};
