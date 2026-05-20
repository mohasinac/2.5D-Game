import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S } from "@/styles/theme";

interface DashboardStats { beyblades: number; arenas: number; matches: number; players: number; }

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
  { label:"Game Monitor", href:"http://localhost:2567/colyseus", icon:"📡", desc:"Colyseus server monitor", external:true },
  { label:"Settings", href:"/admin/settings", icon:"⚙️", desc:"Game-wide settings" },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ beyblades:0, arenas:0, matches:0, players:0 });
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [beybladeSnap, arenaSnap, matchSnap, playerSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
          getDocs(query(collection(db, COLLECTIONS.MATCHES), orderBy("createdAt","desc"), limit(5))),
          getDocs(collection(db, COLLECTIONS.PLAYER_STATS)),
        ]);
        setStats({ beyblades:beybladeSnap.size, arenas:arenaSnap.size, matches:matchSnap.size, players:playerSnap.size });
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
          <Link key={card.label} to={card.href} style={{ display:"block", background:`${card.accent}0f`, border:`1px solid ${card.accent}22`, borderRadius:14, padding:16, textDecoration:"none" }}>
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
