import { apiFetch } from "@/lib/api-client";
import type {
  DashboardSummaryResponse,
  RevenueTrendQuery,
  RevenueTrendResponse,
} from "@/types/dashboard";

export function fetchDashboardSummary() {
  return apiFetch<DashboardSummaryResponse>("/api/dashboard/summary");
}

export function fetchRevenueTrend(params: RevenueTrendQuery) {
  const search = new URLSearchParams({ granularity: params.granularity });
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  return apiFetch<RevenueTrendResponse>(`/api/dashboard/revenue?${search.toString()}`);
}
