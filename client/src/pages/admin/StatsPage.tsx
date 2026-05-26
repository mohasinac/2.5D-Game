import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

interface PlayerStat {
  id: string; username?: string; wins?: number; losses?: number;
  totalDamageDealt?: number; totalCollisions?: number; matchesPlayed?: number;
  winRate?: number;
}

type SortKey = "wins" | "winRate" | "totalDamageDealt";

const MEDALS = ["🥇", "🥈", "🥉"];

export function StatsPage() {
  const [players, setPlayers] = useState<PlayerStat[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("wins");

  useEffect(() => {
    (async () => {
      try {
        const [playerSnap, matchSnap, countSnap] = await Promise.all([
          getDocs(query(collection(db, COLLECTIONS.PLAYER_STATS), orderBy("wins","desc"), limit(50))),
          getDocs(query(collection(db, COLLECTIONS.MATCHES), orderBy("createdAt","desc"), limit(20))),
          getCountFromServer(collection(db, COLLECTIONS.MATCHES)).catch(() => null),
        ]);
        const list = playerSnap.docs.map((d) => {
          const data = d.data() as PlayerStat;
          const wins = data.wins ?? 0;
          const mp = data.matchesPlayed ?? 0;
          return { ...data, id: d.id, winRate: mp > 0 ? wins / mp : 0 };
        });
        setPlayers(list);
        setMatches(matchSnap.docs.map(d => ({ id:d.id, ...d.data() })));
        setTotalMatches(countSnap?.data().count ?? matchSnap.size);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const sorted = [...players].sort((a, b) => {
    if (sortKey === "winRate") return (b.winRate ?? 0) - (a.winRate ?? 0);
    if (sortKey === "totalDamageDealt") return (b.totalDamageDealt ?? 0) - (a.totalDamageDealt ?? 0);
    return (b.wins ?? 0) - (a.wins ?? 0);
  });

  const Spinner = () => (
    <div className="py-8 flex justify-center">
      <div className="spin w-6 h-6 border-2 border-blue border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-6 w-full box-border">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text">Statistics</h1>
        <p className="text-faint text-[13px] mt-1">
          Player performance and match history · {totalMatches.toLocaleString()} total matches
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Top Players</div>
            <div className="flex gap-1">
              {(["wins","winRate","totalDamageDealt"] as SortKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSortKey(k)}
                  className={`py-[3px] px-2 text-[11px] rounded-[6px] cursor-pointer border ${sortKey === k ? "bg-blue-13 text-theme-blue border-blue-30" : "bg-transparent text-theme-faint border-border-c"}`}
                >
                  {k === "wins" ? "Wins" : k === "winRate" ? "Win %" : "Damage"}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-bg2 border border-border rounded-2xl overflow-hidden">
            {loading ? <Spinner /> : sorted.length === 0 ? (
              <div className="py-8 text-center text-faint text-[13px]">No player data yet</div>
            ) : sorted.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < sorted.length-1 ? "border-b border-border-c" : ""}`}>
                <span className={`w-8 text-center ${i<3 ? "text-[18px] text-theme-yellow" : "text-[13px] text-theme-faint"}`}>
                  {i<3 ? MEDALS[i] : `${i+1}.`}
                </span>
                <div className="flex-1">
                  <p className="text-text text-[13px] font-medium">{p.username ?? p.id.slice(0,10)}</p>
                  <p className="text-faint text-[11px]">{p.matchesPlayed ?? 0} matches · {((p.winRate??0)*100).toFixed(0)}% win rate</p>
                </div>
                <div className="text-right text-xs">
                  {sortKey === "wins" && (
                    <>
                      <p className="text-green font-mono">{p.wins ?? 0}W</p>
                      <p className="text-red font-mono">{p.losses ?? 0}L</p>
                    </>
                  )}
                  {sortKey === "winRate" && (
                    <p className="text-blue font-mono text-sm font-bold">
                      {((p.winRate??0)*100).toFixed(1)}%
                    </p>
                  )}
                  {sortKey === "totalDamageDealt" && (
                    <p className="text-yellow font-mono">
                      {(p.totalDamageDealt??0).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent matches */}
        <div>
          <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-2">Recent Matches</div>
          <div className="bg-bg2 border border-border rounded-2xl overflow-hidden">
            {loading ? <Spinner /> : matches.length === 0 ? (
              <div className="py-8 text-center text-faint text-[13px]">No matches recorded yet</div>
            ) : matches.map((m, i) => (
              <div key={m.id} className={`flex justify-between items-center px-4 py-2.5 ${i < matches.length-1 ? "border-b border-border-c" : ""}`}>
                <div>
                  <p className="text-text text-[11px] font-mono">{m.id.slice(0,16)}…</p>
                  <p className="text-faint text-[11px] capitalize">
                    {m.mode ?? "pvp"} · {m.players?.length ?? "?"} players
                    {m.seriesFormat ? ` · ${m.seriesFormat}` : ""}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-yellow">{m.winner ? `Winner: ${m.winner.slice(0,8)}` : "Draw"}</p>
                  <p className="text-faint">{m.createdAt?.toDate?.()?.toLocaleDateString() ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
