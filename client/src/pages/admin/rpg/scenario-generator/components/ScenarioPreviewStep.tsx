import type { ScenarioOutput } from "../parser/types";
import type { PlaceholderAssets } from "../placeholders/generatePlaceholders";
import type { ScenarioInput } from "../parser/types";
import { PreviewSection } from "./PreviewSection";
import { MapMiniPreview } from "./MapMiniPreview";
import { PlaceholderThumbnail } from "./PlaceholderThumbnail";

interface Props {
  output: ScenarioOutput;
  input: ScenarioInput;
  assets: PlaceholderAssets;
  onBack: () => void;
  onConfirm: () => void;
}

export function ScenarioPreviewStep({ output, input, assets, onBack, onConfirm }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white text-lg font-semibold">Step 2: Preview Generated Content</h2>
        <div className="flex gap-2">
          <button onClick={onBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
            Back
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
            Save to Firestore
          </button>
        </div>
      </div>

      {output.warnings.length > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
          <div className="text-yellow-400 text-xs font-bold mb-1">Warnings:</div>
          {output.warnings.map((w, i) => (
            <div key={i} className="text-yellow-300 text-xs">{w}</div>
          ))}
        </div>
      )}

      <PreviewSection title="Maps" count={output.maps.length} defaultOpen>
        <div className="flex flex-col gap-4">
          {output.maps.map((map) => (
            <div key={map.id} className="flex gap-4 items-start">
              <MapMiniPreview map={map} maxWidth={200} />
              <div className="flex flex-col gap-1">
                <div className="text-white text-sm font-medium">{map.displayName}</div>
                <div className="text-gray-400 text-xs">ID: {map.id}</div>
                <div className="text-gray-400 text-xs">Size: {map.width}x{map.height} | Type: {map.type}</div>
                <div className="text-gray-400 text-xs">Exits: {map.exits.length} | NPCs: {map.npcPlacements.length} | Triggers: {map.eventTriggers.length}</div>
              </div>
            </div>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="NPCs" count={output.npcs.length}>
        <div className="flex flex-col gap-2">
          {output.npcs.map((npc) => {
            const ch = (input.characters ?? []).find((c) => npc.id.endsWith(c.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")));
            const spriteUrl = ch ? assets.sprites[ch.id] : undefined;
            return (
              <div key={npc.id} className="flex items-center gap-3">
                {spriteUrl && <PlaceholderThumbnail dataUrl={spriteUrl} size={32} />}
                <div>
                  <div className="text-white text-sm">{npc.displayName}</div>
                  <div className="text-gray-400 text-xs">
                    {npc.type} | {npc.battleConfig ? "Battler" : "Non-combat"} | ID: {npc.id}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PreviewSection>

      <PreviewSection title="Dialogues" count={output.dialogues.length}>
        <div className="flex flex-col gap-1.5">
          {output.dialogues.map((dlg) => {
            const nodeCount = Object.keys(dlg.nodes).length;
            const firstNode = dlg.nodes[dlg.startNodeId];
            return (
              <div key={dlg.id} className="text-xs">
                <span className="text-white font-medium">{dlg.id}</span>
                <span className="text-gray-500 ml-2">{nodeCount} nodes</span>
                {firstNode?.text && (
                  <span className="text-gray-400 ml-2">"{firstNode.text.slice(0, 50)}{firstNode.text.length > 50 ? "..." : ""}"</span>
                )}
              </div>
            );
          })}
        </div>
      </PreviewSection>

      <PreviewSection title="Quests" count={output.quests.length}>
        <div className="flex flex-col gap-2">
          {output.quests.map((q) => (
            <div key={q.id}>
              <div className="text-white text-sm">{q.title}</div>
              <div className="text-gray-400 text-xs">{q.category} | {q.objectives.length} objectives | ID: {q.id}</div>
            </div>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Story Events" count={output.storyEvents.length}>
        <div className="flex flex-col gap-1.5">
          {output.storyEvents.map((evt) => (
            <div key={evt.id} className="text-xs">
              <span className="text-white font-medium">{evt.displayName}</span>
              <span className="text-gray-500 ml-2">{evt.steps.length} steps</span>
              <span className="text-gray-500 ml-2">ID: {evt.id}</span>
            </div>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Cutscenes" count={output.cutscenes.length}>
        <div className="flex flex-col gap-1.5">
          {output.cutscenes.map((cut) => (
            <div key={cut.id} className="text-xs">
              <span className="text-white font-medium">{cut.displayName}</span>
              <span className="text-gray-500 ml-2">{cut.steps.length} steps | {cut.setupActors.length} actors</span>
            </div>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Badges" count={output.badges.length}>
        <div className="flex flex-col gap-2">
          {output.badges.map((badge) => {
            const b = (input.badges ?? []).find((ib) => badge.id.endsWith(ib.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")));
            const iconUrl = b ? assets.badgeIcons[b.id] : undefined;
            return (
              <div key={badge.id} className="flex items-center gap-2">
                {iconUrl && <PlaceholderThumbnail dataUrl={iconUrl} size={16} />}
                <div>
                  <span className="text-white text-sm">{badge.displayName}</span>
                  <span className="text-gray-500 text-xs ml-2">{badge.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </PreviewSection>

      <PreviewSection title="Items" count={output.items.length}>
        <div className="flex flex-col gap-2">
          {output.items.map((item) => {
            const it = (input.items ?? []).find((ii) => item.id.endsWith(ii.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")));
            const iconUrl = it ? assets.itemIcons[it.id] : undefined;
            return (
              <div key={item.id} className="flex items-center gap-2">
                {iconUrl && <PlaceholderThumbnail dataUrl={iconUrl} size={16} />}
                <div>
                  <span className="text-white text-sm">{item.displayName}</span>
                  <span className="text-gray-500 text-xs ml-2">{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </PreviewSection>
    </div>
  );
}
