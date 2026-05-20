import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

interface GameSettings {
  defaultArenaId: string; maxPlayersPerRoom: number; matchTimeoutSeconds: number;
  enableAI: boolean; enableTournament: boolean; maintenanceMode: boolean; serverMessage: string;
}
const DEFAULTS: GameSettings = { defaultArenaId:"", maxPlayersPerRoom:4, matchTimeoutSeconds:180, enableAI:false, enableTournament:false, maintenanceMode:false, serverMessage:"" };

function Toggle({ on, onChange }: { on:boolean; onChange:()=>void }) {
  return (
    <button
      role="switch" aria-checked={on} onClick={onChange}
      style={{ position:"relative", width:40, height:22, borderRadius:11, background: on ? C.blue : C.bg3, border:"none", cursor:"pointer", flexShrink:0 }}
    >
      <span style={{ position:"absolute", top:3, left: on ? 19 : 3, width:16, height:16, background:C.white, borderRadius:"50%", transition:"left 150ms" }} />
    </button>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db,"settings","game"))
      .then(snap => { if (snap.exists()) setSettings({ ...DEFAULTS, ...snap.data() as GameSettings }); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof GameSettings, v: any) => setSettings(s => ({ ...s, [k]:v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db,"settings","game"), { ...settings, updatedAt:serverTimestamp() });
      toast.success("Settings saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ padding:24, display:"flex", justifyContent:"center" }}>
      <div className="spin" style={{ width:32, height:32, border:`2px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%" }} />
    </div>
  );

  return (
    <div style={{ padding:24, maxWidth:600, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Settings</h1>
          <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>Game-wide configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding:"8px 20px", background:C.blue, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity:saving?0.5:1 }}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {/* Game config */}
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={S.sectionTitle}>Game Configuration</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={S.label}>Default Arena ID</label>
              <input type="text" value={settings.defaultArenaId} onChange={e => set("defaultArenaId",e.target.value)} placeholder="Firestore arena document ID" style={S.input} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={S.label}>Max Players / Room</label>
                <select value={settings.maxPlayersPerRoom} onChange={e => set("maxPlayersPerRoom",+e.target.value)} style={{ ...S.input, cursor:"pointer" }}>
                  {[2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Match Timeout (seconds)</label>
                <input type="number" min={60} max={600} step={30} value={settings.matchTimeoutSeconds} onChange={e => set("matchTimeoutSeconds",+e.target.value)} style={S.input} />
              </div>
            </div>
          </div>
        </div>

        {/* Feature flags */}
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={S.sectionTitle}>Features</div>
          {([
            ["enableAI","AI Battle Mode","Allow players to fight AI opponents"],
            ["enableTournament","Tournament Mode","Enable tournament bracket play"],
            ["maintenanceMode","Maintenance Mode","Block all new game connections"],
          ] as [keyof GameSettings,string,string][]).map(([key,label,desc],i,arr) => (
            <label key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", cursor:"pointer", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
              <div>
                <p style={{ color:C.text, fontSize:13 }}>{label}</p>
                <p style={{ color:C.faint, fontSize:11 }}>{desc}</p>
              </div>
              <Toggle on={!!settings[key]} onChange={() => set(key, !settings[key])} />
            </label>
          ))}
        </div>

        {/* Server message */}
        <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={S.sectionTitle}>Server Message</div>
          <textarea
            value={settings.serverMessage}
            onChange={e => set("serverMessage",e.target.value)}
            rows={3}
            placeholder="Displayed to all players in the lobby (leave empty to hide)"
            style={{ ...S.input, resize:"none", lineHeight:1.5, fontFamily:"inherit" }}
          />
        </div>
      </div>
    </div>
  );
}
