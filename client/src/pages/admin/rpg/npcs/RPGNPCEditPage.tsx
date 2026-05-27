import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD, safeJsonParse } from "../rpgAdminShared";
import { NPCSpriteBlock } from "../components/NPCSpriteBlock";

export default function RPGNPCEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("trainer");
  const [spriteSheetId, setSpriteSheetId] = useState("");
  const [portraitId, setPortraitId] = useState("");
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [defaultFacing, setDefaultFacing] = useState("down");
  const [scheduleJson, setScheduleJson] = useState("[]");
  const [defaultDialogueId, setDefaultDialogueId] = useState("");
  const [battleConfigJson, setBattleConfigJson] = useState("null");
  const [shopInventoryId, setShopInventoryId] = useState("");
  const [questIds, setQuestIds] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [arcIds, setArcIds] = useState("");

  // Upload state
  const [uploadingSpriteUrl, setUploadingSpriteUrl] = useState(false);
  const [uploadingPortraitUrl, setUploadingPortraitUrl] = useState(false);
  const spriteInputRef   = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_NPCS, id));
        if (!snap.exists()) return;
        const d = snap.data();
        setDisplayName(d.displayName ?? "");
        setType(d.type ?? "trainer");
        setSpriteSheetId(d.spriteSheetId ?? "");
        setPortraitId(d.portraitId ?? "");
        setSpriteUrl(d.spriteUrl ?? null);
        setPortraitUrl(d.portraitUrl ?? null);
        setDefaultFacing(d.defaultFacing ?? "down");
        setScheduleJson(JSON.stringify(d.schedule ?? [], null, 2));
        setDefaultDialogueId(d.defaultDialogueId ?? "");
        setBattleConfigJson(JSON.stringify(d.battleConfig ?? null, null, 2));
        setShopInventoryId(d.shopInventoryId ?? "");
        setQuestIds((d.questIds ?? []).join(", "));
        setRouteExclusiveFor(d.routeExclusiveFor ?? "");
        setArcIds((d.arcIds ?? []).join(", "));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  // Upload a sprite sheet image and save the URL on the document
  const handleSpriteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || !storage) return;
    setUploadingSpriteUrl(true);
    try {
      const path = `rpg/npcs/${id}/sprite_${Date.now()}_${file.name}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      setSpriteUrl(url);
    } catch (err) { console.error(err); }
    finally { setUploadingSpriteUrl(false); }
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || !storage) return;
    setUploadingPortraitUrl(true);
    try {
      const path = `rpg/npcs/${id}/portrait_${Date.now()}_${file.name}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      const url  = await getDownloadURL(snap.ref);
      setPortraitUrl(url);
    } catch (err) { console.error(err); }
    finally { setUploadingPortraitUrl(false); }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, type, spriteSheetId, portraitId, defaultFacing,
        schedule: safeJsonParse(scheduleJson, []),
        defaultDialogueId,
        questIds: questIds.split(",").map(s => s.trim()).filter(Boolean),
        arcIds:   arcIds.split(",").map(s => s.trim()).filter(Boolean),
      };
      const bc = safeJsonParse(battleConfigJson, null);
      if (bc) data.battleConfig = bc;
      if (shopInventoryId) data.shopInventoryId = shopInventoryId;
      if (routeExclusiveFor) data.routeExclusiveFor = routeExclusiveFor;
      if (spriteUrl)   data.spriteUrl   = spriteUrl;
      if (portraitUrl) data.portraitUrl = portraitUrl;
      await setDoc(doc(db, COLLECTIONS.RPG_NPCS, id), data);
      navigate("/admin/rpg/npcs");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete NPC "${id}"?`)) return;
    await deleteDoc(doc(db, COLLECTIONS.RPG_NPCS, id));
    navigate("/admin/rpg/npcs");
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  const hasBattle = safeJsonParse(battleConfigJson, null) !== null;

  return (
    <div className="p-6 w-full">
      <div className="mb-5">
        <Link to="/admin/rpg/npcs" className="text-blue-400 text-sm hover:underline">&larr; Back to NPCs</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit NPC: {id}</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Form */}
        <div className={CARD + " space-y-4 flex-1 max-w-2xl"}>
          <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
          <div>
            <label className={LBL}>Type</label>
            <select className={INP} value={type} onChange={e => setType(e.target.value)}>
              {["trainer","rival","gym_leader","shopkeeper","story","boss","ally","merchant","npc","elder","quest_giver","blader"].map(t =>
                <option key={t} value={t}>{t}</option>
              )}
            </select>
          </div>

          {/* Sprite sheet — ID + image upload */}
          <div>
            <label className={LBL}>Sprite Sheet ID</label>
            <input className={INP} value={spriteSheetId} onChange={e => setSpriteSheetId(e.target.value)} />
            <div className="mt-2 flex items-center gap-3">
              {spriteUrl
                ? <img src={spriteUrl} alt="sprite" className="h-16 border border-gray-700 rounded" style={{ imageRendering: "pixelated" }} />
                : <div className="h-16 w-16 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no image</div>
              }
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => spriteInputRef.current?.click()}
                  disabled={uploadingSpriteUrl}
                  className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  {uploadingSpriteUrl ? "Uploading…" : "Upload Sprite"}
                </button>
                {spriteUrl && (
                  <button type="button" onClick={() => setSpriteUrl(null)} className="text-xs text-red-400 hover:text-red-300">
                    Remove
                  </button>
                )}
              </div>
              <input ref={spriteInputRef} type="file" accept="image/*,.gif" className="hidden" onChange={handleSpriteUpload} />
            </div>
          </div>

          {/* Portrait — ID + image upload */}
          <div>
            <label className={LBL}>Portrait ID</label>
            <input className={INP} value={portraitId} onChange={e => setPortraitId(e.target.value)} />
            <div className="mt-2 flex items-center gap-3">
              {portraitUrl
                ? <img src={portraitUrl} alt="portrait" className="h-20 w-20 object-cover border border-gray-700 rounded" style={{ imageRendering: "pixelated" }} />
                : <div className="h-20 w-20 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no portrait</div>
              }
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => portraitInputRef.current?.click()}
                  disabled={uploadingPortraitUrl}
                  className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  {uploadingPortraitUrl ? "Uploading…" : "Upload Portrait"}
                </button>
                {portraitUrl && (
                  <button type="button" onClick={() => setPortraitUrl(null)} className="text-xs text-red-400 hover:text-red-300">
                    Remove
                  </button>
                )}
              </div>
              <input ref={portraitInputRef} type="file" accept="image/*,.gif" className="hidden" onChange={handlePortraitUpload} />
            </div>
          </div>

          <div>
            <label className={LBL}>Default Facing</label>
            <select className={INP} value={defaultFacing} onChange={e => setDefaultFacing(e.target.value)}>
              {["up", "down", "left", "right"].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div><label className={LBL}>Schedule (JSON)</label><textarea className={TEXTAREA} value={scheduleJson} onChange={e => setScheduleJson(e.target.value)} rows={5} /></div>
          <div><label className={LBL}>Default Dialogue ID</label><input className={INP} value={defaultDialogueId} onChange={e => setDefaultDialogueId(e.target.value)} /></div>
          <div><label className={LBL}>Battle Config (JSON)</label><textarea className={TEXTAREA} value={battleConfigJson} onChange={e => setBattleConfigJson(e.target.value)} rows={8} /></div>
          <div><label className={LBL}>Shop Inventory ID</label><input className={INP} value={shopInventoryId} onChange={e => setShopInventoryId(e.target.value)} /></div>
          <div><label className={LBL}>Quest IDs (comma separated)</label><input className={INP} value={questIds} onChange={e => setQuestIds(e.target.value)} /></div>
          <div><label className={LBL}>Route Exclusive For</label><input className={INP} value={routeExclusiveFor} onChange={e => setRouteExclusiveFor(e.target.value)} /></div>
          <div><label className={LBL}>Arc IDs (comma separated)</label><input className={INP} value={arcIds} onChange={e => setArcIds(e.target.value)} /></div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
            <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
          </div>
        </div>

        {/* Sticky NPC preview panel */}
        <div className="sticky top-6 flex-shrink-0 w-[200px]">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-3 font-semibold">NPC Preview</div>

            {/* If a real portrait/sprite is uploaded, show it; otherwise show colored block */}
            {portraitUrl ? (
              <img
                src={portraitUrl}
                alt={displayName}
                className="w-full rounded border border-gray-700 mb-3"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <div className="flex justify-center mb-3">
                <NPCSpriteBlock
                  npcType={type}
                  facing={defaultFacing}
                  displayName={displayName || id}
                  hasBattle={hasBattle}
                  size={80}
                />
              </div>
            )}

            {/* Sprite sheet preview (if uploaded) */}
            {spriteUrl && (
              <div className="mb-3">
                <div className="text-[10px] text-gray-500 mb-1">Sprite Sheet</div>
                <img
                  src={spriteUrl}
                  alt="sprite sheet"
                  className="w-full border border-gray-700 rounded"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            )}

            <div className="space-y-1 text-[11px] text-gray-500">
              <div><span className="text-gray-400">Type:</span> {type}</div>
              <div><span className="text-gray-400">Facing:</span> {defaultFacing}</div>
              <div><span className="text-gray-400">Battle:</span> {hasBattle ? <span className="text-red-400">Yes ⚔</span> : "No"}</div>
              {defaultDialogueId && <div><span className="text-gray-400">Dialogue:</span> <span className="font-mono text-[10px]">{defaultDialogueId}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
