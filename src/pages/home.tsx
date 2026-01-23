import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Active Trials",
    value: "42",
    change: "+8% vs last quarter",
  },
  {
    title: "Contracts in Review",
    value: "13",
    change: "5 awaiting signature",
  },
  {
    title: "Invoices Pending",
    value: "$128K",
    change: "Avg. 12 day turnaround",
  },
];

const sections = [
  {
    title: "Compliance snapshot",
    icon: ShieldCheck,
    body:
      "All key regulatory documents are up to date. 3 monitoring visits scheduled within the next 30 days.",
  },
  {
    title: "Contract milestones",
    icon: FileText,
    body:
      "Renewals for oncology programs begin next month. Align finance and legal stakeholders before sending drafts.",
  },
];

function HomePage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Portfolio pulse
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Clinical trials dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Track contracts, invoices, and study operations in one collaborative workspace.
            </p>
          </div>
          <Button className="gap-2 rounded-full px-5">
            Create report
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {item.title}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{item.change}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map(({ title, icon: Icon, body }) => (
          <div key={title} className="card h-full">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-900/5 p-2">
                <Icon className="h-4 w-4 text-slate-900" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
