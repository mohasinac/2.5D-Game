import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD, safeJsonParse } from "../rpgAdminShared";
import { MapMiniPreview } from "../components/MapMiniPreview";
import type { RPGMap } from "@/rpg/data/schemas";

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

  // Image assets
  const [bgImageUrl,      setBgImageUrl]      = useState<string | null>(null);
  const [tilesetImageUrl, setTilesetImageUrl] = useState<string | null>(null);
  const [uploadingBg,      setUploadingBg]      = useState(false);
  const [uploadingTileset, setUploadingTileset] = useState(false);
  const bgInputRef      = useRef<HTMLInputElement>(null);
  const tilesetInputRef = useRef<HTMLInputElement>(null);

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
        setBgImageUrl(d.bgImageUrl ?? null);
        setTilesetImageUrl(d.tilesetImageUrl ?? null);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const uploadAsset = async (
    file: File,
    kind: "bg" | "tileset",
    setUploading: (v: boolean) => void,
    setUrl: (url: string) => void,
  ) => {
    if (!id || !storage) return;
    setUploading(true);
    try {
      const path = `rpg/maps/${id}/${kind}_${Date.now()}_${file.name}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      setUrl(url);
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        regionId, displayName, type, width, height, tilesetId,
        layers:         safeJsonParse(layersJson,        []),
        exits:          safeJsonParse(exitsJson,         []),
        entryPoints:    safeJsonParse(entryPointsJson,   []),
        eventTriggers:  safeJsonParse(eventTriggersJson, []),
        npcPlacements:  safeJsonParse(npcPlacementsJson, []),
        bgmTrackId, lightingPreset,
      };
      if (bgImageUrl)      data.bgImageUrl      = bgImageUrl;
      if (tilesetImageUrl) data.tilesetImageUrl = tilesetImageUrl;
      await setDoc(doc(db, COLLECTIONS.RPG_MAPS, id), data);
      navigate("/admin/rpg/maps");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete map "${id}"?`)) return;
    await deleteDoc(doc(db, COLLECTIONS.RPG_MAPS, id));
    navigate("/admin/rpg/maps");
  };

  // Live preview map object
  const previewMap = useMemo<RPGMap>(() => ({
    id:              id ?? "preview",
    regionId,
    displayName:     displayName || id || "preview",
    type:            type as RPGMap["type"],
    width,
    height,
    tilesetId,
    layers:          safeJsonParse(layersJson,        []),
    exits:           safeJsonParse(exitsJson,         []),
    entryPoints:     safeJsonParse(entryPointsJson,   []),
    eventTriggers:   safeJsonParse(eventTriggersJson, []),
    npcPlacements:   safeJsonParse(npcPlacementsJson, []),
    bgmTrackId,
    lightingPreset:  lightingPreset as RPGMap["lightingPreset"],
  }), [id, regionId, displayName, type, width, height, tilesetId,
       layersJson, exitsJson, entryPointsJson, eventTriggersJson, npcPlacementsJson,
       bgmTrackId, lightingPreset]);

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full">
      <div className="mb-5">
        <Link to="/admin/rpg/maps" className="text-blue-400 text-sm hover:underline">&larr; Back to Maps</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit Map: {id}</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Form */}
        <div className={CARD + " space-y-4 flex-1 max-w-2xl"}>
          <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
          <div><label className={LBL}>Region ID</label><input className={INP} value={regionId} onChange={e => setRegionId(e.target.value)} /></div>
          <div><label className={LBL}>Type</label><input className={INP} value={type} onChange={e => setType(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={LBL}>Width (tiles)</label><input type="number" className={INP} value={width} onChange={e => setWidth(+e.target.value)} /></div>
            <div><label className={LBL}>Height (tiles)</label><input type="number" className={INP} value={height} onChange={e => setHeight(+e.target.value)} /></div>
          </div>
          <div><label className={LBL}>Tileset ID</label><input className={INP} value={tilesetId} onChange={e => setTilesetId(e.target.value)} /></div>

          {/* Background image upload */}
          <div>
            <label className={LBL}>Background Image</label>
            <div className="mt-2 flex items-start gap-3">
              {bgImageUrl
                ? <img src={bgImageUrl} alt="background" className="h-24 rounded border border-gray-700 object-cover" style={{ imageRendering: "pixelated" }} />
                : <div className="h-24 w-32 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no background</div>
              }
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => bgInputRef.current?.click()}
                  disabled={uploadingBg}
                  className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  {uploadingBg ? "Uploading…" : "Upload Background"}
                </button>
                {bgImageUrl && <button type="button" onClick={() => setBgImageUrl(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
              </div>
              <input ref={bgInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) void uploadAsset(f, "bg", setUploadingBg, setBgImageUrl); }} />
            </div>
          </div>

          {/* Tileset image upload */}
          <div>
            <label className={LBL}>Tileset Image</label>
            <div className="mt-2 flex items-start gap-3">
              {tilesetImageUrl
                ? <img src={tilesetImageUrl} alt="tileset" className="h-24 rounded border border-gray-700" style={{ imageRendering: "pixelated" }} />
                : <div className="h-24 w-24 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no tileset</div>
              }
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => tilesetInputRef.current?.click()}
                  disabled={uploadingTileset}
                  className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  {uploadingTileset ? "Uploading…" : "Upload Tileset"}
                </button>
                {tilesetImageUrl && <button type="button" onClick={() => setTilesetImageUrl(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
              </div>
              <input ref={tilesetInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) void uploadAsset(f, "tileset", setUploadingTileset, setTilesetImageUrl); }} />
            </div>
          </div>

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

        {/* Sticky live preview panel */}
        <div className="sticky top-6 flex-shrink-0 w-[260px]">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Live Preview</div>

            {/* Background image preview if uploaded */}
            {bgImageUrl && (
              <div className="mb-2 relative">
                <img src={bgImageUrl} alt="bg" className="w-full rounded border border-gray-700" style={{ imageRendering: "pixelated" }} />
                <span className="absolute top-1 left-1 text-[9px] bg-black/60 text-gray-300 px-1 rounded">bg</span>
              </div>
            )}

            <MapMiniPreview map={previewMap} maxWidth={234} showLegend />
            <div className="mt-3 space-y-1 text-[11px] text-gray-500">
              <div><span className="text-gray-400">Type:</span> {type}</div>
              <div><span className="text-gray-400">Lighting:</span> {lightingPreset}</div>
              <div><span className="text-gray-400">Tileset:</span> {tilesetId || <span className="italic">none</span>}</div>
              <div><span className="text-gray-400">BGM:</span> {bgmTrackId || <span className="italic">none</span>}</div>
            </div>

            {tilesetImageUrl && (
              <div className="mt-3">
                <div className="text-[10px] text-gray-500 mb-1">Tileset Sheet</div>
                <img src={tilesetImageUrl} alt="tileset" className="w-full border border-gray-700 rounded" style={{ imageRendering: "pixelated" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
