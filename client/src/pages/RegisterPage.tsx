import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserDoc } from "@/lib/userDoc";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const googleProvider = new GoogleAuthProvider();

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
    <div
      className="bg-bg0 flex items-center justify-center"
      style={{ height: '100dvh', overflow: 'hidden', padding: 'clamp(8px,2dvh,20px)', boxSizing: 'border-box' }}
    >
      <div className="fixed top-3 right-4 z-[100]">
        <ThemeToggle compact />
      </div>

      <div style={{ width: '100%', maxWidth: 'min(420px,92vw)' }}>
        <div className="text-center" style={{ marginBottom: 'clamp(6px,1.5dvh,24px)' }}>
          <div style={{ fontSize: 'clamp(24px,5vmin,48px)', marginBottom: 'clamp(4px,1dvh,8px)' }}>🌀</div>
          <h1 className="font-bold text-theme-text" style={{ fontSize: 'clamp(14px,2.5vmin,22px)', margin: 0 }}>Create Account</h1>
          <p className="text-theme-muted" style={{ fontSize: 'clamp(11px,1.5vmin,13px)', marginTop: 4 }}>Join the arena and start battling</p>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className={cn(
            "w-full flex items-center justify-center gap-2.5",
            "bg-bg2 border border-border-c rounded-[10px]",
            "text-sm font-semibold text-theme-text cursor-pointer",
            (googleLoading || loading) && "opacity-50"
          )}
          style={{ padding: 'clamp(7px,1.3dvh,11px) 20px', marginBottom: 'clamp(6px,1.5dvh,20px)', boxSizing: 'border-box' }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6.1C12.4 13.2 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
            <path fill="#FBBC05" d="M10.5 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.5 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.5 2.5 10.7l8-6.1z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-3.7-13.5-9.3l-7.8 6.1C6.7 42.6 14.7 48 24 48z"/>
          </svg>
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3" style={{ marginBottom: 'clamp(6px,1.5dvh,20px)' }}>
          <div className="flex-1 h-px bg-border-c" />
          <span className="text-theme-faint text-[12px]">or register with email</span>
          <div className="flex-1 h-px bg-border-c" />
        </div>

        <form
          onSubmit={handleEmailRegister}
          className="bg-bg2 border border-border-c rounded-2xl flex flex-col"
          style={{ padding: 'clamp(10px,2dvh,28px) clamp(12px,2.5vw,28px)', gap: 'clamp(6px,1.2dvh,16px)' }}
        >
          <div>
            <label className="block text-xs text-muted" style={{ marginBottom: 6 }}>Display Name <span className="text-faint">(optional)</span></label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Blade Master"
              className="w-full bg-bg3 border border-border rounded-lg text-text text-sm"
              style={{ padding: 'clamp(4px,1dvh,8px) 12px', boxSizing: 'border-box' }}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs text-muted" style={{ marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-bg3 border border-border rounded-lg text-text text-sm"
              style={{ padding: 'clamp(4px,1dvh,8px) 12px', boxSizing: 'border-box' }}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted" style={{ marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-bg3 border border-border rounded-lg text-text text-sm"
              style={{ padding: 'clamp(4px,1dvh,8px) 12px', boxSizing: 'border-box' }}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted" style={{ marginBottom: 6 }}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full bg-bg3 border border-border rounded-lg text-text text-sm"
              style={{ padding: 'clamp(4px,1dvh,8px) 12px', boxSizing: 'border-box' }}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || !email.trim() || !password || !confirm}
            className={cn(
              "bg-theme-purple text-white rounded-lg text-sm font-semibold border-none cursor-pointer",
              (loading || googleLoading || !email.trim() || !password || !confirm) && "opacity-50"
            )}
            style={{ padding: 'clamp(6px,1.3dvh,10px) 20px', marginTop: 4 }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="text-center flex justify-center gap-5" style={{ marginTop: 'clamp(6px,1.5dvh,20px)' }}>
          <Link to="/login" className="text-theme-muted text-[13px] no-underline">
            Already have an account? <span className="text-theme-purple">Sign in</span>
          </Link>
        </div>
        <div className="text-center" style={{ marginTop: 'clamp(4px,1dvh,12px)' }}>
          <Link to="/" className="text-theme-faint text-[12px] no-underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
