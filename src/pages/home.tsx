import { Fragment, useMemo } from "react";
import { TotalRevenueChart } from "@/components/charts/total-revenue-chart";
import { DashboardCard } from "@/components/dashboard-card";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { formatCurrencyCompact } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/types/dashboard";

const contractFilters = ["Daily", "Weekly", "Monthly", "Yearly"];
const bubbleLayouts = [
  { size: 180, className: "left-0 top-0 z-30" },
  { size: 140, className: "left-4 bottom-8 z-20" },
  { size: 110, className: "right-0 top-24 z-10" },
];

function HomePage() {
  const { data, isLoading, isError } = useDashboardSummary();

  const contractStats = useMemo(
    () => [
      {
        label: "Total Contracts",
        value: data ? data.contracts.totalContracts.toLocaleString() : "—",
        color: "text-sky-400",
      },
      {
        label: "Total Amount",
        value: data ? formatCurrencyCompact(data.contracts.totalAmount) : "—",
        color: "text-brand-green",
      },
      {
        label: "Ongoing Contracts",
        value: data ? data.contracts.ongoingContracts.toLocaleString() : "—",
        color: "text-amber-400",
      },
    ],
    [data]
  );

  const contractStatusMetrics = useMemo(
    () => [
      {
        label: "Contracts Finalized",
        value: data?.contractStatus.finalized ?? 0,
        color: "bg-brand-green",
      },
      {
        label: "Ongoing Contracts",
        value: data?.contractStatus.ongoing ?? 0,
        color: "bg-amber-400",
      },
      {
        label: "Expired Contracts",
        value: data?.contractStatus.expired ?? 0,
        color: "bg-red-500",
      },
    ],
    [
      data?.contractStatus.expired,
      data?.contractStatus.finalized,
      data?.contractStatus.ongoing,
    ]
  );

  const invoiceStats = useMemo(
    () => [
      {
        label: "Total Invoices",
        value: data ? data.invoices.totalInvoices.toLocaleString() : "—",
        color: "text-sky-400",
      },
      {
        label: "Total Amount",
        value: data ? formatCurrencyCompact(data.invoices.totalAmount) : "—",
        color: "text-brand-green",
      },
    ],
    [data]
  );

  const userStatusMetrics = data?.userStatus.metrics ?? [
    { label: "Active", value: 0, color: "bg-brand-green" },
    { label: "Offline", value: 0, color: "bg-[#86D38F]" },
    { label: "Inactive", value: 0, color: "bg-slate-300" },
  ];

  const positionedUserBubbles = useMemo(
    () =>
      [...userStatusMetrics]
        .sort((a, b) => b.value - a.value)
        .map((metric, index) => ({
          ...metric,
          size: bubbleLayouts[index]?.size ?? 140,
          className: bubbleLayouts[index]?.className ?? "left-0 top-0",
        })),
    [userStatusMetrics]
  );

  const alerts = data?.alerts ?? [];

  return (
    <div className="grid h-[820px] gap-6 pb-10 lg:grid-cols-[320px_minmax(0,1fr)_320px] lg:items-end">
      <DashboardCard
        title="Important Alerts"
        headerAlign="center"
        className="h-full min-h-[620px] overflow-hidden"
      >
        <div className="flex h-full min-h-0 flex-col">
          {isLoading ? (
            <div className="flex flex-1 flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`alert-skeleton-${index}`}
                  className="h-16 animate-pulse rounded-xl bg-mint-100/70"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-1 items-center justify-center text-sm text-red-500">
              Failed to load alerts.
            </div>
          ) : (
            <ol className="scrollbar-left flex-1 divide-y divide-slate-100 overflow-y-auto pr-2">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <SeverityIcon severity={alert.severity} />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm leading-snug text-slate-700">
                      {alert.title.map((segment, segmentIndex) => (
                        <span
                          key={`${alert.id}-segment-${segmentIndex}`}
                          className={cn(
                            segment.emphasis ? "font-semibold text-slate-900" : "",
                            segment.className
                          )}
                        >
                          {segment.text}
                        </span>
                      ))}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {alert.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DashboardCard>

      <div className="flex h-full flex-col gap-6">
        <DashboardCard title="Contracts" className="pb-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
              {contractStats.map((stat, index) => (
                <Fragment key={stat.label}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <p className="text-base text-slate-600">{stat.label}</p>
                    <p className={cn("text-3xl font-extrabold", stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                  {index < contractStats.length - 1 ? (
                    <div className="hidden h-14 w-px bg-slate-200 md:block" />
                  ) : null}
                </Fragment>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Contracts Status" className="min-h-[250px]">
          <div className="space-y-6">
            <div className="flex gap-4 text-center text-sm font-semibold text-slate-500">
              {contractFilters.map((filter, index) => (
                <span
                  key={filter}
                  className={cn(
                    "py-1 transition",
                    index === 0 ? "text-slate-900" : "text-slate-400"
                  )}
                >
                  {filter}
                </span>
              ))}
            </div>

            <div className="flex h-[30px] gap-1.5">
              {contractStatusMetrics.map((metric) => {
                const flexValue = Math.max(metric.value, 1);

                return (
                  <div
                    key={metric.label}
                    className={cn("h-full rounded-[10px]", metric.color)}
                    style={{ flex: flexValue }}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-10 text-center">
              {contractStatusMetrics.map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <p className="text-3xl font-black text-slate-900">
                    {metric.value.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-base text-slate-600">
                    <span className={cn("h-2.5 w-2.5 rounded-full", metric.color)} />
                    <span>{metric.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Total Revenue" className="min-h-[364px]">
          <TotalRevenueChart />
        </DashboardCard>
      </div>

      <div className="flex h-full flex-col gap-6">
        <DashboardCard title="Invoices">
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-evenly">
            {invoiceStats.map((stat, index) => (
              <Fragment key={stat.label}>
                <div className="flex flex-col items-center gap-3 text-center">
                  <p className="text-base text-slate-600">{stat.label}</p>
                  <p className={cn("text-3xl font-extrabold", stat.color)}>
                    {stat.value}
                  </p>
                </div>
                {index < invoiceStats.length - 1 ? (
                  <div className="hidden h-14 w-px bg-slate-200 md:block" />
                ) : null}
              </Fragment>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Total Users"
          className="h-full flex-1"
          highlight={
            <span className="text-3xl font-black text-sky-400">
              {data ? data.userStatus.totalUsers : "—"}
            </span>
          }
        >
          <div className="flex flex-col items-center justify-between gap-8 py-6">
            {isLoading ? (
              <div className="h-72 w-72 animate-pulse rounded-full bg-mint-100/70" />
            ) : (
              <div className="flex w-full flex-1 items-center justify-center">
                <div className="relative h-80 w-full max-w-[240px]">
                  {positionedUserBubbles.map((bubble) => (
                    <div
                      key={bubble.label}
                      className={cn(
                        "absolute flex items-center justify-center rounded-full text-3xl font-black text-slate-800 shadow-soft ring-4 ring-white/70",
                        bubble.color,
                        bubble.className
                      )}
                      style={{
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                      }}
                    >
                      {bubble.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-700">
              {userStatusMetrics.map((status) => (
                <div key={status.label} className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", status.color)} />
                  <span>{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  switch (severity) {
    case "warning":
      return (
        <TriangleAlertIcon
          fill="#FACC15"
          ariaLabel="Warning alert"
          className="text-amber-500"
        />
      );
    case "danger":
      return (
        <TriangleAlertIcon
          fill="#EF4444"
          ariaLabel="Critical alert"
          className="text-red-500"
        />
      );
    case "info":
      return (
        <TriangleAlertIcon
          fill="#A5B4FC"
          ariaLabel="Info alert"
          className="text-indigo-500"
        />
      );
    case "success":
    default:
      return <DocumentAddedIcon ariaLabel="New contract alert" />;
  }
}

function TriangleAlertIcon({
  fill,
  ariaLabel,
  className,
}: {
  fill: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center",
        className
      )}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <path d="M20 4L37 36H3L20 4Z" fill={fill} />
        <rect x="18.4" y="14" width="3.2" height="12" rx="1.6" fill="white" />
        <circle cx="20" cy="28.5" r="1.6" fill="white" />
      </svg>
    </span>
  );
}

function DocumentAddedIcon({ ariaLabel }: { ariaLabel: string }) {
  return (
    <span
      className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center"
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <path
          d="M13 5h14l7 7v19a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4Z"
          fill="#34D399"
        />
        <path d="M27 5v8h8" fill="#4ADE80" />
        <path
          d="M20 18v5m0 0v5m0-5h5m-5 0h-5"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default HomePage;
