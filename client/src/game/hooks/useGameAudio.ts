// useGameAudio — loads sound assets from gameDataStore and exposes play/loop/stop helpers.
// Volume is read from UIPrefsStore (soundVolume 0–1).
// Uses Web Audio API (HTMLAudioElement pool) — no external library required.

import { useCallback, useEffect, useRef } from "react";

export type SoundTag =
  | "hit-light"
  | "hit-heavy"
  | "spin-out"
  | "special-attack"
  | "charge-loop"
  | "launch-perfect"
  | "low-spin-alarm"
  | "countdown-beep"
  | "victory-fanfare"
  | "defeat-sting"
  | "combo-trigger";

interface SoundAssetDoc {
  tag: string;
  audioUrl: string;
}

interface UseGameAudioOptions {
  /** Pre-loaded asset docs keyed by tag. Pass from gameDataStore. */
  assets?: SoundAssetDoc[];
  /** Volume 0–1. Default 0.7 */
  volume?: number;
}

export function useGameAudio({ assets = [], volume = 0.7 }: UseGameAudioOptions = {}) {
  // Map tag → URL
  const urlMapRef = useRef<Map<SoundTag, string>>(new Map());
  // Active looping audio elements
  const loopingRef = useRef<Map<SoundTag, HTMLAudioElement>>(new Map());
  // Pool of one-shot audio elements per tag (reuse to avoid allocation on every hit)
  const poolRef = useRef<Map<SoundTag, HTMLAudioElement[]>>(new Map());

  // Rebuild URL map when assets change
  useEffect(() => {
    const map = new Map<SoundTag, string>();
    for (const doc of assets) {
      map.set(doc.tag as SoundTag, doc.audioUrl);
    }
    urlMapRef.current = map;
  }, [assets]);

  const getAudio = useCallback((tag: SoundTag): HTMLAudioElement | null => {
    const url = urlMapRef.current.get(tag);
    if (!url) return null;

    // Reuse a finished pool element, or create a new one
    const pool = poolRef.current.get(tag) ?? [];
    const reusable = pool.find(a => a.paused || a.ended);
    if (reusable) {
      reusable.currentTime = 0;
      reusable.volume = volume;
      return reusable;
    }

    const audio = new Audio(url);
    audio.volume = volume;
    pool.push(audio);
    poolRef.current.set(tag, pool);
    return audio;
  }, [volume]);

  const playSound = useCallback((tag: SoundTag) => {
    const audio = getAudio(tag);
    if (!audio) return;
    audio.play().catch(() => undefined);
  }, [getAudio]);

  const loopSound = useCallback((tag: SoundTag) => {
    if (loopingRef.current.has(tag)) return; // already looping
    const url = urlMapRef.current.get(tag);
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = volume * 0.7; // loops slightly quieter
    audio.loop = true;
    loopingRef.current.set(tag, audio);
    audio.play().catch(() => undefined);
  }, [volume]);

  const stopLoop = useCallback((tag?: SoundTag) => {
    if (tag) {
      const audio = loopingRef.current.get(tag);
      if (audio) { audio.pause(); audio.currentTime = 0; }
      loopingRef.current.delete(tag);
    } else {
      // Stop all loops
      loopingRef.current.forEach(a => { a.pause(); a.currentTime = 0; });
      loopingRef.current.clear();
    }
  }, []);

  // Update volume on all active elements when it changes
  useEffect(() => {
    poolRef.current.forEach(pool => pool.forEach(a => { a.volume = volume; }));
    loopingRef.current.forEach(a => { a.volume = volume * 0.7; });
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => () => {
    loopingRef.current.forEach(a => { a.pause(); });
    loopingRef.current.clear();
    poolRef.current.clear();
  }, []);

  return { playSound, loopSound, stopLoop };
}
