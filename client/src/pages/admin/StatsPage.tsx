import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S } from "@/styles/theme";

interface PlayerStat {
  id: string; username?: string; wins?: number; losses?: number;
  totalDamageDealt?: number; totalCollisions?: number; matchesPlayed?: number;
  winRate?: number; // computed
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
    <div style={{ padding:32, display:"flex", justifyContent:"center" }}>
      <div className="spin" style={{ width:24, height:24, border:`2px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%" }} />
    </div>
  );

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Statistics</h1>
        <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>
          Player performance and match history · {totalMatches.toLocaleString()} total matches
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Leaderboard */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <div style={S.sectionTitle}>Top Players</div>
            <div style={{ display:"flex", gap:4 }}>
              {(["wins","winRate","totalDamageDealt"] as SortKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSortKey(k)}
                  style={{
                    padding:"3px 8px", fontSize:11, borderRadius:6, cursor:"pointer",
                    background: sortKey === k ? C.blue+"22" : "transparent",
                    color: sortKey === k ? C.blue : C.faint,
                    border: `1px solid ${sortKey === k ? C.blue+"55" : C.border}`,
                  }}
                >
                  {k === "wins" ? "Wins" : k === "winRate" ? "Win %" : "Damage"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
            {loading ? <Spinner /> : sorted.length === 0 ? (
              <div style={{ padding:32, textAlign:"center", color:C.faint, fontSize:13 }}>No player data yet</div>
            ) : sorted.map((p, i) => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom: i < sorted.length-1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize:i<3?18:13, width:32, textAlign:"center", color:i<3?C.yellow:C.faint }}>
                  {i<3 ? MEDALS[i] : `${i+1}.`}
                </span>
                <div style={{ flex:1 }}>
                  <p style={{ color:C.text, fontSize:13, fontWeight:500 }}>{p.username ?? p.id.slice(0,10)}</p>
                  <p style={{ color:C.faint, fontSize:11 }}>{p.matchesPlayed ?? 0} matches · {((p.winRate??0)*100).toFixed(0)}% win rate</p>
                </div>
                <div style={{ textAlign:"right", fontSize:12 }}>
                  {sortKey === "wins" && (
                    <>
                      <p style={{ color:C.green, fontFamily:"monospace" }}>{p.wins ?? 0}W</p>
                      <p style={{ color:C.red, fontFamily:"monospace" }}>{p.losses ?? 0}L</p>
                    </>
                  )}
                  {sortKey === "winRate" && (
                    <p style={{ color:C.blue, fontFamily:"monospace", fontSize:14, fontWeight:700 }}>
                      {((p.winRate??0)*100).toFixed(1)}%
                    </p>
                  )}
                  {sortKey === "totalDamageDealt" && (
                    <p style={{ color:C.yellow, fontFamily:"monospace" }}>
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
          <div style={S.sectionTitle}>Recent Matches</div>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
            {loading ? <Spinner /> : matches.length === 0 ? (
              <div style={{ padding:32, textAlign:"center", color:C.faint, fontSize:13 }}>No matches recorded yet</div>
            ) : matches.map((m, i) => (
              <div key={m.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", borderBottom: i<matches.length-1 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <p style={{ color:C.text, fontSize:11, fontFamily:"monospace" }}>{m.id.slice(0,16)}…</p>
                  <p style={{ color:C.faint, fontSize:11, textTransform:"capitalize" }}>
                    {m.mode ?? "pvp"} · {m.players?.length ?? "?"} players
                    {m.seriesFormat ? ` · ${m.seriesFormat}` : ""}
                  </p>
                </div>
                <div style={{ textAlign:"right", fontSize:12 }}>
                  <p style={{ color:C.yellow }}>{m.winner ? `Winner: ${m.winner.slice(0,8)}` : "Draw"}</p>
                  <p style={{ color:C.faint }}>{m.createdAt?.toDate?.()?.toLocaleDateString() ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
