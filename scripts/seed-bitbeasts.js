#!/usr/bin/env node
// Seed bitbeast_assets collection — 6 placeholder BitBeast entries.
// Each doc: { id, name, imageUrl, beyType, description }
// Replace imageUrl values with real GIF/PNG URLs once assets are ready.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin env vars."); process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

const BITBEASTS = [
  {
    id: "black_dranzer",
    name: "Black Dranzer",
    imageUrl: "",
    beyType: "attack",
    description: "Legendary phoenix of destruction. Piercing talons deliver crushing strikes.",
  },
  {
    id: "draciel",
    name: "Draciel",
    imageUrl: "",
    beyType: "defense",
    description: "Ancient turtle guardian. Impenetrable shell reflects all incoming force.",
  },
  {
    id: "dragoon",
    name: "Dragoon",
    imageUrl: "",
    beyType: "balanced",
    description: "Wind dragon of balance. Controls the battlefield with sweeping gusts.",
  },
  {
    id: "driger",
    name: "Driger",
    imageUrl: "",
    beyType: "attack",
    description: "Sacred white tiger. Lightning-fast slashes from unexpected angles.",
  },
  {
    id: "wolborg",
    name: "Wolborg",
    imageUrl: "",
    beyType: "stamina",
    description: "Frost wolf endurance spirit. Outlasts opponents in a spinning blizzard.",
  },
  {
    id: "galman",
    name: "Galman",
    imageUrl: "",
    beyType: "stamina",
    description: "Eagle of eternal spin. Soars above the arena sapping opponent energy.",
  },
];

async function seed() {
  const col = db.collection("bitbeast_assets");
  for (const bst of BITBEASTS) {
    await col.doc(bst.id).set({
      name: bst.name,
      url: bst.imageUrl,
      storagePath: "",
      tag: bst.beyType,
      description: bst.description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log(`✅ ${bst.name}`);
  }
  console.log("Done — 6 BitBeast entries written.");
}

seed().catch(e => { console.error(e); process.exit(1); });
