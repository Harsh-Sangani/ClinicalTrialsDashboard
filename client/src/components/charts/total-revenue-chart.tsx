import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRevenueTrend } from "@/hooks/useRevenueTrend";
import { cn } from "@/lib/utils";
import type {
  RevenueGranularity,
  RevenuePoint,
  RevenueTrendQuery,
} from "@/types/dashboard";

type DateRange = { start: string; end: string };
type BaseTimeframeValue = RevenueGranularity;
type TimeframeValue = RevenueGranularity | "custom";

const timeframeOptions: { label: string; value: TimeframeValue }[] = [
  { label: "D", value: "daily" },
  { label: "W", value: "weekly" },
  { label: "M", value: "monthly" },
  { label: "Custom", value: "custom" },
];

const currencyFormatter = (value: number) => `$${Math.round(value / 1_000)}k`;

type RevenueTooltipPayload = {
  value: number;
  color: string;
  name: string;
  payload: RevenuePoint;
};

type RevenueTooltipProps = {
  active?: boolean;
  payload?: RevenueTooltipPayload[];
  label?: string;
};

const customRangeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function getDefaultRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export function TotalRevenueChart() {
  const [timeframe, setTimeframe] = useState<TimeframeValue>("monthly");
  const [customRange, setCustomRange] = useState<DateRange>(getDefaultRange);
  const [pendingRange, setPendingRange] = useState<DateRange>(getDefaultRange);
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);

  const activeGranularity: BaseTimeframeValue =
    timeframe === "custom" ? "monthly" : timeframe;

  const revenueQuery = useMemo<RevenueTrendQuery>(() => {
    if (timeframe === "custom") {
      return {
        granularity: "monthly",
        startDate: customRange.start,
        endDate: customRange.end,
      };
    }
    return { granularity: activeGranularity };
  }, [activeGranularity, customRange.end, customRange.start, timeframe]);

  const { data, isFetching, isError } = useRevenueTrend(revenueQuery);
  const chartData = data?.data ?? [];

  const pendingIsValid =
    Boolean(pendingRange.start) &&
    Boolean(pendingRange.end) &&
    new Date(pendingRange.start).getTime() <=
      new Date(pendingRange.end).getTime();

  const customRangeSummary =
    timeframe === "custom" && customRange.start && customRange.end
      ? `${formatRangeDate(customRange.start)} — ${formatRangeDate(customRange.end)}`
      : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-5 font-semibold text-slate-500">
          <LegendPill label="Total Cost" color="bg-red-500" textColor="text-red-500" />
          <LegendPill
            label="Total Revenue"
            color="bg-brand-green"
            textColor="text-brand-green"
          />
        </div>

        <div className="relative flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 rounded-full border px-4 text-xs font-semibold transition",
                  (option.value === timeframe ||
                    (option.value === "custom" && isCustomPickerOpen))
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                )}
                onClick={() => {
                  if (option.value === "custom") {
                    setPendingRange(customRange);
                    setIsCustomPickerOpen((prev) => !prev);
                    return;
                  }
                  setTimeframe(option.value);
                  setIsCustomPickerOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === "custom" ? (
                  <ChevronDown className="ml-1 h-4 w-4" />
                ) : null}
              </Button>
            ))}
          </div>

          {customRangeSummary ? (
            <span className="text-slate-400">Showing {customRangeSummary}</span>
          ) : null}

          {isCustomPickerOpen ? (
            <div className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold text-slate-800">Custom range</p>
              <p className="text-xs text-slate-500">
                Pick a start and end date to refine totals.
              </p>
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Start date
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    value={pendingRange.start}
                    max={pendingRange.end || undefined}
                    onChange={(event) =>
                      setPendingRange((prev) => ({
                        ...prev,
                        start: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  End date
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    value={pendingRange.end}
                    min={pendingRange.start || undefined}
                    onChange={(event) =>
                      setPendingRange((prev) => ({
                        ...prev,
                        end: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCustomPickerOpen(false);
                    setPendingRange(customRange);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!pendingIsValid}
                  onClick={() => {
                    if (!pendingIsValid) {
                      return;
                    }
                    setCustomRange(pendingRange);
                    setTimeframe("custom");
                    setIsCustomPickerOpen(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="h-[220px] w-full">
        {isError ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/60 text-sm text-red-500">
            Unable to load revenue data.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-mint-200/80 bg-mint-50/60 text-sm text-slate-500">
            {isFetching ? "Loading revenue…" : "No data for the selected range."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis
                dataKey="label"
                tickLine={{ stroke: "#E2E8F0" }}
                axisLine={{ stroke: "#94A3B8" }}
                tickMargin={12}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={currencyFormatter}
                tickLine={{ stroke: "#E2E8F0" }}
                axisLine={{ stroke: "#94A3B8" }}
                width={68}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />
              <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#CBD5F5" }} />
              <Line
                type="linear"
                dataKey="cost"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#ef4444" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                type="linear"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#16a34a" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function RevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="min-w-[140px] rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-xs font-semibold text-slate-600 shadow-lg backdrop-blur">
      <p className="mb-2 text-sm text-slate-800">{label}</p>
      {point?.dateLabel ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {point.dateLabel}
        </p>
      ) : null}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span>{currencyFormatter(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendPill({
  label,
  color,
  textColor,
}: {
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <span className={cn("flex items-center gap-2 text-sm", textColor)}>
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function formatRangeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return customRangeFormatter.format(date);
}
