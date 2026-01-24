import { Pencil, Trash2 } from "lucide-react";

type TableActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label="Edit"
        onClick={onEdit}
        className="inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Delete"
        onClick={onDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-500 text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
