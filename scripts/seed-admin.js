// scripts/seed-admin.js
// Creates admin@letitrip.in with role "admin" in Firebase Auth + Firestore.
// Run: node scripts/seed-admin.js
// Idempotent — safe to re-run.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars. Check your .env file.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
});

const auth = admin.auth();
const db = admin.firestore();

const ADMIN_EMAIL = "admin@letitrip.in";
const ADMIN_PASSWORD = "TempPass123!";

async function seedAdmin() {
  let uid;

  try {
    const user = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    uid = user.uid;
    console.log(`✅ Created user: ${ADMIN_EMAIL} (uid: ${uid})`);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      const existing = await auth.getUserByEmail(ADMIN_EMAIL);
      uid = existing.uid;
      console.log(`ℹ️  User already exists: ${ADMIN_EMAIL} (uid: ${uid})`);
    } else {
      throw err;
    }
  }

  await db.collection("users").doc(uid).set(
    {
      uid,
      email: ADMIN_EMAIL,
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`✅ Firestore users/${uid} → role: "admin"`);
  console.log(`\n🎮 Admin ready: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

seedAdmin()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
