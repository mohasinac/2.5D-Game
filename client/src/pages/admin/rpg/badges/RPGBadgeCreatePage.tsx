import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";

export default function RPGBadgeCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [iconAssetId, setIconAssetId] = useState("");
  const [category, setCategory] = useState("gym");
  const [regionId, setRegionId] = useState("");
  const [arcId, setArcId] = useState("");
  const [earnType, setEarnType] = useState("defeat-npc");
  const [earnTargetId, setEarnTargetId] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [order, setOrder] = useState(0);

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) { toast.error("ID or name required"); return; }
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, description, iconAssetId, category, order,
        earnCondition: { type: earnType, targetId: earnTargetId },
      };
      if (regionId) data.regionId = regionId;
      if (arcId) data.arcId = arcId;
      if (routeExclusiveFor) data.routeExclusiveFor = routeExclusiveFor;
      await setDoc(doc(db, COLLECTIONS.RPG_BADGES, docId), data);
      toast.success("Badge created");
      navigate("/admin/rpg/badges");
    } catch (e) { console.error(e); toast.error("Failed to create badge"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/badges" className="text-blue-400 text-sm hover:underline">&larr; Back to Badges</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Badge</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={2} /></div>
        <div><label className={LBL}>Icon Asset ID</label><input className={INP} value={iconAssetId} onChange={e => setIconAssetId(e.target.value)} /></div>
        <div><label className={LBL}>Category</label><input className={INP} value={category} onChange={e => setCategory(e.target.value)} placeholder="gym, tournament, quest, special..." /></div>
        <div><label className={LBL}>Region ID</label><input className={INP} value={regionId} onChange={e => setRegionId(e.target.value)} /></div>
        <div><label className={LBL}>Arc ID</label><input className={INP} value={arcId} onChange={e => setArcId(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LBL}>Earn Condition Type</label><input className={INP} value={earnType} onChange={e => setEarnType(e.target.value)} placeholder="defeat-npc, complete-quest..." /></div>
          <div><label className={LBL}>Earn Target ID</label><input className={INP} value={earnTargetId} onChange={e => setEarnTargetId(e.target.value)} /></div>
        </div>
        <div><label className={LBL}>Route Exclusive For</label><input className={INP} value={routeExclusiveFor} onChange={e => setRouteExclusiveFor(e.target.value)} /></div>
        <div><label className={LBL}>Order</label><input type="number" className={INP} value={order} onChange={e => setOrder(+e.target.value)} /></div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Badge"}</button>
      </div>
    </div>
  );
}
