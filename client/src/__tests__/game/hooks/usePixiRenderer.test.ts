import { renderHook, act } from "@testing-library/react";
import { usePixiRenderer } from "@/game/hooks/usePixiRenderer";
import type { RefObject } from "react";

// vi.mock is hoisted to the top of the file by vitest. Any variables referenced
// inside the factory must also be hoisted with vi.hoisted() or defined inline.
const {
  mockInit,
  mockDestroy,
  mockRender,
  mockSpawnCollision,
  mockSpawnSpinOut,
  mockSpawnDamage,
  mockResize,
  MockRendererConstructor,
} = vi.hoisted(() => {
  const mockInit = vi.fn().mockResolvedValue(undefined);
  const mockDestroy = vi.fn();
  const mockRender = vi.fn();
  const mockSpawnCollision = vi.fn();
  const mockSpawnSpinOut = vi.fn();
  const mockSpawnDamage = vi.fn();
  const mockResize = vi.fn();

  const MockRendererConstructor = vi.fn().mockImplementation(() => ({
    init: mockInit,
    destroy: mockDestroy,
    render: mockRender,
    spawnCollisionParticles: mockSpawnCollision,
    spawnSpinOutParticles: mockSpawnSpinOut,
    spawnDamageNumber: mockSpawnDamage,
    resize: mockResize,
  }));

  return {
    mockInit,
    mockDestroy,
    mockRender,
    mockSpawnCollision,
    mockSpawnSpinOut,
    mockSpawnDamage,
    mockResize,
    MockRendererConstructor,
  };
});

vi.mock("@/game/renderer/PixiRenderer", () => ({
  BeybladeGameRenderer: MockRendererConstructor,
}));

// ─────────────────────────────────────────────────────────────────────────────

function makeContainerRef(el: HTMLDivElement | null): RefObject<HTMLDivElement | null> {
  return { current: el };
}

describe("usePixiRenderer", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("creates a BeybladeGameRenderer and calls init() when containerRef has a DOM element", async () => {
    const ref = makeContainerRef(container);

    await act(async () => {
      renderHook(() => usePixiRenderer(ref));
      await Promise.resolve();
    });

    expect(MockRendererConstructor).toHaveBeenCalledWith(container);
    expect(mockInit).toHaveBeenCalledTimes(1);
  });

  it("does NOT create a renderer when containerRef is null", async () => {
    const ref = makeContainerRef(null);

    await act(async () => {
      renderHook(() => usePixiRenderer(ref));
    });

    expect(MockRendererConstructor).not.toHaveBeenCalled();
  });

  it("returns render, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber as functions", async () => {
    const ref = makeContainerRef(container);

    const { result } = renderHook(() => usePixiRenderer(ref));

    await act(async () => {
      await Promise.resolve();
    });

    expect(typeof result.current.render).toBe("function");
    expect(typeof result.current.spawnCollisionParticles).toBe("function");
    expect(typeof result.current.spawnSpinOutParticles).toBe("function");
    expect(typeof result.current.spawnDamageNumber).toBe("function");
  });

  it("calling render(null, new Map()) with no renderer initialized is a no-op (no throw)", () => {
    // Use a null ref so no renderer is ever created
    const ref = makeContainerRef(null);

    const { result } = renderHook(() => usePixiRenderer(ref));

    expect(() => result.current.render(null, new Map())).not.toThrow();
  });

  it("calls renderer destroy() on unmount", async () => {
    const ref = makeContainerRef(container);

    const { unmount } = renderHook(() => usePixiRenderer(ref));

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      unmount();
    });

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it("re-running the effect with the same container does not create a second renderer", async () => {
    const ref = makeContainerRef(container);

    const { rerender } = renderHook(() => usePixiRenderer(ref));

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      rerender();
    });

    // initializedRef guard prevents a second construction
    expect(MockRendererConstructor).toHaveBeenCalledTimes(1);
  });
});
