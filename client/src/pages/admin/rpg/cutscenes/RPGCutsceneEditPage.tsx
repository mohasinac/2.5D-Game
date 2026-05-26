import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useDefsDocs } from "@/hooks/useDefsDocs";
import type { CutsceneActorPlacement, CutsceneStep, FacingDirection } from "@/rpg/data/schemas";
import RPGStepBuilder from "@/components/admin/rpg/RPGStepBuilder";
import { LBL, INP, BTN_PRIMARY, BTN_DANGER, CARD } from "../rpgAdminShared";

const FALLBACK_FACINGS: FacingDirection[] = ["up", "down", "left", "right"];

function ActorsEditor({ actors, onChange }: { actors: CutsceneActorPlacement[]; onChange: (a: CutsceneActorPlacement[]) => void }) {
  const facingDocs = useDefsDocs(COLLECTIONS.RPG_FACING_DEFS);
  const facings = facingDocs.length > 0 ? facingDocs.map(d => d.id) as FacingDirection[] : FALLBACK_FACINGS;

  const update = (i: number, a: CutsceneActorPlacement) => { const next = [...actors]; next[i] = a; onChange(next); };
  const remove = (i: number) => onChange(actors.filter((_, j) => j !== i));
  const add = () => onChange([...actors, { npcId: "", tile: { x: 0, y: 0 }, facing: "down" }]);

  return (
    <div className="space-y-2">
      {actors.map((a, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-gray-900 border border-gray-700 rounded-lg">
          <input type="text" value={a.npcId} onChange={e => update(i, { ...a, npcId: e.target.value })}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="NPC ID" />
          <input type="number" value={a.tile.x} onChange={e => update(i, { ...a, tile: { ...a.tile, x: Number(e.target.value) } })}
            className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="X" />
          <input type="number" value={a.tile.y} onChange={e => update(i, { ...a, tile: { ...a.tile, y: Number(e.target.value) } })}
            className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="Y" />
          <select value={a.facing} onChange={e => update(i, { ...a, facing: e.target.value as FacingDirection })}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white">
            {facings.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm">x</button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Actor
      </button>
    </div>
  );
}

export default function RPGCutsceneEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [teardown, setTeardown] = useState<"return-control" | "map-change" | "battle-start">("return-control");
  const [setupActors, setSetupActors] = useState<CutsceneActorPlacement[]>([]);
  const [steps, setSteps] = useState<CutsceneStep[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_CUTSCENES, id));
        if (!snap.exists()) { toast.error("Cutscene not found"); return; }
        const d = snap.data();
        setDisplayName(d.displayName ?? "");
        setTeardown(d.teardown ?? "return-control");
        setSetupActors(d.setupActors ?? []);
        setSteps(d.steps ?? []);
      } catch (e) { console.error(e); toast.error("Failed to load cutscene"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_CUTSCENES, id), {
        displayName, teardown, setupActors, steps,
      });
      toast.success("Cutscene saved");
      navigate("/admin/rpg/cutscenes");
    } catch (e) { console.error(e); toast.error("Failed to save cutscene"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete cutscene "${id}"?`)) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_CUTSCENES, id));
      toast.success("Cutscene deleted");
      navigate("/admin/rpg/cutscenes");
    } catch (e) { console.error(e); toast.error("Failed to delete cutscene"); }
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/cutscenes" className="text-blue-400 text-sm hover:underline">&larr; Back to Cutscenes</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit Cutscene: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div>
          <label className={LBL}>Teardown</label>
          <select className={INP} value={teardown} onChange={e => setTeardown(e.target.value as typeof teardown)}>
            {["return-control", "map-change", "battle-start"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={LBL}>Setup Actors</label>
          <ActorsEditor actors={setupActors} onChange={setSetupActors} />
        </div>

        <div>
          <label className={LBL}>Steps</label>
          <RPGStepBuilder steps={steps} onChange={setSteps} />
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
