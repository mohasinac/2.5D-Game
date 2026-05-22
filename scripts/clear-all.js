#!/usr/bin/env node
// Deletes every document in every root-level Firestore collection.
// Run BEFORE seed:all to guarantee a completely fresh database.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars.");
  process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

async function deleteCollection(colRef) {
  const snap = await colRef.get();
  if (snap.empty) return 0;

  let batch = db.batch();
  let count = 0;
  let total = 0;

  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    count++;
    total++;
    if (count === 500) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }
  if (count) await batch.commit();
  return total;
}

async function clearAll() {
  console.log("\n══════════════════════════════════════");
  console.log("  Firestore Full Clear");
  console.log("══════════════════════════════════════\n");

  const collections = await db.listCollections();

  for (const col of collections) {
    const deleted = await deleteCollection(col);
    if (deleted > 0) {
      console.log(`  🗑️  ${col.id.padEnd(30)} — ${deleted} docs deleted`);
    } else {
      console.log(`  ✓  ${col.id.padEnd(30)} — already empty`);
    }
  }

  console.log("\n✅ All Firestore collections cleared.\n");
}

clearAll()
  .catch((err) => { console.error("❌ Clear failed:", err); process.exit(1); })
  .finally(() => process.exit(0));
