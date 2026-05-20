#!/usr/bin/env node
/**
 * Connection check script.
 * Usage:
 *   node scripts/check.js                          # uses RAILWAY_URL from .env
 *   node scripts/check.js https://your.railway.app # override URL inline
 */

require("dotenv").config();
const admin = require("firebase-admin");

const RAILWAY_URL = process.argv[2] || process.env.RAILWAY_URL || "http://localhost:2567";
const TIMEOUT_MS = 8000;

const GREEN  = "\x1b[32m✔\x1b[0m";
const RED    = "\x1b[31m✘\x1b[0m";
const YELLOW = "\x1b[33m…\x1b[0m";
const BOLD   = (s) => `\x1b[1m${s}\x1b[0m`;
const DIM    = (s) => `\x1b[2m${s}\x1b[0m`;

function pass(label, detail = "") {
  console.log(`  ${GREEN} ${BOLD(label)} ${DIM(detail)}`);
}
function fail(label, err) {
  console.log(`  ${RED} ${BOLD(label)}`);
  console.log(`     ${DIM(err?.message ?? err)}`);
}
function info(label) {
  console.log(`  ${YELLOW} ${label}`);
}

async function checkRailway() {
  console.log(`\n${BOLD("1. Railway Game Server")}  ${DIM(RAILWAY_URL)}`);

  // Health endpoint
  info("GET /health");
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${RAILWAY_URL}/health`, { signal: ctrl.signal });
    clearTimeout(timer);
    const body = await res.json();
    if (res.ok) pass("/health", `HTTP ${res.status} — ${JSON.stringify(body)}`);
    else fail("/health", `HTTP ${res.status}`);
  } catch (err) {
    fail("/health", err.name === "AbortError" ? `Timed out after ${TIMEOUT_MS}ms` : err);
  }

  // Colyseus monitor (confirms Colyseus is running)
  info("GET /colyseus");
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${RAILWAY_URL}/colyseus`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok || res.status === 302) pass("/colyseus monitor", `HTTP ${res.status}`);
    else fail("/colyseus monitor", `HTTP ${res.status}`);
  } catch (err) {
    fail("/colyseus monitor", err.name === "AbortError" ? `Timed out after ${TIMEOUT_MS}ms` : err);
  }
}

async function checkFirebase() {
  console.log(`\n${BOLD("2. Firebase")}  ${DIM("project: " + process.env.FIREBASE_ADMIN_PROJECT_ID)}`);

  const projectId    = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail  = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey   = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    fail("Firebase Admin credentials", "Missing FIREBASE_ADMIN_* env vars — check your .env");
    return;
  }

  // Init (guard against double-init if script is re-run in same process)
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }

  const db = admin.firestore();

  // Check each collection with a lightweight limit(1) read
  const collections = [
    "beyblade_stats",
    "arenas",
    "stadiums",
    "matches",
    "player_stats",
  ];

  for (const col of collections) {
    info(`Firestore: ${col}`);
    try {
      const snap = await db.collection(col).limit(1).get();
      pass(`${col}`, `${snap.size} doc(s) returned (collection ${snap.empty ? "empty" : "has data"})`);
    } catch (err) {
      fail(`${col}`, err);
    }
  }

  // Storage bucket ping
  info("Firebase Storage bucket");
  try {
    const bucket = admin.storage().bucket(`${projectId}.appspot.com`);
    await bucket.exists();
    pass("Storage bucket", `${projectId}.appspot.com reachable`);
  } catch (err) {
    // storageBucket might use .firebasestorage.app domain — try that
    try {
      const bucket = admin.storage().bucket(`${projectId}.firebasestorage.app`);
      await bucket.exists();
      pass("Storage bucket", `${projectId}.firebasestorage.app reachable`);
    } catch (err2) {
      fail("Storage bucket", err2);
    }
  }
}

(async () => {
  console.log(BOLD("\n══════════════════════════════════════"));
  console.log(BOLD("  Beyblade Game — Connection Check"));
  console.log(BOLD("══════════════════════════════════════"));

  await checkRailway();
  await checkFirebase();

  console.log("\n" + DIM("Done.") + "\n");
  process.exit(0);
})();
