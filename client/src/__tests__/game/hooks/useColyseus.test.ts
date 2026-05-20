// FILE 5: src/__tests__/game/hooks/useColyseus.test.ts
// Tests for src/game/hooks/useColyseus.ts

import { renderHook, act, waitFor } from "@testing-library/react";
import { Client } from "colyseus.js";
import { useColyseus } from "@/game/hooks/useColyseus";
import type { ServerBeyblade } from "@/types/game";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Default options used in most tests */
const defaultOpts = { roomName: "tryout_room" };

/**
 * Retrieve the fresh mockRoom instance created by the mocked Client constructor.
 * Each test gets a new instance because vi.clearAllMocks() runs before each test
 * (from setup.ts) — which resets return values — so we call the constructor spy
 * to get the most-recently created client, then grab its joinOrCreate result.
 */
async function getMockRoom() {
  // The mock Client factory builds a fresh room object each time. Access it via
  // the instances tracked by the vi.fn() mock.
  const ClientMock = vi.mocked(Client);
  const latestInstance = ClientMock.mock.results[ClientMock.mock.results.length - 1]?.value;
  if (!latestInstance) return null;
  return await latestInstance.joinOrCreate.mock.results[0]?.value;
}

/** Build a fake ServerBeyblade for state-change tests. */
function makeFakeBeyblade(id: string, overrides: Partial<ServerBeyblade> = {}): ServerBeyblade {
  return {
    id,
    userId: `user-${id}`,
    username: `Player-${id}`,
    x: 100, y: 100,
    rotation: 0, velocityX: 0, velocityY: 0, angularVelocity: 0,
    health: 100, maxHealth: 100,
    stamina: 100, maxStamina: 100,
    spin: 2000, maxSpin: 2000,
    isActive: true, isAI: false,
    type: "balanced",
    radius: 5, actualSize: 120,
    isInvulnerable: false,
    damageDealt: 0, damageReceived: 0, collisions: 0,
    spinDirection: "right",
    power: 0, isAirborne: false, airborneTimer: 0,
    isDefending: false, attackBuffTimer: 0, dodgeBuffTimer: 0,
    stunTimer: 0, comboExecuting: false,
    ...overrides,
  };
}

// ─── Initial state ────────────────────────────────────────────────────────────

describe("useColyseus — initial state", () => {
  it("starts with connectionState=disconnected, gameState=null, empty beyblades Map", () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    expect(result.current.connectionState).toBe("disconnected");
    expect(result.current.gameState).toBeNull();
    expect(result.current.beyblades).toBeInstanceOf(Map);
    expect(result.current.beyblades.size).toBe(0);
    expect(result.current.myBeyblade).toBeNull();
    expect(result.current.room).toBeNull();
  });
});

// ─── autoConnect=true ─────────────────────────────────────────────────────────

describe("useColyseus — autoConnect=true", () => {
  it("automatically connects on mount and sets state to connected", async () => {
    const { result } = renderHook(() =>
      useColyseus({ ...defaultOpts, autoConnect: true })
    );

    await waitFor(() => {
      expect(result.current.connectionState).toBe("connected");
    });

    expect(vi.mocked(Client)).toHaveBeenCalledOnce();
    expect(result.current.room).not.toBeNull();
  });
});

// ─── autoConnect=false ────────────────────────────────────────────────────────

describe("useColyseus — autoConnect=false", () => {
  it("does NOT auto-connect and stays disconnected", async () => {
    const { result } = renderHook(() =>
      useColyseus({ ...defaultOpts, autoConnect: false })
    );

    // Give any accidental promises a chance to settle
    await new Promise<void>((r) => setTimeout(r, 0));

    expect(result.current.connectionState).toBe("disconnected");
    expect(vi.mocked(Client)).not.toHaveBeenCalled();
  });
});

// ─── manual connect() ─────────────────────────────────────────────────────────

