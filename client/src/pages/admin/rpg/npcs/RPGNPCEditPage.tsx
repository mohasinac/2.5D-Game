import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD, safeJsonParse } from "../rpgAdminShared";

export default function RPGNPCEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("trainer");
  const [spriteSheetId, setSpriteSheetId] = useState("");
  const [portraitId, setPortraitId] = useState("");
  const [defaultFacing, setDefaultFacing] = useState("down");
  const [scheduleJson, setScheduleJson] = useState("[]");
  const [defaultDialogueId, setDefaultDialogueId] = useState("");
  const [battleConfigJson, setBattleConfigJson] = useState("null");
  const [shopInventoryId, setShopInventoryId] = useState("");
  const [questIds, setQuestIds] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [arcIds, setArcIds] = useState("");

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

  const handleSave = async () => {
    if (!id) return;
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

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/npcs" className="text-blue-400 text-sm hover:underline">&larr; Back to NPCs</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit NPC: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Type</label><input className={INP} value={type} onChange={e => setType(e.target.value)} /></div>
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
    </div>
  );
}
