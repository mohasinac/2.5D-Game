import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/** Upsert a user profile doc in Firestore (merge: true — never overwrites role). */
export async function createUserDoc(
  uid: string,
  email: string | null,
  displayName: string | null,
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { uid, email, displayName, role: "user", createdAt: serverTimestamp() },
    { merge: true },
  );
}
