/**
 * WhatsApp-Style Image Editor for Beyblade
 * Drag to reposition, pinch/scroll to zoom
 * Mobile-friendly with touch support
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { C, btn, btnOutline } from "../../styles/theme";

interface WhatsAppStyleImageEditorProps {
  imageUrl: string;
  onPositionChange: (position: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  }) => void;
  initialPosition?: { x: number; y: number; scale: number; rotation: number };
  circleSize?: number;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function WhatsAppStyleImageEditor({
  imageUrl,
  onPositionChange,
  initialPosition = { x: 0, y: 0, scale: 1, rotation: 0 },
  circleSize = 300,
  onSave,
  onCancel,
}: WhatsAppStyleImageEditorProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImageLoaded(true);
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    onPositionChange(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.x, position.y, position.scale, position.rotation]);

  useEffect(() => {
    if (!canvasRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#1f2937";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      ctx.beginPath();
      ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const aspectRatio = img.width / img.height;
      let scaledWidth: number, scaledHeight: number;

      if (aspectRatio > 1) {
        scaledWidth = circleSize * position.scale;
        scaledHeight = scaledWidth / aspectRatio;
      } else {
        scaledHeight = circleSize * position.scale;
        scaledWidth = scaledHeight * aspectRatio;
      }

      const offsetX = position.x * (circleSize / 4);
      const offsetY = position.y * (circleSize / 4);

      ctx.translate(circleSize / 2 + offsetX, circleSize / 2 + offsetY);
      ctx.rotate((position.rotation * Math.PI) / 180);

      ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

      ctx.restore();

      // Red circle border
      ctx.beginPath();
      ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 4;
      ctx.stroke();
    };
    img.src = imageUrl;
  }, [imageUrl, position, circleSize, imageLoaded]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x * (circleSize / 4),
        y: e.clientY - position.y * (circleSize / 4),
      });
    },
    [position, circleSize]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();

      const newX = (e.clientX - dragStart.x) / (circleSize / 4);
      const newY = (e.clientY - dragStart.y) / (circleSize / 4);

      setPosition((prev) => ({
        ...prev,
        x: Math.max(-4, Math.min(4, newX)),
        y: Math.max(-4, Math.min(4, newY)),
      }));
    },
    [isDragging, dragStart, circleSize]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setPosition((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
    }));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDistance = 0;
    let initialScale = position.scale;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialScale = position.scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const scale = (dist / initialDistance) * initialScale;
        setPosition((prev) => ({
          ...prev,
          scale: Math.max(0.5, Math.min(3, scale)),
        }));
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [position.scale]);

  const handleZoomIn = () =>
    setPosition((p) => ({ ...p, scale: Math.min(3, p.scale + 0.1) }));
  const handleZoomOut = () =>
    setPosition((p) => ({ ...p, scale: Math.max(0.5, p.scale - 0.1) }));
  const handleRotate = () =>
    setPosition((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }));
  const handleReset = () =>
    setPosition({ x: 0, y: 0, scale: 1, rotation: 0 });

  const zoomRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: C.bg3,
    borderRadius: 999,
    padding: "10px 20px",
  };

  const roundBtn: React.CSSProperties = {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    color: C.text,
    fontSize: 22,
    cursor: "pointer",
    borderRadius: "50%",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      padding: 16,
      background: "#000",
      borderRadius: 12,
    }}>
      {/* Header */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: C.text, fontSize: 15, cursor: "pointer" }}>
          ✕ Cancel
        </button>
        <span style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>Drag the image to adjust</span>
        <button onClick={onSave} style={{ background: "none", border: "none", color: C.blue, fontSize: 15, cursor: "pointer", fontWeight: 600 }}>
          ✓ Upload
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          touchAction: "none",
          userSelect: "none",
          width: circleSize,
          height: circleSize,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          width={circleSize}
          height={circleSize}
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* Zoom Controls */}
      <div style={zoomRowStyle}>
        <button
          onClick={handleZoomOut}
          disabled={position.scale <= 0.5}
          style={{ ...roundBtn, opacity: position.scale <= 0.5 ? 0.4 : 1 }}
        >
          −
        </button>

        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={position.scale}
          onChange={(e) =>
            setPosition((p) => ({ ...p, scale: parseFloat(e.target.value) }))
          }
          style={{ width: 140, accentColor: C.blue }}
        />
        <span style={{ color: C.text, fontSize: 12, fontWeight: 600, minWidth: 40 }}>
          {Math.round(position.scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={position.scale >= 3}
          style={{ ...roundBtn, opacity: position.scale >= 3 ? 0.4 : 1 }}
        >
          +
        </button>
      </div>

      {/* Rotate */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={handleRotate}
          style={{
            padding: "6px 16px",
            background: C.bg3,
            border: "none",
            color: C.text,
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🔄 Rotate
          <span style={{ color: C.faint, fontSize: 11 }}>({position.rotation}°)</span>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer" }}
      >
        Reset Position & Rotation
      </button>

      {/* Instructions */}
      <div style={{ textAlign: "center", color: C.faint, fontSize: 12, lineHeight: 1.6 }}>
        <div>Drag to reposition • Scroll or pinch to zoom • Click rotate</div>
        <div style={{ fontSize: 11 }}>Position will be saved with the beyblade</div>
      </div>
    </div>
  );
}
