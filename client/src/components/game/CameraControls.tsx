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

  const btnStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "0.5rem",
    background: "rgba(20, 25, 40, 0.85)",
    border: "1px solid rgba(120, 160, 200, 0.4)",
    color: "#ddeeff",
    fontSize: "1.25rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    transition: "background 0.15s, transform 0.1s",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${topRem}rem`,
        right: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in (+)"
        style={btnStyle}
        onClick={onZoomIn}
      >+</button>
      <button
        type="button"
        aria-label="Reset zoom"
        title="Reset zoom (0)"
        style={{ ...btnStyle, fontSize: "0.85rem" }}
        onClick={onZoomReset}
      >0</button>
      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out (−)"
        style={btnStyle}
        onClick={onZoomOut}
      >&minus;</button>
    </div>
  );
}
