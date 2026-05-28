import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

interface GameSettings {
  // Existing
  defaultArenaId: string;
  maxPlayersPerRoom: number;
  matchTimeoutSeconds: number;
  enableAI: boolean;
  enableTournament: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  serverMessage: string;
  // Game mode toggles
  enableTryout: boolean;
  enablePvp: boolean;
  enableAiBattle: boolean;
  // Global blacklists (newline/comma separated IDs)
  globalBeybladeBlacklist: string;
  globalArenaBlacklist: string;
  // Feature toggles
  featureSpecialMoves: boolean;
  featureTurrets: boolean;
  featurePortals: boolean;
  featureWaterBodies: boolean;
  featurePits: boolean;
  featureLoops: boolean;
  // Tournament gap
  minimumTournamentGapMinutes: number;
  // Room limits
  maxActiveRooms: number;
  maxSpectatorsBattle: number;
  maxSpectatorsTournament: number;
  maxSpectatorsAI: number;
  // Renderer
  defaultRendererMode: "2d" | "2.5d";
}

const DEFAULTS: GameSettings = {
  defaultArenaId: "", maxPlayersPerRoom: 4, matchTimeoutSeconds: 180,
  enableAI: true, enableTournament: true, maintenanceMode: false,
  maintenanceMessage: "", serverMessage: "",
  enableTryout: true, enablePvp: true, enableAiBattle: true,
  globalBeybladeBlacklist: "", globalArenaBlacklist: "",
  featureSpecialMoves: true, featureTurrets: true, featurePortals: true,
  featureWaterBodies: true, featurePits: true, featureLoops: true,
  minimumTournamentGapMinutes: 30,
  maxActiveRooms: 20,
  maxSpectatorsBattle: 8, maxSpectatorsTournament: 8, maxSpectatorsAI: 8,
  defaultRendererMode: "2.5d",
};

const inputCls = "w-full bg-bg1 border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-faint focus:outline-none focus:border-blue";

