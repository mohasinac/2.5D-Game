import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// ─── Firebase ─────────────────────────────────────────────────────────────────

vi.mock("@/lib/firebase", () => ({
  db: {},
  storage: {},
  auth: {},
  COLLECTIONS: {
    BEYBLADE_STATS: "beyblade_stats",
    ARENAS: "arenas",
    STADIUMS: "stadiums",
    MATCHES: "matches",
    PLAYER_STATS: "player_stats",
    ARENA_THEME_ASSETS: "arena_theme_assets",
    OBSTACLE_ASSETS: "obstacle_assets",
    TURRET_ASSETS: "turret_assets",
    WATER_BODY_ASSETS: "water_body_assets",
    PORTAL_ASSETS: "portal_assets",
    SOUND_ASSETS: "sound_assets",
    BIT_BEAST_PARTS: "bit_beast_parts",
    ATTACK_RING_PARTS: "attack_ring_parts",
    WEIGHT_DISK_PARTS: "weight_disk_parts",
    SUB_PARTS: "sub_parts",
    TIP_PARTS: "tip_parts",
    CORE_PARTS: "core_parts",
    CASING_PARTS: "casing_parts",
    BEYBLADE_SYSTEMS: "beyblade_systems",
  },
}));

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn((_db, name) => ({ _name: name })),
  doc: vi.fn((_db, ...path) => ({ _path: path.join("/") })),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  setDoc: vi.fn().mockResolvedValue(undefined),
  addDoc: vi.fn().mockResolvedValue({ id: "mock-id" }),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn((...args) => args[0]),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((_auth, cb) => { cb(null); return vi.fn(); }),
  signOut: vi.fn().mockResolvedValue(undefined),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({
    user: { uid: "test-uid", email: "test@example.com" },
  }),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

// ─── Colyseus ─────────────────────────────────────────────────────────────────

const mockRoom = {
  sessionId: "test-session",
  roomId: "test-room-id",
  connection: { isOpen: true },
  onStateChange: vi.fn(),
  onError: vi.fn(),
  onLeave: vi.fn(),
  onMessage: vi.fn(),
  send: vi.fn(),
  leave: vi.fn(),
};

vi.mock("colyseus.js", () => ({
  Client: vi.fn().mockImplementation(() => ({
    joinOrCreate: vi.fn().mockResolvedValue(mockRoom),
    join: vi.fn().mockResolvedValue(mockRoom),
    joinById: vi.fn().mockResolvedValue(mockRoom),
  })),
}));

// ─── PixiJS ───────────────────────────────────────────────────────────────────

const makeContainer = () => ({
  addChild: vi.fn(),
  addChildAt: vi.fn(),
  removeChild: vi.fn(),
  removeChildren: vi.fn(),
  destroy: vi.fn(),
  children: [] as unknown[],
});

const makeGraphics = () => ({
  circle: vi.fn().mockReturnThis(),
  fill: vi.fn().mockReturnThis(),
  stroke: vi.fn().mockReturnThis(),
  rect: vi.fn().mockReturnThis(),
  clear: vi.fn().mockReturnThis(),
  moveTo: vi.fn().mockReturnThis(),
  lineTo: vi.fn().mockReturnThis(),
  arc: vi.fn().mockReturnThis(),
  ellipse: vi.fn().mockReturnThis(),
  x: 0, y: 0, alpha: 1, rotation: 0,
  scale: { set: vi.fn(), x: 1, y: 1 },
  skew: { set: vi.fn(), x: 0, y: 0 },
  ...makeContainer(),
});

vi.mock("pixi.js", () => ({
  Application: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
    resize: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      stop: vi.fn(),
      start: vi.fn(),
      destroy: vi.fn(),
      deltaMS: 16,
    },
    stage: makeContainer(),
    canvas: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      remove: vi.fn(),
    },
    screen: { width: 800, height: 600 },
    renderer: { context: { gl: { getExtension: vi.fn(() => null) } } },
  })),
  Container: vi.fn().mockImplementation(makeContainer),
  Graphics: vi.fn().mockImplementation(makeGraphics),
  Text: vi.fn().mockImplementation(() => ({
    anchor: { set: vi.fn() },
    destroy: vi.fn(),
    x: 0, y: 0, alpha: 1, rotation: 0,
    scale: { set: vi.fn() },
    style: {},
  })),
  Ticker: vi.fn(),
  Filter: vi.fn(),
}));

// ─── react-hot-toast ─────────────────────────────────────────────────────────

vi.mock("react-hot-toast", () => ({
  default: Object.assign(
    vi.fn(),
    { success: vi.fn(), error: vi.fn(), loading: vi.fn(), dismiss: vi.fn() }
  ),
  Toaster: () => null,
}));

// ─── import.meta.env defaults ────────────────────────────────────────────────

Object.defineProperty(import.meta, "env", {
  value: {
    VITE_GAME_SERVER_URL: "ws://localhost:2567",
    VITE_FIREBASE_API_KEY: "test-key",
    VITE_FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
    VITE_FIREBASE_PROJECT_ID: "test-project",
    VITE_FIREBASE_STORAGE_BUCKET: "test.appspot.com",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "123",
    VITE_FIREBASE_APP_ID: "1:123:web:abc",
  },
  writable: true,
});

// ─── RAF / cancelAnimationFrame stubs ────────────────────────────────────────

let rafId = 0;
global.requestAnimationFrame = vi.fn((cb) => { ++rafId; cb(0); return rafId; });
global.cancelAnimationFrame = vi.fn();

// ─── Reset all mocks between tests ───────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  rafId = 0;
});
