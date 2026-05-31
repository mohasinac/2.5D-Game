import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div
      className="bg-bg0 [background:radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--blue)_9%,transparent)_0%,var(--bg0)_70%)]"
      style={{ height: '100dvh', overflow: 'hidden', padding: 'clamp(8px,2vmin,32px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}
    >
      <div className="text-center" style={{ marginBottom: 'clamp(8px,2.5vmin,56px)' }}>
        <div style={{ fontSize: 'clamp(28px,7vmin,80px)', marginBottom: 'clamp(4px,1vmin,16px)' }}>🌀</div>
        <h1 className="font-black text-theme-text tracking-[-0.03em]" style={{ fontSize: 'clamp(18px,4.5vmin,52px)', margin: 0 }}>
          Beyblade Game
        </h1>
        <p className="text-theme-muted text-sm">Real-time multiplayer spinning top battles</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: 'min(560px,92vw)', marginBottom: 'clamp(6px,1.5vmin,40px)' }}>
        <Link
          to="/game"
          className="group block bg-bg2 rounded-[20px] border border-border-c no-underline transition-colors duration-200 hover:border-theme-blue"
          style={{ padding: 'clamp(8px,2vmin,32px)' }}
        >
          <div className="text-center">
            <div style={{ fontSize: 'clamp(18px,4vmin,44px)', marginBottom: 'clamp(4px,1vmin,12px)' }}>🎮</div>
            <h2 className="font-bold text-theme-text" style={{ fontSize: 'clamp(12px,2vmin,20px)', margin: '0 0 4px' }}>Play Game</h2>
            <p className="text-theme-muted text-sm" style={{ margin: 0 }}>Tryout mode or live PVP battles</p>
          </div>
        </Link>

        <Link
          to="/admin"
          className="group block bg-bg2 rounded-[20px] border border-border-c no-underline transition-colors duration-200 hover:border-theme-purple"
          style={{ padding: 'clamp(8px,2vmin,32px)' }}
        >
          <div className="text-center">
            <div style={{ fontSize: 'clamp(18px,4vmin,44px)', marginBottom: 'clamp(4px,1vmin,12px)' }}>⚙️</div>
            <h2 className="font-bold text-theme-text" style={{ fontSize: 'clamp(12px,2vmin,20px)', margin: '0 0 4px' }}>Admin Panel</h2>
            <p className="text-theme-muted text-sm" style={{ margin: 0 }}>Manage beyblades, arenas, and assets</p>
          </div>
        </Link>
      </div>

      <div className="flex gap-3" style={{ marginBottom: 'clamp(4px,1vmin,20px)' }}>
        <Link
          to="/leaderboard"
          className="py-[10px] px-5 bg-bg2/60 rounded-xl border border-border-c no-underline text-theme-yellow text-sm font-semibold"
        >
          🏆 Leaderboard
        </Link>
      </div>

      <div className="flex items-center gap-2.5 bg-bg2/60 rounded-xl py-[10px] px-5 border border-border-c">
        <div className="w-2 h-2 rounded-full bg-theme-green pulse" />
        <span className="text-theme-muted text-sm">Game Server Ready</span>
        <span className="text-theme-faint text-xs">· port 2567</span>
      </div>
    </div>
  );
}
