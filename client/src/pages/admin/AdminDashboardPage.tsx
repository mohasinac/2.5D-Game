import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S, alpha } from "@/styles/theme";

interface DashboardStats { beyblades: number; arenas: number; matches: number; players: number; }
interface TournamentStats { active: number; upcoming: number; }

const statCards = [
  { label:"Beyblades", icon:"🌀", href:"/admin/beyblades", accent:C.blue },
  { label:"Arenas", icon:"⭕", href:"/admin/arenas", accent:C.purple },
  { label:"Matches Played", icon:"⚔️", href:"/admin/stats", accent:C.red },
  { label:"Players", icon:"👥", href:"/admin/stats", accent:C.green },
] as const;

const quickLinks = [
  { label:"Create Beyblade", href:"/admin/beyblades/create", icon:"➕", desc:"Add a new beyblade to the game" },
  { label:"Create Arena", href:"/admin/arenas/create", icon:"🏟️", desc:"Design a new battle arena" },
  { label:"Asset Library", href:"/admin/assets", icon:"🖼️", desc:"Manage sprites and sounds" },
  { label:"Arena Test", href:"/admin/arena-test", icon:"🧪", desc:"Test arena configurations" },
  { label:"AI vs AI Lab", href:"/admin/ai-vs-ai", icon:"🤖", desc:"Pit two AIs against each other to validate beys & arenas" },
  { label:"Game Monitor", href:"http://localhost:2567/colyseus", icon:"📡", desc:"Colyseus server monitor", external:true },
  { label:"Settings", href:"/admin/settings", icon:"⚙️", desc:"Game-wide settings" },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ beyblades:0, arenas:0, matches:0, players:0 });
  const [tournamentStats, setTournamentStats] = useState<TournamentStats>({ active:0, upcoming:0 });
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [beybladeSnap, arenaSnap, matchSnap, playerSnap, activeSnap, upcomingSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
          getDocs(query(collection(db, COLLECTIONS.MATCHES), orderBy("createdAt","desc"), limit(5))),
          getDocs(collection(db, COLLECTIONS.PLAYER_STATS)),
          getDocs(query(collection(db, COLLECTIONS.TOURNAMENTS), where("status","==","in-progress"))),
          getDocs(query(collection(db, COLLECTIONS.TOURNAMENTS), where("status","==","registration"))),
        ]);
        setStats({ beyblades:beybladeSnap.size, arenas:arenaSnap.size, matches:matchSnap.size, players:playerSnap.size });
        setTournamentStats({ active:activeSnap.size, upcoming:upcomingSnap.size });
        setRecentMatches(matchSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch (err) { console.error("Dashboard fetch error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  const statValues = [stats.beyblades, stats.arenas, stats.matches, stats.players];

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Dashboard</h1>
        <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>Game administration overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        {statCards.map((card, i) => (
          <Link key={card.label} to={card.href} style={{ display:"block", background:alpha(card.accent, 0.06), border:`1px solid ${alpha(card.accent, 0.13)}`, borderRadius:14, padding:16, textDecoration:"none" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{card.icon}</div>
            {loading ? (
              <div style={{ height:28, width:48, background:C.bg3, borderRadius:6, marginBottom:4 }} className="pulse" />
            ) : (
              <div style={{ fontSize:24, fontWeight:700, color:C.text, fontFamily:"monospace" }}>{statValues[i]}</div>
            )}
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Tournament stats */}
      <div style={{ background:alpha(C.yellow, 0.06), border:`1px solid ${alpha(C.yellow, 0.13)}`, borderRadius:14, padding:16, marginBottom:28, display:"flex", alignItems:"center", gap:24 }}>
        <span style={{ fontSize:28 }}>🏆</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:4 }}>Tournaments</div>
          <div style={{ display:"flex", gap:20 }}>
            <div>
              {loading ? <div style={{ height:20, width:32, background:C.bg3, borderRadius:4 }} className="pulse" /> : <span style={{ fontSize:20, fontWeight:700, color:C.yellow, fontFamily:"monospace" }}>{tournamentStats.active}</span>}
              <span style={{ fontSize:12, color:C.muted, marginLeft:6 }}>active</span>
            </div>
            <div>
              {loading ? <div style={{ height:20, width:32, background:C.bg3, borderRadius:4 }} className="pulse" /> : <span style={{ fontSize:20, fontWeight:700, color:C.blue, fontFamily:"monospace" }}>{tournamentStats.upcoming}</span>}
              <span style={{ fontSize:12, color:C.muted, marginLeft:6 }}>registration open</span>
            </div>
          </div>
        </div>
        <Link to="/admin/tournaments" style={{ padding:"8px 16px", background:alpha(C.yellow, 0.13), border:`1px solid ${alpha(C.yellow, 0.33)}`, borderRadius:8, color:C.yellow, fontSize:12, fontWeight:600, textDecoration:"none" }}>
          Manage →
        </Link>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Quick links */}
        <div>
          <div style={S.sectionTitle}>Quick Actions</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {quickLinks.map((link) => {
              const inner = (
                <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:16 }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>{link.icon}</div>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{link.label}</div>
                  <div style={{ fontSize:11, color:C.faint, marginTop:3 }}>{link.desc}</div>
                </div>
              );
              return link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>{inner}</a>
              ) : (
                <Link key={link.label} to={link.href} style={{ textDecoration:"none" }}>{inner}</Link>
              );
            })}
          </div>
        </div>

        {/* Recent matches */}
        <div>
          <div style={S.sectionTitle}>Recent Matches</div>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            {loading ? (
              <div style={{ padding:32, textAlign:"center" }}>
                <div className="spin" style={{ width:24, height:24, border:`2px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%", margin:"0 auto" }} />
              </div>
            ) : recentMatches.length === 0 ? (
              <div style={{ padding:32, textAlign:"center", color:C.faint, fontSize:13 }}>No matches played yet</div>
            ) : (
              recentMatches.map((match, i) => (
                <div key={match.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", borderBottom: i < recentMatches.length-1 ? `1px solid ${C.border}` : "none" }}>
                  <div>
                    <div style={{ color:C.text, fontFamily:"monospace", fontSize:11 }}>{match.id.slice(0,12)}...</div>
                    <div style={{ color:C.faint, fontSize:11, textTransform:"capitalize" }}>{match.mode ?? "pvp"}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:C.green, fontSize:11 }}>Winner: {match.winner ?? "—"}</div>
                    <div style={{ color:C.faint, fontSize:11 }}>{match.createdAt?.toDate?.()?.toLocaleDateString() ?? "—"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
