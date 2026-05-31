import { useState } from "react";
import { useUIPrefsStore } from "../stores/uiPrefsStore";
import StoryHubPage from "./StoryHubPage";
import ProfilePage from "./ProfilePage";
import ModeSelectPage from "./ModeSelectPage";

type Tab = "play" | "story" | "profile";

export function GameHubPage() {
  const { lastTab, set } = useUIPrefsStore();
  const [tab, setTab] = useState<Tab>((lastTab as Tab) || "play");

  function switchTab(t: Tab) {
    setTab(t);
    set({ lastTab: t });
  }

  return (
    <div className="flex flex-col h-dvh bg-bg1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {tab === "play"    && <ModeSelectPage />}
        {tab === "story"   && <StoryHubPage />}
        {tab === "profile" && <ProfilePage />}
      </div>

      <nav className="flex items-center justify-around h-16 bg-bg2 border-t border-border-c shrink-0 safe-area-bottom">
        <TabButton label="Play"    icon="⚔️"  active={tab === "play"}    onClick={() => switchTab("play")} />
        <TabButton label="Story"   icon="📖"  active={tab === "story"}   onClick={() => switchTab("story")} />
        <TabButton label="Profile" icon="👤"  active={tab === "profile"} onClick={() => switchTab("profile")} />
      </nav>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${
        active ? "text-accent border-t-2 border-accent -mt-px" : "text-theme-muted"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
