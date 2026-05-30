import * as admin from "firebase-admin";
import type { BeybladeStats, ArenaConfig } from "../types/shared";
import type { ArenaSystem } from "../types/arenaSystem";
import type {
  BeybladeSystem,
  ARPart,
  WDPart,
  TipPart,
  CorePart,
  CasingPart,
  BitBeastPart,
  SpinTrackPart,
  SubPart,
} from "../../shared/types/beybladeSystem";
import { FIREBASE_COLLECTIONS } from "../constants/firebase";
import {
  PARTS_25D_COLLECTIONS,
} from "../constants/collections";
import { getFallbackPart } from "./fallbackBeys";

// Initialize Firebase Admin (if not already initialized)
let db: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  // Use environment variables for Firebase Admin credentials
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('⚠️  Firebase Admin credentials not found in environment variables.');
    console.warn('   Server will run but cannot access Firestore.');
    console.warn('   Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      db = admin.firestore();
      console.log('✅ Firebase Admin initialized');
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error);
    }
  }
}

export function getFirestoreDb(): admin.firestore.Firestore | null { return db; }

/**
 * Load beyblade data from Firestore
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms)),
  ]);
}

export async function loadBeyblade(beybladeId: string): Promise<BeybladeStats | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const doc = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.BEYBLADE_STATS).doc(beybladeId).get(),
      5000
    );

    if (!doc.exists) {
      console.error(`Beyblade not found: ${beybladeId}`);
      return null;
    }

    return doc.data() as BeybladeStats;
  } catch (error) {
    console.error("Error loading beyblade:", error);
    return null;
  }
}

/**
 * Load arena data from Firestore
 */
export async function loadArena(arenaId: string): Promise<ArenaConfig | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const doc = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.ARENAS).doc(arenaId).get(),
      5000
    );

    if (!doc.exists) {
      console.error(`Arena not found: ${arenaId}`);
      return null;
    }

    return doc.data() as ArenaConfig;
  } catch (error) {
    console.error("Error loading arena:", error);
    return null;
  }
}

/**
 * Load arena system (2.5D) data from Firestore
 */
export async function loadArenaSystem(arenaSystemId: string): Promise<ArenaSystem | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const doc = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.ARENA_SYSTEMS).doc(arenaSystemId).get(),
      5000
    );

    if (!doc.exists) {
      console.error(`Arena system not found: ${arenaSystemId}`);
      return null;
    }

    return doc.data() as ArenaSystem;
  } catch (error) {
    console.error("Error loading arena system:", error);
    return null;
  }
}

/**
 * Load 2.5D beyblade system (composition + part IDs) from Firestore.
 * Used by the parts25d/* rooms; classic 2D rooms read beyblade_stats via loadBeyblade().
 */
export async function loadBeybladeSystem(systemId: string): Promise<BeybladeSystem | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const doc = await withTimeout(
      db.collection(FIREBASE_COLLECTIONS.BEYBLADE_SYSTEMS).doc(systemId).get(),
      5000
    );

    if (!doc.exists) {
      console.error(`Beyblade system not found: ${systemId}`);
      return null;
    }

    return doc.data() as BeybladeSystem;
  } catch (error) {
    console.error("Error loading beyblade system:", error);
    return null;
  }
}

// Resolved part bundle — matches PartSystemManager.ResolvedPartBundle.
// Kept here so server-side rooms can load + resolve a BeybladeSystem in one shot.
export interface ResolvedBeybladeSystem {
  system: BeybladeSystem;
  parts: {
    tip?: TipPart;
    ar?: ARPart;
    wd?: WDPart;
    core?: CorePart;
    casing?: CasingPart;
    bitBeast?: BitBeastPart;
    spinTrack?: SpinTrackPart;
    subParts: SubPart[];
  };
}

async function loadDoc<T>(collection: string, id: string | undefined): Promise<T | null> {
  if (!db || !id) return null;
  try {
    const doc = await withTimeout(db.collection(collection).doc(id).get(), 5000);
    return doc.exists ? (doc.data() as T) : null;
  } catch (err) {
    console.error(`Error loading ${collection}/${id}:`, err);
    return null;
  }
}

/**
 * Load a 2.5D BeybladeSystem doc AND fetch every part it references in parallel.
 * Returns null if the system itself can't be loaded; individual missing parts
 * are silently skipped (the PartSystemManager handles undefined parts gracefully).
 */
