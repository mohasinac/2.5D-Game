import { useState, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";
import { MapMiniPreview } from "../components/MapMiniPreview";
import { MapTilePainter } from "../components/MapTilePainter";
import { RPGMapExitsEditor } from "../components/RPGMapExitsEditor";
import { RPGEntryPointsEditor } from "../components/RPGEntryPointsEditor";
import { RPGNPCPlacementsEditor } from "../components/RPGNPCPlacementsEditor";
import { RPGEventTriggersEditor } from "../components/RPGEventTriggersEditor";
import type { RPGMap, TileLayer, MapExit, MapEntryPoint, MapNPCPlacement, MapEventTrigger } from "@/rpg/data/schemas";

const MAP_TYPES = ["town","route","gym","arena","cave","building","outdoor","indoor","overworld","dungeon","shop"];

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
  const [layers, setLayers] = useState<TileLayer[]>([]);
  const [exits, setExits] = useState<MapExit[]>([]);
  const [entryPoints, setEntryPoints] = useState<MapEntryPoint[]>([
    { id: "default", tile: { x: 1, y: 1 }, facingDirection: "down" },
  ]);
  const [eventTriggers, setEventTriggers] = useState<MapEventTrigger[]>([]);
  const [npcPlacements, setNpcPlacements] = useState<MapNPCPlacement[]>([]);
  const [bgmTrackId, setBgmTrackId] = useState("");
  const [lightingPreset, setLightingPreset] = useState("day");

  // Image assets
  const [bgImageUrl,      setBgImageUrl]      = useState<string | null>(null);
  const [tilesetImageUrl, setTilesetImageUrl] = useState<string | null>(null);
  const [uploadingBg,      setUploadingBg]      = useState(false);
  const [uploadingTileset, setUploadingTileset] = useState(false);
  const bgInputRef      = useRef<HTMLInputElement>(null);
  const tilesetInputRef = useRef<HTMLInputElement>(null);

  const resolvedId = id || slugify(displayName) || "new_map";

  const uploadAsset = async (
    file: File,
    kind: "bg" | "tileset",
    setUploading: (v: boolean) => void,
    setUrl: (url: string) => void,
  ) => {
    if (!storage) return;
    setUploading(true);
    try {
      const path = `rpg/maps/${resolvedId}/${kind}_${Date.now()}_${file.name}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      setUrl(url);
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        regionId, displayName, type, width, height, tilesetId,
        layers, exits, entryPoints, eventTriggers, npcPlacements,
        bgmTrackId, lightingPreset,
      };
      if (bgImageUrl)      data.bgImageUrl      = bgImageUrl;
      if (tilesetImageUrl) data.tilesetImageUrl = tilesetImageUrl;
      await setDoc(doc(db, COLLECTIONS.RPG_MAPS, docId), data);
      navigate("/admin/rpg/maps");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  // Resize ground layer when w/h changes
  const handleResize = (newW: number, newH: number) => {
    setWidth(newW);
    setHeight(newH);
    setLayers(prev => {
      const ground = prev.find(l => l.name === "ground");
      if (!ground) return prev;
      const newData = new Array(newW * newH).fill(0);
      for (let y = 0; y < Math.min(ground.height, newH); y++) {
        for (let x = 0; x < Math.min(ground.width, newW); x++) {
          newData[y * newW + x] = ground.data[y * ground.width + x] ?? 0;
        }
      }
      const updated: TileLayer = { ...ground, width: newW, height: newH, data: newData };
      return [updated, ...prev.filter(l => l.name !== "ground")];
    });
  };

  // Live preview
  const previewMap = useMemo<RPGMap>(() => ({
    id: resolvedId,
    regionId,
    displayName: displayName || "New Map",
    type: type as RPGMap["type"],
    width, height, tilesetId,
    layers, exits, entryPoints, eventTriggers, npcPlacements,
    bgmTrackId,
    lightingPreset: lightingPreset as RPGMap["lightingPreset"],
  }), [resolvedId, regionId, displayName, type, width, height, tilesetId,
       layers, exits, entryPoints, eventTriggers, npcPlacements,
       bgmTrackId, lightingPreset]);

  return (
    <div className="p-6 w-full">
      <div className="mb-5">
        <Link to="/admin/rpg/maps" className="text-blue-400 text-sm hover:underline">&larr; Back to Maps</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Map</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Form ── */}
        <div className={CARD + " space-y-4 flex-1 max-w-2xl"}>

          {/* BASICS */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Basic Info</h2>
            <div>
              <label className={LBL}>ID <span className="text-gray-600 normal-case font-normal">(auto from name if empty)</span></label>
              <input className={INP} value={id} onChange={e => setId(e.target.value)} placeholder={resolvedId} />
            </div>
            <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
            <div><label className={LBL}>Region ID</label><input className={INP} value={regionId} onChange={e => setRegionId(e.target.value)} /></div>
            <div>
              <label className={LBL}>Map Type</label>
              <select className={INP} value={type} onChange={e => setType(e.target.value)}>
                {MAP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Lighting</label>
              <select className={INP} value={lightingPreset} onChange={e => setLightingPreset(e.target.value)}>
                {["day", "evening", "night", "indoor", "cave"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div><label className={LBL}>BGM Track ID</label><input className={INP} value={bgmTrackId} onChange={e => setBgmTrackId(e.target.value)} placeholder="optional" /></div>
            <div><label className={LBL}>Tileset ID</label><input className={INP} value={tilesetId} onChange={e => setTilesetId(e.target.value)} /></div>
          </section>

          {/* SIZE */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Map Size</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LBL}>Width (tiles)</label>
                <input type="number" className={INP} value={width} min={1} max={64}
                  onChange={e => handleResize(+e.target.value, height)} />
              </div>
              <div>
                <label className={LBL}>Height (tiles)</label>
                <input type="number" className={INP} value={height} min={1} max={64}
                  onChange={e => handleResize(width, +e.target.value)} />
              </div>
            </div>
          </section>

          {/* IMAGES */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Images</h2>
            <div>
              <label className={LBL}>Background Image</label>
              <p className="text-[10px] text-gray-500 mb-2">When set, void/floor tiles are transparent — background shows through.</p>
              <div className="flex items-start gap-3">
                {bgImageUrl
                  ? <img src={bgImageUrl} alt="bg" className="h-24 rounded border border-gray-700 object-cover" style={{ imageRendering: "pixelated" }} />
                  : <div className="h-24 w-32 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no background</div>
                }
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => bgInputRef.current?.click()} disabled={uploadingBg}
                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                    {uploadingBg ? "Uploading…" : "Upload Background"}
                  </button>
                  {bgImageUrl && <button type="button" onClick={() => setBgImageUrl(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                </div>
                <input ref={bgInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) void uploadAsset(f, "bg", setUploadingBg, setBgImageUrl); }} />
              </div>
            </div>
            <div>
              <label className={LBL}>Tileset Image</label>
              <div className="flex items-start gap-3">
                {tilesetImageUrl
                  ? <img src={tilesetImageUrl} alt="tileset" className="h-24 rounded border border-gray-700" style={{ imageRendering: "pixelated" }} />
                  : <div className="h-24 w-24 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no tileset</div>
                }
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => tilesetInputRef.current?.click()} disabled={uploadingTileset}
                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                    {uploadingTileset ? "Uploading…" : "Upload Tileset"}
                  </button>
                  {tilesetImageUrl && <button type="button" onClick={() => setTilesetImageUrl(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                </div>
                <input ref={tilesetInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) void uploadAsset(f, "tileset", setUploadingTileset, setTilesetImageUrl); }} />
              </div>
            </div>
          </section>

          {/* TILE PAINTER */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Tiles</h2>
            <MapTilePainter width={width} height={height} layers={layers} onChange={setLayers} />
          </section>

          {/* STRUCTURE */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Map Structure</h2>
            <RPGEntryPointsEditor   value={entryPoints}   onChange={setEntryPoints} />
            <RPGMapExitsEditor      value={exits}          onChange={setExits} />
            <RPGNPCPlacementsEditor value={npcPlacements} onChange={setNpcPlacements} />
            <RPGEventTriggersEditor value={eventTriggers} onChange={setEventTriggers} />
          </section>

          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Map"}</button>
        </div>

        {/* Sticky live preview */}
        <div className="sticky top-6 flex-shrink-0 w-[260px]">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Live Preview</div>
            {bgImageUrl && (
              <div className="mb-2 relative">
                <img src={bgImageUrl} alt="bg" className="w-full rounded border border-gray-700" style={{ imageRendering: "pixelated" }} />
                <span className="absolute top-1 left-1 text-[9px] bg-black/60 text-gray-300 px-1 rounded">bg</span>
              </div>
            )}
            <MapMiniPreview map={previewMap} maxWidth={234} showLegend bgImageUrl={bgImageUrl} />
            <div className="mt-3 space-y-1 text-[11px] text-gray-500">
              <div><span className="text-gray-400">ID:</span> <span className="font-mono text-[10px]">{resolvedId}</span></div>
              <div><span className="text-gray-400">Type:</span> {type}</div>
              <div><span className="text-gray-400">Lighting:</span> {lightingPreset}</div>
              <div><span className="text-gray-400">NPCs:</span> {npcPlacements.length} placed</div>
              <div><span className="text-gray-400">Exits:</span> {exits.length}</div>
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
