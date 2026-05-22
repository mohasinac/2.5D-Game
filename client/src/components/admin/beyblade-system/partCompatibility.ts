export interface PartCompatibility {
  compatibilityTags?: string[];
  requiredCompatibility?: string[];
  excludedCompatibility?: string[];
}

export function isCompatible(
  part: PartCompatibility,
  existingTags: string[],
  isAdmin: boolean,
): { ok: boolean; reason: string } {
  if (isAdmin) return { ok: true, reason: "" };

  for (const exc of part.excludedCompatibility ?? []) {
    if (existingTags.includes(exc)) {
      return { ok: false, reason: `Excluded by tag "${exc}"` };
    }
  }

  const required = part.requiredCompatibility ?? [];
  if (required.length > 0 && !required.some((t) => existingTags.includes(t))) {
    return { ok: false, reason: `Requires one of: ${required.join(", ")}` };
  }

  return { ok: true, reason: "" };
}
