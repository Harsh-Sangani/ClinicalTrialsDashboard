import type { Contract as PrismaContract, Invoice as PrismaInvoice, Prisma } from "@prisma/client";

import type { ContractCreateInput, ContractUpdateInput } from "../schemas/contract.schema";
import type { InvoiceCreateInput, InvoiceUpdateInput } from "../schemas/invoice.schema";
import type { Contract, Invoice } from "../types/domain";

// Prisma returns Decimal for numeric columns and Date for date/timestamp columns.
// The client expects plain numbers and strings, so normalize on the way out.

function dateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function serializeContract(row: PrismaContract): Contract {
  return {
    id: row.id,
    study_number: row.studyNumber,
    department: row.department,
    contract_value: row.contractValue.toNumber(),
    balance: row.balance.toNumber(),
    status: row.status as Contract["status"],
    start_date: dateOnly(row.startDate),
    end_date: dateOnly(row.endDate),
    created_at: row.createdAt.toISOString(),
  };
}

export function serializeInvoice(row: PrismaInvoice): Invoice {
  return {
    id: row.id,
    department: row.department,
    study_number: row.studyNumber,
    invoice_number: row.invoiceNumber,
    invoice_description: row.invoiceDescription,
    cost: row.cost.toNumber(),
    contract_number: row.contractNumber,
    payment_date: row.paymentDate ? dateOnly(row.paymentDate) : null,
    uploaded_by_email: row.uploadedByEmail,
    created_at: row.createdAt.toISOString(),
  };
}

// Map validated snake_case input to Prisma's camelCase write shape. Create
// mappers require every field; update mappers set only the keys provided.
export function toContractCreateData(input: ContractCreateInput): Prisma.ContractUncheckedCreateInput {
  return {
    studyNumber: input.study_number,
    department: input.department,
    contractValue: input.contract_value,
    balance: input.balance,
    status: input.status,
    startDate: new Date(input.start_date),
    endDate: new Date(input.end_date),
  };
}

export function toContractUpdateData(input: ContractUpdateInput): Prisma.ContractUncheckedUpdateInput {
  const data: Prisma.ContractUncheckedUpdateInput = {};
  if (input.study_number !== undefined) data.studyNumber = input.study_number;
  if (input.department !== undefined) data.department = input.department;
  if (input.contract_value !== undefined) data.contractValue = input.contract_value;
  if (input.balance !== undefined) data.balance = input.balance;
  if (input.status !== undefined) data.status = input.status;
  if (input.start_date !== undefined) data.startDate = new Date(input.start_date);
  if (input.end_date !== undefined) data.endDate = new Date(input.end_date);
  return data;
}

export function toInvoiceCreateData(input: InvoiceCreateInput): Prisma.InvoiceUncheckedCreateInput {
  return {
    department: input.department,
    studyNumber: input.study_number,
    invoiceNumber: input.invoice_number,
    invoiceDescription: input.invoice_description ?? null,
    cost: input.cost,
    contractNumber: input.contract_number,
    paymentDate: input.payment_date ? new Date(input.payment_date) : null,
    uploadedByEmail: input.uploaded_by_email,
  };
}

export function toInvoiceUpdateData(input: InvoiceUpdateInput): Prisma.InvoiceUncheckedUpdateInput {
  const data: Prisma.InvoiceUncheckedUpdateInput = {};
  if (input.department !== undefined) data.department = input.department;
  if (input.study_number !== undefined) data.studyNumber = input.study_number;
  if (input.invoice_number !== undefined) data.invoiceNumber = input.invoice_number;
  if (input.invoice_description !== undefined) data.invoiceDescription = input.invoice_description;
  if (input.cost !== undefined) data.cost = input.cost;
  if (input.contract_number !== undefined) data.contractNumber = input.contract_number;
  if (input.payment_date !== undefined)
    data.paymentDate = input.payment_date ? new Date(input.payment_date) : null;
  if (input.uploaded_by_email !== undefined) data.uploadedByEmail = input.uploaded_by_email;
  return data;
}
