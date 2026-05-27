// scripts/seed-gimmick-synergies.js
// Seeds 12 gimmick × part material synergy definitions.
// Safe to re-run (uses setDoc with merge:false — full overwrite).
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

if (!admin.apps.length) {
  const serviceAccount = require("../firebase-service-account.json");
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = getFirestore();

const SYNERGIES = [
  // rubber tip × magnetism gimmick — increased magnetic force
  {
    id: "rubber_magnetism",
    gimmickId: "magnacore_attract",
    materialId: "rubber",
    modifierType: "force_multiplier",
    value: 1.5,
    description: "Rubber tips grip magnetic fields for 50% stronger attraction force.",
  },
  // rubber tip × magnetic repel — same boost
  {
    id: "rubber_magnetism_repel",
    gimmickId: "magnacore_repel",
    materialId: "rubber",
    modifierType: "force_multiplier",
    value: 1.4,
    description: "Rubber tips amplify magnetic repulsion by 40%.",
  },
  // metal disk × smash attack — increased smash damage
  {
    id: "metal_smash",
    gimmickId: "smash_impact",
    materialId: "metal",
    modifierType: "force_multiplier",
    value: 1.35,
    description: "Metal weight disks deliver 35% stronger smash impacts.",
  },
  // POM tip × bearing drift — extended drift duration
  {
    id: "pom_bearing_drift",
    gimmickId: "bearing_drift",
    materialId: "pom",
    modifierType: "spin_bonus",
    value: 1.3,
    description: "POM tips on bearing drift maintain spin 30% longer.",
  },
  // ABS plastic × spin equalization — faster equalization
  {
    id: "abs_spin_equalization",
    gimmickId: "spin_equalization",
    materialId: "abs_plastic",
    modifierType: "force_multiplier",
    value: 1.2,
    description: "ABS parts transfer spin 20% more efficiently during equalization.",
  },
  // rubber tip × orbit movement — tighter orbit radius
  {
    id: "rubber_orbit",
    gimmickId: "orbit_movement",
    materialId: "rubber",
    modifierType: "force_multiplier",
    value: 1.25,
    description: "Rubber tips grip the bowl for tighter, faster orbital paths.",
  },
  // metal × spring recoil — increased recoil distance
  {
    id: "metal_spring_recoil",
    gimmickId: "spring_recoil",
    materialId: "metal",
    modifierType: "force_multiplier",
    value: 1.4,
    description: "Metal parts store and release spring energy 40% more forcefully.",
  },
  // nylon × upper launch — enhanced upper attack
  {
    id: "nylon_upper_launch",
    gimmickId: "upper_launch",
    materialId: "nylon",
    modifierType: "force_multiplier",
    value: 1.3,
    description: "Nylon attack rings deliver 30% stronger upper attack trajectories.",
  },
  // rubber × burst suppress — improved burst resistance
  {
    id: "rubber_burst_suppress",
    gimmickId: "burst_suppress",
    materialId: "rubber",
    modifierType: "spin_bonus",
    value: 1.45,
    description: "Rubber locks resist burst 45% more effectively under stress.",
  },
  // metal × weight shift — enhanced weight shift force
  {
    id: "metal_weight_shift",
    gimmickId: "weight_shift",
    materialId: "metal",
    modifierType: "force_multiplier",
    value: 1.3,
    description: "Metal components shift weight 30% more dramatically mid-battle.",
  },
  // POM × free spin — reduced friction in free spin mode
  {
    id: "pom_free_spin",
    gimmickId: "free_spin",
    materialId: "pom",
    modifierType: "spin_bonus",
    value: 1.4,
    description: "POM-tipped free spin bearings retain 40% more spin in free spin mode.",
  },
  // ABS × velocity burst — extended burst duration
  {
    id: "abs_velocity_burst",
    gimmickId: "velocity_burst",
    materialId: "abs_plastic",
    modifierType: "force_multiplier",
    value: 1.2,
    description: "ABS frames channel velocity burst energy 20% more efficiently.",
  },
];

async function seed() {
  const col = db.collection("gimmick_synergies");
  let count = 0;
  for (const syn of SYNERGIES) {
    const { id, ...data } = syn;
    await col.doc(id).set(data);
    count++;
    console.log(`  ✅ ${id}`);
  }
  console.log(`\nSeeded ${count} gimmick synergies.`);
}

seed().catch(console.error);
