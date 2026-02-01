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
import { cn } from "@/lib/utils";

type RevenuePoint = {
  label: string;
  revenue: number;
  cost: number;
  date?: string;
  dateValue: string;
};

type DateRange = {
  start: string;
  end: string;
};

type BaseTimeframeValue = "daily" | "weekly" | "monthly";
type TimeframeValue = BaseTimeframeValue | "custom";

const timeframeOptions: { label: string; value: TimeframeValue }[] = [
  { label: "D", value: "daily" },
  { label: "W", value: "weekly" },
  { label: "M", value: "monthly" },
  { label: "Custom", value: "custom" },
];

const revenueDataByTimeframe: Record<BaseTimeframeValue, RevenuePoint[]> = {
  daily: [
    {
      label: "Mon",
      date: "Jan 05, 2026",
      dateValue: "2026-01-05",
      revenue: 210_000,
      cost: 180_000,
    },
    {
      label: "Tue",
      date: "Jan 06, 2026",
      dateValue: "2026-01-06",
      revenue: 235_000,
      cost: 190_000,
    },
    {
      label: "Wed",
      date: "Jan 07, 2026",
      dateValue: "2026-01-07",
      revenue: 248_000,
      cost: 207_000,
    },
    {
      label: "Thu",
      date: "Jan 08, 2026",
      dateValue: "2026-01-08",
      revenue: 260_000,
      cost: 215_000,
    },
    {
      label: "Fri",
      date: "Jan 09, 2026",
      dateValue: "2026-01-09",
      revenue: 255_000,
      cost: 210_000,
    },
    {
      label: "Sat",
      date: "Jan 10, 2026",
      dateValue: "2026-01-10",
      revenue: 240_000,
      cost: 205_000,
    },
    {
      label: "Sun",
      date: "Jan 11, 2026",
      dateValue: "2026-01-11",
      revenue: 230_000,
      cost: 200_000,
    },
  ],
  weekly: [
    {
      label: "W1",
      date: "Jan 01-07, 2026",
      dateValue: "2026-01-01",
      revenue: 320_000,
      cost: 290_000,
    },
    {
      label: "W2",
      date: "Jan 08-14, 2026",
      dateValue: "2026-01-08",
      revenue: 350_000,
      cost: 310_000,
    },
    {
      label: "W3",
      date: "Jan 15-21, 2026",
      dateValue: "2026-01-15",
      revenue: 410_000,
      cost: 360_000,
    },
    {
      label: "W4",
      date: "Jan 22-28, 2026",
      dateValue: "2026-01-22",
      revenue: 430_000,
      cost: 375_000,
    },
    {
      label: "W5",
      date: "Jan 29-Feb 04, 2026",
      dateValue: "2026-01-29",
      revenue: 455_000,
      cost: 395_000,
    },
    {
      label: "W6",
      date: "Feb 05-11, 2026",
      dateValue: "2026-02-05",
      revenue: 470_000,
      cost: 410_000,
    },
    {
      label: "W7",
      date: "Feb 12-18, 2026",
      dateValue: "2026-02-12",
      revenue: 440_000,
      cost: 390_000,
    },
    {
      label: "W8",
      date: "Feb 19-25, 2026",
      dateValue: "2026-02-19",
      revenue: 420_000,
      cost: 370_000,
    },
  ],
  monthly: [
    {
      label: "Jan",
      date: "Jan 2026",
      dateValue: "2026-01-01",
      revenue: 260_000,
      cost: 210_000,
    },
    {
      label: "Feb",
      date: "Feb 2026",
      dateValue: "2026-02-01",
      revenue: 310_000,
      cost: 250_000,
    },
    {
      label: "Mar",
      date: "Mar 2026",
      dateValue: "2026-03-01",
      revenue: 390_000,
      cost: 320_000,
    },
    {
      label: "Apr",
      date: "Apr 2026",
      dateValue: "2026-04-01",
      revenue: 350_000,
      cost: 280_000,
    },
    {
      label: "May",
      date: "May 2026",
      dateValue: "2026-05-01",
      revenue: 270_000,
      cost: 200_000,
    },
    {
      label: "Jun",
      date: "Jun 2026",
      dateValue: "2026-06-01",
      revenue: 360_000,
      cost: 260_000,
    },
    {
      label: "Jul",
      date: "Jul 2026",
      dateValue: "2026-07-01",
      revenue: 420_000,
      cost: 330_000,
    },
    {
      label: "Aug",
      date: "Aug 2026",
      dateValue: "2026-08-01",
      revenue: 500_000,
      cost: 460_000,
    },
    {
      label: "Sep",
      date: "Sep 2026",
      dateValue: "2026-09-01",
      revenue: 480_000,
      cost: 450_000,
    },
    {
      label: "Oct",
      date: "Oct 2026",
      dateValue: "2026-10-01",
      revenue: 430_000,
      cost: 400_000,
    },
    {
      label: "Nov",
      date: "Nov 2026",
      dateValue: "2026-11-01",
      revenue: 380_000,
      cost: 360_000,
    },
    {
      label: "Dec",
      date: "Dec 2026",
      dateValue: "2026-12-01",
      revenue: 460_000,
      cost: 420_000,
    },
  ],
};

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
  const monthly = revenueDataByTimeframe.monthly;
  return {
    start: monthly[0]?.dateValue ?? "",
    end: monthly[monthly.length - 1]?.dateValue ?? "",
  };
}

export function TotalRevenueChart() {
  const [timeframe, setTimeframe] = useState<TimeframeValue>("monthly");
  const [customRange, setCustomRange] = useState<DateRange>(getDefaultRange);
  const [pendingRange, setPendingRange] = useState<DateRange>(getDefaultRange);
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);

  const customFilteredData = useMemo(
    () => filterDataByRange(revenueDataByTimeframe.monthly, customRange),
    [customRange]
  );

  const chartData = useMemo(() => {
    if (timeframe === "custom") {
      return customFilteredData;
    }
    return revenueDataByTimeframe[timeframe];
  }, [timeframe, customFilteredData]);

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

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 24, left: 8, bottom: 0 }}
          >
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
      {point?.date ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {point.date}
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

function filterDataByRange(data: RevenuePoint[], range: DateRange) {
  if (!range.start || !range.end) {
    return data;
  }

  const startTime = new Date(range.start).getTime();
  const endTime = new Date(range.end).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return data;
  }

  const filtered = data.filter((point) => {
    const pointTime = new Date(point.dateValue).getTime();
    return pointTime >= startTime && pointTime <= endTime;
  });

  return filtered.length ? filtered : data;
}

function formatRangeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return customRangeFormatter.format(date);
}
