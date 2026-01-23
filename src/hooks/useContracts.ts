import { useQuery } from "@tanstack/react-query";

import { fetchContracts } from "@/api/contracts";

export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
    staleTime: 1000 * 60 * 5,
  });
}