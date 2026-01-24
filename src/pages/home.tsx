import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const placeholderCount = {
  alerts: 4,
  metrics: 3,
  statuses: 4,
  invoices: 3,
};

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
        <DashboardCard title="Contracts" className="min-h-[208px]">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: placeholderCount.metrics }).map((_, index) => (
              <div
                key={`contract-metric-${index}`}
                className="space-y-3 rounded-2xl border border-dashed border-mint-200/80 bg-mint-50/60 px-4 py-4"
              >
                <div className="h-3 w-2/3 rounded-full bg-mint-200" />
                <div className="h-6 w-3/4 rounded-full bg-mint-100" />
                <div className="h-3 w-1/3 rounded-full bg-mint-100/70" />
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Contracts Status" className="min-h-[250px]">
          <div className="space-y-5">
            {Array.from({ length: placeholderCount.statuses }).map((_, index) => (
              <div key={`status-${index}`} className="flex items-center gap-4">
                <div className="h-3 w-24 rounded-full bg-mint-100" />
                <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-brand-green/40 via-mint-200/60 to-brand-navy/40" />
                <div className="h-3 w-10 rounded-full bg-mint-100/70" />
              </div>
            ))}
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
        <DashboardCard title="Invoices" headerAlign="center" className="min-h-[208px]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full border border-dashed border-mint-200/70 bg-mint-50" />
            {Array.from({ length: placeholderCount.invoices }).map((_, index) => (
              <div key={`invoice-${index}`} className="h-3 w-32 rounded-full bg-mint-100/80" />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Total Users"
          className="min-h-[634px]"
          highlight={<span className="text-3xl font-black text-sky-400">18</span>}
        >
          <div className="flex h-full flex-col gap-6">
            <div className="space-y-3 rounded-3xl border border-dashed border-mint-200/80 bg-mint-50/70 px-5 py-6">
              <div className="h-4 w-3/5 rounded-full bg-mint-200" />
              <div className="h-4 w-1/2 rounded-full bg-mint-100" />
              <div className="h-3 w-2/3 rounded-full bg-mint-100/70" />
            </div>
            <div className="flex flex-1 flex-col justify-end">
              <div className="h-full rounded-[26px] border border-dashed border-mint-200/70 bg-gradient-to-b from-mint-50 via-white to-mint-100" />
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  children?: ReactNode;
  className?: string;
  headerAlign?: "start" | "center";
  highlight?: ReactNode;
};

function DashboardCard({
  title,
  children,
  className,
  headerAlign = "start",
  highlight,
}: DashboardCardProps) {
  const headerClasses =
    headerAlign === "center"
      ? "flex-col items-center justify-center gap-2 text-center"
      : "flex-row items-center justify-between gap-3";

  return (
    <section
      className={cn(
        "flex flex-col rounded-[20px] border border-black/10 bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      <div className={cn("flex px-6 py-4", headerClasses)}>
        <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
        {highlight}
      </div>
      {children ? <div className="flex-1 px-6 pb-6 pt-2">{children}</div> : null}
    </section>
  );
}

export default HomePage;
