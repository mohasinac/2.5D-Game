import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { QuestObjective, QuestReward, FlagCondition } from "@/rpg/data/schemas";
import RPGObjectivesEditor from "@/components/admin/rpg/RPGObjectivesEditor";
import RPGRewardsEditor from "@/components/admin/rpg/RPGRewardsEditor";
import RPGFlagConditionEditor from "@/components/admin/rpg/RPGFlagConditionEditor";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";

export default function RPGQuestCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [arcId, setArcId] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [category, setCategory] = useState("main");
  const [prerequisites, setPrerequisites] = useState("");
  const [requiredFlags, setRequiredFlags] = useState<FlagCondition>({});
  const [objectives, setObjectives] = useState<QuestObjective[]>([]);
  const [rewards, setRewards] = useState<QuestReward>({});

  const handleSave = async () => {
    const docId = id || slugify(title);
    if (!docId) { toast.error("ID or title required"); return; }
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
      await setDoc(doc(db, COLLECTIONS.RPG_QUESTS, docId), data);
      toast.success("Quest created");
      navigate("/admin/rpg/quests");
    } catch (e) { console.error(e); toast.error("Failed to create quest"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/quests" className="text-blue-400 text-sm hover:underline">&larr; Back to Quests</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Quest</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from title if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
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

        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Quest"}</button>
      </div>
    </div>
  );
}
