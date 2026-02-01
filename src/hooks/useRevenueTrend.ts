import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchRevenueTrend } from "@/api/dashboard";
import type { RevenueTrendQuery, RevenueTrendResponse } from "@/types/dashboard";

export function useRevenueTrend(params: RevenueTrendQuery) {
  return useQuery<RevenueTrendResponse>({
    queryKey: ["revenue-trend", params],
    queryFn: () => fetchRevenueTrend(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
