import { Link } from "react-router-dom";
import { C } from "@/styles/theme";

export function HomePage() {
  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(ellipse at 50% 0%, ${C.blue}18 0%, ${C.bg0} 70%)`,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32,
    }}>
      <div style={{ textAlign:"center", marginBottom:56 }}>
        <div style={{ fontSize:80, marginBottom:16 }}>🌀</div>
        <h1 style={{ fontSize:52, fontWeight:900, color:C.text, letterSpacing:"-0.03em", marginBottom:12 }}>
          Beyblade Game
        </h1>
        <p style={{ fontSize:18, color:C.muted }}>Real-time multiplayer spinning top battles</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:560, width:"100%", marginBottom:40 }}>
        <Link
          to="/game"
          style={{
            display:"block", padding:32, background:C.bg2,
            borderRadius:20, border:`1px solid ${C.border}`,
            textDecoration:"none", transition:"border-color 200ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C.blue)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
        >
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🎮</div>
            <h2 style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:6 }}>Play Game</h2>
            <p style={{ color:C.muted, fontSize:13 }}>Tryout mode or live PVP battles</p>
          </div>
        </Link>

        <Link
          to="/admin"
          style={{
            display:"block", padding:32, background:C.bg2,
            borderRadius:20, border:`1px solid ${C.border}`,
            textDecoration:"none", transition:"border-color 200ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C.purple)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
        >
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>⚙️</div>
            <h2 style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:6 }}>Admin Panel</h2>
            <p style={{ color:C.muted, fontSize:13 }}>Manage beyblades, arenas, and assets</p>
          </div>
        </Link>
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <Link
          to="/leaderboard"
          style={{
            padding:"10px 20px", background:C.bg2+"99", borderRadius:12,
            border:`1px solid ${C.border}`, textDecoration:"none",
            color:C.yellow, fontSize:13, fontWeight:600,
          }}
        >
          🏆 Leaderboard
        </Link>
      </div>

      <div style={{
        display:"flex", alignItems:"center", gap:10,
        background:C.bg2+"99", borderRadius:12, padding:"10px 20px", border:`1px solid ${C.border}`,
      }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }} className="pulse" />
        <span style={{ color:C.muted, fontSize:13 }}>Game Server Ready</span>
        <span style={{ color:C.faint, fontSize:12 }}>· port 2567</span>
      </div>
    </div>
  );
}
