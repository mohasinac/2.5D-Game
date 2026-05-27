import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";
import { NPCSpriteBlock, NPCStateSelector, type NPCState } from "../components/NPCSpriteBlock";
import { RPGScheduleBuilder } from "../components/RPGScheduleBuilder";
import { RPGBattleConfigForm } from "../components/RPGBattleConfigForm";
import type { NPCScheduleEntry, NPCBattleConfig } from "@/rpg/data/schemas";

const NPC_TYPES = ["trainer","rival","gym_leader","shopkeeper","story","boss","ally","merchant","npc","elder","quest_giver","blader"];

export default function RPGNPCCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("trainer");
  const [spriteSheetId, setSpriteSheetId] = useState("");
  const [portraitId, setPortraitId] = useState("");
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [defaultFacing, setDefaultFacing] = useState<string>("down");
  const [previewState, setPreviewState] = useState<NPCState>("idle");
  const [schedule, setSchedule] = useState<NPCScheduleEntry[]>([]);
  const [defaultDialogueId, setDefaultDialogueId] = useState("");
  const [battleConfig, setBattleConfig] = useState<NPCBattleConfig | null>(null);
  const [shopInventoryId, setShopInventoryId] = useState("");
  const [questIds, setQuestIds] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [arcIds, setArcIds] = useState("");
  const [catchRadius, setCatchRadius] = useState<number | "">("");
  const [catchEventId, setCatchEventId] = useState("");

  const [uploadingSpriteUrl, setUploadingSpriteUrl] = useState(false);
  const [uploadingPortraitUrl, setUploadingPortraitUrl] = useState(false);
  const spriteInputRef   = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  const resolvedId = id || slugify(displayName) || "new_npc";

  const handleSpriteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setUploadingSpriteUrl(true);
    try {
      const path = `rpg/npcs/${resolvedId}/sprite_${Date.now()}_${file.name}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      setSpriteUrl(await getDownloadURL(snap.ref));
    } catch (err) { console.error(err); }
    finally { setUploadingSpriteUrl(false); }
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setUploadingPortraitUrl(true);
    try {
      const path = `rpg/npcs/${resolvedId}/portrait_${Date.now()}_${file.name}`;
      const snap = await uploadBytes(storageRef(storage, path), file);
      setPortraitUrl(await getDownloadURL(snap.ref));
    } catch (err) { console.error(err); }
    finally { setUploadingPortraitUrl(false); }
  };

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, type, spriteSheetId, portraitId, defaultFacing,
        schedule, defaultDialogueId,
        questIds: questIds.split(",").map(s => s.trim()).filter(Boolean),
        arcIds:   arcIds.split(",").map(s => s.trim()).filter(Boolean),
      };
      if (battleConfig)       data.battleConfig       = battleConfig;
      if (shopInventoryId)    data.shopInventoryId    = shopInventoryId;
      if (routeExclusiveFor)  data.routeExclusiveFor  = routeExclusiveFor;
      if (spriteUrl)          data.spriteUrl          = spriteUrl;
      if (portraitUrl)        data.portraitUrl        = portraitUrl;
      if (catchRadius !== "") data.catchRadius        = catchRadius;
      if (catchEventId)       data.catchEventId       = catchEventId;
      await setDoc(doc(db, COLLECTIONS.RPG_NPCS, docId), data);
      navigate("/admin/rpg/npcs");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-5">
        <Link to="/admin/rpg/npcs" className="text-blue-400 text-sm hover:underline">&larr; Back to NPCs</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create NPC</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Form ── */}
        <div className={CARD + " space-y-4 flex-1 max-w-2xl"}>

          {/* IDENTITY */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Identity</h2>
            <div>
              <label className={LBL}>ID <span className="text-gray-600 normal-case font-normal">(auto from name if empty)</span></label>
              <input className={INP} value={id} onChange={e => setId(e.target.value)} placeholder={resolvedId} />
            </div>
            <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
            <div>
              <label className={LBL}>Type</label>
              <select className={INP} value={type} onChange={e => setType(e.target.value)}>
                {NPC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Default Facing</label>
              <select className={INP} value={defaultFacing} onChange={e => setDefaultFacing(e.target.value)}>
                {["up", "down", "left", "right"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div><label className={LBL}>Default Dialogue ID</label><input className={INP} value={defaultDialogueId} onChange={e => setDefaultDialogueId(e.target.value)} placeholder="dlg_npcname_default" /></div>
          </section>

          {/* SPRITES */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Sprites & Portrait</h2>
            <div>
              <label className={LBL}>Sprite Sheet ID</label>
              <input className={INP} value={spriteSheetId} onChange={e => setSpriteSheetId(e.target.value)} />
              <p className="text-[10px] text-gray-500 mt-1">Layout: 4 rows (down/left/right/up) × 3 cols (stand/step-L/step-R)</p>
              <div className="mt-2 flex items-center gap-3">
                {spriteUrl
                  ? <img src={spriteUrl} alt="sprite" className="h-16 border border-gray-700 rounded" style={{ imageRendering: "pixelated" }} />
                  : <div className="h-16 w-16 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no sprite</div>
                }
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => spriteInputRef.current?.click()} disabled={uploadingSpriteUrl}
                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                    {uploadingSpriteUrl ? "Uploading…" : "Upload Sprite Sheet"}
                  </button>
                  {spriteUrl && <button type="button" onClick={() => setSpriteUrl(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                </div>
                <input ref={spriteInputRef} type="file" accept="image/*,.gif" className="hidden" onChange={handleSpriteUpload} />
              </div>
            </div>
            <div>
              <label className={LBL}>Portrait ID</label>
              <input className={INP} value={portraitId} onChange={e => setPortraitId(e.target.value)} />
              <div className="mt-2 flex items-center gap-3">
                {portraitUrl
                  ? <img src={portraitUrl} alt="portrait" className="h-20 w-20 object-cover border border-gray-700 rounded" style={{ imageRendering: "pixelated" }} />
                  : <div className="h-20 w-20 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-gray-600 text-[10px]">no portrait</div>
                }
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => portraitInputRef.current?.click()} disabled={uploadingPortraitUrl}
                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                    {uploadingPortraitUrl ? "Uploading…" : "Upload Portrait"}
                  </button>
                  {portraitUrl && <button type="button" onClick={() => setPortraitUrl(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                </div>
                <input ref={portraitInputRef} type="file" accept="image/*,.gif" className="hidden" onChange={handlePortraitUpload} />
              </div>
            </div>
          </section>

          {/* SCHEDULE */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Schedule</h2>
            <RPGScheduleBuilder value={schedule} onChange={setSchedule} />
          </section>

          {/* BATTLE */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Battle</h2>
            <RPGBattleConfigForm value={battleConfig} onChange={setBattleConfig} />
          </section>

          {/* CATCH MECHANIC */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Catch / Chase Mechanic</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LBL}>Catch Radius (tiles)</label>
                <input type="number" className={INP} value={catchRadius} min={0}
                  onChange={e => setCatchRadius(e.target.value === "" ? "" : +e.target.value)}
                  placeholder="leave empty to disable" />
              </div>
              <div>
                <label className={LBL}>Catch Event ID</label>
                <input className={INP} value={catchEventId} onChange={e => setCatchEventId(e.target.value)} placeholder="story_event_id" />
              </div>
            </div>
          </section>

          {/* LINKS */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Links & IDs</h2>
            <div><label className={LBL}>Shop Inventory ID</label><input className={INP} value={shopInventoryId} onChange={e => setShopInventoryId(e.target.value)} placeholder="optional" /></div>
            <div><label className={LBL}>Quest IDs (comma separated)</label><input className={INP} value={questIds} onChange={e => setQuestIds(e.target.value)} placeholder="quest_1, quest_2" /></div>
            <div><label className={LBL}>Route Exclusive For</label><input className={INP} value={routeExclusiveFor} onChange={e => setRouteExclusiveFor(e.target.value)} placeholder="route_id (optional)" /></div>
            <div><label className={LBL}>Arc IDs (comma separated)</label><input className={INP} value={arcIds} onChange={e => setArcIds(e.target.value)} placeholder="arc1, arc2" /></div>
          </section>

          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create NPC"}</button>
        </div>

        {/* ── Sticky NPC preview ── */}
        <div className="sticky top-6 flex-shrink-0 w-[210px]">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">NPC Preview</div>

            <div className="flex justify-center">
              <NPCSpriteBlock
                npcType={type}
                facing={defaultFacing}
                npcState={previewState}
                displayName={displayName || resolvedId}
                hasBattle={battleConfig !== null}
                spriteSheetUrl={spriteUrl}
                size={90}
              />
            </div>

            {portraitUrl && (
              <div>
                <div className="text-[10px] text-gray-500 mb-1">Portrait</div>
                <img src={portraitUrl} alt={displayName} className="w-full rounded border border-gray-700" style={{ imageRendering: "pixelated" }} />
              </div>
            )}

            <div>
              <div className="text-[10px] text-gray-500 mb-1.5">Preview State</div>
              <NPCStateSelector value={previewState} onChange={setPreviewState} />
            </div>

            <div>
              <div className="text-[10px] text-gray-500 mb-1.5">Facing</div>
              <div className="grid grid-cols-2 gap-1">
                {["up","down","left","right"].map((f) => (
                  <button key={f} type="button" onClick={() => setDefaultFacing(f)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                      defaultFacing === f ? "bg-amber-500 text-black font-bold" : "bg-gray-800 text-gray-400 hover:text-gray-200"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-gray-500 border-t border-gray-800 pt-2">
              <div><span className="text-gray-400">ID:</span> <span className="font-mono text-[10px]">{resolvedId}</span></div>
              <div><span className="text-gray-400">Type:</span> {type}</div>
              <div><span className="text-gray-400">Battle:</span> {battleConfig ? <span className="text-red-400">Yes ⚔</span> : "No"}</div>
              <div><span className="text-gray-400">Schedule:</span> {schedule.length} entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
