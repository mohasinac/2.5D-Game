/**
 * scripts/create-test-user.js
 *
 * Creates a Firebase admin test account for Playwright E2E tests.
 * Run: node scripts/create-test-user.js
 *
 * Creates: testadmin@letitrip.in / TestAdmin1234!
 * Role: admin (written to Firestore users/{uid})
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

const TEST_EMAIL    = "admin@letitrip.in";
const TEST_PASSWORD = "BeyAdmin#2025";
const TEST_NAME     = "Beyblade Admin";

async function run() {
  let uid;

  // Try to get existing user first
  try {
    const existing = await auth.getUserByEmail(TEST_EMAIL);
    uid = existing.uid;
    // Update password in case it changed
    await auth.updateUser(uid, { password: TEST_PASSWORD, displayName: TEST_NAME });
    console.log(`✓ Updated existing test user  uid=${uid}`);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    // Create new
    const user = await auth.createUser({
      email:        TEST_EMAIL,
      password:     TEST_PASSWORD,
      displayName:  TEST_NAME,
      emailVerified: true,
    });
    uid = user.uid;
    console.log(`✓ Created new test user  uid=${uid}`);
  }

  // Write admin role to Firestore
  await db.collection("users").doc(uid).set(
    { uid, email: TEST_EMAIL, displayName: TEST_NAME, role: "admin", createdAt: new Date().toISOString() },
    { merge: true }
  );
  console.log(`✓ Firestore users/${uid} → role: admin`);

  // Print env snippet
  console.log("\n── Add to .env ──────────────────────────────────────────");
  console.log(`TEST_EMAIL=${TEST_EMAIL}`);
  console.log(`TEST_PASSWORD=${TEST_PASSWORD}`);
  console.log("─────────────────────────────────────────────────────────\n");
}

run().catch(err => { console.error("✗", err.message); process.exit(1); });
