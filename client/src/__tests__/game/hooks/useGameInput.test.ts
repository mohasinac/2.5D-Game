// FILE 4: src/__tests__/game/hooks/useGameInput.test.ts
// Tests for src/game/hooks/useGameInput.ts

import { renderHook, act } from "@testing-library/react";
import { useGameInput } from "@/game/hooks/useGameInput";

// ─── RAF override ─────────────────────────────────────────────────────────────
// setup.ts mocks RAF to call the callback synchronously and immediately,
// causing infinite recursion in useGameInput's loop.  We override RAF here
// to be a simple id-counter that captures (but does NOT invoke) the callback.
// Tests that need a loop tick call runFrame() explicitly.

let _rafId = 0;
let _pendingCb: FrameRequestCallback | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _rafSpy: ReturnType<typeof vi.spyOn<any, any>> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _cafSpy: ReturnType<typeof vi.spyOn<any, any>> | null = null;

function installSafeRaf() {
  _rafId = 0;
  _pendingCb = null;
  _rafSpy = vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((cb) => {
    _pendingCb = cb;
    return ++_rafId;
  });
  _cafSpy = vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {
    _pendingCb = null;
  });
}

function restoreRaf() {
  _rafSpy?.mockRestore();
  _cafSpy?.mockRestore();
  _pendingCb = null;
}

/** Execute one pending RAF callback (simulates one animation frame). */
function runFrame() {
  if (_pendingCb) {
    const cb = _pendingCb;
    _pendingCb = null; // clear first so loop's next rAF is captured fresh
    cb(performance.now());
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Fire a keydown event on window for the given code. */
function pressKey(code: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true }));
}

/** Fire a keyup event on window for the given code. */
function releaseKey(code: string) {
  window.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }));
}

// ─── disabled hook ────────────────────────────────────────────────────────────

describe("useGameInput — enabled=false", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("does not call sendInput after a keydown when disabled", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, false));

    pressKey("KeyA");
    runFrame();

    expect(sendInput).not.toHaveBeenCalled();
  });

  it("does not add keydown/keyup listeners to window when disabled", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const sendInput = vi.fn();

    renderHook(() => useGameInput(sendInput, false));

    const keyListeners = addSpy.mock.calls.filter(
      ([event]) => event === "keydown" || event === "keyup"
    );
    expect(keyListeners).toHaveLength(0);
    addSpy.mockRestore();
  });
});

// ─── WASD movement ────────────────────────────────────────────────────────────

describe("useGameInput — WASD keys", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("pressing A sends moveLeft=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyA");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveLeft: true })
    );
  });

  it("pressing D sends moveRight=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyD");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveRight: true })
    );
  });

  it("pressing W sends moveUp=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyW");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveUp: true })
    );
  });

  it("pressing S sends moveDown=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyS");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveDown: true })
    );
  });
});

// ─── Arrow key movement ───────────────────────────────────────────────────────

describe("useGameInput — Arrow keys", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("pressing ArrowLeft sends moveLeft=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("ArrowLeft");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveLeft: true })
    );
  });

  it("pressing ArrowRight sends moveRight=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("ArrowRight");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveRight: true })
    );
  });

  it("pressing ArrowUp sends moveUp=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("ArrowUp");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveUp: true })
    );
  });

  it("pressing ArrowDown sends moveDown=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("ArrowDown");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveDown: true })
    );
  });
});

// ─── Action keys J/K/L/I ─────────────────────────────────────────────────────

describe("useGameInput — action keys", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("pressing J sends attack=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyJ");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ attack: true })
    );
  });

  it("pressing K sends defense=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyK");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ defense: true })
    );
  });

  it("pressing L sends dodge=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyL");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ dodge: true })
    );
  });

  it("pressing I sends jump=true", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      pressKey("KeyI");
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ jump: true })
    );
  });
});

// ─── Space held → chargeHeld ─────────────────────────────────────────────────

