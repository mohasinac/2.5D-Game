// useBitBeastCinematic — loads a beyblade's bit beast asset from Firestore and
// exposes helpers to show/hide the BitBeastCinematic overlay.
// Returns show(), a visible flag, moveName, and imageUrl.

import { useCallback, useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

interface BitBeastCinematicState {
  imageUrl: string;
  moveName: string;
  visible: boolean;
  show: (name: string, durationMs?: number) => void;
}

export function useBitBeastCinematic(beybladeId: string | null | undefined): BitBeastCinematicState {
  const [imageUrl, setImageUrl]   = useState("");
  const [moveName, setMoveName]   = useState("");
  const [visible,  setVisible]    = useState(false);
  const imageUrlRef               = useRef("");
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref in sync so the show() callback always reads the latest URL.
  useEffect(() => { imageUrlRef.current = imageUrl; }, [imageUrl]);

  // Load bit beast image from Firestore: beyblade_stats → bitBeastId → bitbeast_assets
  useEffect(() => {
    if (!beybladeId) return;
    let cancelled = false;

    getDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, beybladeId))
      .then(snap => {
        if (cancelled || !snap.exists()) return null;
        const bitBeastId = (snap.data() as any).bitBeastId as string | undefined;
        if (!bitBeastId) return null;
        return getDoc(doc(db, COLLECTIONS.BITBEAST_ASSETS, bitBeastId));
      })
      .then(bbSnap => {
        if (cancelled || !bbSnap || !bbSnap.exists()) return;
        const url = (bbSnap.data() as any).imageUrl as string | undefined;
        if (url) setImageUrl(url);
      })
      .catch(() => { /* silent — no bit beast is fine */ });

    return () => { cancelled = true; };
  }, [beybladeId]);

  const show = useCallback((name: string, durationMs = 1800) => {
    if (!imageUrlRef.current) return;  // no asset loaded yet — skip silently
    if (timerRef.current) clearTimeout(timerRef.current);
    setMoveName(name);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), durationMs);
  }, []);

  return { imageUrl, moveName, visible, show };
}