describe("useColyseus — connect()", () => {
  it("transitions to connected when connect() is called manually", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    expect(result.current.connectionState).toBe("disconnected");

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.connectionState).toBe("connected");
    expect(result.current.room).not.toBeNull();
  });

  it("sets connectionState to connecting before the join resolves", async () => {
    // Delay joinOrCreate slightly so we can observe the 'connecting' state
    const ClientMock = vi.mocked(Client);

    let resolveJoin!: (val: unknown) => void;
    const delayedJoin = new Promise((res) => { resolveJoin = res; });

    ClientMock.mockImplementationOnce(() => ({
      joinOrCreate: vi.fn().mockReturnValue(delayedJoin),
      join: vi.fn(),
      joinById: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any));

    const { result } = renderHook(() => useColyseus(defaultOpts));

    // Start connecting but don't await
    act(() => { result.current.connect(); });

    expect(result.current.connectionState).toBe("connecting");

    // Resolve to avoid open handles (provide a minimal room stub)
    act(() => {
      resolveJoin({
        sessionId: "s1",
        roomId: "r1",
        connection: { isOpen: true },
        onStateChange: vi.fn(),
        onError: vi.fn(),
        onLeave: vi.fn(),
        onMessage: vi.fn(),
        send: vi.fn(),
        leave: vi.fn(),
      });
    });

    await waitFor(() => expect(result.current.connectionState).toBe("connected"));
  });
});

// ─── disconnect() ────────────────────────────────────────────────────────────

describe("useColyseus — disconnect()", () => {
  it("calls room.leave() when disconnect is invoked", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    const roomRef = result.current.room as any;
    expect(roomRef).not.toBeNull();

    act(() => {
      result.current.disconnect();
    });

    expect(roomRef.leave).toHaveBeenCalledOnce();
  });
});

// ─── sendInput() — connected ──────────────────────────────────────────────────

describe("useColyseus — sendInput() when connected", () => {
  it("calls room.send('input', ...) with the provided input object", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    const input = { moveLeft: true, moveRight: false, attack: false, specialMove: false };

    act(() => {
      result.current.sendInput(input);
    });

    const room = result.current.room as any;
    expect(room.send).toHaveBeenCalledWith("input", input);
  });
});

// ─── sendInput() — not connected ─────────────────────────────────────────────

describe("useColyseus — sendInput() when connection.isOpen=false", () => {
  it("does nothing when the connection is closed", async () => {
    const ClientMock = vi.mocked(Client);

    const closedRoom = {
      sessionId: "closed-session",
      roomId: "closed-room",
      connection: { isOpen: false }, // <-- closed
      onStateChange: vi.fn(),
      onError: vi.fn(),
      onLeave: vi.fn(),
      onMessage: vi.fn(),
      send: vi.fn(),
      leave: vi.fn(),
    };

    ClientMock.mockImplementationOnce(() => ({
      joinOrCreate: vi.fn().mockResolvedValue(closedRoom),
      join: vi.fn(),
      joinById: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any));

    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    act(() => {
      result.current.sendInput({ moveLeft: true });
    });

    expect(closedRoom.send).not.toHaveBeenCalled();
  });
});

// ─── onError ─────────────────────────────────────────────────────────────────

describe("useColyseus — onError callback", () => {
  it("sets connectionState to error when the room fires an error", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.connectionState).toBe("connected");

    // Grab the onError callback that was registered on the room
    const room = result.current.room as any;
    const onErrorCb: (code: number, message: string) => void =
      room.onError.mock.calls[0][0];

    act(() => {
      onErrorCb(1006, "WebSocket closed unexpectedly");
    });

    expect(result.current.connectionState).toBe("error");
  });
});

// ─── onLeave ─────────────────────────────────────────────────────────────────

describe("useColyseus — onLeave callback", () => {
  it("resets state to disconnected, null room, null gameState when room fires onLeave", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.connectionState).toBe("connected");

    const room = result.current.room as any;
    const onLeaveCb: () => void = room.onLeave.mock.calls[0][0];

    act(() => {
      onLeaveCb();
    });

    expect(result.current.connectionState).toBe("disconnected");
    expect(result.current.room).toBeNull();
    expect(result.current.gameState).toBeNull();
    expect(result.current.beyblades.size).toBe(0);
    expect(result.current.myBeyblade).toBeNull();
  });
});

