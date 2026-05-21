import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { createRef } from "react";
import WhatsAppStyleImageEditor from "@/components/admin/WhatsAppStyleImageEditor";
import type { WhatsAppStyleImageEditorRef } from "@/components/admin/WhatsAppStyleImageEditor";

// ─── Canvas mock ──────────────────────────────────────────────────────────────

const mockBlob = new Blob(["canvas-content"], { type: "image/jpeg" });
const mockCtx = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillStyle: "",
  beginPath: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  clip: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  stroke: vi.fn(),
  lineWidth: 0,
  strokeStyle: "",
};

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx) as any;
  HTMLCanvasElement.prototype.toBlob = vi.fn((cb: any) => cb(mockBlob));
});

const noop = vi.fn();

function renderEditor(overrides?: Partial<React.ComponentProps<typeof WhatsAppStyleImageEditor>>, ref?: React.Ref<WhatsAppStyleImageEditorRef>) {
  return render(
    <WhatsAppStyleImageEditor
      ref={ref}
      imageUrl="data:image/png;base64,abc123"
      onPositionChange={noop}
      onSave={noop}
      onCancel={noop}
      {...overrides}
    />
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("WhatsAppStyleImageEditor", () => {

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders canvas element", () => {
    renderEditor();
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  it("renders header with Cancel and Upload buttons", () => {
    renderEditor();
    expect(screen.getByText("✕ Cancel")).toBeInTheDocument();
    expect(screen.getByText("✓ Upload")).toBeInTheDocument();
    expect(screen.getByText("Drag the image to adjust")).toBeInTheDocument();
  });

  it("renders zoom slider and buttons", () => {
    renderEditor();
    expect(document.querySelector("input[type='range']")).toBeInTheDocument();
    expect(screen.getByText("−")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("renders rotate and reset controls", () => {
    renderEditor();
    expect(screen.getByText(/🔄 Rotate/)).toBeInTheDocument();
    expect(screen.getByText("Reset Position & Rotation")).toBeInTheDocument();
  });

  it("shows instruction text", () => {
    renderEditor();
    expect(screen.getByText(/Drag to reposition/)).toBeInTheDocument();
  });

  it("renders with custom circleSize", () => {
    renderEditor({ circleSize: 200 });
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(200);
  });

  // ── Controls ───────────────────────────────────────────────────────────────

  it("calls onCancel when Cancel button clicked", () => {
    const onCancel = vi.fn();
    renderEditor({ onCancel });
    fireEvent.click(screen.getByText("✕ Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onSave when Upload button clicked", () => {
    const onSave = vi.fn();
    renderEditor({ onSave });
    fireEvent.click(screen.getByText("✓ Upload"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("zoom in button increases scale", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange });

    const zoomInBtn = screen.getByText("+");
    fireEvent.click(zoomInBtn);

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.scale).toBeGreaterThan(1);
    });
  });

  it("zoom out button decreases scale", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange, initialPosition: { x: 0, y: 0, scale: 2, rotation: 0 } });

    const zoomOutBtn = screen.getByText("−");
    fireEvent.click(zoomOutBtn);

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.scale).toBeLessThan(2);
    });
  });

  it("zoom in button disabled at max scale (3)", async () => {
    renderEditor({ initialPosition: { x: 0, y: 0, scale: 3, rotation: 0 } });
    const zoomInBtn = screen.getByText("+");
    expect((zoomInBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it("zoom out button disabled at min scale (0.5)", async () => {
    renderEditor({ initialPosition: { x: 0, y: 0, scale: 0.5, rotation: 0 } });
    const zoomOutBtn = screen.getByText("−");
    expect((zoomOutBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it("zoom slider updates scale via onPositionChange", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange });

    const slider = document.querySelector("input[type='range']") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "2.5" } });

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.scale).toBeCloseTo(2.5);
    });
  });

  it("rotate button advances rotation by 90°", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange });

    fireEvent.click(screen.getByText(/🔄 Rotate/));

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.rotation).toBe(90);
    });
  });

  it("rotate button wraps at 360°", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange, initialPosition: { x: 0, y: 0, scale: 1, rotation: 270 } });

    fireEvent.click(screen.getByText(/🔄 Rotate/));

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.rotation).toBe(0);
    });
  });

  it("reset button restores default position", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange, initialPosition: { x: 2, y: 2, scale: 2, rotation: 90 } });

    fireEvent.click(screen.getByText("Reset Position & Rotation"));

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toEqual({ x: 0, y: 0, scale: 1, rotation: 0 });
    });
  });

  it("shows current rotation in rotate button label", async () => {
    renderEditor({ initialPosition: { x: 0, y: 0, scale: 1, rotation: 180 } });
    expect(screen.getByText("(180°)")).toBeInTheDocument();
  });

  it("shows current scale percentage on slider label", async () => {
    renderEditor({ initialPosition: { x: 0, y: 0, scale: 1.5, rotation: 0 } });
    expect(screen.getByText("150%")).toBeInTheDocument();
  });

  // ── Dragging ───────────────────────────────────────────────────────────────

  it("tracks pointer drag and calls onPositionChange", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange });

    const canvas = document.querySelector("canvas")!;
    const container = canvas.parentElement!;

    fireEvent.pointerDown(container, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(container, { clientX: 150, clientY: 130 });
    fireEvent.pointerUp(container);

    await waitFor(() => {
      expect(onPositionChange).toHaveBeenCalled();
    });
  });

  it("stops dragging on pointer leave", () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange });

    const canvas = document.querySelector("canvas")!;
    const container = canvas.parentElement!;

    fireEvent.pointerDown(container, { clientX: 100, clientY: 100 });
    fireEvent.pointerLeave(container);
    onPositionChange.mockClear();
    fireEvent.pointerMove(container, { clientX: 200, clientY: 200 });

    // After leave, move should not trigger position change via drag
    expect(onPositionChange).not.toHaveBeenCalled();
  });

  it("wheel scroll adjusts scale", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange });

    const canvas = document.querySelector("canvas")!;
    const container = canvas.parentElement!;

    fireEvent.wheel(container, { deltaY: -100 }); // scroll up = zoom in

    await waitFor(() => {
      const calls = onPositionChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.scale).toBeGreaterThan(1);
    });
  });

  // ── getCanvasBlob via ref ─────────────────────────────────────────────────

  it("getCanvasBlob resolves a Blob via ref", async () => {
    const ref = createRef<WhatsAppStyleImageEditorRef>();
    renderEditor({}, ref);

    const blob = await ref.current!.getCanvasBlob();
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/jpeg");
  });

  it("getCanvasBlob rejects when toBlob returns null", async () => {
    HTMLCanvasElement.prototype.toBlob = vi.fn((cb: any) => cb(null));
    const ref = createRef<WhatsAppStyleImageEditorRef>();
    renderEditor({}, ref);

    await expect(ref.current!.getCanvasBlob()).rejects.toThrow("toBlob returned null");
  });

  // ── initialPosition prop ──────────────────────────────────────────────────

  it("initializes with provided position values", async () => {
    const onPositionChange = vi.fn();
    renderEditor({ onPositionChange, initialPosition: { x: 1, y: -1, scale: 1.5, rotation: 45 } });

    // onPositionChange fires once on mount via useEffect
    await waitFor(() => {
      expect(onPositionChange).toHaveBeenCalledWith(
        expect.objectContaining({ x: 1, y: -1, scale: 1.5, rotation: 45 })
      );
    });
  });
});
