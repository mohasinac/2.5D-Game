import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";

export default function RPGArcCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [order, setOrder] = useState(0);
  const [routeIds, setRouteIds] = useState("");
  const [startingRegionId, setStartingRegionId] = useState("");
  const [previousArcId, setPreviousArcId] = useState("");
  const [completionFlagId, setCompletionFlagId] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) { toast.error("ID or name required"); return; }
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, order,
        routeIds: routeIds.split(",").map(s => s.trim()).filter(Boolean),
        startingRegionId, completionFlagId, description,
      };
      if (previousArcId) data.previousArcId = previousArcId;
      await setDoc(doc(db, COLLECTIONS.RPG_ARCS, docId), data);
      toast.success("Arc created");
      navigate("/admin/rpg/arcs");
    } catch (e) { console.error(e); toast.error("Failed to create arc"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/arcs" className="text-blue-400 text-sm hover:underline">&larr; Back to Arcs</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Arc</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Order</label><input type="number" className={INP} value={order} onChange={e => setOrder(+e.target.value)} /></div>
        <div><label className={LBL}>Route IDs (comma separated)</label><input className={INP} value={routeIds} onChange={e => setRouteIds(e.target.value)} /></div>
        <div><label className={LBL}>Starting Region ID</label><input className={INP} value={startingRegionId} onChange={e => setStartingRegionId(e.target.value)} /></div>
        <div><label className={LBL}>Previous Arc ID</label><input className={INP} value={previousArcId} onChange={e => setPreviousArcId(e.target.value)} /></div>
        <div><label className={LBL}>Completion Flag ID</label><input className={INP} value={completionFlagId} onChange={e => setCompletionFlagId(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Arc"}</button>
      </div>
    </div>
  );
}
