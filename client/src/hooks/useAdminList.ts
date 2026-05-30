import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface UseAdminListOptions<T> {
  collectionId: string;
  searchFields?: (keyof T)[];
  pageSize?: number;
}

interface UseAdminListResult<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (s: string) => void;
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
  deleteItem: (id: string) => Promise<void>;
  filteredItems: T[];
  pagedItems: T[];
}

export function useAdminList<T extends { id: string }>(
  opts: UseAdminListOptions<T>
): UseAdminListResult<T> {
  const { collectionId, searchFields = [], pageSize = 25 } = opts;
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, collectionId));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const deleteItem = useCallback(async (id: string) => {
    await deleteDoc(doc(db, collectionId, id));
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Deleted");
  }, [collectionId]);

  const filteredItems = search
    ? items.filter(item => {
        const q = search.toLowerCase();
        // Always search by id
        if (item.id.toLowerCase().includes(q)) return true;
        // Search by configured fields
        return searchFields.some(field => {
          const val = item[field];
          return typeof val === "string" && val.toLowerCase().includes(q);
        });
      })
    : items;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  return {
    items,
    isLoading,
    error,
    search,
    setSearch,
    page: clampedPage,
    totalPages,
    nextPage: () => setPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setPage(p => Math.max(p - 1, 1)),
    refetch: fetchItems,
    deleteItem,
    filteredItems,
    pagedItems,
  };
}