export async function loadBeybladeSystemBundle(systemId: string): Promise<ResolvedBeybladeSystem | null> {
  const system = await loadBeybladeSystem(systemId);
  if (!system) return null;

  const subPartIds = (system.subPartAttachments ?? []).map(a => a.subPartId).filter(Boolean);

  const [tip, ar, wd, core, casing, bitBeast, spinTrack, subParts] = await Promise.all([
    loadDoc<TipPart>(PARTS_25D_COLLECTIONS.TIP_PARTS, system.tipId),
    loadDoc<ARPart>(PARTS_25D_COLLECTIONS.ATTACK_RING_PARTS, system.attackRingId),
    loadDoc<WDPart>(PARTS_25D_COLLECTIONS.WEIGHT_DISK_PARTS, system.weightDiskId),
    loadDoc<CorePart>(PARTS_25D_COLLECTIONS.CORE_PARTS, system.coreId),
    loadDoc<CasingPart>(PARTS_25D_COLLECTIONS.CASING_PARTS, system.casingId),
    loadDoc<BitBeastPart>(PARTS_25D_COLLECTIONS.BIT_BEAST_PARTS, system.bitBeastId),
    loadDoc<SpinTrackPart>(PARTS_25D_COLLECTIONS.SPIN_TRACK_PARTS, system.spinTrackId),
    Promise.all(subPartIds.map(id => loadDoc<SubPart>(PARTS_25D_COLLECTIONS.SUB_PARTS, id))),
  ]);

  // For each part, fall back to inline preset when Firestore returns nothing.
  const resolvedTip       = tip       ?? getFallbackPart<TipPart>(system.tipId ?? "");
  const resolvedAr        = ar        ?? getFallbackPart<ARPart>(system.attackRingId ?? "");
  const resolvedWd        = wd        ?? getFallbackPart<WDPart>(system.weightDiskId ?? "");
  const resolvedCore      = core      ?? getFallbackPart<CorePart>(system.coreId ?? "");
  const resolvedCasing    = casing    ?? getFallbackPart<CasingPart>(system.casingId ?? "");
  const resolvedBitBeast  = bitBeast  ?? getFallbackPart<BitBeastPart>(system.bitBeastId ?? "");
  const resolvedSpinTrack = spinTrack ?? getFallbackPart<SpinTrackPart>(system.spinTrackId ?? "");

  return {
    system,
    parts: {
      tip:       resolvedTip,
      ar:        resolvedAr,
      wd:        resolvedWd,
      core:      resolvedCore,
      casing:    resolvedCasing,
      bitBeast:  resolvedBitBeast,
      spinTrack: resolvedSpinTrack,
      subParts:  subParts.filter((p): p is SubPart => p != null),
    },
  };
}

/**
 * Save match result to Firestore
 */
export async function saveMatch(matchData: any): Promise<string | null> {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const docRef = await db.collection(FIREBASE_COLLECTIONS.MATCHES).add({
      ...matchData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Match saved: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error saving match:", error);
    return null;
  }
}

/**
 * Update player stats
 */
/**
 * Update player stats. Numeric fields (matchesPlayed, wins, losses, totalDamageDealt,
 * totalCollisions, tournamentPoints, etc.) are INCREMENTED atomically.
 * Non-numeric fields are merged via Firestore's `merge: true`.
 *
 * Pass `_overwrite: { fieldName: value }` to force a numeric set (rarely needed).
 */
const INCREMENT_FIELDS = new Set([
  "matchesPlayed",
  "wins",
  "losses",
  "draws",
  "totalDamageDealt",
  "totalCollisions",
  "tournamentPoints",
  "burstKills",
]);

export async function updatePlayerStats(
  userId: string,
  updates: Partial<any>
): Promise<boolean> {
  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  try {
    const docRef = db.collection(FIREBASE_COLLECTIONS.PLAYER_STATS).doc(userId);
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (typeof v === "number" && INCREMENT_FIELDS.has(k)) {
        out[k] = admin.firestore.FieldValue.increment(v);
      } else {
        out[k] = v;
      }
    }
    await docRef.set(out, { merge: true });

    console.log(`Player stats updated: ${userId}`);
    return true;
  } catch (error) {
    console.error("Error updating player stats:", error);
    return false;
  }
}

export async function loadBeybladesBatch(ids: string[]): Promise<Map<string, BeybladeStats>> {
  const result = new Map<string, BeybladeStats>();
  if (!db || ids.length === 0) return result;
  try {
    // Firestore "in" query limit is 30; chunk if needed
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 30) chunks.push(ids.slice(i, i + 30));
    for (const chunk of chunks) {
      const snap = await withTimeout(
        db.collection(FIREBASE_COLLECTIONS.BEYBLADE_STATS).where(admin.firestore.FieldPath.documentId(), "in", chunk).get(),
        8000
      );
      snap.docs.forEach(d => result.set(d.id, d.data() as BeybladeStats));
    }
  } catch (err) {
    console.error("Error loading beyblades batch:", err);
  }
  return result;
}

export interface BehaviorDefDoc {
  id: string;
  category: string;
  description?: string;
  params?: unknown[];
}

export interface ComboEffectDoc {
  id: string;
  name: string;
  cost: number;
  cooldownMs: number;
  windupTicks?: number;
  bleedTicks?: number;
  tasks?: unknown[];
  steps?: unknown[];
}

/**
 * Load all behavior definitions from Firestore (keyword library).
 * Called once in room onCreate() and cached.
 */
export async function loadBehaviorDefs(): Promise<BehaviorDefDoc[]> {
  if (!db) return [];
  try {
    const snap = await withTimeout(
      db.collection("behavior_defs").get(),
      8000
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BehaviorDefDoc));
  } catch (err) {
    console.error("Error loading behavior_defs:", err);
    return [];
  }
}

/**
 * Load all combo effect definitions from Firestore.
 * Called once in room onCreate() and cached.
 */
export async function loadComboEffects(): Promise<ComboEffectDoc[]> {
  if (!db) return [];
  try {
    const snap = await withTimeout(
      db.collection("combo_effects").get(),
      8000
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ComboEffectDoc));
  } catch (err) {
    console.error("Error loading combo_effects:", err);
    return [];
  }
}

export { db };
