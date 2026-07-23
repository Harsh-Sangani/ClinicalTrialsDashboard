import { Router } from "express";

import { prisma } from "../db";
import { asyncHandler } from "../lib/async-handler";
import { serializeContract, toContractCreateData, toContractUpdateData } from "../lib/serializers";
import { contractCreateSchema, contractUpdateSchema } from "../schemas/contract.schema";

export const contractsRouter = Router();

contractsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.contract.findMany({ orderBy: { startDate: "desc" } });
    res.json(rows.map(serializeContract));
  })
);

contractsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = contractCreateSchema.parse(req.body);
    const created = await prisma.contract.create({ data: toContractCreateData(input) });
    res.status(201).json(serializeContract(created));
  })
);

contractsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const input = contractUpdateSchema.parse(req.body);
    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: toContractUpdateData(input),
    });
    res.json(serializeContract(updated));
  })
);

contractsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.contract.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);
