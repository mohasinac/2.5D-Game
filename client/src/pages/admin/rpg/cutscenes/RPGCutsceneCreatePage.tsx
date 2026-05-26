import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { CutsceneActorPlacement, CutsceneStep, FacingDirection } from "@/rpg/data/schemas";
import RPGStepBuilder from "@/components/admin/rpg/RPGStepBuilder";
import { LBL, INP, BTN_PRIMARY, BTN_SECONDARY, CARD, slugify } from "../rpgAdminShared";

const FACINGS: FacingDirection[] = ["up", "down", "left", "right"];

function ActorsEditor({ actors, onChange }: { actors: CutsceneActorPlacement[]; onChange: (a: CutsceneActorPlacement[]) => void }) {
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
            {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
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

export default function RPGCutsceneCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [teardown, setTeardown] = useState<"return-control" | "map-change" | "battle-start">("return-control");
  const [setupActors, setSetupActors] = useState<CutsceneActorPlacement[]>([]);
  const [steps, setSteps] = useState<CutsceneStep[]>([]);

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) { toast.error("ID or name required"); return; }
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_CUTSCENES, docId), {
        displayName, teardown, setupActors, steps,
      });
      toast.success("Cutscene created");
      navigate("/admin/rpg/cutscenes");
    } catch (e) { console.error(e); toast.error("Failed to create cutscene"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/cutscenes" className="text-blue-400 text-sm hover:underline">&larr; Back to Cutscenes</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Cutscene</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
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

        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Cutscene"}</button>
      </div>
    </div>
  );
}
