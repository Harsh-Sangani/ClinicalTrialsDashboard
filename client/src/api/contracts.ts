import { apiFetch } from "@/lib/api-client";
import type { Contract } from "@/types/contracts";

export function fetchContracts() {
  return apiFetch<Contract[]>("/api/contracts");
}
