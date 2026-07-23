import { apiFetch } from "@/lib/api-client";
import type { Invoice } from "@/types/invoices";

export function fetchInvoices() {
  return apiFetch<Invoice[]>("/api/invoices");
}
