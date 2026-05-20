import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S } from "@/styles/theme";

interface PlayerStat {
  id: string; username?: string; wins?: number; losses?: number;
  totalDamageDealt?: number; totalCollisions?: number; matchesPlayed?: number;
}

export function StatsPage() {
  const [players, setPlayers] = useState<PlayerStat[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [playerSnap, matchSnap] = await Promise.all([
          getDocs(query(collection(db, COLLECTIONS.PLAYER_STATS), orderBy("wins","desc"), limit(20))),
          getDocs(query(collection(db, COLLECTIONS.MATCHES), orderBy("createdAt","desc"), limit(20))),
        ]);
        setPlayers(playerSnap.docs.map(d => ({ id:d.id, ...d.data() } as PlayerStat)));
        setMatches(matchSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const Spinner = () => (
    <div style={{ padding:32, display:"flex", justifyContent:"center" }}>
      <div className="spin" style={{ width:24, height:24, border:`2px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%" }} />
    </div>
  );

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Statistics</h1>
        <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>Player performance and match history</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Leaderboard */}
        <div>
          <div style={S.sectionTitle}>Top Players</div>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
            {loading ? <Spinner /> : players.length === 0 ? (
              <div style={{ padding:32, textAlign:"center", color:C.faint, fontSize:13 }}>No player data yet</div>
            ) : players.map((p, i) => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:18, width:32, textAlign:"center" }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:C.text, fontSize:13, fontWeight:500 }}>{p.username ?? p.id.slice(0,8)}</p>
                  <p style={{ color:C.faint, fontSize:11 }}>{p.matchesPlayed ?? 0} matches</p>
                </div>
                <div style={{ textAlign:"right", fontSize:12 }}>
                  <p style={{ color:C.green, fontFamily:"monospace" }}>{p.wins ?? 0}W</p>
                  <p style={{ color:C.red, fontFamily:"monospace" }}>{p.losses ?? 0}L</p>
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
                  <p style={{ color:C.text, fontSize:11, fontFamily:"monospace" }}>{m.id.slice(0,16)}...</p>
                  <p style={{ color:C.faint, fontSize:11, textTransform:"capitalize" }}>{m.mode ?? "pvp"} · {m.players?.length ?? "?"} players</p>
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
