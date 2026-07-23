
import { useMemo, useState } from "react";

import { TableActions } from "@/components/table-actions";
import { TableToolbar } from "@/components/table-toolbar";
import { useInvoices } from "@/hooks/useInvoices";
import type { Invoice } from "@/types/invoices";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const sortOptions = [
  { label: "Payment Date (Newest)", value: "payment_desc" },
  { label: "Payment Date (Oldest)", value: "payment_asc" },
  { label: "Cost (High-Low)", value: "cost_desc" },
  { label: "Cost (Low-High)", value: "cost_asc" },
];

const dateValue = (value?: string | null) => (value ? new Date(value).getTime() : 0);
const escapeCsvValue = (value: string | number | null | undefined) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

function InvoicesPage() {
  return (
    <div className="space-y-4">
      <InvoicesTable />
    </div>
  );
}

function InvoicesTable() {
  const {
    data: invoices = [],
    isLoading,
    isError,
    error,
  } = useInvoices();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(sortOptions[0].value);

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      [
        invoice.department,
        invoice.study_number,
        invoice.invoice_number,
        invoice.contract_number,
        invoice.uploaded_by_email,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query))
    );
  }, [invoices, searchQuery]);

  const sortedInvoices = useMemo(() => {
    const list = [...filteredInvoices];
    return list.sort((a, b) => {
      switch (sortBy) {
        case "payment_asc":
          return dateValue(a.payment_date) - dateValue(b.payment_date);
        case "cost_desc":
          return b.cost - a.cost;
        case "cost_asc":
          return a.cost - b.cost;
        case "payment_desc":
        default:
          return dateValue(b.payment_date) - dateValue(a.payment_date);
      }
    });
  }, [filteredInvoices, sortBy]);

  const handleExport = () => {
    if (sortedInvoices.length === 0) {
      return;
    }

    const headers = [
      "Department",
      "Study Number",
      "Invoice Number",
      "Invoice Description",
      "Cost",
      "Contract Number",
      "Payment Date",
      "User",
    ];

    const csvRows = sortedInvoices.map((invoice) => [
      invoice.department,
      invoice.study_number,
      invoice.invoice_number,
      invoice.invoice_description ?? "",
      currencyFormatter.format(invoice.cost),
      invoice.contract_number,
      invoice.payment_date
        ? new Date(invoice.payment_date).toLocaleDateString()
        : "",
      invoice.uploaded_by_email,
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNew = () => {
    console.log("TODO: open create invoice flow");
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-slate-500" colSpan={9}>
            Loading invoices...
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-red-500" colSpan={9}>
            {error?.message ?? "Unable to load invoices"}
          </td>
        </tr>
      );
    }

    if (sortedInvoices.length === 0) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-slate-500" colSpan={9}>
            No invoices found
          </td>
        </tr>
      );
    }

    return sortedInvoices.map((invoice) => (
      <InvoicesRow key={invoice.id} invoice={invoice} />
    ));
  };

  return (
    <div className="space-y-3">
      <div className="py-3">
        <TableToolbar
          searchPlaceholder="Search invoices"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          onExport={handleExport}
          disableExport={sortedInvoices.length === 0}
          addButtonLabel="Add New Invoice"
          onAdd={handleAddNew}
        />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Study Number</th>
                <th className="px-4 py-3">Invoice Number</th>
                <th className="px-4 py-3">Invoice Description</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Contract Number</th>
                <th className="px-4 py-3">Payment Date</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{renderBody()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InvoicesRow({ invoice }: { invoice: Invoice }) {
  return (
    <tr className="border-t border-slate-100 text-slate-700">
      <td className="px-4 py-3 text-slate-900">{invoice.department}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">
        {invoice.study_number}
      </td>
      <td className="px-4 py-3 font-semibold text-slate-900">
        {invoice.invoice_number}
      </td>
      <td className="px-4 py-3 text-slate-600">
        {invoice.invoice_description ?? "—"}
      </td>
      <td className="px-4 py-3">
        {currencyFormatter.format(invoice.cost)}
      </td>
      <td className="px-4 py-3 text-slate-600">{invoice.contract_number}</td>
      <td className="px-4 py-3 text-slate-600">
        {invoice.payment_date
          ? new Date(invoice.payment_date).toLocaleDateString()
          : "—"}
      </td>
      <td className="px-4 py-3 text-slate-600">
        {invoice.uploaded_by_email}
      </td>
      <td className="px-4 py-3">
        <TableActions />
      </td>
    </tr>
  );
}

export default InvoicesPage;
