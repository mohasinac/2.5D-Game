import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GameProvider } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { IS_LOCAL } from "@/game/hooks/useColyseus";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SoundManager } from "@/game/audio/SoundManager";
import { TouchControlsGBLayout } from "@/components/game/TouchControlsGBLayout";

import { Settings } from "lucide-react";
import toast from "react-hot-toast";

const FULLSCREEN_GAME_PATHS = ["/game/tryout", "/game/battle/", "/game/ai-battle/play", "/rpg/game", "/rpg/battle"];
function isFullScreenGame(pathname: string) {
  return FULLSCREEN_GAME_PATHS.some(p => pathname.startsWith(p));
}

function isGameOrRpgRoute(pathname: string) {
  return pathname.startsWith("/game") || pathname.startsWith("/rpg");
}

function AuthChip() {
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <Link to="/login" className="px-3 py-1 bg-theme-purple text-white rounded-md text-xs no-underline font-medium">
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-theme-muted">{currentUser.email}</span>
      <Link to="/admin/settings" title="Settings"
        className="flex items-center px-1.5 py-1 bg-transparent border border-border-c rounded-md text-theme-faint no-underline hover:text-theme-text transition-colors">
        <Settings size={13} />
      </Link>
      <button
        onClick={async () => { await signOutUser(); toast.success("Signed out"); navigate("/"); }}
        className="px-2.5 py-1 bg-transparent border border-border-c rounded-md text-xs text-theme-faint cursor-pointer hover:text-theme-text transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

export function RootLayout() {
  const location = useLocation();
  const hideAuth = isFullScreenGame(location.pathname);

  // Unlock Web Audio on the first user interaction anywhere in the app.
  // Browsers suspend AudioContext until a gesture fires; this lifts the block.
  useEffect(() => {
    const unlock = () => SoundManager.unlock();
    window.addEventListener("pointerdown", unlock, { once: true, capture: true });
    window.addEventListener("keydown",     unlock, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown",     unlock, { capture: true });
    };
  }, []);

  const showControls = isGameOrRpgRoute(location.pathname);

  return (
    <GameProvider>
      <div className="min-h-screen bg-bg0 text-theme-text min-w-[320px]">
        {IS_LOCAL && (
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[200] bg-yellow-400 text-black px-2.5 py-0.5 rounded text-[11px] font-bold tracking-[0.05em] pointer-events-none">
            LOCAL · ws://localhost:2567
          </div>
        )}
        {!hideAuth && (
          <div className="fixed top-3 right-4 z-[100] flex items-center gap-2">
            <ThemeToggle compact />
            <AuthChip />
          </div>
        )}
        <Outlet />
        {showControls && <TouchControlsGBLayout />}
      </div>
    </GameProvider>
  );
}
