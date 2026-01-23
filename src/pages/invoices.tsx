const invoices = [
  {
    number: "INV-3201",
    sponsor: "Atria Oncology",
    amount: "$24,500",
    status: "Sent",
    due: "Jan 24",
  },
  {
    number: "INV-3200",
    sponsor: "Northwind Pharma",
    amount: "$68,850",
    status: "Approved",
    due: "Jan 18",
  },
  {
    number: "INV-3198",
    sponsor: "Helix Labs",
    amount: "$12,400",
    status: "Paid",
    due: "Jan 9",
  },
];

function InvoicesPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Invoices</h1>
        <p className="text-sm text-slate-500">
          Cash flow at a glance with current approvals.
        </p>
      </header>

      <div className="card space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.number}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {invoice.number} · {invoice.sponsor}
              </p>
              <p className="text-xs text-slate-500">Due {invoice.due}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {invoice.amount}
              </p>
              <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-900">
                {invoice.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoicesPage;