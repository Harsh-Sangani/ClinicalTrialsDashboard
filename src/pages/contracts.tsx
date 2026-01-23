const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const contracts = [
  {
    id: "8dd4a1fa-7d4b-4344-8bd3-1001e1",
    studyNumber: "CT-1001",
    department: "Pulmonology",
    contractValue: 207000,
    balance: 26000,
    status: "Ongoing",
    startDate: "2023-05-21",
    endDate: "2024-01-21",
    createdAt: "2023-04-15",
  },
  {
    id: "8dd4a1fa-7d4b-4344-8bd3-1002e1",
    studyNumber: "CT-1008",
    department: "Neurology",
    contractValue: 229000,
    balance: 75000,
    status: "Ongoing",
    startDate: "2023-06-22",
    endDate: "2023-12-11",
    createdAt: "2023-05-05",
  },
  {
    id: "8dd4a1fa-7d4b-4344-8bd3-1003e1",
    studyNumber: "CT-1015",
    department: "Dermatology",
    contractValue: 199000,
    balance: 111000,
    status: "Finalized",
    startDate: "2023-06-26",
    endDate: "2024-08-28",
    createdAt: "2023-05-14",
  },
  {
    id: "8dd4a1fa-7d4b-4344-8bd3-1004e1",
    studyNumber: "CT-1024",
    department: "Oncology",
    contractValue: 452000,
    balance: 236000,
    status: "Ongoing",
    startDate: "2023-01-17",
    endDate: "2023-06-01",
    createdAt: "2022-12-05",
  },
  {
    id: "8dd4a1fa-7d4b-4344-8bd3-1005e1",
    studyNumber: "CT-1030",
    department: "Cardiology",
    contractValue: 516000,
    balance: 352000,
    status: "Finalized",
    startDate: "2023-12-26",
    endDate: "2025-01-28",
    createdAt: "2023-10-01",
  },
];

function ContractsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Contracts</h1>
        <p className="text-sm text-slate-500">
          Stay ahead of approvals and upcoming renewals.
        </p>
      </header>

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
          <tbody>
            {contracts.map((contract) => (
              <tr
                key={contract.id}
                className="border-t border-slate-100 text-slate-700"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {contract.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {contract.studyNumber}
                </td>
                <td className="px-4 py-3">{contract.department}</td>
                <td className="px-4 py-3">
                  {formatter.format(contract.contractValue)}
                </td>
                <td className="px-4 py-3">
                  {formatter.format(contract.balance)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">
                    {contract.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {contract.startDate}
                </td>
                <td className="px-4 py-3 text-slate-600">{contract.endDate}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(contract.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContractsPage;
