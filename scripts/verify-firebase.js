/**
 * Verify Firebase + filesystem operations end-to-end.
 *
 * Covers:
 *   1. Local FS (read/write/delete a temp file)
 *   2. Server-side: Firebase Admin SDK — Firestore create/edit/delete + Storage upload/download/delete
 *   3. Client-side: Firebase Web SDK — Firestore create/edit/delete + Storage upload/download/delete
 *
 * Reads credentials from .env (admin) and client/.env (web SDK).
 * Run:  node scripts/verify-firebase.js
 */

const path = require("path");
const fs = require("fs");
const os = require("os");

// Load .env from project root (admin creds + VITE_* fallbacks)
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
// Overlay client/.env for VITE_* web config
require("dotenv").config({
  path: path.resolve(__dirname, "..", "client", ".env"),
  override: false,
});

const COLOR = { g: "\x1b[32m", r: "\x1b[31m", y: "\x1b[33m", c: "\x1b[36m", reset: "\x1b[0m" };
const results = [];
function pass(name) { results.push({ name, ok: true }); console.log(`${COLOR.g}✔${COLOR.reset} ${name}`); }
function fail(name, err) { results.push({ name, ok: false, err }); console.log(`${COLOR.r}✘${COLOR.reset} ${name} — ${err?.message || err}`); }
function step(name) { console.log(`\n${COLOR.c}▶ ${name}${COLOR.reset}`); }

const TEST_DOC_ID = `verify-${Date.now()}`;
// Admin SDK bypasses rules, so it can use a scratch collection/path.
const ADMIN_COLLECTION = "_verify_scratch";
const ADMIN_STORAGE_PATH = `_verify_scratch/${TEST_DOC_ID}.txt`;
// Web SDK obeys security rules — use rule-permitted paths:
//   firestore: beyblade_stats/{id}   (admin write, auth read)
//   storage:   beyblades/{path}      (admin write + image content-type, <5MB)
const WEB_COLLECTION = "beyblade_stats";
const WEB_STORAGE_PATH = `beyblades/${TEST_DOC_ID}.png`;
const TEST_PAYLOAD = `verify run @ ${new Date().toISOString()}`;
// Minimal 1×1 transparent PNG — used for storage rules requiring image/* content-type
const PNG_1x1 = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da6300010000000500010d0a2db40000000049454e44ae426082",
  "hex",
);

