// scripts/fix-admin-role.js
// Grants admin role + custom claim to any Firebase Auth user by email.
// Usage: node scripts/fix-admin-role.js <email>
// Example: node scripts/fix-admin-role.js admin@letitrip.in
// Idempotent — safe to re-run.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars. Check your .env file.");
  process.exit(1);
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.error("❌ Usage: node scripts/fix-admin-role.js <email>");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
});

const auth = admin.auth();
const db = admin.firestore();

async function fixAdminRole() {
  let user;
  try {
    user = await auth.getUserByEmail(targetEmail);
  } catch (err) {
    console.error(`❌ No Firebase Auth user found for: ${targetEmail}`);
    console.error("   Make sure the user has signed in at least once, or run seed-admin.js first.");
    process.exit(1);
  }

  const { uid } = user;
  console.log(`✅ Found user: ${targetEmail} (uid: ${uid})`);

  await db.collection("users").doc(uid).set(
    { uid, email: targetEmail, role: "admin", updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true },
  );
  console.log(`✅ Firestore users/${uid} → role: "admin"`);

  await auth.setCustomUserClaims(uid, { admin: true });
  console.log(`✅ Auth custom claim set: { admin: true } on uid=${uid}`);

  console.log(`\n🎮 Done. ${targetEmail} is now admin.`);
  console.log(`   The user must sign out and back in (or call getIdToken(true)) for the claim to take effect.`);
}

fixAdminRole()
  .catch((err) => { console.error("❌ Failed:", err); process.exit(1); })
  .finally(() => process.exit(0));
