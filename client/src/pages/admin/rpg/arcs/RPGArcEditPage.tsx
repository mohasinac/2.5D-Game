import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD } from "../rpgAdminShared";

export default function RPGArcEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [order, setOrder] = useState(0);
  const [routeIds, setRouteIds] = useState("");
  const [startingRegionId, setStartingRegionId] = useState("");
  const [previousArcId, setPreviousArcId] = useState("");
  const [completionFlagId, setCompletionFlagId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_ARCS, id));
        if (!snap.exists()) { toast.error("Arc not found"); return; }
        const d = snap.data();
        setDisplayName(d.displayName ?? "");
        setOrder(d.order ?? 0);
        setRouteIds((d.routeIds ?? []).join(", "));
        setStartingRegionId(d.startingRegionId ?? "");
        setPreviousArcId(d.previousArcId ?? "");
        setCompletionFlagId(d.completionFlagId ?? "");
        setDescription(d.description ?? "");
      } catch (e) { console.error(e); toast.error("Failed to load arc"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, order,
        routeIds: routeIds.split(",").map(s => s.trim()).filter(Boolean),
        startingRegionId, completionFlagId, description,
      };
      if (previousArcId) data.previousArcId = previousArcId;
      await setDoc(doc(db, COLLECTIONS.RPG_ARCS, id), data);
      toast.success("Arc saved");
      navigate("/admin/rpg/arcs");
    } catch (e) { console.error(e); toast.error("Failed to save arc"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete arc "${id}"?`)) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_ARCS, id));
      toast.success("Arc deleted");
      navigate("/admin/rpg/arcs");
    } catch (e) { console.error(e); toast.error("Failed to delete arc"); }
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/arcs" className="text-blue-400 text-sm hover:underline">&larr; Back to Arcs</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit Arc: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Order</label><input type="number" className={INP} value={order} onChange={e => setOrder(+e.target.value)} /></div>
        <div><label className={LBL}>Route IDs (comma separated)</label><input className={INP} value={routeIds} onChange={e => setRouteIds(e.target.value)} /></div>
        <div><label className={LBL}>Starting Region ID</label><input className={INP} value={startingRegionId} onChange={e => setStartingRegionId(e.target.value)} /></div>
        <div><label className={LBL}>Previous Arc ID</label><input className={INP} value={previousArcId} onChange={e => setPreviousArcId(e.target.value)} /></div>
        <div><label className={LBL}>Completion Flag ID</label><input className={INP} value={completionFlagId} onChange={e => setCompletionFlagId(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
