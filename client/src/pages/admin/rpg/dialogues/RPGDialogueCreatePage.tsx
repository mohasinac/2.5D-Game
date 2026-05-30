import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify, safeJsonParse } from "../rpgAdminShared";

export default function RPGDialogueCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [startNodeId, setStartNodeId] = useState("start");
  const [nodesJson, setNodesJson] = useState(JSON.stringify({
    start: { id: "start", type: "speech", speakerId: "", text: "Hello!", nextNodeId: "end" },
    end: { id: "end", type: "end", speakerId: "", text: "" },
  }, null, 2));

  const handleSave = async () => {
    const docId = id || slugify(id || "dialogue");
    if (!docId) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_DIALOGUES, docId), {
        nodes: safeJsonParse(nodesJson, {}),
        startNodeId,
      });
      navigate("/admin/rpg/dialogues");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/dialogues" className="text-accent text-sm hover:underline">&larr; Back to Dialogues</Link>
        <h1 className="text-[22px] font-bold text-theme-text mt-2">Create Dialogue</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID</label><input className={INP} value={id} onChange={e => setId(e.target.value)} placeholder="e.g. npc_kai_intro" /></div>
        <div><label className={LBL}>Start Node ID</label><input className={INP} value={startNodeId} onChange={e => setStartNodeId(e.target.value)} /></div>
        <div><label className={LBL}>Nodes (JSON)</label><textarea className={TEXTAREA} value={nodesJson} onChange={e => setNodesJson(e.target.value)} rows={16} /></div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Dialogue"}</button>
      </div>
    </div>
  );
}
