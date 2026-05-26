import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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

    return (
      <div className="bg-bg2 rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <div className="text-[13px] font-semibold text-theme-text">
            Adjust Image (Drag to move, scroll to zoom)
          </div>

          {/* Canvas */}
          <div className="flex justify-center">
            <div
              className={`relative border-2 border-theme-blue rounded-lg overflow-hidden touch-none [width:var(--iw)] [height:var(--ih)] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{
                "--iw": `min(${targetWidth}px, 90vw)`,
                "--ih": `min(${targetHeight}px, 90vw)`,
              } as React.CSSProperties}
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
                className="block w-full h-full"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-[2px] rounded text-[11px]">
                {targetWidth} × {targetHeight}
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.1}
                className={[
                  "p-2 rounded-md border-none bg-transparent cursor-pointer text-theme-muted flex items-center justify-center",
                  zoom <= 0.1 ? "opacity-40" : "opacity-100",
                ].join(" ")}
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
                className="flex-1 accent-theme-blue"
                title={`Zoom: ${Math.round(zoom * 100)}%`}
              />

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className={[
                  "p-2 rounded-md border-none bg-transparent cursor-pointer text-theme-muted flex items-center justify-center",
                  zoom >= 3 ? "opacity-40" : "opacity-100",
                ].join(" ")}
                title="Zoom in"
              >
                <ZoomIn size={18} />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-md border-none bg-transparent cursor-pointer text-theme-muted flex items-center justify-center"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="text-[11px] text-center text-theme-faint">
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
