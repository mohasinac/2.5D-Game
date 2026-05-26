import type { ScenarioInput } from "./types";

export interface ValidationError {
  path: string;
  message: string;
}

export function validateScenarioInput(input: ScenarioInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.scenario) {
    errors.push({ path: "scenario", message: "Missing required 'scenario' object" });
    return errors;
  }
  if (!input.scenario.id) {
    errors.push({ path: "scenario.id", message: "Scenario id is required" });
  }
  if (!input.scenario.title) {
    errors.push({ path: "scenario.title", message: "Scenario title is required" });
  }
  if (!input.scenario.arcId) {
    errors.push({ path: "scenario.arcId", message: "Scenario arcId is required" });
  }
  if (!input.scenario.regionId) {
    errors.push({ path: "scenario.regionId", message: "Scenario regionId is required" });
  }

  const locationIds = new Set<string>();
  const characterIds = new Set<string>();
  const allIds = new Set<string>();

  for (const loc of input.locations ?? []) {
    if (!loc.id) {
      errors.push({ path: "locations", message: "Location missing id" });
      continue;
    }
    if (locationIds.has(loc.id)) {
      errors.push({ path: `locations.${loc.id}`, message: `Duplicate location id "${loc.id}"` });
    }
    locationIds.add(loc.id);
    if (allIds.has(loc.id)) {
      errors.push({ path: `locations.${loc.id}`, message: `Id "${loc.id}" collides with another entity` });
    }
    allIds.add(loc.id);
    if (!loc.name) {
      errors.push({ path: `locations.${loc.id}`, message: "Location missing name" });
    }
  }

  for (const ch of input.characters ?? []) {
    if (!ch.id) {
      errors.push({ path: "characters", message: "Character missing id" });
      continue;
    }
    if (characterIds.has(ch.id)) {
      errors.push({ path: `characters.${ch.id}`, message: `Duplicate character id "${ch.id}"` });
    }
    characterIds.add(ch.id);
    allIds.add(ch.id);
    if (!ch.name) {
      errors.push({ path: `characters.${ch.id}`, message: "Character missing name" });
    }
    if (ch.location && !locationIds.has(ch.location)) {
      errors.push({ path: `characters.${ch.id}.location`, message: `References unknown location "${ch.location}"` });
    }
  }

  for (const scene of input.scenes ?? []) {
    if (!scene.id) {
      errors.push({ path: "scenes", message: "Scene missing id" });
      continue;
    }
    allIds.add(scene.id);
    if (!scene.name) {
      errors.push({ path: `scenes.${scene.id}`, message: "Scene missing name" });
    }
    if (scene.location && !locationIds.has(scene.location)) {
      errors.push({ path: `scenes.${scene.id}.location`, message: `References unknown location "${scene.location}"` });
    }
    for (const actor of scene.actors ?? []) {
      if (!characterIds.has(actor.npcId)) {
        errors.push({ path: `scenes.${scene.id}.actors`, message: `Actor references unknown character "${actor.npcId}"` });
      }
    }
  }

  for (const quest of input.quests ?? []) {
    if (!quest.id) {
      errors.push({ path: "quests", message: "Quest missing id" });
      continue;
    }
    allIds.add(quest.id);
    if (!quest.title) {
      errors.push({ path: `quests.${quest.id}`, message: "Quest missing title" });
    }
    if (!quest.objectives || quest.objectives.length === 0) {
      errors.push({ path: `quests.${quest.id}`, message: "Quest has no objectives" });
    }
  }

  for (const badge of input.badges ?? []) {
    if (!badge.id) {
      errors.push({ path: "badges", message: "Badge missing id" });
      continue;
    }
    allIds.add(badge.id);
    if (!badge.name) {
      errors.push({ path: `badges.${badge.id}`, message: "Badge missing name" });
    }
    if (!badge.earnCondition) {
      errors.push({ path: `badges.${badge.id}`, message: "Badge missing earnCondition" });
    }
  }

  for (const item of input.items ?? []) {
    if (!item.id) {
      errors.push({ path: "items", message: "Item missing id" });
      continue;
    }
    allIds.add(item.id);
    if (!item.name) {
      errors.push({ path: `items.${item.id}`, message: "Item missing name" });
    }
  }

  return errors;
}
