import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/game";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Signed in!");
      navigate(redirect, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err.code, err.message);
      const msg =
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
          ? "Invalid email or password"
          : err.code === "auth/operation-not-allowed"
          ? "Email/Password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method."
          : err.code === "auth/too-many-requests"
          ? "Too many failed attempts. Try again later."
          : err.code === "auth/network-request-failed"
          ? "Network error — check your connection."
          : `Sign-in failed (${err.code ?? "unknown"})`;
      toast.error(msg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌀</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Beyblade Game</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Sign in to play or manage the game</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
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
              placeholder="••••••••"
              style={S.input}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            style={{
              padding: "10px 20px", background: C.purple, color: C.white,
              borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none",
              cursor: "pointer", opacity: loading || !email.trim() || !password ? 0.5 : 1,
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/" style={{ color: C.faint, fontSize: 12, textDecoration: "none" }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