(async () => {
  // ───────────────────────────── 1. FS ─────────────────────────────
  step("Filesystem (local)");
  const tmpFile = path.join(os.tmpdir(), `verify-${TEST_DOC_ID}.txt`);
  try {
    fs.writeFileSync(tmpFile, TEST_PAYLOAD, "utf8");
    pass(`fs.writeFileSync → ${tmpFile}`);
  } catch (e) { fail("fs.writeFileSync", e); }
  try {
    const got = fs.readFileSync(tmpFile, "utf8");
    if (got !== TEST_PAYLOAD) throw new Error(`mismatch: ${got}`);
    pass("fs.readFileSync (content matches)");
  } catch (e) { fail("fs.readFileSync", e); }
  try {
    fs.appendFileSync(tmpFile, "\nappended");
    const got = fs.readFileSync(tmpFile, "utf8");
    if (!got.endsWith("appended")) throw new Error("append failed");
    pass("fs.appendFileSync (edit)");
  } catch (e) { fail("fs.appendFileSync", e); }
  try {
    fs.unlinkSync(tmpFile);
    pass("fs.unlinkSync");
  } catch (e) { fail("fs.unlinkSync", e); }

  // ──────────────────── 2. Firebase Admin (server) ────────────────────
  step("Firebase Admin SDK (server)");
  let admin, adminApp, adminDb, adminBucket;
  try {
    admin = require("firebase-admin");
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET;
    if (!projectId || !clientEmail || !privateKey) throw new Error("missing admin env vars");

    adminApp = admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    });
    adminDb = admin.firestore();
    adminBucket = admin.storage().bucket();
    pass(`admin.initializeApp (project=${projectId}, bucket=${storageBucket})`);
  } catch (e) { fail("admin.initializeApp", e); }

  if (adminDb) {
    const ref = adminDb.collection(ADMIN_COLLECTION).doc(TEST_DOC_ID);
    try {
      await ref.set({ payload: TEST_PAYLOAD, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      pass("admin firestore.create (set)");
    } catch (e) { fail("admin firestore.create", e); }
    try {
      await ref.update({ edited: true, editedAt: admin.firestore.FieldValue.serverTimestamp() });
      const snap = await ref.get();
      if (!snap.exists || snap.data().edited !== true) throw new Error("edit not persisted");
      pass("admin firestore.edit (update + read)");
    } catch (e) { fail("admin firestore.edit", e); }
    try {
      await ref.delete();
      pass("admin firestore.delete");
    } catch (e) { fail("admin firestore.delete", e); }
  }

  if (adminBucket) {
    const file = adminBucket.file(ADMIN_STORAGE_PATH);
    try {
      await file.save(Buffer.from(TEST_PAYLOAD), { contentType: "text/plain", resumable: false });
      pass(`admin storage.upload → gs://${adminBucket.name}/${ADMIN_STORAGE_PATH}`);
    } catch (e) { fail("admin storage.upload", e); }
    try {
      const [buf] = await file.download();
      if (buf.toString("utf8") !== TEST_PAYLOAD) throw new Error("downloaded mismatch");
      pass("admin storage.download (content matches)");
    } catch (e) { fail("admin storage.download", e); }
    try {
      await file.save(Buffer.from(TEST_PAYLOAD + " (edited)"), { contentType: "text/plain", resumable: false });
      const [buf] = await file.download();
      if (!buf.toString("utf8").includes("(edited)")) throw new Error("edit not persisted");
      pass("admin storage.edit (overwrite)");
    } catch (e) { fail("admin storage.edit", e); }
    try {
      await file.delete();
      pass("admin storage.delete");
    } catch (e) { fail("admin storage.delete", e); }
  }

  // ──────────────────── 3. Firebase Web SDK (client) ────────────────────
  step("Firebase Web SDK (client)");
  // Web SDK is installed in client/node_modules
  const clientNodeModules = path.resolve(__dirname, "..", "client", "node_modules");
  // Admin seed user — must match scripts/seed-admin.js
  const ADMIN_EMAIL = "admin@letitrip.in";
  const ADMIN_PASSWORD = "TempPass123!";
  let webApp, webDb, webStorage;
  try {
    const { initializeApp } = require(path.join(clientNodeModules, "firebase/app"));
    const config = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
    };
    for (const [k, v] of Object.entries(config)) if (!v) throw new Error(`missing client env: ${k}`);
    webApp = initializeApp(config, "verify-web-client");
    const { getFirestore } = require(path.join(clientNodeModules, "firebase/firestore"));
    const { getStorage } = require(path.join(clientNodeModules, "firebase/storage"));
    webDb = getFirestore(webApp);
    webStorage = getStorage(webApp);
    pass(`web initializeApp (project=${config.projectId})`);
  } catch (e) { fail("web initializeApp", e); }

  // Sign in as the seeded admin so security rules permit reads/writes
  if (webApp) {
    try {
      const { getAuth, signInWithEmailAndPassword } =
        require(path.join(clientNodeModules, "firebase/auth"));
      const webAuth = getAuth(webApp);
      const cred = await signInWithEmailAndPassword(webAuth, ADMIN_EMAIL, ADMIN_PASSWORD);
      pass(`web auth.signIn (${ADMIN_EMAIL}, uid=${cred.user.uid})`);
    } catch (e) { fail("web auth.signIn", e); }
  }

  if (webDb) {
    const { doc, setDoc, updateDoc, getDoc, deleteDoc, serverTimestamp } =
      require(path.join(clientNodeModules, "firebase/firestore"));
    const ref = doc(webDb, WEB_COLLECTION, TEST_DOC_ID + "-web");
    try {
      await setDoc(ref, { payload: TEST_PAYLOAD, createdAt: serverTimestamp() });
      pass("web firestore.create (setDoc)");
    } catch (e) { fail("web firestore.create", e); }
    try {
      await updateDoc(ref, { edited: true });
      const snap = await getDoc(ref);
      if (!snap.exists() || snap.data().edited !== true) throw new Error("edit not persisted");
      pass("web firestore.edit (updateDoc + getDoc)");
    } catch (e) { fail("web firestore.edit", e); }
    try {
      await deleteDoc(ref);
      pass("web firestore.delete");
    } catch (e) { fail("web firestore.delete", e); }
  }

  if (webStorage) {
    const { ref, uploadBytes, getBytes, deleteObject } =
      require(path.join(clientNodeModules, "firebase/storage"));
    const sref = ref(webStorage, WEB_STORAGE_PATH);
    try {
      await uploadBytes(sref, PNG_1x1, { contentType: "image/png" });
      pass(`web storage.upload (uploadBytes → ${WEB_STORAGE_PATH})`);
    } catch (e) { fail("web storage.upload", e); }
    try {
      const buf = await getBytes(sref);
      if (Buffer.from(buf).length !== PNG_1x1.length) throw new Error("downloaded size mismatch");
      pass("web storage.download (getBytes, size matches)");
    } catch (e) { fail("web storage.download", e); }
    try {
      // Re-upload same PNG with custom metadata to exercise "edit" path under image-only rules
      await uploadBytes(sref, PNG_1x1, { contentType: "image/png", customMetadata: { edited: "true" } });
      pass("web storage.edit (re-upload with metadata)");
    } catch (e) { fail("web storage.edit", e); }
    try {
      await deleteObject(sref);
      pass("web storage.delete");
    } catch (e) { fail("web storage.delete", e); }
  }

  // ──────────────────────────── Summary ────────────────────────────
  const okCount = results.filter(r => r.ok).length;
  const failCount = results.length - okCount;
  console.log(`\n${COLOR.c}── Summary ──${COLOR.reset}`);
  console.log(`${COLOR.g}${okCount} passed${COLOR.reset}  ${failCount ? COLOR.r : COLOR.g}${failCount} failed${COLOR.reset}`);
  if (failCount) {
    console.log("\nFailures:");
    for (const r of results.filter(r => !r.ok)) console.log(`  - ${r.name}: ${r.err?.message || r.err}`);
  }
  process.exit(failCount ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
