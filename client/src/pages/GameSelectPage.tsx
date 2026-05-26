import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/cn";

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
      hoverBorderClass: "hover:border-theme-blue",
      disabled: false,
    },
    {
      to: "/game/battle/lobby",
      mode: "pvp" as const,
      icon: "⚔️",
      title: "PVP Battle",
      desc: "Live multiplayer — battle up to 4 players in real-time with full physics.",
      sub: "2-4 Players",
      hoverBorderClass: "hover:border-theme-red",
      disabled: false,
    },
    {
      to: srvSettings.enableAI ? "/game/ai-battle" : "#",
      mode: null,
      icon: "🤖",
      title: "AI Battle",
      desc: "Fight CPU opponents at varying difficulty levels.",
      sub: srvSettings.enableAI ? "1 Player" : "Coming Soon",
      hoverBorderClass: srvSettings.enableAI ? "hover:border-theme-purple" : "",
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
          hoverBorderClass: "hover:border-theme-yellow",
          disabled: false,
        }]
      : []),
  ];

  const colCount = Math.min(modes.length, 3);

  return (
    <div className="min-h-screen bg-bg0 p-8">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-theme-muted text-[13px] no-underline">← Back</Link>
          <h1 className="text-[36px] font-black text-theme-text mt-3 tracking-[-0.02em]">
            Select Game Mode
          </h1>
        </div>

        {srvSettings.maintenanceMode && (
          <div className="bg-theme-yellow/[.09] border border-theme-yellow/[.33] rounded-[10px] px-4 py-3 mb-6 text-theme-yellow text-[13px] font-semibold">
            ⚠️ Server is in maintenance mode — some features may be unavailable.
            {srvSettings.serverMessage && ` ${srvSettings.serverMessage}`}
          </div>
        )}

        {!srvSettings.maintenanceMode && srvSettings.serverMessage && (
          <div className="bg-theme-blue/[.09] border border-theme-blue/[.27] rounded-[10px] px-4 py-3 mb-6 text-theme-blue text-[13px]">
            {srvSettings.serverMessage}
          </div>
        )}

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
        >
          {modes.map((m) => {
            const inner = (
              <div className={cn(
                "p-6 bg-bg2 rounded-[20px] border border-border-c h-full box-border",
                m.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              )}>
                <div className="text-[36px] mb-4">{m.icon}</div>
                <h2 className="text-[18px] font-bold text-theme-text mb-2">{m.title}</h2>
                <p className="text-theme-muted text-[13px] leading-relaxed">{m.desc}</p>
                <div className={cn(
                  "mt-4 text-[12px] font-semibold",
                  m.title === "Tryout" && "text-theme-blue",
                  m.title === "PVP Battle" && "text-theme-red",
                  m.title === "AI Battle" && (srvSettings.enableAI ? "text-theme-purple" : "text-theme-faint"),
                  m.title === "Tournament" && "text-theme-yellow",
                )}>
                  {m.sub}
                </div>
              </div>
            );

            if (m.disabled) return <div key={m.title}>{inner}</div>;

            return (
              <Link
                key={m.title}
                to={m.to}
                onClick={() => m.mode && setGameMode(m.mode)}
                className={cn("no-underline block group transition-colors duration-200", m.hoverBorderClass, "[&>div]:transition-colors [&>div]:duration-200")}
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
