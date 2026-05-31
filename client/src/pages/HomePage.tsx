import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen bg-bg0 flex flex-col items-center justify-center p-8 [background:radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--blue)_9%,transparent)_0%,var(--bg0)_70%)]">
      <div className="text-center mb-14">
        <div className="text-[80px] mb-4">🌀</div>
        <h1 className="text-[52px] font-black text-theme-text tracking-[-0.03em] mb-3">
          Beyblade Game
        </h1>
        <p className="text-[18px] text-theme-muted">Real-time multiplayer spinning top battles</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-[min(560px,92vw)] w-full mb-10">
        <Link
          to="/game"
          className="group block p-8 bg-bg2 rounded-[20px] border border-border-c no-underline transition-colors duration-200 hover:border-theme-blue"
        >
          <div className="text-center">
            <div className="text-[44px] mb-3">🎮</div>
            <h2 className="text-[20px] font-bold text-theme-text mb-1.5">Play Game</h2>
            <p className="text-theme-muted text-[13px]">Tryout mode or live PVP battles</p>
          </div>
        </Link>

        <Link
          to="/admin"
          className="group block p-8 bg-bg2 rounded-[20px] border border-border-c no-underline transition-colors duration-200 hover:border-theme-purple"
        >
          <div className="text-center">
            <div className="text-[44px] mb-3">⚙️</div>
            <h2 className="text-[20px] font-bold text-theme-text mb-1.5">Admin Panel</h2>
            <p className="text-theme-muted text-[13px]">Manage beyblades, arenas, and assets</p>
          </div>
        </Link>
      </div>

      <div className="flex gap-3 mb-5">
        <Link
          to="/leaderboard"
          className="py-[10px] px-5 bg-bg2/60 rounded-xl border border-border-c no-underline text-theme-yellow text-[13px] font-semibold"
        >
          🏆 Leaderboard
        </Link>
      </div>

      <div className="flex items-center gap-2.5 bg-bg2/60 rounded-xl py-[10px] px-5 border border-border-c">
        <div className="w-2 h-2 rounded-full bg-theme-green pulse" />
        <span className="text-theme-muted text-[13px]">Game Server Ready</span>
        <span className="text-theme-faint text-[12px]">· port 2567</span>
      </div>
    </div>
  );
}
