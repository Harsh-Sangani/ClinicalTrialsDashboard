
import { useMemo, useState } from "react";

import { TableActions } from "@/components/table-actions";
import { TableToolbar } from "@/components/table-toolbar";
import { useContracts } from "@/hooks/useContracts";
import type { Contract } from "@/types/contracts";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const sortOptions = [
  { label: "Start Date (Newest)", value: "start_desc" },
  { label: "Start Date (Oldest)", value: "start_asc" },
  { label: "Contract Value (High-Low)", value: "value_desc" },
  { label: "Contract Value (Low-High)", value: "value_asc" },
];

const toDateValue = (value: string) => new Date(value).getTime();
const escapeCsvValue = (value: string | number | null | undefined) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

function ContractsPage() {
  return (
    <div className="space-y-4">
      <ContractsTable />
    </div>
  );
}

function ContractsTable() {
  const {
    data: contracts = [],
    isLoading,
    isError,
    error,
  } = useContracts();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(sortOptions[0].value);

  const filteredContracts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return contracts;
    }

    return contracts.filter((contract) =>
      [contract.department, contract.study_number, contract.status]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query))
    );
  }, [contracts, searchQuery]);

  const sortedContracts = useMemo(() => {
    const items = [...filteredContracts];
    return items.sort((a, b) => {
      switch (sortBy) {
        case "start_asc":
          return toDateValue(a.start_date) - toDateValue(b.start_date);
        case "value_desc":
          return b.contract_value - a.contract_value;
        case "value_asc":
          return a.contract_value - b.contract_value;
        case "start_desc":
        default:
          return toDateValue(b.start_date) - toDateValue(a.start_date);
      }
    });
  }, [filteredContracts, sortBy]);

  const handleExport = () => {
    if (sortedContracts.length === 0) {
      return;
    }

    const headers = [
      "Department",
      "Study Number",
      "Contract Value",
      "Balance",
      "Status",
      "Start Date",
      "End Date",
      "Created",
    ];

    const csvRows = sortedContracts.map((contract) => [
      contract.department,
      contract.study_number,
      formatter.format(contract.contract_value),
      formatter.format(contract.balance),
      contract.status,
      contract.start_date,
      contract.end_date,
      new Date(contract.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contracts-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNew = () => {
    console.log("TODO: open create contract flow");
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-slate-500" colSpan={10}>
            Loading contracts...
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-red-500" colSpan={10}>
            {error?.message ?? "Unable to load contracts"}
          </td>
        </tr>
      );
    }

    if (sortedContracts.length === 0) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-slate-500" colSpan={10}>
            No contracts found
          </td>
        </tr>
      );
    }

    return sortedContracts.map((contract) => (
      <ContractsRow key={contract.id} contract={contract} />
    ));
  };

  return (
    <div className="space-y-3">
      <div className="py-3">
        <TableToolbar
          searchPlaceholder="Search contracts"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          onExport={handleExport}
          disableExport={sortedContracts.length === 0}
          addButtonLabel="Add New Contract"
          onAdd={handleAddNew}
        />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Study #</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Contract Value ($)</th>
                <th className="px-4 py-3">Balance ($)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Created</th>
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

function ContractsRow({ contract }: { contract: Contract }) {
  return (
    <tr className="border-t border-slate-100 text-slate-700">
      <td className="px-4 py-3 font-mono text-xs text-slate-500">
        {contract.id.slice(0, 8)}...
      </td>
      <td className="px-4 py-3 font-semibold text-slate-900">
        {contract.study_number}
      </td>
      <td className="px-4 py-3">{contract.department}</td>
      <td className="px-4 py-3">{formatter.format(contract.contract_value)}</td>
      <td className="px-4 py-3">{formatter.format(contract.balance)}</td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">
          {contract.status}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">{contract.start_date}</td>
      <td className="px-4 py-3 text-slate-600">{contract.end_date}</td>
      <td className="px-4 py-3 text-slate-500">
        {new Date(contract.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <TableActions />
      </td>
    </tr>
  );
}

export default ContractsPage;
