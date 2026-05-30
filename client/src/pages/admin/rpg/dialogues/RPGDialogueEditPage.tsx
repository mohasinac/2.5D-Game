import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { DialogueNode } from "@/rpg/data/schemas";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD, safeJsonParse } from "../rpgAdminShared";

export default function RPGDialogueEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startNodeId, setStartNodeId] = useState("start");
  const [nodesJson, setNodesJson] = useState("{}");
  const [nodes, setNodes] = useState<Record<string, DialogueNode>>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_DIALOGUES, id));
        if (!snap.exists()) return;
        const d = snap.data();
        setStartNodeId(d.startNodeId ?? "start");
        const n = (d.nodes ?? {}) as Record<string, DialogueNode>;
        setNodes(n);
        setNodesJson(JSON.stringify(n, null, 2));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_DIALOGUES, id), {
        nodes: safeJsonParse(nodesJson, nodes),
        startNodeId,
      });
      navigate("/admin/rpg/dialogues");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete dialogue "${id}"?`)) return;
    await deleteDoc(doc(db, COLLECTIONS.RPG_DIALOGUES, id));
    navigate("/admin/rpg/dialogues");
  };

  if (loading) return <div className="p-6 text-theme-muted text-sm">Loading...</div>;

  const nodeEntries = Object.values(nodes);

  return (
    <div className="p-6 w-full max-w-4xl">
      <div className="mb-5">
        <Link to="/admin/rpg/dialogues" className="text-accent text-sm hover:underline">&larr; Back to Dialogues</Link>
        <h1 className="text-[22px] font-bold text-theme-text mt-2">Edit Dialogue: {id}</h1>
      </div>

      {/* Node summary list */}
      {nodeEntries.length > 0 && (
        <div className="mb-5 bg-bg1 border border-border-c rounded-xl p-4">
          <h2 className="text-sm font-semibold text-theme-text mb-3">Node Overview ({nodeEntries.length} nodes)</h2>
          <div className="space-y-1">
            {nodeEntries.map(n => (
              <div key={n.id} className="flex items-center gap-3 text-sm py-1">
                <span className="text-accent font-mono w-28 shrink-0">{n.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  n.type === "speech" ? "bg-green-900 text-green-300" :
                  n.type === "choice" ? "bg-yellow-900 text-yellow-300" :
                  n.type === "branch" ? "bg-purple-900 text-purple-300" :
                  n.type === "trigger" ? "bg-orange-900 text-orange-300" :
                  "bg-bg3 text-theme-muted"
                }`}>
                  {n.type}
                </span>
                {n.speakerId && <span className="text-theme-muted">[{n.speakerId}]</span>}
                <span className="text-theme-muted truncate">{n.text?.slice(0, 60)}{(n.text?.length ?? 0) > 60 ? "..." : ""}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Start Node ID</label><input className={INP} value={startNodeId} onChange={e => setStartNodeId(e.target.value)} /></div>
        <div><label className={LBL}>Nodes (JSON)</label><textarea className={TEXTAREA} value={nodesJson} onChange={e => setNodesJson(e.target.value)} rows={20} /></div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
