-- CreateTable
CREATE TABLE "contracts" (
    "id" UUID NOT NULL,
    "study_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contract_value" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "department" TEXT NOT NULL,
    "study_number" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "invoice_description" TEXT,
    "cost" DECIMAL(12,2) NOT NULL,
    "contract_number" TEXT NOT NULL,
    "payment_date" DATE,
    "uploaded_by_email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");
