// API-facing shapes. These mirror the client's src/types exactly (snake_case,
// numbers, ISO strings) so the frontend consumes the API with zero type changes.

export type Contract = {
  id: string;
  study_number: string;
  department: string;
  contract_value: number;
  balance: number;
  status: "Ongoing" | "Finalized" | "Expired";
  start_date: string;
  end_date: string;
  created_at: string;
};

export type Invoice = {
  id: string;
  department: string;
  study_number: string;
  invoice_number: string;
  invoice_description: string | null;
  cost: number;
  contract_number: string;
  payment_date: string | null;
  uploaded_by_email: string;
  created_at: string;
};

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
