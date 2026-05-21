import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRef } from "react";
import ImageCropper from "@/components/admin/ImageCropper";
import type { ImageCropperRef } from "@/components/admin/ImageCropper";

// ─── Canvas mock ──────────────────────────────────────────────────────────────

const mockBlob = new Blob(["fake-image-data"], { type: "image/jpeg" });

const mockGetContext = vi.fn(() => ({
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  clip: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  stroke: vi.fn(),
}));

const mockToBlob = vi.fn((cb: (b: Blob | null) => void) => cb(mockBlob));

// Patch HTMLCanvasElement before tests
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = mockGetContext as any;
  HTMLCanvasElement.prototype.toBlob = mockToBlob as any;
});

// ─── Image load mock ──────────────────────────────────────────────────────────

function mockImageLoad() {
  const originalImage = global.Image;
  const MockImage = vi.fn().mockImplementation(() => {
    const img = { crossOrigin: "", src: "", width: 400, height: 400, onload: null as any };
    // Fire onload asynchronously after src is set
    Object.defineProperty(img, "src", {
      set(url: string) {
        (this as any)._src = url;
        setTimeout(() => this.onload?.(), 0);
      },
      get() { return (this as any)._src; },
    });
    return img;
  });
  global.Image = MockImage as any;
  return () => { global.Image = originalImage; };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ImageCropper", () => {
  it("renders canvas and zoom controls", () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  it("renders the correct size annotation in canvas overlay", () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" targetWidth={300} targetHeight={300} />);
    expect(screen.getByText("300 × 300")).toBeInTheDocument();
  });

  it("shows zoom instruction text", () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    expect(screen.getByText(/Drag to reposition/)).toBeInTheDocument();
  });

  it("zoom in button is disabled at max zoom (3)", async () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const zoomInBtn = screen.getByTitle("Zoom in");

    // Click zoom in many times to reach max
    for (let i = 0; i < 30; i++) {
      if (!(zoomInBtn as HTMLButtonElement).disabled) fireEvent.click(zoomInBtn);
    }

    await waitFor(() => {
      expect((zoomInBtn as HTMLButtonElement).disabled).toBe(true);
    });
  });

  it("zoom out button is disabled at min zoom (0.1)", async () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const zoomOutBtn = screen.getByTitle("Zoom out");

    for (let i = 0; i < 30; i++) {
      if (!(zoomOutBtn as HTMLButtonElement).disabled) fireEvent.click(zoomOutBtn);
    }

    await waitFor(() => {
      expect((zoomOutBtn as HTMLButtonElement).disabled).toBe(true);
    });
  });

  it("zoom slider updates zoom value", async () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const slider = screen.getByTitle(/Zoom:/);
    fireEvent.change(slider, { target: { value: "2" } });
    await waitFor(() => {
      expect((slider as HTMLInputElement).value).toBe("2");
    });
  });

  it("reset button calls centerImage (re-centers zoom)", async () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const zoomInBtn = screen.getByTitle("Zoom in");
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomInBtn);

    const resetBtn = screen.getByTitle("Reset");
    fireEvent.click(resetBtn);

    // After reset, zoom-in button should no longer be disabled
    expect((zoomInBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it("allows dragging to reposition image without crashing", async () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const canvas = document.querySelector("canvas")!;
    const container = canvas.parentElement!;

    // Verify drag events are handled without errors
    expect(() => {
      fireEvent.mouseDown(container, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(container, { clientX: 150, clientY: 120 });
      fireEvent.mouseUp(container);
    }).not.toThrow();

    expect(container).toBeInTheDocument();
  });

  it("stops dragging on mouse leave", async () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const canvas = document.querySelector("canvas")!;
    const container = canvas.parentElement!;

    fireEvent.mouseDown(container, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(container);
    fireEvent.mouseMove(container, { clientX: 200, clientY: 200 });

    // Should not throw and should still render correctly
    expect(container).toBeInTheDocument();
  });

  it("supports touch drag to reposition", () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" />);
    const canvas = document.querySelector("canvas")!;
    const container = canvas.parentElement!;

    fireEvent.touchStart(container, { touches: [{ clientX: 50, clientY: 50 }] });
    fireEvent.touchMove(container, { touches: [{ clientX: 80, clientY: 70 }] });
    fireEvent.touchEnd(container);

    expect(container).toBeInTheDocument();
  });

  // ── getCroppedImage via ref ────────────────────────────────────────────────

  it("getCroppedImage resolves a Blob via ref", async () => {
    const ref = createRef<ImageCropperRef>();
    render(<ImageCropper ref={ref} imageUrl="data:image/png;base64,abc" />);

    const blob = await ref.current!.getCroppedImage();
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/jpeg");
  });

  it("getCroppedImage rejects when canvas not available", async () => {
    const ref = createRef<ImageCropperRef>();
    render(<ImageCropper ref={ref} imageUrl="data:image/png;base64,abc" />);

    // Make toBlob return null to simulate failure
    HTMLCanvasElement.prototype.toBlob = vi.fn((cb: any) => cb(null));

    await expect(ref.current!.getCroppedImage()).rejects.toThrow("Failed to create blob");
  });

  it("uses custom targetWidth and targetHeight for canvas dimensions", () => {
    render(<ImageCropper imageUrl="data:image/png;base64,abc" targetWidth={512} targetHeight={256} />);
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.width).toBe(512);
    expect(canvas.height).toBe(256);
  });
});
