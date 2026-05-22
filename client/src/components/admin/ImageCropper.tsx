import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { C } from "../../styles/theme";

interface ImageCropperProps {
  imageUrl: string;
  targetWidth?: number;
  targetHeight?: number;
}

interface ImageCropperRef {
  getCroppedImage: () => Promise<Blob>;
}

const ImageCropper = forwardRef<ImageCropperRef, ImageCropperProps>(
  ({ imageUrl, targetWidth = 400, targetHeight = 400 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;

      image.onload = () => {
        imageRef.current = image;
        setImageLoaded(true);
        centerImage(image);
      };

      return () => {
        imageRef.current = null;
      };
    }, [imageUrl]);

    const centerImage = (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.max(
        targetWidth / image.width,
        targetHeight / image.height
      );
      setZoom(scale);
      setPosition({ x: 0, y: 0 });
    };

    const drawImage = useCallback(() => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image || !imageLoaded) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, targetWidth, targetHeight);

      const scaledWidth = image.width * zoom;
      const scaledHeight = image.height * zoom;

      const x = (targetWidth - scaledWidth) / 2 + position.x;
      const y = (targetHeight - scaledHeight) / 2 + position.y;

      ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    }, [zoom, position, imageLoaded, targetWidth, targetHeight]);

    useEffect(() => {
      drawImage();
    }, [drawImage]);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    };

    const handleTouchEnd = () => setIsDragging(false);

    const handleZoomIn = () => setZoom((p) => Math.min(p + 0.1, 3));
    const handleZoomOut = () => setZoom((p) => Math.max(p - 0.1, 0.1));

    const handleReset = () => {
      if (imageRef.current) centerImage(imageRef.current);
    };

    const getCroppedImage = (): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) { reject(new Error("Canvas not found")); return; }
        canvas.toBlob(
          (blob) => { blob ? resolve(blob) : reject(new Error("Failed to create blob")); },
          "image/jpeg",
          0.95
        );
      });
    };

    useImperativeHandle(ref, () => ({ getCroppedImage }));

    const iconBtn: React.CSSProperties = {
      padding: 8,
      borderRadius: 6,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: C.muted,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <div style={{ background: C.bg2, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            Adjust Image (Drag to move, scroll to zoom)
          </div>

          {/* Canvas */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                border: `2px solid ${C.blue}`,
                borderRadius: 8,
                overflow: "hidden",
                width: `min(${targetWidth}px, 90vw)`,
                height: `min(${targetHeight}px, 90vw)`,
                touchAction: "none",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <canvas
                ref={canvasRef}
                width={targetWidth}
                height={targetHeight}
                style={{ display: "block", width: "100%", height: "100%" }}
              />
              <div style={{
                position: "absolute", bottom: 8, right: 8,
                background: "rgba(0,0,0,0.7)", color: C.white,
                padding: "2px 8px", borderRadius: 4, fontSize: 11,
              }}>
                {targetWidth} × {targetHeight}
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.1}
                style={{ ...iconBtn, opacity: zoom <= 0.1 ? 0.4 : 1 }}
                title="Zoom out"
              >
                <ZoomOut size={18} />
              </button>

              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: C.blue }}
                title={`Zoom: ${Math.round(zoom * 100)}%`}
              />

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                style={{ ...iconBtn, opacity: zoom >= 3 ? 0.4 : 1 }}
                title="Zoom in"
              >
                <ZoomIn size={18} />
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={iconBtn}
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div style={{ fontSize: 11, textAlign: "center", color: C.faint }}>
              Drag to reposition • Scroll or use slider to zoom • Click reset to center
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ImageCropper.displayName = "ImageCropper";

export default ImageCropper;
export type { ImageCropperProps, ImageCropperRef };
