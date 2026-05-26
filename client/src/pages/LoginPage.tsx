import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserDoc } from "@/lib/userDoc";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const googleProvider = new GoogleAuthProvider();

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/game";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await createUserDoc(cred.user.uid, cred.user.email, cred.user.displayName);
      toast.success("Signed in!");
      navigate(redirect, { replace: true });
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") return;
      toast.error(`Google sign-in failed (${err.code ?? "unknown"})`, { duration: 5000 });
    } finally {
      setGoogleLoading(false);
    }
  };

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
    <div className="min-h-screen bg-bg0 flex items-center justify-center p-5">
      <div className="fixed top-3 right-4 z-[100]">
        <ThemeToggle compact />
      </div>
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🌀</div>
          <h1 className="text-[22px] font-bold text-theme-text m-0">Beyblade Game</h1>
          <p className="text-theme-muted text-[13px] mt-1">Sign in to play or manage the game</p>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 py-[11px] px-5 mb-5",
            "bg-bg2 border border-border-c rounded-[10px]",
            "text-[14px] font-semibold text-theme-text cursor-pointer",
            (googleLoading || loading) && "opacity-50"
          )}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6.1C12.4 13.2 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
            <path fill="#FBBC05" d="M10.5 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.5 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.5 2.5 10.7l8-6.1z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-3.7-13.5-9.3l-7.8 6.1C6.7 42.6 14.7 48 24 48z"/>
          </svg>
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border-c" />
          <span className="text-theme-faint text-[12px]">or sign in with email</span>
          <div className="flex-1 h-px bg-border-c" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg2 border border-border-c rounded-2xl p-7 flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs text-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className={cn(
              "py-[10px] px-5 bg-theme-purple text-white rounded-lg text-[14px] font-semibold border-none cursor-pointer mt-1",
              (loading || !email.trim() || !password) && "opacity-50"
            )}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link to="/register" className="text-theme-muted text-[13px] no-underline">
            No account? <span className="text-theme-purple">Create one</span>
          </Link>
        </div>
        <div className="text-center mt-3">
          <Link to="/" className="text-theme-faint text-[12px] no-underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
