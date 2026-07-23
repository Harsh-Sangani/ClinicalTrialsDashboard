export function formatCurrencyCompact(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  const abs = Math.abs(value);
  let divisor = 1;
  let suffix = "";

  if (abs >= 1_000_000) {
    divisor = 1_000_000;
    suffix = "M";
  } else if (abs >= 1_000) {
    divisor = 1_000;
    suffix = "K";
  }

  const scaled = value / divisor;
  const formatted =
    scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1).replace(/\.0$/, "");

  return `$${formatted}${suffix}`;
}
