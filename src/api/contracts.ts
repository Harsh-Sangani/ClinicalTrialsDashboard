import { supabase } from "@/lib/supabase";
import type { Contract } from "@/types/contracts";

export async function fetchContracts() {
  const { data, error } = await supabase
    .from("contracts")
    .select(
      "id, study_number, department, contract_value, balance, status, start_date, end_date, created_at"
    )
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Contract[];
}