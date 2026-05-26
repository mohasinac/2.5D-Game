// CameraControls — top-right zoom buttons under the Exit button.
// Wires to the renderer's cameraZoomIn / cameraZoomOut / cameraZoomReset.
// Keyboard mirrors: '+' / '-' / '0'. Pinch handled by the renderer separately.
// See plan: Part 2 + Part 8.

import { useEffect } from "react";

interface CameraControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  /** Vertical offset from top (rem) — lets pages stack other top-right controls above. */
  topRem?: number;
}

export function CameraControls({ onZoomIn, onZoomOut, onZoomReset, topRem = 4 }: CameraControlsProps) {
  // Keyboard shortcuts: + / - / 0
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when user is typing in an input.
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "+" || e.key === "=") { onZoomIn(); e.preventDefault(); }
      else if (e.key === "-" || e.key === "_") { onZoomOut(); e.preventDefault(); }
      else if (e.key === "0") { onZoomReset(); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onZoomIn, onZoomOut, onZoomReset]);

  const btnClass = "w-10 h-10 rounded-lg bg-[rgba(20,25,40,0.85)] border border-[rgba(120,160,200,0.4)] text-[#ddeeff] text-[1.25rem] font-semibold cursor-pointer flex items-center justify-center backdrop-blur transition-[background,transform] duration-150";

  return (
    <div
      style={{ position: "absolute", top: `${topRem}rem`, right: "1rem" }}
      className="flex flex-col gap-[0.4rem] z-50 pointer-events-auto"
    >
      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in (+)"
        className={btnClass}
        onClick={onZoomIn}
      >+</button>
      <button
        type="button"
        aria-label="Reset zoom"
        title="Reset zoom (0)"
        className={btnClass + " text-[0.85rem]"}
        onClick={onZoomReset}
      >0</button>
      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out (−)"
        className={btnClass}
        onClick={onZoomOut}
      >&minus;</button>
    </div>
  );
}
