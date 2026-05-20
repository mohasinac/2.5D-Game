import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";

// Full-screen game pages — hide the global AuthChip so it doesn't overlap the in-game HUD.
const FULLSCREEN_GAME_PATHS = ["/game/tryout", "/game/battle/", "/game/ai-battle/play"];
function isFullScreenGame(pathname: string) {
  return FULLSCREEN_GAME_PATHS.some(p => pathname.startsWith(p));
}

function AuthChip() {
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <Link to="/login" style={{ padding:"4px 12px", background:C.purple, color:C.white, borderRadius:6, fontSize:12, textDecoration:"none", fontWeight:500 }}>
        Sign In
      </Link>
    );
  }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontSize:12, color:C.muted }}>{currentUser.email}</span>
      <button
        onClick={async () => { await signOutUser(); toast.success("Signed out"); navigate("/"); }}
        style={{ padding:"4px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, color:C.faint, cursor:"pointer" }}
      >
        Sign out
      </button>
    </div>
  );
}

export function RootLayout() {
  const location = useLocation();
  const hideAuth = isFullScreenGame(location.pathname);

  return (
    <GameProvider>
      <div style={{ minHeight:"100vh", background:C.bg0, color:C.text }}>
        {!hideAuth && (
          <div style={{ position:"fixed", top:12, right:16, zIndex:100 }}>
            <AuthChip />
          </div>
        )}
        <Outlet />
      </div>
      <Toaster position="top-right" toastOptions={{ style:{ background:C.bg2, color:C.text, border:`1px solid ${C.border}` } }} />
    </GameProvider>
  );
}
