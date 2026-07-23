import fs from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

// CSV source data lives at the repo root (../../data relative to this file).
const dataDir = path.resolve(__dirname, "../../data");

type ContractRow = {
  study_number: string;
  department: string;
  contract_value: string;
  balance: string;
  status: string;
  start_date: string;
  end_date: string;
};

type InvoiceRow = {
  id: string;
  department: string;
  study_number: string;
  invoice_number: string;
  invoice_description: string;
  cost: string;
  contract_number: string;
  payment_date: string;
  uploaded_by_email: string;
  created_at: string;
};

function readCsv<T>(file: string): T[] {
  const content = fs.readFileSync(path.join(dataDir, file));
  return parse(content, { columns: true, skip_empty_lines: true, trim: true }) as T[];
}

async function main() {
  const contracts = readCsv<ContractRow>("contracts.csv");
  const invoices = readCsv<InvoiceRow>("invoices.csv");

  // Idempotent reseed.
  await prisma.invoice.deleteMany();
  await prisma.contract.deleteMany();

  await prisma.contract.createMany({
    data: contracts.map((row) => ({
      studyNumber: row.study_number,
      department: row.department,
      contractValue: row.contract_value,
      balance: row.balance,
      status: row.status,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
    })),
  });

  await prisma.invoice.createMany({
    data: invoices.map((row) => ({
      id: row.id || undefined,
      department: row.department,
      studyNumber: row.study_number,
      invoiceNumber: row.invoice_number,
      invoiceDescription: row.invoice_description || null,
      cost: row.cost,
      contractNumber: row.contract_number,
      paymentDate: row.payment_date ? new Date(row.payment_date) : null,
      uploadedByEmail: row.uploaded_by_email,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
    })),
  });

  console.log(`Seeded ${contracts.length} contracts and ${invoices.length} invoices.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
