import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type DefDoc = { id: string; label: string; [key: string]: unknown };

const cache = new Map<string, { docs: DefDoc[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export function useDefsDocs(collectionId: string): DefDoc[] {
  const [docs, setDocs] = useState<DefDoc[]>(() => cache.get(collectionId)?.docs ?? []);

  useEffect(() => {
    const cached = cache.get(collectionId);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setDocs(cached.docs);
      return;
    }
    let cancelled = false;
    getDocs(collection(db, collectionId)).then(snap => {
      if (cancelled) return;
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as DefDoc));
      items.sort((a, b) => {
        const sa = (a.sortOrder as number) ?? 0;
        const sb = (b.sortOrder as number) ?? 0;
        if (sa !== sb) return sa - sb;
        return a.label.localeCompare(b.label);
      });
      cache.set(collectionId, { docs: items, ts: Date.now() });
      setDocs(items);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [collectionId]);

  return docs;
}
