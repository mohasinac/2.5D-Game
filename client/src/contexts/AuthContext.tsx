import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextValue {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAdmin: false,
  loading: true,
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Read role from Firestore users/{uid} — create doc if first sign-in
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists()) {
            // First sign-in — create user doc with default role
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              role: "user",
              createdAt: serverTimestamp(),
            }, { merge: true });
            setIsAdmin(false);
          } else {
            setIsAdmin(snap.data()?.role === "admin");
          }
        } catch (err) {
          console.error("Failed to load user role from Firestore:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOutUser = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
