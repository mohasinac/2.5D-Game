import { Link } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { C } from "@/styles/theme";

const modes = [
  {
    to: "/game/tryout",
    mode: "tryout" as const,
    icon: "🌀",
    title: "Tryout",
    desc: "Solo practice — master the arena hazards and your beyblade's special moves.",
    sub: "1 Player",
    subColor: C.blue,
    hoverBorder: C.blue,
    disabled: false,
  },
  {
    to: "/game/battle/lobby",
    mode: "pvp" as const,
    icon: "⚔️",
    title: "PVP Battle",
    desc: "Live multiplayer — battle up to 4 players in real-time with full physics.",
    sub: "2-4 Players",
    subColor: C.red,
    hoverBorder: C.red,
    disabled: false,
  },
  {
    to: "#",
    mode: null,
    icon: "🤖",
    title: "AI Battle",
    desc: "Fight CPU opponents at varying difficulty levels.",
    sub: "Coming Soon",
    subColor: C.faint,
    hoverBorder: C.border,
    disabled: true,
  },
];

export function GameSelectPage() {
  const { setGameMode } = useGame();

  return (
    <div style={{ minHeight:"100vh", background:C.bg0, padding:32 }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <div style={{ marginBottom:32 }}>
          <Link to="/" style={{ color:C.muted, fontSize:13, textDecoration:"none" }}>← Back</Link>
          <h1 style={{ fontSize:36, fontWeight:900, color:C.text, marginTop:12, letterSpacing:"-0.02em" }}>
            Select Game Mode
          </h1>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {modes.map((m) => {
            const inner = (
              <div style={{ padding:24, background:C.bg2, borderRadius:20, border:`1px solid ${C.border}`, height:"100%", boxSizing:"border-box", opacity: m.disabled ? 0.5 : 1, cursor: m.disabled ? "not-allowed" : "pointer" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>{m.icon}</div>
                <h2 style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>{m.title}</h2>
                <p style={{ color:C.muted, fontSize:13, lineHeight:1.5 }}>{m.desc}</p>
                <div style={{ marginTop:16, fontSize:12, fontWeight:600, color: m.subColor }}>{m.sub}</div>
              </div>
            );

            if (m.disabled) return <div key={m.title}>{inner}</div>;

            return (
              <Link
                key={m.title}
                to={m.to}
                onClick={() => m.mode && setGameMode(m.mode)}
                style={{ textDecoration:"none", display:"block" }}
                onMouseEnter={e => (e.currentTarget.querySelector("div")!.style.borderColor = m.hoverBorder)}
                onMouseLeave={e => (e.currentTarget.querySelector("div")!.style.borderColor = C.border)}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
