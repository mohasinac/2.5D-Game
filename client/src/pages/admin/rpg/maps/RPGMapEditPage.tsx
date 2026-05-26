import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD, safeJsonParse } from "../rpgAdminShared";

export default function RPGMapEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_MAPS, id));
        if (!snap.exists()) return;
        const d = snap.data();
        setRegionId(d.regionId ?? "");
        setDisplayName(d.displayName ?? "");
        setType(d.type ?? "town");
        setWidth(d.width ?? 20);
        setHeight(d.height ?? 15);
        setTilesetId(d.tilesetId ?? "");
        setLayersJson(JSON.stringify(d.layers ?? [], null, 2));
        setExitsJson(JSON.stringify(d.exits ?? [], null, 2));
        setEntryPointsJson(JSON.stringify(d.entryPoints ?? [], null, 2));
        setEventTriggersJson(JSON.stringify(d.eventTriggers ?? [], null, 2));
        setNpcPlacementsJson(JSON.stringify(d.npcPlacements ?? [], null, 2));
        setBgmTrackId(d.bgmTrackId ?? "");
        setLightingPreset(d.lightingPreset ?? "day");
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_MAPS, id), {
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

  const handleDelete = async () => {
    if (!id || !confirm(`Delete map "${id}"?`)) return;
    await deleteDoc(doc(db, COLLECTIONS.RPG_MAPS, id));
    navigate("/admin/rpg/maps");
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/maps" className="text-blue-400 text-sm hover:underline">&larr; Back to Maps</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit Map: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Region ID</label><input className={INP} value={regionId} onChange={e => setRegionId(e.target.value)} /></div>
        <div><label className={LBL}>Type</label><input className={INP} value={type} onChange={e => setType(e.target.value)} /></div>
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
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
