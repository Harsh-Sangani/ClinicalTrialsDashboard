import type { Contract } from "@/types/contracts";
import type { Invoice } from "@/types/invoices";

export type AlertSeverity = "warning" | "danger" | "success" | "info";

export type DashboardAlertSegment = {
  text: string;
  emphasis?: boolean;
  className?: string;
};

export type DashboardAlert = {
  id: string;
  severity: AlertSeverity;
  title: DashboardAlertSegment[];
  detail: string;
};

export type ContractsSummary = {
  totalContracts: number;
  totalAmount: number;
  ongoingContracts: number;
};

export type ContractStatusBreakdown = {
  finalized: number;
  ongoing: number;
  expired: number;
};

export type InvoiceSummary = {
  totalInvoices: number;
  totalAmount: number;
  overdueInvoices: number;
};

export type UserStatusMetric = {
  label: string;
  value: number;
  color: string;
};

export type UserStatusSummary = {
  totalUsers: number;
  metrics: UserStatusMetric[];
};

export type DashboardSummaryResponse = {
  alerts: DashboardAlert[];
  contracts: ContractsSummary;
  contractStatus: ContractStatusBreakdown;
  invoices: InvoiceSummary;
  userStatus: UserStatusSummary;
};

export type RevenueGranularity = "daily" | "weekly" | "monthly";

export type RevenuePoint = {
  label: string;
  dateLabel: string;
  dateValue: string;
  revenue: number;
  cost: number;
};

export type RevenueTrendResponse = {
  granularity: RevenueGranularity;
  data: RevenuePoint[];
};

export type RevenueTrendQuery = {
  granularity: RevenueGranularity;
  startDate?: string;
  endDate?: string;
};

export type ContractsData = Contract;
export type InvoicesData = Invoice;