function normalize(raw: string): string[] {
  return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch" aria-checked={on} onClick={onChange}
      className={`relative w-10 h-[22px] rounded-full border-none cursor-pointer flex-shrink-0 transition-colors ${on ? "bg-blue" : "bg-bg3"}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full transition-[left] duration-150 ${on ? "left-[19px]" : "left-[3px]"}`} />
    </button>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "game"))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          // Convert array fields back to newline strings for editing
          setSettings({
            ...DEFAULTS,
            ...data,
            globalBeybladeBlacklist: (data.globalBeybladeBlacklist ?? []).join("\n"),
            globalArenaBlacklist: (data.globalArenaBlacklist ?? []).join("\n"),
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof GameSettings>(k: K, v: GameSettings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "game"), {
        ...settings,
        // Convert textarea strings back to arrays
        globalBeybladeBlacklist: normalize(settings.globalBeybladeBlacklist),
        globalArenaBlacklist: normalize(settings.globalArenaBlacklist),
        updatedAt: serverTimestamp(),
      });
      toast.success("Settings saved!");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-6 flex justify-center">
      <div className="spin w-8 h-8 border-2 border-blue border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-6 max-w-[660px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Settings</h1>
          <p className="text-faint text-sm mt-1">Game-wide configuration</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setSettings(DEFAULTS)}>Reset Defaults</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Game config */}
        <Section title="Game Configuration">
          <div>
            <Label>Default Arena ID</Label>
            <input type="text" value={settings.defaultArenaId} onChange={(e) => set("defaultArenaId", e.target.value)} placeholder="Firestore arena document ID" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Max Players / Room</Label>
              <SearchableSelect
                value={String(settings.maxPlayersPerRoom)}
                options={[2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
                onChange={(v) => set("maxPlayersPerRoom", +v)}
              />
            </div>
            <div>
              <Label>Match Timeout (seconds)</Label>
              <input type="number" min={60} max={600} step={30} value={settings.matchTimeoutSeconds} onChange={(e) => set("matchTimeoutSeconds", +e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <Label>Default Renderer Mode</Label>
            <p className="text-faint text-[11px] mb-2">Used for arenas that do not specify an explicit renderer mode. 2.5D adds tilt perspective; 2D is flat top-down.</p>
            <div className="flex gap-2">
              {(["2d", "2.5d"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => set("defaultRendererMode", m)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold border transition-colors ${settings.defaultRendererMode === m ? "bg-blue border-blue text-white" : "bg-bg1 border-border text-faint hover:text-text"}`}
                >
                  {m === "2.5d" ? "2.5D (Tilt Perspective)" : "2D (Flat Top-Down)"}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Game modes */}
        <Section title="Game Modes">
          {([
            ["enableTryout", "Tryout (Solo Practice)", "Allow solo tryout rooms"],
            ["enablePvp", "PVP Battle", "Allow player vs player battles"],
            ["enableAiBattle", "AI Battle", "Allow player vs AI matches"],
            ["enableAI", "AI Battle (legacy flag)", "Legacy toggle — prefer enableAiBattle"],
            ["enableTournament", "Tournament Mode", "Show Tournament in game select menu"],
            ["maintenanceMode", "Maintenance Mode", "Block all new game connections"],
          ] as [keyof GameSettings, string, string][]).map(([key, label, desc], i, arr) => (
            <ToggleRow key={key} label={label} desc={desc} on={!!settings[key]} onChange={() => set(key, !settings[key])} last={i === arr.length - 1} />
          ))}
          {settings.maintenanceMode && (
            <div className="pt-2">
              <Label>Maintenance Message (shown to blocked players)</Label>
              <textarea
                value={settings.maintenanceMessage}
                onChange={e => set("maintenanceMessage", e.target.value)}
                rows={2}
                placeholder="We'll be back soon. Maintenance in progress."
                className={`${inputCls} resize-y leading-relaxed`}
              />
            </div>
          )}
        </Section>

        {/* Arena features */}
        <Section title="Arena Features">
          <p className="text-[11px] text-faint -mt-1">Disable individual arena hazards globally. Affects all rooms.</p>
          {([
            ["featureSpecialMoves", "Special Moves", "Attack/Defense/Stamina/Balanced specials"],
            ["featureTurrets", "Turrets", "Automated projectile turrets"],
            ["featurePortals", "Portals", "Teleportation portals"],
            ["featureWaterBodies", "Water Bodies", "Slow zones / damage areas"],
            ["featurePits", "Pits", "Ring-out pits"],
            ["featureLoops", "Loops", "Speed loop ramps"],
          ] as [keyof GameSettings, string, string][]).map(([key, label, desc], i, arr) => (
            <ToggleRow key={key} label={label} desc={desc} on={!!settings[key]} onChange={() => set(key, !settings[key])} last={i === arr.length - 1} />
          ))}
        </Section>

        {/* Global blacklists */}
        <Section title="Global Blacklists">
          <div>
            <Label>Beyblade ID Blacklist (one per line or comma-separated)</Label>
            <textarea
              value={settings.globalBeybladeBlacklist}
              onChange={(e) => set("globalBeybladeBlacklist", e.target.value)}
              rows={4}
              placeholder={"banned_beyblade_id1\nbanned_beyblade_id2"}
              className={`${inputCls} resize-y font-mono text-xs`}
            />
          </div>
          <div>
            <Label>Arena ID Blacklist</Label>
            <textarea
              value={settings.globalArenaBlacklist}
              onChange={(e) => set("globalArenaBlacklist", e.target.value)}
              rows={3}
              placeholder="banned_arena_id1"
              className={`${inputCls} resize-y font-mono text-xs`}
            />
          </div>
        </Section>

        {/* Room limits */}
        <Section title="Room Limits">
          <div>
            <Label>Max Active Rooms (across all types)</Label>
            <div className="flex items-center gap-3">
              <input type="range" min={5} max={50} step={1} value={settings.maxActiveRooms} onChange={e => set("maxActiveRooms", +e.target.value)} className="flex-1" />
              <span className="text-sm text-text min-w-[28px] text-right">{settings.maxActiveRooms}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {([
              ["maxSpectatorsBattle", "Spectators / Battle Room"],
              ["maxSpectatorsTournament", "Spectators / Tournament Room"],
              ["maxSpectatorsAI", "Spectators / AI Battle Room"],
            ] as [keyof GameSettings, string][]).map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={12} step={1} value={settings[key] as number} onChange={e => set(key, +e.target.value)} className="flex-1" />
                  <span className="text-sm text-text min-w-[20px]">{settings[key] as number}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Tournament settings */}
        <Section title="Tournament Settings">
          <div>
            <Label>Minimum Gap Between Tournaments (minutes)</Label>
            <input
              type="number" min={0} max={1440} step={5}
              value={settings.minimumTournamentGapMinutes}
              onChange={(e) => set("minimumTournamentGapMinutes", +e.target.value)}
              className={`${inputCls} w-[120px]`}
            />
            <p className="text-faint text-[11px] mt-1">
              Advisory gap shown as a warning when scheduling overlapping tournaments. Not enforced.
            </p>
          </div>
        </Section>

        {/* Server message */}
        <Section title="Server Message">
          <textarea
            value={settings.serverMessage}
            onChange={(e) => set("serverMessage", e.target.value)}
            rows={3}
            placeholder="Displayed to all players in the lobby (leave empty to hide)"
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg2 border border-border rounded-2xl p-5">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-3.5">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange, last }: { label: string; desc: string; on: boolean; onChange: () => void; last?: boolean }) {
  return (
    <label className={`flex items-center justify-between py-2.5 cursor-pointer ${last ? "" : "border-b border-border"}`}>
      <div>
        <p className="text-text text-sm">{label}</p>
        <p className="text-faint text-[11px]">{desc}</p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </label>
  );
}
