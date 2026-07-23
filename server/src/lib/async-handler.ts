import type { RequestHandler } from "express";

// Express 4 does not forward rejected promises to the error middleware, so wrap
// async route handlers to funnel any thrown/rejected error into next().
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
