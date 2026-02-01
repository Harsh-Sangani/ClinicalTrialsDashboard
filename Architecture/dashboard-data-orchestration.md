# Dashboard Data Orchestration

## Goals
- Provide a single data pipeline for all widgets on the Clinical Trials dashboard.
- Reduce client round-trips by aggregating Supabase data on the server (or edge function) when possible.
- Keep calculations consistent across cards, alerts, and charts.

## Data Domains & Sources
| Domain | Source Tables | Key fields |
| --- | --- | --- |
| Contracts | contracts | status, contract_value, balance, start_date, end_date |
| Invoices | invoices | cost, payment_date, created_at, uploaded_by_email |
| Alerts | Derived rules | contract expiry window, invoice overdue window, low balance threshold |
| Revenue Trend | contracts + invoices | contract_value (booked revenue), cost (expenses) |
| Users | invoices | uploaded_by_email + last activity timestamp |

## API Surface
`
GET /api/dashboard/summary
  → contract summary, contract status breakdown, invoice summary, alerts, user status bubbles
GET /api/dashboard/revenue?granularity=daily&startDate=2026-01-01&endDate=2026-01-31
  → line chart points + totals for given window
`
Both endpoints can be implemented as Supabase edge functions or routed through Vite proxy. The current client calls helper functions that directly query Supabase; swapping to HTTP later only requires updating these helpers.

## Aggregation Rules
- **Contracts summary**: counts per status + sum of contract_value. Same dataset powers the "Contracts" card and the status bar.
- **Alerts**:
  - Expiring contracts: end_date within next 7 days.
  - Low balance: balance / contract_value ≤ 10%.
  - New contracts: created_at within the past 7 days.
  - Overdue invoices: payment_date is null and created_at older than 7 days.
- **User status**: compute last invoice upload per uploaded_by_email → Active (≤7d), Offline (8–30d), Inactive (>30d or never).
- **Revenue trend**: totalCost = sum of invoice cost per bucket; totalRevenue = sum of contract_value per bucket. Buckets exist for daily (7), weekly (8), monthly (12) plus arbitrary custom range.

## Client Data Flow
1. useDashboardSummary() fetches the summary endpoint with React Query → cards, alerts, user bubbles.
2. TotalRevenueChart manages timeframe state and invokes useRevenueTrend() with granularity + optional range; React Query caches each combination.
3. Hooks expose loading/error states; home.tsx renders placeholders accordingly.

## Caching & Refresh
- React Query cache TTL: 60s for summary, 30s for revenue trend.
- HTTP responses should set Cache-Control: public, max-age=30 when served by an API.
- Keep previous data while fetching to avoid layout jumps when toggling filters.

## Future Enhancements
- Move aggregation to Supabase Functions for server-side joins.
- Persist alert thresholds in a config table.
- Add websocket/push updates for near-real-time alerts.