// ─── onStateChange ────────────────────────────────────────────────────────────

describe("useColyseus — onStateChange callback", () => {
  it("updates beyblades Map and myBeyblade from state change", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    const room = result.current.room as any;
    const sessionId: string = room.sessionId; // "test-session" from setup.ts
    const onStateChangeCb: (state: any) => void = room.onStateChange.mock.calls[0][0];

    const fakeBey = makeFakeBeyblade(sessionId, { userId: "u1", username: "Me" });

    // Build a Map-like state.beyblades (Colyseus uses a MapSchema with forEach)
    const beyMap = new Map([[sessionId, fakeBey]]);
    const fakeState = {
      status: "in-progress",
      mode: "tryout",
      timer: 120,
      startTime: Date.now(),
      winner: "",
      matchId: "match-1",
      arena: { id: "a1", name: "Arena", width: 1080, height: 1080, shape: "circle", theme: "default" },
      beyblades: {
        forEach: (fn: (val: ServerBeyblade, key: string) => void) =>
          beyMap.forEach((v, k) => fn(v, k)),
      },
    };

    act(() => {
      onStateChangeCb(fakeState);
    });

    expect(result.current.beyblades.size).toBe(1);
    expect(result.current.beyblades.has(sessionId)).toBe(true);
    // myBeyblade is keyed by room.sessionId
    expect(result.current.myBeyblade).not.toBeNull();
    expect(result.current.myBeyblade?.username).toBe("Me");
  });

  it("updates gameState from state change", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    const room = result.current.room as any;
    const onStateChangeCb: (state: any) => void = room.onStateChange.mock.calls[0][0];

    const emptyBeyMap = new Map();
    const fakeState = {
      status: "countdown",
      mode: "ai-battle",
      timer: 60,
      startTime: 12345,
      winner: "",
      matchId: "match-2",
      arena: null,
      beyblades: {
        forEach: (fn: (val: ServerBeyblade, key: string) => void) =>
          emptyBeyMap.forEach((v, k) => fn(v, k)),
      },
    };

    act(() => {
      onStateChangeCb(fakeState);
    });

    expect(result.current.gameState?.status).toBe("countdown");
    expect(result.current.gameState?.mode).toBe("ai-battle");
    expect(result.current.gameState?.timer).toBe(60);
    expect(result.current.gameState?.arena).toBeNull();
  });

  it("sets myBeyblade to null when session is not in the beyblades map", async () => {
    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    const room = result.current.room as any;
    const onStateChangeCb: (state: any) => void = room.onStateChange.mock.calls[0][0];

    // Put a beyblade in the map that is NOT the current session
    const otherBey = makeFakeBeyblade("other-session");
    const beyMap = new Map([["other-session", otherBey]]);
    const fakeState = {
      status: "in-progress",
      mode: "single-battle-pvp",
      timer: 90,
      startTime: 0,
      winner: "",
      matchId: "match-3",
      arena: null,
      beyblades: {
        forEach: (fn: (val: ServerBeyblade, key: string) => void) =>
          beyMap.forEach((v, k) => fn(v, k)),
      },
    };

    act(() => {
      onStateChangeCb(fakeState);
    });

    expect(result.current.beyblades.size).toBe(1);
    expect(result.current.myBeyblade).toBeNull();
  });
});

// ─── connect() error handling ─────────────────────────────────────────────────

describe("useColyseus — connect() failure", () => {
  it("sets connectionState to error when joinOrCreate rejects", async () => {
    const ClientMock = vi.mocked(Client);

    ClientMock.mockImplementationOnce(() => ({
      joinOrCreate: vi.fn().mockRejectedValue(new Error("Connection refused")),
      join: vi.fn(),
      joinById: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any));

    const { result } = renderHook(() => useColyseus(defaultOpts));

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.connectionState).toBe("error");
  });
});
