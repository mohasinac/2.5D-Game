import { SearchableSelect } from "@/components/admin/SearchableSelect";
import RPGFlagConditionEditor from "./RPGFlagConditionEditor";
import type { DialogueNode, DialogueChoice, FlagCondition } from "@/rpg/data/schemas";

interface Props {
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
  onChange: (nodes: Record<string, DialogueNode>, startNodeId: string) => void;
}

const NODE_TYPES = ["speech", "choice", "branch", "end", "trigger"] as const;
const NODE_TYPE_OPTIONS = NODE_TYPES.map(t => ({ value: t, label: t }));

function ChoiceEditor({ choice, onChange, onRemove }: {
  choice: DialogueChoice; onChange: (c: DialogueChoice) => void; onRemove: () => void;
}) {
  const set = <K extends keyof DialogueChoice>(k: K, v: DialogueChoice[K]) => onChange({ ...choice, [k]: v });
  return (
    <div className="p-2 bg-gray-850 border border-gray-700 rounded space-y-2">
      <div className="flex items-center gap-2">
        <input type="text" value={choice.label} onChange={e => set("label", e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="Choice label" />
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-300 text-sm">x</button>
      </div>
      <input type="text" value={choice.nextNodeId} onChange={e => set("nextNodeId", e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="Next node ID" />
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Sets Flags</label>
        {Object.entries(choice.setsFlags ?? {}).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <input type="text" defaultValue={k} onBlur={e => {
              const nk = e.target.value.trim() || k;
              if (nk === k) return;
              const f = { ...(choice.setsFlags ?? {}) }; const val = f[k]; delete f[k]; f[nk] = val;
              set("setsFlags", f);
            }} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white" />
            <button type="button" onClick={() => {
              const f = { ...(choice.setsFlags ?? {}) }; f[k] = !f[k]; set("setsFlags", f);
            }} className={`px-2 py-0.5 rounded text-xs font-bold ${v ? "bg-green-700" : "bg-red-700"}`}>
              {v ? "T" : "F"}
            </button>
            <button type="button" onClick={() => {
              const f = { ...(choice.setsFlags ?? {}) }; delete f[k];
              set("setsFlags", Object.keys(f).length ? f : undefined);
            }} className="text-red-400 text-xs">x</button>
          </div>
        ))}
        <button type="button" onClick={() => set("setsFlags", { ...(choice.setsFlags ?? {}), new_flag: true })}
          className="text-xs text-blue-400">+ flag</button>
      </div>
    </div>
  );
}

function NodeCard({ node, onChange, onRemove }: {
  node: DialogueNode; onChange: (n: DialogueNode) => void; onRemove: () => void;
}) {
  const set = <K extends keyof DialogueNode>(k: K, v: DialogueNode[K]) => onChange({ ...node, [k]: v });
  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">{node.id}</span>
        <div className="flex-1">
          <SearchableSelect value={node.type} options={NODE_TYPE_OPTIONS}
            onChange={v => set("type", v as DialogueNode["type"])} />
        </div>
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-300 text-sm px-2">Delete</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Speaker ID</label>
          <input type="text" value={node.speakerId} onChange={e => set("speakerId", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
        </div>
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Portrait State</label>
          <input type="text" value={node.portraitState ?? ""} onChange={e => set("portraitState", e.target.value || undefined)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" placeholder="e.g. happy" />
        </div>
      </div>

      <div className="space-y-0.5">
        <label className="text-xs text-gray-500">Text</label>
        <textarea value={node.text} onChange={e => set("text", e.target.value)} rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white resize-y" />
      </div>

      {node.type === "speech" && (
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Next Node ID</label>
          <input type="text" value={node.nextNodeId ?? ""} onChange={e => set("nextNodeId", e.target.value || undefined)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
        </div>
      )}

      {node.type === "choice" && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400">Choices</label>
          {(node.choices ?? []).map((c, i) => (
            <ChoiceEditor key={c.id} choice={c}
              onChange={nc => {
                const choices = [...(node.choices ?? [])]; choices[i] = nc; set("choices", choices);
              }}
              onRemove={() => set("choices", (node.choices ?? []).filter((_, j) => j !== i))} />
          ))}
          <button type="button" onClick={() => set("choices", [
            ...(node.choices ?? []),
            { id: crypto.randomUUID(), label: "", nextNodeId: "" },
          ])} className="text-xs text-blue-400">+ Add Choice</button>
        </div>
      )}

      {node.type === "branch" && (
        <div className="space-y-2">
          <RPGFlagConditionEditor label="Branch Condition" value={node.branchCondition ?? {}}
            onChange={v => set("branchCondition", Object.keys(v).length ? v : undefined)} />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">True Node ID</label>
              <input type="text" value={node.branchTrueNodeId ?? ""} onChange={e => set("branchTrueNodeId", e.target.value || undefined)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">False Node ID</label>
              <input type="text" value={node.branchFalseNodeId ?? ""} onChange={e => set("branchFalseNodeId", e.target.value || undefined)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
            </div>
          </div>
        </div>
      )}

      {node.type === "trigger" && (
        <div className="space-y-0.5">
          <label className="text-xs text-gray-500">Trigger Event ID</label>
          <input type="text" value={node.triggerEventId ?? ""} onChange={e => set("triggerEventId", e.target.value || undefined)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
        </div>
      )}
    </div>
  );
}

export default function RPGNodeEditor({ nodes, startNodeId, onChange }: Props) {
  const nodeList = Object.values(nodes);
  const nodeOptions = nodeList.map(n => ({ value: n.id, label: `${n.id} (${n.type})` }));

  const addNode = () => {
    const id = crypto.randomUUID();
    const newNode: DialogueNode = { id, type: "speech", speakerId: "", text: "" };
    onChange({ ...nodes, [id]: newNode }, startNodeId || id);
  };

  const updateNode = (n: DialogueNode) => onChange({ ...nodes, [n.id]: n }, startNodeId);

  const removeNode = (id: string) => {
    const next = { ...nodes }; delete next[id];
    onChange(next, startNodeId === id ? (Object.keys(next)[0] ?? "") : startNodeId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-gray-400">Start Node</label>
        <div className="flex-1">
          <SearchableSelect value={startNodeId} options={nodeOptions}
            onChange={v => onChange(nodes, v)} placeholder="Select start node..." />
        </div>
      </div>

      <div className="space-y-3">
        {nodeList.map(n => (
          <NodeCard key={n.id} node={n} onChange={updateNode} onRemove={() => removeNode(n.id)} />
        ))}
      </div>

      <button type="button" onClick={addNode}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:border-gray-500">
        + Add Node
      </button>
    </div>
  );
}
