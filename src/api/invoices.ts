import { supabase } from "@/lib/supabase";
import type { Invoice } from "@/types/invoices";

export async function fetchInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, department, study_number, invoice_number, invoice_description, cost, contract_number, payment_date, uploaded_by_email, created_at"
    )
    .order("payment_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Invoice[];
}
