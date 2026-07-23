import { Router } from "express";

import { prisma } from "../db";
import { asyncHandler } from "../lib/async-handler";
import { serializeInvoice, toInvoiceCreateData, toInvoiceUpdateData } from "../lib/serializers";
import { invoiceCreateSchema, invoiceUpdateSchema } from "../schemas/invoice.schema";

export const invoicesRouter = Router();

invoicesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.invoice.findMany({
      orderBy: [{ paymentDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    });
    res.json(rows.map(serializeInvoice));
  })
);

invoicesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = invoiceCreateSchema.parse(req.body);
    const created = await prisma.invoice.create({ data: toInvoiceCreateData(input) });
    res.status(201).json(serializeInvoice(created));
  })
);

invoicesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const input = invoiceUpdateSchema.parse(req.body);
    const updated = await prisma.invoice.update({
      where: { id: req.params.id },
      data: toInvoiceUpdateData(input),
    });
    res.json(serializeInvoice(updated));
  })
);

invoicesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);
