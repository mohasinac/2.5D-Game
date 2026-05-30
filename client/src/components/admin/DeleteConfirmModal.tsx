import { useState } from "react";

interface Props {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmModal({ isOpen, itemName, onConfirm, onCancel }: Props) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); } finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-bg1 border border-border-c rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-theme-text font-bold text-lg mb-2">Confirm Delete</h2>
        <p className="text-theme-muted text-sm mb-5">
          Delete <span className="text-theme-text font-mono font-semibold">"{itemName}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 bg-bg2 border border-border-c text-theme-muted rounded-lg text-sm font-medium hover:text-theme-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