describe("useGameInput — Space held", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("sets chargeHeld=true while space is held down", () => {
    const nowMock = vi.spyOn(Date, "now").mockReturnValue(1000);
    const sendInput = vi.fn();

    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      // Press space — spaceDownTimeRef gets set to Date.now()=1000
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ chargeHeld: true })
    );

    nowMock.mockRestore();
  });
});

// ─── Short Space tap → specialTap ────────────────────────────────────────────

describe("useGameInput — Space short tap", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("sets specialTap=true for one frame after a quick space tap (< 150ms)", () => {
    const nowMock = vi.spyOn(Date, "now").mockReturnValue(1000);
    const sendInput = vi.fn();

    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      // Press space at t=1000
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    });

    // Release at t=1050 — held 50ms (< 150ms threshold)
    nowMock.mockReturnValue(1050);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
      runFrame();
    });

    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ specialTap: true })
    );

    nowMock.mockRestore();
  });

  it("does NOT set specialTap=true when space is held longer than 150ms", () => {
    const nowMock = vi.spyOn(Date, "now").mockReturnValue(1000);
    const sendInput = vi.fn();

    renderHook(() => useGameInput(sendInput, true));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    });

    // Release after 200ms — above threshold
    nowMock.mockReturnValue(1200);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
      runFrame();
    });

    // Either sendInput was not called, or was called without specialTap=true
    const calls = sendInput.mock.calls;
    for (const [input] of calls) {
      expect(input.specialTap).not.toBe(true);
    }

    nowMock.mockRestore();
  });
});

// ─── Duplicate suppression ────────────────────────────────────────────────────

describe("useGameInput — duplicate suppression", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("does not call sendInput on a second frame when nothing changed", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    // First frame — all false, sends initial state
    act(() => { runFrame(); });
    const firstCount = sendInput.mock.calls.length;

    // Second frame — nothing changed, should NOT call sendInput again
    act(() => { runFrame(); });

    expect(sendInput.mock.calls.length).toBe(firstCount);
  });

  it("sends again only when input actually changes", () => {
    const sendInput = vi.fn();
    renderHook(() => useGameInput(sendInput, true));

    // Initial frame (all-false state → sends once)
    act(() => { runFrame(); });
    sendInput.mockClear();

    // Press A — state changes
    act(() => {
      pressKey("KeyA");
      runFrame();
    });
    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveLeft: true })
    );
    sendInput.mockClear();

    // Release A — state changes again
    act(() => {
      releaseKey("KeyA");
      runFrame();
    });
    expect(sendInput).toHaveBeenCalledWith(
      expect.objectContaining({ moveLeft: false })
    );
  });
});

// ─── Cleanup on unmount ───────────────────────────────────────────────────────

describe("useGameInput — cleanup on unmount", () => {
  beforeEach(() => installSafeRaf());
  afterEach(() => restoreRaf());

  it("removes keydown and keyup listeners from window on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const sendInput = vi.fn();

    const { unmount } = renderHook(() => useGameInput(sendInput, true));
    unmount();

    const removedEvents = removeSpy.mock.calls.map(([event]) => event);
    expect(removedEvents).toContain("keydown");
    expect(removedEvents).toContain("keyup");

    removeSpy.mockRestore();
  });

  it("calls cancelAnimationFrame on unmount", () => {
    const sendInput = vi.fn();
    const { unmount } = renderHook(() => useGameInput(sendInput, true));

    unmount();

    // cancelAnimationFrame spy is our _cafSpy
    expect(_cafSpy).toHaveBeenCalled();
  });

  it("does not call sendInput after unmount when a key is pressed", () => {
    const sendInput = vi.fn();
    const { unmount } = renderHook(() => useGameInput(sendInput, true));
    sendInput.mockClear();

    unmount();
    pressKey("KeyA");
    // No pending frame should be runnable — verify sendInput stays silent
    expect(sendInput).not.toHaveBeenCalled();
  });
});
