import { useContracts } from "@/hooks/useContracts";
import type { Contract } from "@/types/contracts";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ContractsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Contracts</h1>
        <p className="text-sm text-slate-500">
          Stay ahead of approvals and upcoming renewals.
        </p>
      </header>

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

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-slate-500" colSpan={9}>
            Loading contracts…
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-red-500" colSpan={9}>
            {error?.message ?? "Unable to load contracts"}
          </td>
        </tr>
      );
    }

    if (contracts.length === 0) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-slate-500" colSpan={9}>
            No contracts found
          </td>
        </tr>
      );
    }

    return contracts.map((contract) => (
      <ContractsRow key={contract.id} contract={contract} />
    ));
  };

  return (
    <div className="card overflow-hidden">
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
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
}

function ContractsRow({ contract }: { contract: Contract }) {
  return (
    <tr className="border-t border-slate-100 text-slate-700">
      <td className="px-4 py-3 font-mono text-xs text-slate-500">
        {contract.id.slice(0, 8)}…
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
    </tr>
  );
}
export default ContractsPage;
