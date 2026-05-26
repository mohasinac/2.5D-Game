/**
 * WhatsApp-Style Image Editor for Beyblade
 * Drag to reposition, pinch/scroll to zoom
 * Mobile-friendly with touch support
 */

import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/cn";
import { HEX } from "../../styles/theme";

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

export interface WhatsAppStyleImageEditorRef {
  getCanvasBlob: () => Promise<Blob>;
}

const WhatsAppStyleImageEditor = forwardRef<WhatsAppStyleImageEditorRef, WhatsAppStyleImageEditorProps>(function WhatsAppStyleImageEditor({
  imageUrl,
  onPositionChange,
  initialPosition = { x: 0, y: 0, scale: 1, rotation: 0 },
  circleSize = 300,
  onSave,
  onCancel,
}: WhatsAppStyleImageEditorProps, ref) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvasBlob: (): Promise<Blob> =>
      new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) { reject(new Error("Canvas not ready")); return; }
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("toBlob returned null"))),
          "image/jpeg",
          0.95
        );
      }),
  }));

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
      ctx.strokeStyle = HEX.red;
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

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black rounded-xl w-full box-border">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <button onClick={onCancel} className="bg-transparent border-none text-theme-text text-[15px] cursor-pointer">
          ✕ Cancel
        </button>
        <span className="text-theme-text text-[15px] font-semibold">Drag the image to adjust</span>
        <button onClick={onSave} className="bg-transparent border-none text-theme-blue text-[15px] cursor-pointer font-semibold">
          ✓ Upload
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative touch-none select-none"
        style={{
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
          className="rounded-lg"
        />
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2 bg-bg3 rounded-full px-4 py-2.5 w-full box-border">
        <button
          onClick={handleZoomOut}
          disabled={position.scale <= 0.5}
          className={cn(
            "w-9 h-9 flex items-center justify-center bg-transparent border-none text-theme-text text-[22px] cursor-pointer rounded-full",
            position.scale <= 0.5 && "opacity-40",
          )}
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
          className="flex-1 min-w-[60px] accent-theme-blue"
        />
        <span className="text-theme-text text-[12px] font-semibold min-w-[40px]">
          {Math.round(position.scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={position.scale >= 3}
          className={cn(
            "w-9 h-9 flex items-center justify-center bg-transparent border-none text-theme-text text-[22px] cursor-pointer rounded-full",
            position.scale >= 3 && "opacity-40",
          )}
        >
          +
        </button>
      </div>

      {/* Rotate */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRotate}
          className="px-4 py-1.5 bg-bg3 border-none text-theme-text rounded-lg text-[13px] cursor-pointer flex items-center gap-1.5"
        >
          🔄 Rotate
          <span className="text-theme-faint text-[11px]">({position.rotation}°)</span>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="bg-transparent border-none text-theme-muted text-[13px] cursor-pointer"
      >
        Reset Position & Rotation
      </button>

      {/* Instructions */}
      <div className="text-center text-theme-faint text-[12px] leading-relaxed">
        <div>Drag to reposition • Scroll or pinch to zoom • Click rotate</div>
        <div className="text-[11px]">Position will be saved with the beyblade</div>
      </div>
    </div>
  );
});

WhatsAppStyleImageEditor.displayName = "WhatsAppStyleImageEditor";

export default WhatsAppStyleImageEditor;
