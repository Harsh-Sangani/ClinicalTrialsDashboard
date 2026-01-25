import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type DashboardCardProps = {
  title: string;
  children?: ReactNode;
  className?: string;
  headerAlign?: "start" | "center";
  highlight?: ReactNode;
};

export function DashboardCard({
  title,
  children,
  className,
  headerAlign = "start",
  highlight,
}: DashboardCardProps) {
  const headerClasses =
    headerAlign === "center"
      ? "flex-col items-center justify-center gap-2 text-center"
      : "flex-row items-center gap-3";

  const titleClasses =
    headerAlign === "center"
      ? "text-center"
      : "flex-1 text-center";

  return (
    <section
      className={cn(
        "flex flex-col rounded-[20px] border border-black/10 bg-white px-8 pb-8 shadow-[0_0_20px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      <div className={cn("flex py-5", headerClasses)}>
        <h2 className={cn("text-lg font-semibold text-slate-700", titleClasses)}>
          {title}
        </h2>
        {highlight}
      </div>
      {children ? <div>{children}</div> : null}
    </section>
  );
}
