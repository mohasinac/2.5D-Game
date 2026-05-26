import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify, safeJsonParse } from "../rpgAdminShared";

export default function RPGMapCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("town");
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [tilesetId, setTilesetId] = useState("");
  const [layersJson, setLayersJson] = useState("[]");
  const [exitsJson, setExitsJson] = useState("[]");
  const [entryPointsJson, setEntryPointsJson] = useState("[]");
  const [eventTriggersJson, setEventTriggersJson] = useState("[]");
  const [npcPlacementsJson, setNpcPlacementsJson] = useState("[]");
  const [bgmTrackId, setBgmTrackId] = useState("");
  const [lightingPreset, setLightingPreset] = useState("day");

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_MAPS, docId), {
        regionId, displayName, type, width, height, tilesetId,
        layers: safeJsonParse(layersJson, []),
        exits: safeJsonParse(exitsJson, []),
        entryPoints: safeJsonParse(entryPointsJson, []),
        eventTriggers: safeJsonParse(eventTriggersJson, []),
        npcPlacements: safeJsonParse(npcPlacementsJson, []),
        bgmTrackId, lightingPreset,
      });
      navigate("/admin/rpg/maps");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/maps" className="text-blue-400 text-sm hover:underline">&larr; Back to Maps</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Map</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Region ID</label><input className={INP} value={regionId} onChange={e => setRegionId(e.target.value)} /></div>
        <div><label className={LBL}>Type</label><input className={INP} value={type} onChange={e => setType(e.target.value)} placeholder="town, route, gym, arena, cave, building..." /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LBL}>Width (tiles)</label><input type="number" className={INP} value={width} onChange={e => setWidth(+e.target.value)} /></div>
          <div><label className={LBL}>Height (tiles)</label><input type="number" className={INP} value={height} onChange={e => setHeight(+e.target.value)} /></div>
        </div>
        <div><label className={LBL}>Tileset ID</label><input className={INP} value={tilesetId} onChange={e => setTilesetId(e.target.value)} /></div>
        <div><label className={LBL}>Layers (JSON)</label><textarea className={TEXTAREA} value={layersJson} onChange={e => setLayersJson(e.target.value)} rows={6} /></div>
        <div><label className={LBL}>Exits (JSON)</label><textarea className={TEXTAREA} value={exitsJson} onChange={e => setExitsJson(e.target.value)} rows={4} /></div>
        <div><label className={LBL}>Entry Points (JSON)</label><textarea className={TEXTAREA} value={entryPointsJson} onChange={e => setEntryPointsJson(e.target.value)} rows={4} /></div>
        <div><label className={LBL}>Event Triggers (JSON)</label><textarea className={TEXTAREA} value={eventTriggersJson} onChange={e => setEventTriggersJson(e.target.value)} rows={4} /></div>
        <div><label className={LBL}>NPC Placements (JSON)</label><textarea className={TEXTAREA} value={npcPlacementsJson} onChange={e => setNpcPlacementsJson(e.target.value)} rows={4} /></div>
        <div><label className={LBL}>BGM Track ID</label><input className={INP} value={bgmTrackId} onChange={e => setBgmTrackId(e.target.value)} /></div>
        <div>
          <label className={LBL}>Lighting Preset</label>
          <select className={INP} value={lightingPreset} onChange={e => setLightingPreset(e.target.value)}>
            {["day", "evening", "night", "indoor", "cave"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Map"}</button>
      </div>
    </div>
  );
}
