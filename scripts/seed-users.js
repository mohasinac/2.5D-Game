/**
 * scripts/seed-users.js
 *
 * Creates two permanent accounts in Firebase Auth + Firestore:
 *   1. Admin  — admin@letitrip.in  / BeyAdmin#2025
 *   2. Player — player@letitrip.in / BeyPlayer#2025
 *
 * Idempotent — safe to re-run; updates password/role if accounts already exist.
 * Run: node scripts/seed-users.js
 */

require("dotenv").config();
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth }      = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();
const db   = getFirestore();

const USERS = [
  {
    email:       "admin@letitrip.in",
    password:    "BeyAdmin#2025",
    displayName: "Beyblade Admin",
    role:        "admin",
    adminClaim:  true,
  },
  {
    email:       "player@letitrip.in",
    password:    "BeyPlayer#2025",
    displayName: "Beyblade Player",
    role:        "user",
    adminClaim:  false,
  },
];

async function upsertUser(u) {
  let uid;
  try {
    const existing = await auth.getUserByEmail(u.email);
    uid = existing.uid;
    await auth.updateUser(uid, {
      password:     u.password,
      displayName:  u.displayName,
      emailVerified: true,
    });
    console.log(`  ✓ Updated  ${u.email}  uid=${uid}`);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    const created = await auth.createUser({
      email:         u.email,
      password:      u.password,
      displayName:   u.displayName,
      emailVerified: true,
    });
    uid = created.uid;
    console.log(`  ✓ Created  ${u.email}  uid=${uid}`);
  }

  // Set Firestore role doc
  await db.collection("users").doc(uid).set(
    {
      uid,
      email:       u.email,
      displayName: u.displayName,
      role:        u.role,
      updatedAt:   new Date().toISOString(),
    },
    { merge: true },
  );
  console.log(`  ✓ Firestore users/${uid} → role: "${u.role}"`);

  // Set custom claim
  await auth.setCustomUserClaims(uid, { admin: u.adminClaim });
  console.log(`  ✓ Custom claim: { admin: ${u.adminClaim} }`);

  return uid;
}

async function run() {
  console.log("\n── Seeding permanent users ─────────────────────────────\n");
  for (const u of USERS) {
    console.log(`[${u.role.toUpperCase()}] ${u.email}`);
    await upsertUser(u);
    console.log();
  }

  console.log("── .env snippet (copy into root .env) ──────────────────");
  console.log("TEST_EMAIL=admin@letitrip.in");
  console.log("TEST_PASSWORD=BeyAdmin#2025");
  console.log("TEST2_EMAIL=player@letitrip.in");
  console.log("TEST2_PASSWORD=BeyPlayer#2025");
  console.log("─────────────────────────────────────────────────────────\n");
  console.log("✅ Done. Sign out and back in (or call getIdToken(true)) for claims to take effect.");
}

run().catch(err => { console.error("✗", err.message); process.exit(1); });
