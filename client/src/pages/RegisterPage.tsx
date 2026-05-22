import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const googleProvider = new GoogleAuthProvider();

async function createUserDoc(uid: string, email: string | null, displayName: string | null) {
  await setDoc(
    doc(db, "users", uid),
    { uid, email, displayName, role: "user", createdAt: serverTimestamp() },
    { merge: true },
  );
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      await createUserDoc(cred.user.uid, cred.user.email, displayName.trim() || null);
      toast.success("Account created!");
      navigate("/game", { replace: true });
    } catch (err: any) {
      const msg =
        err.code === "auth/email-already-in-use" ? "An account with this email already exists" :
        err.code === "auth/invalid-email" ? "Invalid email address" :
        err.code === "auth/operation-not-allowed" ? "Email/Password sign-up is not enabled in Firebase Console" :
        err.code === "auth/weak-password" ? "Password is too weak" :
        `Registration failed (${err.code ?? "unknown"})`;
      toast.error(msg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await createUserDoc(cred.user.uid, cred.user.email, cred.user.displayName);
      toast.success("Signed in with Google!");
      navigate("/game", { replace: true });
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") return;
      toast.error(`Google sign-in failed (${err.code ?? "unknown"})`, { duration: 5000 });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "fixed", top: 12, right: 16, zIndex: 100 }}>
        <ThemeToggle compact />
      </div>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌀</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Create Account</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Join the arena and start battling</p>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "11px 20px", marginBottom: 20,
            background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
            fontSize: 14, fontWeight: 600, color: C.text, cursor: "pointer",
            opacity: googleLoading || loading ? 0.5 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6.1C12.4 13.2 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
            <path fill="#FBBC05" d="M10.5 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.5 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.5 2.5 10.7l8-6.1z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-3.7-13.5-9.3l-7.8 6.1C6.7 42.6 14.7 48 24 48z"/>
          </svg>
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ color: C.faint, fontSize: 12 }}>or register with email</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <form onSubmit={handleEmailRegister} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={S.label}>Display Name <span style={{ color: C.faint }}>(optional)</span></label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Blade Master"
              style={S.input}
              autoComplete="name"
            />
          </div>

          <div>
            <label style={S.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={S.input}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label style={S.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              style={S.input}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label style={S.label}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              style={S.input}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || !email.trim() || !password || !confirm}
            style={{
              padding: "10px 20px", background: C.purple, color: C.white,
              borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none",
              cursor: "pointer", opacity: loading || googleLoading || !email.trim() || !password || !confirm ? 0.5 : 1,
              marginTop: 4,
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, display: "flex", justifyContent: "center", gap: 20 }}>
          <Link to="/login" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>
            Already have an account? <span style={{ color: C.purple }}>Sign in</span>
          </Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/" style={{ color: C.faint, fontSize: 12, textDecoration: "none" }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
