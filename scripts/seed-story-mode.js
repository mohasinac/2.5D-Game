#!/usr/bin/env node
// Seed story mode collections: seasons, episodes, player_progress templates.
// These define the story mode progression — dialogue and rewards.

require("dotenv").config();
const admin = require("firebase-admin");

const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin env vars."); process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
}
const db = admin.firestore();

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  let batch = db.batch(); let count = 0;
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
}

const SEASONS = [
  {
    id: "s1_bakuten",
    name: "Bakuten Shoot - The Beginning",
    order: 1,
    episodeIds: ["ep1_tyson_intro", "ep2_kai_rival", "ep3_max_friend", "ep4_ray_challenge", "ep5_tournament_start"],
    artworkUrl: "",
    unlockCondition: "none",
    description: "Begin your journey as a blader. Train, battle rivals, and enter your first tournament.",
  },
  {
    id: "s2_vforce",
    name: "V-Force - Rising Power",
    order: 2,
    episodeIds: ["ep6_team_psykick", "ep7_cyber_beys", "ep8_ozuma_test"],
    artworkUrl: "",
    unlockCondition: "complete_season:s1_bakuten",
    description: "Face the mysterious Team Psykick and their cyber beyblades.",
  },
];

const EPISODES = [
  {
    id: "ep1_tyson_intro",
    seasonId: "s1_bakuten",
    order: 1,
    title: "The Blader's Path",
    opponentCharacterId: "daichi",
    dialogue: [
      { speaker: "narrator", text: "A new blader steps into the arena for the first time..." },
      { speaker: "daichi", text: "Hey! You think you can just walk in here and battle? Prove yourself!" },
      { speaker: "player", text: "I'm ready. Let it rip!" },
    ],
    battleConfig: { aiDifficulty: "easy", bestOf: 1, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "daichi", text: "Not bad... but I'll get you next time!" },
    ],
  },
  {
    id: "ep2_kai_rival",
    seasonId: "s1_bakuten",
    order: 2,
    title: "The Rival Appears",
    opponentCharacterId: "kai",
    dialogue: [
      { speaker: "kai", text: "You beat Daichi? That means nothing. Show me what you've got." },
      { speaker: "player", text: "I won't back down!" },
    ],
    battleConfig: { aiDifficulty: "medium", bestOf: 1, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "kai", text: "Hmph. You have potential... but you're still not strong enough." },
    ],
  },
  {
    id: "ep3_max_friend",
    seasonId: "s1_bakuten",
    order: 3,
    title: "The Defensive Wall",
    opponentCharacterId: "max",
    dialogue: [
      { speaker: "max", text: "Hey there! I heard you've been winning battles. Want to have a friendly match?" },
      { speaker: "player", text: "Sure! Let's have fun with it!" },
    ],
    battleConfig: { aiDifficulty: "medium", bestOf: 3, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "max", text: "That was awesome! Your bey has real spirit!" },
    ],
  },
  {
    id: "ep4_ray_challenge",
    seasonId: "s1_bakuten",
    order: 4,
    title: "Tiger's Precision",
    opponentCharacterId: "ray",
    dialogue: [
      { speaker: "ray", text: "I've been watching your battles. You're improving fast. Let me test your skills." },
    ],
    battleConfig: { aiDifficulty: "hard", bestOf: 3, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "ray", text: "Impressive technique. You'll go far in the tournament." },
    ],
  },
  {
    id: "ep5_tournament_start",
    seasonId: "s1_bakuten",
    order: 5,
    title: "Tournament - First Round",
    opponentCharacterId: "tala",
    dialogue: [
      { speaker: "narrator", text: "The regional tournament begins. Your first opponent: Tala of the Blitzkrieg Boys." },
      { speaker: "tala", text: "Don't expect mercy in this arena." },
    ],
    battleConfig: { aiDifficulty: "hard", bestOf: 5, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "tala", text: "You've earned your place here. But the road ahead is harder." },
      { speaker: "narrator", text: "Season 1 complete. New challenges await..." },
    ],
  },
  {
    id: "ep6_team_psykick",
    seasonId: "s2_vforce",
    order: 1,
    title: "Mysterious Challengers",
    opponentCharacterId: "brooklyn",
    dialogue: [
      { speaker: "narrator", text: "A mysterious organization called Team Psykick has appeared..." },
      { speaker: "brooklyn", text: "Your bit beast... it interests me." },
    ],
    battleConfig: { aiDifficulty: "hard", bestOf: 3, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "brooklyn", text: "Fascinating. Your power is real, not artificial." },
    ],
  },
  {
    id: "ep7_cyber_beys",
    seasonId: "s2_vforce",
    order: 2,
    title: "Cyber Beyblades",
    opponentCharacterId: "brooklyn",
    dialogue: [
      { speaker: "narrator", text: "Team Psykick has created artificial beyblades with enhanced stats..." },
    ],
    battleConfig: { aiDifficulty: "hard", bestOf: 3, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [],
  },
  {
    id: "ep8_ozuma_test",
    seasonId: "s2_vforce",
    order: 3,
    title: "The Saint Shields",
    opponentCharacterId: "ray",
    dialogue: [
      { speaker: "narrator", text: "The Saint Shields seek to seal the bit beasts. Can you protect yours?" },
    ],
    battleConfig: { aiDifficulty: "hell", bestOf: 5, arenaId: "default" },
    rewardBeySystemId: null,
    outroDialogue: [
      { speaker: "narrator", text: "Season 2 complete. Your bond with your bit beast grows stronger." },
    ],
  },
];

async function seed() {
  console.log("Seeding story mode collections...");
  await clearCollection("seasons");
  await clearCollection("episodes");

  let batch = db.batch(); let count = 0;
  for (const s of SEASONS) {
    const ref = db.collection("seasons").doc(s.id);
    batch.set(ref, { ...s, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  for (const e of EPISODES) {
    const ref = db.collection("episodes").doc(e.id);
    batch.set(ref, { ...e, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    if (++count === 500) { await batch.commit(); batch = db.batch(); count = 0; }
  }
  if (count) await batch.commit();
  console.log(`  Seeded ${SEASONS.length} seasons and ${EPISODES.length} episodes.`);
}

seed().catch(e => { console.error(e); process.exit(1); });
