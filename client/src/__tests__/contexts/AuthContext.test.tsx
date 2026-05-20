// FILE 3: src/__tests__/contexts/AuthContext.test.tsx
// Tests for src/contexts/AuthContext.tsx

import { render, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

/** Build a minimal Firebase User-like object. */
function makeFakeUser(overrides: Partial<User> = {}): User {
  return {
    uid: "uid-test",
    email: "test@example.com",
    displayName: null,
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    phoneNumber: null,
    providerData: [],
    providerId: "firebase",
    refreshToken: "",
    tenantId: null,
    metadata: {} as User["metadata"],
    delete: vi.fn(),
    getIdToken: vi.fn(),
    getIdTokenResult: vi.fn(),
    reload: vi.fn(),
    toJSON: vi.fn(),
    ...overrides,
  } as unknown as User;
}

/** Make onAuthStateChanged invoke the callback with `user` synchronously. */
function mockAuthState(user: User | null) {
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, cb) => {
    // The type from firebase/auth accepts cb as an observer or function.
    // Cast to the overload that takes a plain callback.
    (cb as (user: User | null) => void)(user);
    return vi.fn(); // unsubscribe no-op
  });
}

/** Build a Firestore DocumentSnapshot-like object. */
function makeSnap(exists: boolean, data: Record<string, unknown> = {}) {
  return {
    exists: () => exists,
    data: () => (exists ? data : undefined),
  };
}

// ─── Initial state ────────────────────────────────────────────────────────────

describe("AuthContext — initial state when auth fires null", () => {
  it("has currentUser=null, isAdmin=false, loading=false after null auth state", async () => {
    // setup.ts already mocks onAuthStateChanged to call cb(null), but vi.clearAllMocks()
    // in beforeEach resets all mocks, so we re-apply it explicitly here.
    mockAuthState(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });
});

// ─── Admin user ───────────────────────────────────────────────────────────────

describe("AuthContext — admin user", () => {
  it("sets isAdmin=true when Firestore doc has role: admin", async () => {
    const user = makeFakeUser({ uid: "admin-uid" });
    mockAuthState(user);

    vi.mocked(getDoc).mockResolvedValueOnce(
      makeSnap(true, { role: "admin" }) as any
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser).toBe(user);
    expect(result.current.isAdmin).toBe(true);
  });
});

// ─── Regular user ────────────────────────────────────────────────────────────

describe("AuthContext — regular user", () => {
  it("sets isAdmin=false when Firestore doc has role: user", async () => {
    const user = makeFakeUser({ uid: "regular-uid" });
    mockAuthState(user);

    vi.mocked(getDoc).mockResolvedValueOnce(
      makeSnap(true, { role: "user" }) as any
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });
});

// ─── First sign-in (no existing doc) ─────────────────────────────────────────

describe("AuthContext — first sign-in", () => {
  it("creates a Firestore doc and sets isAdmin=false when doc does not exist", async () => {
    const user = makeFakeUser({ uid: "new-uid", email: "new@example.com" });
    mockAuthState(user);

    // Firestore snap: document does not exist
    vi.mocked(getDoc).mockResolvedValueOnce(makeSnap(false) as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
    // setDoc should have been called to create the user document
    expect(vi.mocked(setDoc)).toHaveBeenCalledOnce();
    const setDocArgs = vi.mocked(setDoc).mock.calls[0];
    expect(setDocArgs[1]).toMatchObject({
      uid: "new-uid",
      email: "new@example.com",
      role: "user",
    });
  });
});

// ─── signOutUser ──────────────────────────────────────────────────────────────

describe("AuthContext — signOutUser", () => {
  it("calls firebase signOut when signOutUser is invoked", async () => {
    mockAuthState(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.signOutUser();

    expect(vi.mocked(signOut)).toHaveBeenCalledOnce();
  });
});

// ─── useAuth default context ──────────────────────────────────────────────────

describe("AuthContext — useAuth outside AuthProvider", () => {
  it("returns the default context value with loading=true when used outside AuthProvider", () => {
    // useAuth uses useContext with a default value (not throwing), so it returns
    // the default context: { currentUser: null, isAdmin: false, loading: true }
    const { result } = renderHook(() => useAuth());

    expect(result.current.currentUser).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    // The default context created with createContext has loading: true
    expect(result.current.loading).toBe(true);
  });
});

// ─── currentUser is set to the user object ────────────────────────────────────

describe("AuthContext — currentUser", () => {
  it("exposes the firebase User object on currentUser", async () => {
    const user = makeFakeUser({ uid: "uid-42", email: "player@game.com" });
    mockAuthState(user);

    vi.mocked(getDoc).mockResolvedValueOnce(makeSnap(true, { role: "user" }) as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser).toBe(user);
    expect(result.current.currentUser?.uid).toBe("uid-42");
  });
});
