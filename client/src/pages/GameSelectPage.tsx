import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { C } from "@/styles/theme";

interface ServerSettings {
  enableAI: boolean;
  enableTournament: boolean;
  maintenanceMode: boolean;
  serverMessage: string;
}

export function GameSelectPage() {
  const { setGameMode } = useGame();
  const [srvSettings, setSrvSettings] = useState<ServerSettings>({
    enableAI: false,
    enableTournament: false,
    maintenanceMode: false,
    serverMessage: "",
  });

  useEffect(() => {
    getDoc(doc(db, "settings", "game"))
      .then((snap) => {
        if (snap.exists()) setSrvSettings((s) => ({ ...s, ...(snap.data() as Partial<ServerSettings>) }));
      })
      .catch(() => {/* use defaults */});
  }, []);

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
      to: srvSettings.enableAI ? "/game/ai-battle" : "#",
      mode: null,
      icon: "🤖",
      title: "AI Battle",
      desc: "Fight CPU opponents at varying difficulty levels.",
      sub: srvSettings.enableAI ? "1 Player" : "Coming Soon",
      subColor: srvSettings.enableAI ? C.purple : C.faint,
      hoverBorder: srvSettings.enableAI ? C.purple : C.border,
      disabled: !srvSettings.enableAI,
    },
    ...(srvSettings.enableTournament
      ? [{
          to: "/game/tournament",
          mode: null,
          icon: "🏆",
          title: "Tournament",
          desc: "Compete in bracket-style tournaments against other players and AI.",
          sub: "Up to 8 players",
          subColor: C.yellow,
          hoverBorder: C.yellow,
          disabled: false,
        }]
      : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, padding: 32 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>← Back</Link>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: C.text, marginTop: 12, letterSpacing: "-0.02em" }}>
            Select Game Mode
          </h1>
        </div>

        {srvSettings.maintenanceMode && (
          <div style={{
            background: C.yellow + "18", border: `1px solid ${C.yellow}55`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 24,
            color: C.yellow, fontSize: 13, fontWeight: 600,
          }}>
            ⚠️ Server is in maintenance mode — some features may be unavailable.
            {srvSettings.serverMessage && ` ${srvSettings.serverMessage}`}
          </div>
        )}

        {!srvSettings.maintenanceMode && srvSettings.serverMessage && (
          <div style={{
            background: C.blue + "18", border: `1px solid ${C.blue}44`,
            borderRadius: 10, padding: "12px 16px", marginBottom: 24,
            color: C.blue, fontSize: 13,
          }}>
            {srvSettings.serverMessage}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(modes.length, 3)}, 1fr)`,
          gap: 16,
        }}>
          {modes.map((m) => {
            const inner = (
              <div style={{
                padding: 24, background: C.bg2, borderRadius: 20,
                border: `1px solid ${C.border}`, height: "100%",
                boxSizing: "border-box",
                opacity: m.disabled ? 0.5 : 1,
                cursor: m.disabled ? "not-allowed" : "pointer",
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{m.icon}</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{m.title}</h2>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>{m.desc}</p>
                <div style={{ marginTop: 16, fontSize: 12, fontWeight: 600, color: m.subColor }}>{m.sub}</div>
              </div>
            );

            if (m.disabled) return <div key={m.title}>{inner}</div>;

            return (
              <Link
                key={m.title}
                to={m.to}
                onClick={() => m.mode && setGameMode(m.mode)}
                style={{ textDecoration: "none", display: "block" }}
                onMouseEnter={(e) => (e.currentTarget.querySelector("div")!.style.borderColor = m.hoverBorder)}
                onMouseLeave={(e) => (e.currentTarget.querySelector("div")!.style.borderColor = C.border)}
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
