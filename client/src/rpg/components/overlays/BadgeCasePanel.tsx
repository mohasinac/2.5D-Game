import { useRPGStore } from "../../stores/rpgStore";

interface BadgeCasePanelProps {
  badgeDefs: Array<{
    id: string;
    displayName: string;
    description: string;
    iconAssetId: string;
    category: string;
  }>;
  onClose: () => void;
}

export function BadgeCasePanel({ badgeDefs, onClose }: BadgeCasePanelProps) {
  const earnedBadges = useRPGStore((s) => s.earnedBadges);

  const categories = Array.from(new Set(badgeDefs.map((b) => b.category)));

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-amber-400 font-bold text-lg mb-4">Badge Case</h3>

      {categories.map((cat) => {
        const badges = badgeDefs.filter((b) => b.category === cat);
        return (
          <div key={cat} className="mb-4">
            <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
              {cat}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {badges.map((badge) => {
                const earned = earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center p-2 rounded ${
                      earned
                        ? "bg-amber-500/20 border border-amber-400"
                        : "bg-gray-800/50 border border-gray-700"
                    }`}
                    title={earned ? `${badge.displayName}: ${badge.description}` : "???"}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        earned ? "bg-amber-500/30" : "bg-gray-700 grayscale opacity-40"
                      }`}
                    >
                      {earned ? "🏅" : "?"}
                    </div>
                    <span
                      className={`text-xs mt-1 text-center ${
                        earned ? "text-amber-300" : "text-gray-600"
                      }`}
                    >
                      {earned ? badge.displayName : "???"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {badgeDefs.length === 0 && (
        <p className="text-gray-500 text-sm">No badges available in this region.</p>
      )}
    </div>
  );
}
