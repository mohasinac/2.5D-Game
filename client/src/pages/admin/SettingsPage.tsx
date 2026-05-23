import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";
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
};

function normalize(raw: string): string[] {
  return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch" aria-checked={on} onClick={onChange}
      style={{ position: "relative", width: 40, height: 22, borderRadius: 11, background: on ? C.blue : C.bg3, border: "none", cursor: "pointer", flexShrink: 0 }}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 19 : 3, width: 16, height: 16, background: C.white, borderRadius: "50%", transition: "left 150ms" }} />
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
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${C.blue}`, borderTopColor: "transparent", borderRadius: "50%" }} />
    </div>
  );

  return (
    <div style={{ padding: 24, maxWidth: 660, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Settings</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>Game-wide configuration</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setSettings(DEFAULTS)} style={{ padding: "8px 16px", background: "transparent", color: C.muted, borderRadius: 8, fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            Reset Defaults
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", background: C.blue, color: C.white, borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Game config */}
        <Section title="Game Configuration">
          <div>
            <label style={S.label}>Default Arena ID</label>
            <input type="text" value={settings.defaultArenaId} onChange={(e) => set("defaultArenaId", e.target.value)} placeholder="Firestore arena document ID" style={S.input} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={S.label}>Max Players / Room</label>
              <SearchableSelect
                value={String(settings.maxPlayersPerRoom)}
                options={[2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
                onChange={(v) => set("maxPlayersPerRoom", +v)}
                style={{ ...S.input, cursor: "pointer" }}
              />
            </div>
            <div>
              <label style={S.label}>Match Timeout (seconds)</label>
              <input type="number" min={60} max={600} step={30} value={settings.matchTimeoutSeconds} onChange={(e) => set("matchTimeoutSeconds", +e.target.value)} style={S.input} />
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
            <div style={{ paddingTop: 8 }}>
              <label style={S.label}>Maintenance Message (shown to blocked players)</label>
              <textarea
                value={settings.maintenanceMessage}
                onChange={e => set("maintenanceMessage", e.target.value)}
                rows={2}
                placeholder="We'll be back soon. Maintenance in progress."
                style={{ ...S.input, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
          )}
        </Section>

        {/* Arena features */}
        <Section title="Arena Features">
          <p style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Disable individual arena hazards globally. Affects all rooms.</p>
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
            <label style={S.label}>Beyblade ID Blacklist (one per line or comma-separated)</label>
            <textarea
              value={settings.globalBeybladeBlacklist}
              onChange={(e) => set("globalBeybladeBlacklist", e.target.value)}
              rows={4}
              placeholder="banned_beyblade_id1&#10;banned_beyblade_id2"
              style={{ ...S.input, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
            />
          </div>
          <div>
            <label style={S.label}>Arena ID Blacklist</label>
            <textarea
              value={settings.globalArenaBlacklist}
              onChange={(e) => set("globalArenaBlacklist", e.target.value)}
              rows={3}
              placeholder="banned_arena_id1"
              style={{ ...S.input, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
            />
          </div>
        </Section>

        {/* Room limits */}
        <Section title="Room Limits">
          <div>
            <label style={S.label}>Max Active Rooms (across all types)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="range" min={5} max={50} step={1} value={settings.maxActiveRooms} onChange={e => set("maxActiveRooms", +e.target.value)} style={{ flex: 1 }} />
              <span style={{ fontSize: 13, color: C.text, minWidth: 28, textAlign: "right" }}>{settings.maxActiveRooms}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {([
              ["maxSpectatorsBattle", "Spectators / Battle Room"],
              ["maxSpectatorsTournament", "Spectators / Tournament Room"],
              ["maxSpectatorsAI", "Spectators / AI Battle Room"],
            ] as [keyof GameSettings, string][]).map(([key, label]) => (
              <div key={key}>
                <label style={S.label}>{label}</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="range" min={0} max={12} step={1} value={settings[key] as number} onChange={e => set(key, +e.target.value)} style={{ flex: 1 }} />
                  <span style={{ fontSize: 13, color: C.text, minWidth: 20 }}>{settings[key] as number}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Tournament settings */}
        <Section title="Tournament Settings">
          <div>
            <label style={S.label}>Minimum Gap Between Tournaments (minutes)</label>
            <input
              type="number" min={0} max={1440} step={5}
              value={settings.minimumTournamentGapMinutes}
              onChange={(e) => set("minimumTournamentGapMinutes", +e.target.value)}
              style={{ ...S.input, width: 120 }}
            />
            <p style={{ color: C.faint, fontSize: 11, marginTop: 4 }}>
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
            style={{ ...S.input, resize: "none", lineHeight: 1.5, fontFamily: "inherit" }}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <div style={S.sectionTitle}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange, last }: { label: string; desc: string; on: boolean; onChange: () => void; last?: boolean }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <div>
        <p style={{ color: C.text, fontSize: 13 }}>{label}</p>
        <p style={{ color: C.faint, fontSize: 11 }}>{desc}</p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </label>
  );
}
