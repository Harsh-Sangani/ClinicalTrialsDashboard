import { supabase } from "@/lib/supabase";
import type { Contract } from "@/types/contracts";
import type { Invoice } from "@/types/invoices";
import type {
  ContractStatusBreakdown,
  ContractsSummary,
  DashboardAlert,
  DashboardAlertSegment,
  DashboardSummaryResponse,
  RevenueGranularity,
  RevenuePoint,
  RevenueTrendQuery,
  RevenueTrendResponse,
  UserStatusSummary,
} from "@/types/dashboard";

const MS_PER_DAY = 86_400_000;
const EXPIRY_WINDOW_DAYS = 7;
const OVERDUE_WINDOW_DAYS = 7;
const LOW_BALANCE_THRESHOLD = 0.1;
const DAILY_BUCKET_COUNT = 7;
const WEEKLY_BUCKET_COUNT = 8;
const MONTHLY_BUCKET_COUNT = 12;

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
const dayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const weekFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function toDate(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(a: Date, b: Date) {
  return Math.ceil((a.getTime() - b.getTime()) / MS_PER_DAY);
}

function sum(values: number[]) {
  return values.reduce((total, current) => total + current, 0);
}

function buildAlertTitle(segments: DashboardAlertSegment[]): DashboardAlertSegment[] {
  return segments;
}

function buildContractAlerts(contracts: Contract[], now: Date): DashboardAlert[] {
  return contracts.flatMap((contract) => {
    const alerts: DashboardAlert[] = [];
    const endDate = toDate(contract.end_date);
    if (endDate) {
      const diff = daysBetween(endDate, now);
      if (diff >= 0 && diff <= EXPIRY_WINDOW_DAYS) {
        alerts.push({
          id: `${contract.id}-expiring`,
          severity: "warning",
          title: buildAlertTitle([
            { text: "Contract " },
            { text: `#${contract.study_number}`, emphasis: true },
            { text: " expiring in " },
            { text: `${diff} days`, emphasis: true, className: "text-amber-600" },
          ]),
          detail: `(${contract.department}) - Review`,
        });
      }
    }

    const balanceRatio = contract.contract_value === 0 ? 1 : contract.balance / contract.contract_value;
    if (balanceRatio <= LOW_BALANCE_THRESHOLD) {
      alerts.push({
        id: `${contract.id}-low-balance`,
        severity: "info",
        title: buildAlertTitle([
          { text: "Contract " },
          { text: `#${contract.study_number}`, emphasis: true },
          { text: " balance below " },
          { text: `${Math.round(balanceRatio * 100)}%`, emphasis: true, className: "text-indigo-500" },
        ]),
        detail: `(${contract.department}) - Review`,
      });
    }

    const createdAt = toDate(contract.created_at);
    if (createdAt && daysBetween(now, createdAt) <= EXPIRY_WINDOW_DAYS) {
      alerts.push({
        id: `${contract.id}-new`,
        severity: "success",
        title: buildAlertTitle([
          { text: "New Contract " },
          { text: `#${contract.study_number}`, emphasis: true },
          { text: " added" },
        ]),
        detail: `(${contract.department})`,
      });
    }

    return alerts;
  });
}

function buildInvoiceAlerts(invoices: Invoice[], now: Date): DashboardAlert[] {
  return invoices
    .filter((invoice) => {
      if (invoice.payment_date) return false;
      const createdAt = toDate(invoice.created_at);
      if (!createdAt) return false;
      return daysBetween(now, createdAt) > OVERDUE_WINDOW_DAYS;
    })
    .map((invoice) => ({
      id: `${invoice.id}-overdue`,
      severity: "danger",
      title: buildAlertTitle([
        { text: "Invoice " },
        { text: `#${invoice.invoice_number}`, emphasis: true },
        { text: " overdue by " },
        { text: `${OVERDUE_WINDOW_DAYS} days`, emphasis: true, className: "text-red-500" },
      ]),
      detail: `(${invoice.department}) - Action`,
    }));
}

function buildUserStatusSummary(invoices: Invoice[], now: Date): UserStatusSummary {
  const userMap = new Map<string, Date>();
  invoices.forEach((invoice) => {
    const createdAt = toDate(invoice.created_at);
    if (!createdAt) return;
    const existing = userMap.get(invoice.uploaded_by_email);
    if (!existing || existing < createdAt) {
      userMap.set(invoice.uploaded_by_email, createdAt);
    }
  });

  let active = 0;
  let offline = 0;
  let inactive = 0;

  userMap.forEach((lastActive) => {
    const diff = daysBetween(now, lastActive);
    if (diff <= 7) active += 1;
    else if (diff <= 30) offline += 1;
    else inactive += 1;
  });

  const metrics = [
    { label: "Active", value: active, color: "bg-brand-green" },
    { label: "Offline", value: offline, color: "bg-[#86D38F]" },
    { label: "Inactive", value: inactive, color: "bg-slate-300" },
  ];

  return {
    totalUsers: active + offline + inactive,
    metrics,
  };
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  const [{ data: contracts, error: contractsError }, { data: invoices, error: invoicesError }] = await Promise.all([
    supabase
      .from("contracts")
      .select(
        "id, study_number, department, contract_value, balance, status, start_date, end_date, created_at"
      ),
    supabase
      .from("invoices")
      .select(
        "id, department, study_number, invoice_number, cost, payment_date, uploaded_by_email, created_at"
      ),
  ]);

  if (contractsError) {
    throw new Error(contractsError.message);
  }
  if (invoicesError) {
    throw new Error(invoicesError.message);
  }

  const contractsData = (contracts ?? []) as Contract[];
  const invoicesData = (invoices ?? []) as Invoice[];
  const now = new Date();

  const contractsSummary: ContractsSummary = {
    totalContracts: contractsData.length,
    totalAmount: sum(contractsData.map((contract) => contract.contract_value ?? 0)),
    ongoingContracts: contractsData.filter((contract) => contract.status === "Ongoing").length,
  };

  const contractStatus: ContractStatusBreakdown = {
    finalized: contractsData.filter((contract) => contract.status === "Finalized").length,
    ongoing: contractsData.filter((contract) => contract.status === "Ongoing").length,
    expired: contractsData.filter((contract) => contract.status === "Expired").length,
  };

  const invoiceSummary = {
    totalInvoices: invoicesData.length,
    totalAmount: sum(invoicesData.map((invoice) => invoice.cost ?? 0)),
    overdueInvoices: invoicesData.filter((invoice) => !invoice.payment_date).length,
  };

  const alerts = [...buildContractAlerts(contractsData, now), ...buildInvoiceAlerts(invoicesData, now)].slice(0, 20);
  const userStatus = buildUserStatusSummary(invoicesData, now);

  return {
    alerts,
    contracts: contractsSummary,
    contractStatus,
    invoices: invoiceSummary,
    userStatus,
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addWeeks(date: Date, weeks: number) {
  return addDays(date, weeks * 7);
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  return startOfDay(addDays(date, -diff));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function bucketConfig(granularity: RevenueGranularity) {
  switch (granularity) {
    case "daily":
      return { bucketCount: DAILY_BUCKET_COUNT, step: addDays, startFn: startOfDay };
    case "weekly":
      return { bucketCount: WEEKLY_BUCKET_COUNT, step: addWeeks, startFn: startOfWeek };
    case "monthly":
    default:
      return { bucketCount: MONTHLY_BUCKET_COUNT, step: addMonths, startFn: startOfMonth };
  }
}

function formatBucketLabel(date: Date, granularity: RevenueGranularity) {
  switch (granularity) {
    case "daily":
      return { label: dayFormatter.format(date), dateLabel: dayFormatter.format(date) };
    case "weekly": {
      const start = weekFormatter.format(date);
      const end = weekFormatter.format(addDays(date, 6));
      return { label: `W${getWeekNumber(date)}`, dateLabel: `${start} - ${end}` };
    }
    case "monthly":
    default:
      return { label: monthFormatter.format(date), dateLabel: monthFormatter.format(date) };
  }
}

function getWeekNumber(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - start.getTime()) / MS_PER_DAY;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

function buildBuckets(granularity: RevenueGranularity, startDate?: string, endDate?: string) {
  const { bucketCount, step, startFn } = bucketConfig(granularity);
  if (startDate && endDate) {
    const start = startFn(new Date(startDate));
    const finish = new Date(endDate);
    const list: { start: Date; end: Date; label: string; dateLabel: string }[] = [];
    let cursor = start;
    while (cursor <= finish) {
      const bucketStart = startFn(cursor);
      const bucketEnd = step(bucketStart, 1);
      const { label, dateLabel } = formatBucketLabel(bucketStart, granularity);
      list.push({ start: bucketStart, end: bucketEnd, label, dateLabel });
      cursor = bucketEnd;
    }
    return list;
  }

  const now = new Date();
  let cursor = startFn(now);
  for (let i = 0; i < bucketCount - 1; i += 1) {
    cursor = step(cursor, -1);
  }

  const buckets: { start: Date; end: Date; label: string; dateLabel: string }[] = [];
  for (let i = 0; i < bucketCount; i += 1) {
    const bucketStart = startFn(cursor);
    const bucketEnd = step(bucketStart, 1);
    const { label, dateLabel } = formatBucketLabel(bucketStart, granularity);
    buckets.push({ start: bucketStart, end: bucketEnd, label, dateLabel });
    cursor = bucketEnd;
  }

  return buckets;
}

function assignToBucket(date: Date | null, buckets: { start: Date; end: Date }[]) {
  if (!date) return -1;
  return buckets.findIndex((bucket) => date >= bucket.start && date < bucket.end);
}

export async function fetchRevenueTrend(
  params: RevenueTrendQuery
): Promise<RevenueTrendResponse> {
  const { granularity, startDate, endDate } = params;
  const buckets = buildBuckets(granularity, startDate, endDate);

  const [{ data: contracts, error: contractsError }, { data: invoices, error: invoicesError }] = await Promise.all([
    supabase.from("contracts").select("contract_value, start_date, created_at"),
    supabase.from("invoices").select("cost, payment_date, created_at"),
  ]);

  if (contractsError) {
    throw new Error(contractsError.message);
  }
  if (invoicesError) {
    throw new Error(invoicesError.message);
  }

  const revenueBuckets = Array(buckets.length).fill(0);
  const costBuckets = Array(buckets.length).fill(0);

  (contracts ?? []).forEach((row) => {
    const contract = row as Contract;
    const contractDate =
      toDate(contract.start_date) ??
      toDate(contract.created_at);
    const bucketIndex = assignToBucket(contractDate, buckets);
    if (bucketIndex >= 0) {
      revenueBuckets[bucketIndex] += contract.contract_value ?? 0;
    }
  });

  (invoices ?? []).forEach((row) => {
    const invoice = row as Invoice;
    const invoiceDate =
      toDate(invoice.payment_date) ??
      toDate(invoice.created_at);
    const bucketIndex = assignToBucket(invoiceDate, buckets);
    if (bucketIndex >= 0) {
      costBuckets[bucketIndex] += invoice.cost ?? 0;
    }
  });

  const data: RevenuePoint[] = buckets.map((bucket, index) => ({
    label: bucket.label,
    dateLabel: bucket.dateLabel,
    dateValue: bucket.start.toISOString().slice(0, 10),
    revenue: revenueBuckets[index],
    cost: costBuckets[index],
  }));

  return {
    granularity,
    data,
  };
}
