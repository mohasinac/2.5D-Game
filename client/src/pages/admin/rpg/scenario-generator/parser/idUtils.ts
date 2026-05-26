export function kebabSlugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function prefixId(scenarioSlug: string, localId: string): string {
  const slug = kebabSlugify(localId);
  return `${scenarioSlug}-${slug}`;
}

export function resolveRef(
  scenarioSlug: string,
  localId: string,
  knownLocalIds: Set<string>,
): string {
  if (knownLocalIds.has(localId)) {
    return prefixId(scenarioSlug, localId);
  }
  return localId;
}

let _counter = 0;
export function uniqueNodeId(): string {
  _counter += 1;
  return `n${_counter.toString(36)}${Date.now().toString(36).slice(-4)}`;
}

export function resetNodeCounter(): void {
  _counter = 0;
}
