import { z } from "zod";

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
  message: "Invalid date",
});

export const invoiceCreateSchema = z.object({
  department: z.string().min(1),
  study_number: z.string().min(1),
  invoice_number: z.string().min(1),
  invoice_description: z.string().nullish(),
  cost: z.number().nonnegative(),
  contract_number: z.string().min(1),
  payment_date: isoDate.nullish(),
  uploaded_by_email: z.string().email(),
});

export const invoiceUpdateSchema = invoiceCreateSchema.partial();

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>;

export const revenueQuerySchema = z.object({
  granularity: z.enum(["daily", "weekly", "monthly"]).default("monthly"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
