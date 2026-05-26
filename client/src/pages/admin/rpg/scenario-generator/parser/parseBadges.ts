import type { BadgeDef } from "@/rpg/data/schemas";
import type { ScenarioBadge, ScenarioMeta } from "./types";
import { prefixId, resolveRef } from "./idUtils";

export function parseBadges(
  badges: ScenarioBadge[],
  meta: ScenarioMeta,
  localIds: Set<string>,
): { badges: BadgeDef[]; warnings: string[] } {
  const result: BadgeDef[] = [];
  const warnings: string[] = [];
  const slug = meta.id;

  for (const b of badges) {
    const badgeId = prefixId(slug, b.id);

    const badge: BadgeDef = {
      id: badgeId,
      displayName: b.name,
      description: b.description ?? `Badge: ${b.name}`,
      iconAssetId: `${badgeId}-icon`,
      category: b.category ?? "street",
      regionId: b.regionId ?? meta.regionId,
      arcId: meta.arcId,
      earnCondition: {
        type: b.earnCondition.type,
        targetId: resolveRef(slug, b.earnCondition.targetId, localIds),
      },
    };

    result.push(badge);
  }

  return { badges: result, warnings };
}
