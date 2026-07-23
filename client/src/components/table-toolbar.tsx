
import { ArrowUpDown, Download, Plus, Search } from "lucide-react";

type SortOption = {
  label: string;
  value: string;
};

type TableToolbarProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  addButtonLabel: string;
  onAdd?: () => void;
  onExport?: () => void;
  disableExport?: boolean;
};

export function TableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
  addButtonLabel,
  onAdd,
  onExport,
  disableExport,
}: TableToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-6 lg:w-auto">
        <label className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 shadow-[0_0_3px_rgba(0,0,0,0.5)] md:w-[300px]">
          <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span className="sr-only">Search table rows</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full border-none items-center bg-transparent text-sm font-regular text-slate-900 placeholder:text-slate-500 focus:outline-none"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </label>

        <label className="flex items-center gap-1 text-sm font-medium text-slate-900 md:w-auto">
          <span className="sr-only">Sort table</span>
          <ArrowUpDown className="h-4 w-4 text-black" aria-hidden="true" />
          <div className="relative flex items-center">
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="appearance-none bg-transparent pr-6 text-base font-medium text-black focus:outline-none"
              aria-label="Sort table"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

          </div>
        </label>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 lg:justify-end">
        <button
          type="button"
          onClick={onExport}
          disabled={disableExport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow-[0_0_5px_rgba(0,0,0,0.5)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          <Download className="h-4 w-4 text-black" aria-hidden="true" />
          Export Table
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-black shadow-[0_0_5px_rgba(0,0,0,0.5)] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy md:w-auto"
        >
          <Plus className="h-4 w-4 text-black" aria-hidden="true" />
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}
