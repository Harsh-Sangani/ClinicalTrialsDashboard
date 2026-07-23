import { useQuery } from "@tanstack/react-query";

import { fetchInvoices } from "@/api/invoices";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 1000 * 60 * 5,
  });
}
