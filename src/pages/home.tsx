import { Fragment } from "react";

import { DashboardCard } from "@/components/dashboard-card";
import { cn } from "@/lib/utils";

const placeholderCount = {
  alerts: 4,
  metrics: 3,
};

const contractFilters = ["Daily", "Weekly", "Monthly", "Yearly"];
const contractStats = [
  { label: "Total Contracts", value: "20,045", color: "text-sky-400" },
  { label: "Total Amount", value: "$20,045", color: "text-brand-green" },
  { label: "Ongoing Contracts", value: "20,045", color: "text-amber-400" },
];

const contractStatusMetrics = [
  { label: "Contracts Finalized", value: 276, color: "bg-brand-green" },
  { label: "Ongoing Contracts", value: 405, color: "bg-amber-400" },
  { label: "Expired Contracts", value: 100, color: "bg-red-500" },
];

const invoiceStats = [
  { label: "Total Invoices", value: "20,045", color: "text-sky-400" },
  { label: "Total Amount", value: "$20,045", color: "text-brand-green" },
];

const userStatusBubbles = [
  {
    label: "Active",
    value: 10,
    color: "bg-brand-green",
    size: 160,
    className: "left-4 top-0 z-30",
  },
  {
    label: "Offline",
    value: 6,
    color: "bg-[#86D38F]",
    size: 130,
    className: "left-0 bottom-6 z-20",
  },
  {
    label: "Inactive",
    value: 2,
    color: "bg-slate-300",
    size: 110,
    className: "right-2 top-12 z-10",
  },
];

function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
      <DashboardCard
        title="Important Alerts"
        headerAlign="center"
        className="h-full min-h-[720px]"
      >
        <div className="flex h-full flex-col gap-4">
          {Array.from({ length: placeholderCount.alerts }).map((_, index) => (
            <div
              key={`alert-${index}`}
              className="space-y-3 rounded-2xl border border-dashed border-mint-200/70 bg-mint-50/70 px-4 py-5"
            >
              <div className="h-3 w-3/4 rounded-full bg-mint-200/80" />
              <div className="h-3 w-2/3 rounded-full bg-mint-100" />
              <div className="h-3 w-1/2 rounded-full bg-mint-100/70" />
            </div>
          ))}
        </div>
      </DashboardCard>

      <div className="space-y-6">
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
          <div className="flex h-full flex-col gap-6">
            <div className="flex flex-1 items-center justify-center">
              <div className="h-48 w-full rounded-[26px] border border-dashed border-mint-200/70 bg-gradient-to-br from-mint-50 via-white to-mint-100 shadow-inner" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: placeholderCount.metrics }).map((_, index) => (
                <div
                  key={`revenue-metric-${index}`}
                  className="space-y-2 rounded-2xl border border-dashed border-mint-200/80 bg-mint-50/70 px-4 py-3"
                >
                  <div className="h-3 w-1/2 rounded-full bg-mint-200" />
                  <div className="h-4 w-3/4 rounded-full bg-mint-100" />
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="space-y-6">
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
          className="min-h-[634px]"
          highlight={<span className="text-3xl font-black text-sky-400">18</span>}
        >
          <div className="flex h-full flex-col items-center justify-between gap-8">
            <div className="flex w-full flex-1 items-center justify-center">
              <div className="relative h-72 w-full max-w-[240px]">
                {userStatusBubbles.map((bubble) => (
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

            <div className="flex w-full flex-col gap-4 text-center">
              <div className="flex flex-wrap items-center justify-center gap-8 text-base font-semibold text-slate-800">
                {userStatusBubbles.map((bubble) => (
                  <div key={bubble.label} className="flex flex-col items-center gap-2">
                    <div className="text-2xl">{bubble.value}</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", bubble.color)}
                      />
                      <span>{bubble.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default HomePage;
