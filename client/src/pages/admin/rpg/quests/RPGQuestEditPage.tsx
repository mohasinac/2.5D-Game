import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { QuestObjective, QuestReward, FlagCondition } from "@/rpg/data/schemas";
import RPGObjectivesEditor from "@/components/admin/rpg/RPGObjectivesEditor";
import RPGRewardsEditor from "@/components/admin/rpg/RPGRewardsEditor";
import RPGFlagConditionEditor from "@/components/admin/rpg/RPGFlagConditionEditor";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD } from "../rpgAdminShared";

export default function RPGQuestEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [arcId, setArcId] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [category, setCategory] = useState("main");
  const [prerequisites, setPrerequisites] = useState("");
  const [requiredFlags, setRequiredFlags] = useState<FlagCondition>({});
  const [objectives, setObjectives] = useState<QuestObjective[]>([]);
  const [rewards, setRewards] = useState<QuestReward>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_QUESTS, id));
        if (!snap.exists()) { toast.error("Quest not found"); return; }
        const d = snap.data();
        setTitle(d.title ?? "");
        setDescription(d.description ?? "");
        setArcId(d.arcId ?? "");
        setRouteExclusiveFor(d.routeExclusiveFor ?? "");
        setCategory(d.category ?? "main");
        setPrerequisites((d.prerequisites ?? []).join(", "));
        setRequiredFlags(d.requiredFlags ?? {});
        setObjectives(d.objectives ?? []);
        setRewards(d.rewards ?? {});
      } catch (e) { console.error(e); toast.error("Failed to load quest"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        title, description, arcId, category,
        prerequisites: prerequisites.split(",").map(s => s.trim()).filter(Boolean),
        requiredFlags,
        objectives,
        rewards,
      };
      if (routeExclusiveFor) data.routeExclusiveFor = routeExclusiveFor;
      await setDoc(doc(db, COLLECTIONS.RPG_QUESTS, id), data);
      toast.success("Quest saved");
      navigate("/admin/rpg/quests");
    } catch (e) { console.error(e); toast.error("Failed to save quest"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete quest "${id}"?`)) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_QUESTS, id));
      toast.success("Quest deleted");
      navigate("/admin/rpg/quests");
    } catch (e) { console.error(e); toast.error("Failed to delete quest"); }
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/quests" className="text-blue-400 text-sm hover:underline">&larr; Back to Quests</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit Quest: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Title</label><input className={INP} value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <div><label className={LBL}>Arc ID</label><input className={INP} value={arcId} onChange={e => setArcId(e.target.value)} /></div>
        <div><label className={LBL}>Route Exclusive For</label><input className={INP} value={routeExclusiveFor} onChange={e => setRouteExclusiveFor(e.target.value)} /></div>
        <div><label className={LBL}>Category</label><input className={INP} value={category} onChange={e => setCategory(e.target.value)} /></div>
        <div><label className={LBL}>Prerequisites (comma separated quest IDs)</label><input className={INP} value={prerequisites} onChange={e => setPrerequisites(e.target.value)} /></div>

        <div>
          <label className={LBL}>Required Flags</label>
          <RPGFlagConditionEditor value={requiredFlags} onChange={setRequiredFlags} />
        </div>

        <div>
          <label className={LBL}>Objectives</label>
          <RPGObjectivesEditor objectives={objectives} onChange={setObjectives} />
        </div>

        <div>
          <label className={LBL}>Rewards</label>
          <RPGRewardsEditor rewards={rewards} onChange={setRewards} />
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
