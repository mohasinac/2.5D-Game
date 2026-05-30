import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { useAdminList } from "@/hooks/useAdminList";

export interface RPGListColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export interface RPGListConfig<T extends { id: string }> {
  collectionId: string;
  title: string;
  subtitle?: (count: number) => string;
  icon?: string;
  createPath: string;
  editPath: (id: string) => string;
  backPath?: string;
  backLabel?: string;
  columns: RPGListColumn<T>[];
  searchKeys?: (keyof T)[];
}

interface Props<T extends { id: string }> {
  config: RPGListConfig<T>;
}

export function RPGListPage<T extends { id: string }>({ config }: Props<T>) {
  const { collectionId, title, subtitle, createPath, editPath, backPath, backLabel, columns, searchKeys = [] } = config;
  const { pagedItems, filteredItems, isLoading, search, setSearch, page, totalPages, nextPage, prevPage, deleteItem } = useAdminList<T>({ collectionId, searchFields: searchKeys as (keyof T)[] });
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);

  const crumbs = [
    { label: "Admin", path: "/admin" },
    ...(backPath && backLabel ? [{ label: backLabel, path: backPath }] : []),
    { label: title },
  ];

  return (
    <div className="p-4 sm:p-6 w-full">
      <AdminBreadcrumbs crumbs={crumbs} />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">{title}</h1>
          <p className="text-theme-muted text-[13px] mt-1">
            {subtitle ? subtitle(filteredItems.length) : `${filteredItems.length} items`}
          </p>
        </div>
        <Link
          to={createPath}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium no-underline hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + New {title.replace(/^RPG /, "").replace(/s$/, "")}
        </Link>
      </div>

      {searchKeys.length > 0 && (
        <input
          className="w-full max-w-xs bg-bg2 border border-border-c rounded-lg px-3 py-2 text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-accent mb-4"
          placeholder={`Search ${title.toLowerCase()}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      )}

      {isLoading ? (
        <div className="text-theme-muted text-sm">Loading…</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border-c">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-theme-muted uppercase tracking-wide">ID</th>
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-2 text-left text-xs font-semibold text-theme-muted uppercase tracking-wide">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-semibold text-theme-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map(item => (
                  <tr key={item.id} className="border-b border-border-c/50 hover:bg-bg2/60">
                    <td className="px-4 py-2 text-sm text-theme-text">
                      <Link to={editPath(item.id)} className="text-accent hover:underline">{item.id}</Link>
                    </td>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-2 text-sm text-theme-muted">
                        {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setConfirmDelete(item)}
                        className="px-2 py-1 text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <p className="text-theme-muted text-sm mt-4 text-center">No items found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3 mt-4 justify-center">
              <button onClick={prevPage} disabled={page === 1} className="px-3 py-1 text-sm bg-bg2 border border-border-c rounded disabled:opacity-40 text-theme-muted hover:text-theme-text">
                ← Prev
              </button>
              <span className="text-sm text-theme-muted">{page} / {totalPages}</span>
              <button onClick={nextPage} disabled={page === totalPages} className="px-3 py-1 text-sm bg-bg2 border border-border-c rounded disabled:opacity-40 text-theme-muted hover:text-theme-text">
                Next →
              </button>
            </div>
          )}
        </>
      )}

      <DeleteConfirmModal
        isOpen={!!confirmDelete}
        itemName={confirmDelete?.id ?? ""}
        onConfirm={async () => {
          if (!confirmDelete) return;
          await deleteItem(confirmDelete.id);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
