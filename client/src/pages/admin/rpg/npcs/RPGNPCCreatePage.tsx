import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify, safeJsonParse } from "../rpgAdminShared";

export default function RPGNPCCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("trainer");
  const [spriteSheetId, setSpriteSheetId] = useState("");
  const [portraitId, setPortraitId] = useState("");
  const [defaultFacing, setDefaultFacing] = useState<string>("down");
  const [scheduleJson, setScheduleJson] = useState("[]");
  const [defaultDialogueId, setDefaultDialogueId] = useState("");
  const [battleConfigJson, setBattleConfigJson] = useState("null");
  const [shopInventoryId, setShopInventoryId] = useState("");
  const [questIds, setQuestIds] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [arcIds, setArcIds] = useState("");

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, type, spriteSheetId, portraitId, defaultFacing,
        schedule: safeJsonParse(scheduleJson, []),
        defaultDialogueId,
        questIds: questIds.split(",").map(s => s.trim()).filter(Boolean),
        arcIds: arcIds.split(",").map(s => s.trim()).filter(Boolean),
      };
      const bc = safeJsonParse(battleConfigJson, null);
      if (bc) data.battleConfig = bc;
      if (shopInventoryId) data.shopInventoryId = shopInventoryId;
      if (routeExclusiveFor) data.routeExclusiveFor = routeExclusiveFor;
      await setDoc(doc(db, COLLECTIONS.RPG_NPCS, docId), data);
      navigate("/admin/rpg/npcs");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/npcs" className="text-blue-400 text-sm hover:underline">&larr; Back to NPCs</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create NPC</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Type</label><input className={INP} value={type} onChange={e => setType(e.target.value)} placeholder="trainer, rival, gym_leader, shopkeeper, story..." /></div>
        <div><label className={LBL}>Sprite Sheet ID</label><input className={INP} value={spriteSheetId} onChange={e => setSpriteSheetId(e.target.value)} /></div>
        <div><label className={LBL}>Portrait ID</label><input className={INP} value={portraitId} onChange={e => setPortraitId(e.target.value)} /></div>
        <div>
          <label className={LBL}>Default Facing</label>
          <select className={INP} value={defaultFacing} onChange={e => setDefaultFacing(e.target.value)}>
            {["up", "down", "left", "right"].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div><label className={LBL}>Schedule (JSON)</label><textarea className={TEXTAREA} value={scheduleJson} onChange={e => setScheduleJson(e.target.value)} rows={5} /></div>
        <div><label className={LBL}>Default Dialogue ID</label><input className={INP} value={defaultDialogueId} onChange={e => setDefaultDialogueId(e.target.value)} /></div>
        <div><label className={LBL}>Battle Config (JSON, null if no battle)</label><textarea className={TEXTAREA} value={battleConfigJson} onChange={e => setBattleConfigJson(e.target.value)} rows={8} /></div>
        <div><label className={LBL}>Shop Inventory ID</label><input className={INP} value={shopInventoryId} onChange={e => setShopInventoryId(e.target.value)} /></div>
        <div><label className={LBL}>Quest IDs (comma separated)</label><input className={INP} value={questIds} onChange={e => setQuestIds(e.target.value)} /></div>
        <div><label className={LBL}>Route Exclusive For</label><input className={INP} value={routeExclusiveFor} onChange={e => setRouteExclusiveFor(e.target.value)} /></div>
        <div><label className={LBL}>Arc IDs (comma separated)</label><input className={INP} value={arcIds} onChange={e => setArcIds(e.target.value)} /></div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create NPC"}</button>
      </div>
    </div>
  );
}
