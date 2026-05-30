import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { FlagCondition, GateCondition, StoryEventStep } from "@/rpg/data/schemas";
import RPGFlagConditionEditor from "@/components/admin/rpg/RPGFlagConditionEditor";
import RPGGateConditionEditor from "@/components/admin/rpg/RPGGateConditionEditor";
import RPGStepBuilder from "@/components/admin/rpg/RPGStepBuilder";
import { LBL, INP, BTN_PRIMARY, BTN_DANGER, CARD } from "../rpgAdminShared";

function CompletionFlagsEditor({ flags, onChange }: { flags: Record<string, boolean>; onChange: (f: Record<string, boolean>) => void }) {
  const entries = Object.entries(flags);
  return (
    <div className="space-y-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <input type="text" defaultValue={k} onBlur={e => {
            const nk = e.target.value.trim() || k;
            if (nk === k) return;
            const rec = { ...flags }; const val = rec[k]; delete rec[k]; rec[nk] = val; onChange(rec);
          }} className="flex-1 bg-bg2 border border-border-c rounded px-2 py-1 text-sm text-theme-text" placeholder="flag key" />
          <button type="button" onClick={() => { const rec = { ...flags }; rec[k] = !rec[k]; onChange(rec); }}
            className={`px-2 py-0.5 rounded text-xs font-bold ${v ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>
            {v ? "TRUE" : "FALSE"}
          </button>
          <button type="button" onClick={() => { const rec = { ...flags }; delete rec[k]; onChange(rec); }}
            className="text-red-400 hover:text-red-300 text-sm">x</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange({ ...flags, new_flag: true })}
        className="text-xs text-accent hover:opacity-80">+ Add Flag</button>
    </div>
  );
}

export default function RPGStoryEventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [arcId, setArcId] = useState("");
  const [routeExclusiveFor, setRouteExclusiveFor] = useState("");
  const [category, setCategory] = useState("shared");
  const [triggerCondition, setTriggerCondition] = useState<FlagCondition>({});
  const [gate, setGate] = useState<GateCondition>({});
  const [triggerOnce, setTriggerOnce] = useState(true);
  const [blocksPlayerInput, setBlocksPlayerInput] = useState(true);
  const [steps, setSteps] = useState<StoryEventStep[]>([]);
  const [completionFlags, setCompletionFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_STORY_EVENTS, id));
        if (!snap.exists()) { toast.error("Story event not found"); return; }
        const d = snap.data();
        setDisplayName(d.displayName ?? "");
        setArcId(d.arcId ?? "");
        setRouteExclusiveFor(d.routeExclusiveFor ?? "");
        setCategory(d.category ?? "shared");
        setTriggerCondition(d.triggerCondition ?? {});
        setGate(d.gate ?? {});
        setTriggerOnce(d.triggerOnce ?? true);
        setBlocksPlayerInput(d.blocksPlayerInput ?? true);
        setSteps(d.steps ?? []);
        setCompletionFlags(d.completionFlags ?? {});
      } catch (e) { console.error(e); toast.error("Failed to load story event"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, arcId, category,
        triggerCondition, triggerOnce, blocksPlayerInput,
        steps, completionFlags,
      };
      if (Object.keys(gate).length > 0) data.gate = gate;
      if (routeExclusiveFor) data.routeExclusiveFor = routeExclusiveFor;
      await setDoc(doc(db, COLLECTIONS.RPG_STORY_EVENTS, id), data);
      toast.success("Story event saved");
      navigate("/admin/rpg/story-events");
    } catch (e) { console.error(e); toast.error("Failed to save story event"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete story event "${id}"?`)) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_STORY_EVENTS, id));
      toast.success("Story event deleted");
      navigate("/admin/rpg/story-events");
    } catch (e) { console.error(e); toast.error("Failed to delete story event"); }
  };

  if (loading) return <div className="p-6 text-theme-muted text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/story-events" className="text-accent text-sm hover:underline">&larr; Back to Story Events</Link>
        <h1 className="text-[22px] font-bold text-theme-text mt-2">Edit Story Event: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Arc ID</label><input className={INP} value={arcId} onChange={e => setArcId(e.target.value)} /></div>
        <div><label className={LBL}>Route Exclusive For</label><input className={INP} value={routeExclusiveFor} onChange={e => setRouteExclusiveFor(e.target.value)} /></div>
        <div><label className={LBL}>Category</label><input className={INP} value={category} onChange={e => setCategory(e.target.value)} /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-theme-text">
            <input type="checkbox" checked={triggerOnce} onChange={e => setTriggerOnce(e.target.checked)} className="accent-accent" />
            Trigger Once
          </label>
          <label className="flex items-center gap-2 text-sm text-theme-text">
            <input type="checkbox" checked={blocksPlayerInput} onChange={e => setBlocksPlayerInput(e.target.checked)} className="accent-accent" />
            Blocks Player Input
          </label>
        </div>

        <div>
          <label className={LBL}>Trigger Condition</label>
          <RPGFlagConditionEditor value={triggerCondition} onChange={setTriggerCondition} />
        </div>

        <div>
          <label className={LBL}>Gate</label>
          <RPGGateConditionEditor value={gate} onChange={setGate} />
        </div>

        <div>
          <label className={LBL}>Steps</label>
          <RPGStepBuilder steps={steps} onChange={setSteps} />
        </div>

        <div>
          <label className={LBL}>Completion Flags</label>
          <CompletionFlagsEditor flags={completionFlags} onChange={setCompletionFlags} />
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
