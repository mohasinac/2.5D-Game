import { useNavigate } from "react-router-dom";

interface Season {
  id: string;
  title: string;
  episodes: number;
  completed: number;
  locked: boolean;
}

const SEASONS: Season[] = [
  { id: "season1", title: "Season 1: The Iron Blader",   episodes: 5, completed: 0, locked: false },
  { id: "season2", title: "Season 2: Galaxy Tournament", episodes: 5, completed: 0, locked: true  },
];

export default function StoryHubPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-theme-text mb-6">Story Mode</h1>

      <div className="space-y-4">
        {SEASONS.map(season => {
          const pct = season.episodes > 0 ? Math.round((season.completed / season.episodes) * 100) : 0;
          return (
            <div
              key={season.id}
              className={`bg-bg2 border border-border-c rounded-xl p-4 ${season.locked ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-theme-text text-sm">{season.title}</h2>
                {season.locked && <span className="text-theme-muted text-xs">🔒 Locked</span>}
              </div>

              <div className="w-full bg-bg3 rounded-full h-2 mb-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-theme-muted mb-3">
                Progress: {season.completed}/{season.episodes} episodes
              </p>

              {!season.locked && (
                <button
                  onClick={() => navigate(`/rpg`)}
                  className="w-full py-2 rounded-lg bg-accent/10 border border-accent text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
                >
                  {season.completed > 0 ? "Continue →" : "Start →"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
