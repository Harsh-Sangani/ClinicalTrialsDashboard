import { z } from "zod";

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
  message: "Invalid date",
});

export const contractCreateSchema = z.object({
  study_number: z.string().min(1),
  department: z.string().min(1),
  contract_value: z.number().nonnegative(),
  balance: z.number().nonnegative(),
  status: z.enum(["Ongoing", "Finalized", "Expired"]),
  start_date: isoDate,
  end_date: isoDate,
});

export const contractUpdateSchema = contractCreateSchema.partial();

export type ContractCreateInput = z.infer<typeof contractCreateSchema>;
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;
