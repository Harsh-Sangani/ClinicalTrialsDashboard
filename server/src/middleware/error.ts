import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.flatten() });
    return;
  }

  // Prisma "record not found" on update/delete.
  if (err && typeof err === "object" && (err as { code?: string }).code === "P2025") {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  // Prisma unique-constraint violation (e.g. duplicate invoice_number).
  if (err && typeof err === "object" && (err as { code?: string }).code === "P2002") {
    res.status(409).json({ error: "A record with that unique value already exists" });
    return;
  }

  const status =
    err && typeof err === "object" && typeof (err as { status?: number }).status === "number"
      ? (err as { status: number }).status
      : 500;
  const message =
    err && typeof err === "object" && typeof (err as { message?: string }).message === "string"
      ? (err as { message: string }).message
      : "Internal Server Error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
};
