#!/usr/bin/env node
// Seed gear_parts collection — 5 entries: Evolution Gear L/F/S + Infinite Sword/Shield.
// Idempotent: uses set() with merge:false keyed by ID.

require('dotenv').config();
const admin = require('firebase-admin');

const { FIREBASE_ADMIN_PROJECT_ID: projectId, FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail, FIREBASE_ADMIN_PRIVATE_KEY } = process.env;
const privateKey = FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) { console.error('❌ Missing Firebase Admin env vars.'); process.exit(1); }
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

const db = admin.firestore();
const COLLECTION = 'gear_parts';

function ts() { return admin.firestore.FieldValue.serverTimestamp(); }

function cp(angle, width, radiusOuter, damageMultiplier, material, attackType) {
  return { angle, width, radius: radiusOuter, thickness: 4, damageMultiplier, material, attackType };
}

const gears = [
  {
    id: 'evolution-gear-l',
    displayName: 'Evolution Gear L',
    description: 'Lance-shaped attack gear for Dynamite Belial NV2. Two forward-facing smash protrusions at 0°/180°. Rubber outer tips for maximum spin transfer on opponent contact.',
    rarity: 'rare',
    color: '#ef4444',
    gearShape: 'lance',
    archetype: 'attack',
    attachesTo: 'ar',
    weight: 3.5,
    material: 'abs',
    dimensions: { height: 12, outerRadius: 42, innerRadius: 10 },
    geometry: { type: 'preset', preset: 'oval' },
    contactPoints: [
      cp(0,   20, 42, 1.6, 'abs', 'smash'),
      cp(180, 20, 42, 1.6, 'abs', 'smash'),
    ],
    statModifiers: [{ stat: 'attackPts', delta: 10 }],
    enabledSubPartIds: [],
    configurations: [],
    compatibilityTags: ['attack', 'dynamite-belial', 'evolution-gear'],
    requiredCompatibility: [],
    excludedCompatibility: [],
    images: {},
    pockets: [],
  },
  {
    id: 'evolution-gear-f',
    displayName: 'Evolution Gear F',
    description: 'Fortress-shaped defense gear for Dynamite Belial NV2. Four rubber absorb points at 45° spacing deflect and absorb kinetic energy from collisions.',
    rarity: 'rare',
    color: '#3b82f6',
    gearShape: 'fortress',
    archetype: 'defense',
    attachesTo: 'ar',
    weight: 4.0,
    material: 'rubber',
    dimensions: { height: 14, outerRadius: 44, innerRadius: 10 },
    geometry: { type: 'preset', preset: 'octagon' },
    contactPoints: [
      cp(45,  18, 44, 0.9, 'rubber', 'absorb'),
      cp(135, 18, 44, 0.9, 'rubber', 'absorb'),
      cp(225, 18, 44, 0.9, 'rubber', 'absorb'),
      cp(315, 18, 44, 0.9, 'rubber', 'absorb'),
    ],
    statModifiers: [{ stat: 'defensePts', delta: 12 }],
    enabledSubPartIds: [],
    configurations: [],
    compatibilityTags: ['defense', 'dynamite-belial', 'evolution-gear'],
    requiredCompatibility: [],
    excludedCompatibility: [],
    images: {},
    pockets: [],
  },
  {
    id: 'evolution-gear-s',
    displayName: 'Evolution Gear S',
    description: 'Shield-shaped stamina gear for Dynamite Belial NV2. Wide smooth POM contact strip minimises recoil and friction losses for maximum spin retention.',
    rarity: 'rare',
    color: '#22c55e',
    gearShape: 'shield',
    archetype: 'stamina',
    attachesTo: 'ar',
    weight: 3.0,
    material: 'pom',
    dimensions: { height: 10, outerRadius: 43, innerRadius: 10 },
    geometry: { type: 'preset', preset: 'circle' },
    contactPoints: [
      cp(0, 120, 43, 1.1, 'pom', 'graze'),
    ],
    statModifiers: [{ stat: 'staminaPts', delta: 10 }],
    enabledSubPartIds: [],
    configurations: [],
    compatibilityTags: ['stamina', 'dynamite-belial', 'evolution-gear'],
    requiredCompatibility: [],
    excludedCompatibility: [],
    images: {},
    pockets: [],
  },
  {
    id: 'infinite-sword',
    displayName: 'Infinite Sword',
    description: 'Sword-shaped attack gear for Ultimate Belial. Single narrow blade protrusion with extreme damage multiplier — high risk / high reward smash attacker.',
    rarity: 'legendary',
    color: '#f97316',
    gearShape: 'sword',
    archetype: 'attack',
    attachesTo: 'ar',
    weight: 4.5,
    material: 'abs',
    dimensions: { height: 18, outerRadius: 48, innerRadius: 10 },
    geometry: { type: 'preset', preset: 'oval' },
    contactPoints: [
      cp(0, 15, 48, 2.0, 'abs', 'smash'),
    ],
    statModifiers: [{ stat: 'attackPts', delta: 15 }],
    enabledSubPartIds: [],
    configurations: [],
    compatibilityTags: ['attack', 'ultimate-belial', 'infinite-gear'],
    requiredCompatibility: [],
    excludedCompatibility: [],
    images: {},
    pockets: [],
  },
  {
    id: 'infinite-shield',
    displayName: 'Infinite Shield',
    description: 'Shield-shaped defense gear for Ultimate Belial. Two wide rubber absorb arcs wrap the perimeter — near-zero recoil and strong defense against burst.',
    rarity: 'legendary',
    color: '#8b5cf6',
    gearShape: 'shield',
    archetype: 'defense',
    attachesTo: 'ar',
    weight: 4.0,
    material: 'rubber',
    dimensions: { height: 14, outerRadius: 46, innerRadius: 10 },
    geometry: { type: 'preset', preset: 'circle' },
    contactPoints: [
      cp(0,   90, 46, 0.85, 'rubber', 'absorb'),
      cp(180, 90, 46, 0.85, 'rubber', 'absorb'),
    ],
    statModifiers: [{ stat: 'defensePts', delta: 15 }],
    enabledSubPartIds: [],
    configurations: [],
    compatibilityTags: ['defense', 'ultimate-belial', 'infinite-gear'],
    requiredCompatibility: [],
    excludedCompatibility: [],
    images: {},
    pockets: [],
  },
];

async function seed() {
  console.log(`\n⚙️  Seeding ${COLLECTION}…`);
  const batch = db.batch();
  for (const gear of gears) {
    const { id, ...data } = gear;
    batch.set(db.collection(COLLECTION).doc(id), { ...data, createdAt: ts(), updatedAt: ts() });
    console.log(`  ✅ ${id}`);
  }
  await batch.commit();
  console.log(`\n✨ Done — ${gears.length} gears written to ${COLLECTION}\n`);
}

seed().catch((err) => { console.error('❌', err); process.exit(1); });
