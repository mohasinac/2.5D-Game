// FILE 2: src/__tests__/contexts/GameContext.test.tsx
// Tests for src/contexts/GameContext.tsx

import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { GameProvider, useGame, useGameStore, defaultSettings } from "@/contexts/GameContext";
import type { ReactNode } from "react";

// ─── Store reset ─────────────────────────────────────────────────────────────
// Zustand is a global singleton — reset to default state before each test to
// prevent state leaking between tests.

beforeEach(() => {
  useGameStore.setState({ settings: { ...defaultSettings }, _hydrated: true });
});

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

// ─── setBeyblade ──────────────────────────────────────────────────────────────

describe("GameContext — setBeyblade", () => {
  it("updates settings.beybladeId", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-123");
    });

    expect(result.current.settings.beybladeId).toBe("bey-123");
  });
});

// ─── setArena ────────────────────────────────────────────────────────────────

describe("GameContext — setArena", () => {
  it("updates settings.arenaId", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setArena("arena-456");
    });

    expect(result.current.settings.arenaId).toBe("arena-456");
  });
});

// ─── setGameMode ─────────────────────────────────────────────────────────────

describe("GameContext — setGameMode", () => {
  it("updates settings.gameMode", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setGameMode("tryout");
    });

    expect(result.current.settings.gameMode).toBe("tryout");
  });

  it("can set gameMode to pvp", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setGameMode("pvp");
    });

    expect(result.current.settings.gameMode).toBe("pvp");
  });
});

// ─── setDifficulty ───────────────────────────────────────────────────────────

describe("GameContext — setDifficulty", () => {
  it("updates settings.difficulty", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setDifficulty("hard");
    });

    expect(result.current.settings.difficulty).toBe("hard");
  });

  it("can cycle through all difficulty values", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    for (const diff of ["medium", "hard", "hell"] as const) {
      act(() => {
        result.current.setDifficulty(diff);
      });
      expect(result.current.settings.difficulty).toBe(diff);
    }
  });
});

// ─── setOpponent ─────────────────────────────────────────────────────────────

describe("GameContext — setOpponent", () => {
  it("updates settings.opponentId", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setOpponent("opponent-789");
    });

    expect(result.current.settings.opponentId).toBe("opponent-789");
  });
});

// ─── setGameConfig ────────────────────────────────────────────────────────────

describe("GameContext — setGameConfig", () => {
  it("merges a partial config into existing settings", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-init");
      result.current.setArena("arena-init");
    });

    act(() => {
      result.current.setGameConfig({ beybladeId: "bey-new", difficulty: "hell" });
    });

    expect(result.current.settings.beybladeId).toBe("bey-new");
    // arenaId was not in the partial config — must be preserved
    expect(result.current.settings.arenaId).toBe("arena-init");
    expect(result.current.settings.difficulty).toBe("hell");
  });

  it("can set multiple fields at once", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setGameConfig({
        beybladeId: "bey-x",
        arenaId: "arena-y",
        gameMode: "single-battle",
      });
    });

    expect(result.current.settings.beybladeId).toBe("bey-x");
    expect(result.current.settings.arenaId).toBe("arena-y");
    expect(result.current.settings.gameMode).toBe("single-battle");
  });
});

// ─── isReady ─────────────────────────────────────────────────────────────────

describe("GameContext — isReady", () => {
  it("is false when beybladeId, arenaId, and gameMode are all null", () => {
    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.isReady).toBe(false);
  });

  it("is false when only beybladeId is set", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-1");
    });

    expect(result.current.isReady).toBe(false);
  });

  it("is false when beybladeId and arenaId are set but gameMode is null", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-1");
      result.current.setArena("arena-1");
    });

    expect(result.current.isReady).toBe(false);
  });

  it("is true when beybladeId, arenaId, and gameMode are all set", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-1");
      result.current.setArena("arena-1");
      result.current.setGameMode("tryout");
    });

    expect(result.current.isReady).toBe(true);
  });
});

// ─── resetGame ───────────────────────────────────────────────────────────────

describe("GameContext — resetGame", () => {
  it("clears beybladeId, arenaId, and gameMode", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-1");
      result.current.setArena("arena-1");
      result.current.setGameMode("pvp");
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.settings.beybladeId).toBeNull();
    expect(result.current.settings.arenaId).toBeNull();
    expect(result.current.settings.gameMode).toBeNull();
  });

  it("preserves userId and username after reset", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    // Capture the initial userId (generated at module load time)
    const initialUserId = result.current.settings.userId;
    const initialUsername = result.current.settings.username;

    act(() => {
      result.current.setBeyblade("bey-1");
      result.current.setArena("arena-1");
      result.current.setGameMode("tryout");
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.settings.userId).toBe(initialUserId);
    expect(result.current.settings.username).toBe(initialUsername);
  });
});

// ─── startGame ───────────────────────────────────────────────────────────────

describe("GameContext — startGame", () => {
  it("sets gameMode", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.startGame("single-battle");
    });

    expect(result.current.settings.gameMode).toBe("single-battle");
  });

  it("does not clear other settings when starting game", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.setBeyblade("bey-1");
      result.current.setArena("arena-1");
    });

    act(() => {
      result.current.startGame("tryout");
    });

    expect(result.current.settings.beybladeId).toBe("bey-1");
    expect(result.current.settings.arenaId).toBe("arena-1");
    expect(result.current.settings.gameMode).toBe("tryout");
  });
});

// ─── useGame — provider-independent ──────────────────────────────────────────
// Zustand is global — useGame() works without a GameProvider wrapper.

describe("useGame — provider-independent", () => {
  it("returns the expected API shape without a GameProvider", () => {
    const { result } = renderHook(() => useGame());
    expect(result.current).toHaveProperty("settings");
    expect(result.current).toHaveProperty("isReady");
    expect(result.current).toHaveProperty("isHydrated");
    expect(result.current).toHaveProperty("setBeyblade");
    expect(result.current).toHaveProperty("setArena");
    expect(result.current).toHaveProperty("setGameMode");
    expect(result.current).toHaveProperty("resetGame");
  });
});
