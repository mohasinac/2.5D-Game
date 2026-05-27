import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/cn";

interface ServerSettings {
  enableAI: boolean;
  enablePvp: boolean;
  enableTournament: boolean;
  maintenanceMode: boolean;
  serverMessage: string;
}

export function GameSelectPage() {
  const { setGameMode } = useGame();
  // AI Battle is always on by default.
  // PvP Battle is always off by default (enable via admin settings/game if needed).
  // Tournament is always on by default (supports AI opponents).
  const [srvSettings, setSrvSettings] = useState<ServerSettings>({
    enableAI: true,
    enablePvp: false,
    enableTournament: true,
    maintenanceMode: false,
    serverMessage: "",
  });

  useEffect(() => {
    getDoc(doc(db, "settings", "game"))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<ServerSettings>;
          setSrvSettings((s) => ({
            ...s,
            ...data,
            // If Firestore doc doesn't explicitly set these, keep our safe defaults:
            // AI on, PvP off, Tournament on.
            enableAI:         data.enableAI         ?? true,
            enablePvp:        data.enablePvp        ?? false,
            enableTournament: data.enableTournament ?? true,
          }));
        }
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
      show: true,
    },
    // PvP Battle — hidden unless explicitly enabled in admin settings.
    {
      to: "/game/battle/lobby",
      mode: "pvp" as const,
      icon: "⚔️",
      title: "PVP Battle",
      desc: "Live multiplayer — battle up to 4 players in real-time with full physics.",
      sub: "2-4 Players",
      hoverBorderClass: "hover:border-theme-red",
      disabled: false,
      show: srvSettings.enablePvp,
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
      show: true,
    },
    {
      to: "/game/tournament",
      mode: null,
      icon: "🏆",
      title: "Tournament",
      desc: "Compete in bracket-style tournaments against AI opponents and other players.",
      sub: "Up to 8 players",
      hoverBorderClass: "hover:border-theme-yellow",
      disabled: !srvSettings.enableTournament,
      show: true,
    },
  ].filter((m) => m.show);

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

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
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

        <div className="mt-8 grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {[
            { to: "/game/story", icon: "📖", title: "Story Mode", desc: "Season-based campaign" },
            { to: "/game/my-beys", icon: "🔧", title: "My Beyblades", desc: "View your collection" },
            { to: "/game/tutorial", icon: "📚", title: "Tutorial", desc: "Learn the basics" },
            { to: "/game/settings", icon: "⚙️", title: "Settings", desc: "Audio, visuals, controls" },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="no-underline block">
              <div className="p-4 bg-bg2 rounded-[14px] border border-border-c hover:border-theme-blue/40 transition-colors">
                <span className="text-[24px]">{item.icon}</span>
                <h3 className="text-[14px] font-bold text-theme-text mt-2">{item.title}</h3>
                <p className="text-theme-muted text-[11px]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
