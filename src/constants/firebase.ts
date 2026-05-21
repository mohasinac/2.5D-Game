// Back-compat shim. Real source of truth is ./collections.ts.
// Existing imports of FIREBASE_COLLECTIONS / FIREBASE_BUCKETS continue to work.

export { COLLECTIONS as FIREBASE_COLLECTIONS, FIREBASE_BUCKETS } from "./collections";
export type { CollectionName as FirebaseCollection, FirebaseBucket } from "./collections";
