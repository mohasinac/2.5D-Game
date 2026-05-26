# RPG Scenario Generator — JSON Template Reference

Use this format to generate RPG content from a JSON script. Paste the JSON into the Scenario Generator admin page at `/admin/rpg/scenario-generator`.

---

## Top-Level Structure

```json
{
  "scenario": { ... },
  "locations": [ ... ],
  "characters": [ ... ],
  "scenes": [ ... ],
  "quests": [ ... ],
  "badges": [ ... ],
  "items": [ ... ]
}
```

Only `scenario` is required. All other sections are optional arrays.

---

## `scenario` (required)

```json
{
  "id": "episode-01-the-challenge",
  "title": "The Challenge",
  "arcId": "season-1",
  "regionId": "japan"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique scenario slug. All generated entity IDs are prefixed with this (e.g. `episode-01-the-challenge-riverside-park`). |
| `title` | string | Yes | Display name for this scenario. |
| `arcId` | string | Yes | Which arc/generation this belongs to (e.g. `season-1`, `vforce`). |
| `regionId` | string | Yes | Default region for generated maps. |

---

## `locations`

Each location generates an `RPGMap` document in `rpg_maps`.

```json
{
  "id": "riverside-park",
  "name": "Riverside Park",
  "type": "park",
  "size": "20x15",
  "lighting": "day",
  "bgm": "park-theme",
  "layout": [
    "WWWWWWWWWWWWWWWWWWWW",
    "W..................W",
    "W..TTTT....BBBB...W",
    "W..................W",
    "W......PP..........W",
    "W..................W",
    "WWWWWWWWWWWWWWWWWWWW"
  ],
  "exits": [
    { "to": "bey-city-streets", "direction": "south", "transition": "walk" }
  ],
  "entryPoints": [
    { "id": "from-south", "tile": [10, 13], "facing": "up" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Local ID (auto-prefixed with scenario ID). |
| `name` | string | Yes | Display name shown in-game. |
| `type` | string | No | Map type tag (default: `"city"`). |
| `size` | string | No | `"WIDTHxHEIGHT"` in tiles (default: `"20x15"`). Ignored if layout is provided. |
| `lighting` | string | No | `"day"`, `"evening"`, `"night"`, `"indoor"`, or `"cave"` (default: `"day"`). |
| `bgm` | string | No | Background music track ID. |
| `layout` | string[] | No | ASCII tile grid (see legend below). If omitted, generates walled border with grass fill. |
| `exits` | array | No | Map exits linking to other locations. |
| `entryPoints` | array | No | Named spawn points. Default entry point auto-generated if empty. |

### ASCII Tile Legend

| Char | Tile | Collision | Description |
|------|------|-----------|-------------|
| `.` | grass | No | Open ground |
| `W` | wall | Yes | Solid wall |
| `T` | tree | Yes | Tree (decoration layer) |
| `B` | building | Yes | Building (decoration layer) |
| `P` | path | No | Walkable path |
| `A` | arena | No | Battle arena area |
| `D` | door | No | Door / entrance |
| `S` | shop | Yes | Shop building |
| `R` | rock | Yes | Rock obstacle |
| `~` | water | Yes | Water (impassable) |
| ` ` | grass | No | Same as `.` |

### Exit Object

```json
{ "to": "other-location-id", "direction": "south", "transition": "walk" }
```

| Field | Type | Values |
|-------|------|--------|
| `to` | string | Target location ID (local or external) |
| `direction` | string | `"north"`, `"south"`, `"east"`, `"west"`, `"warp"` |
| `transition` | string | `"walk"`, `"warp"`, `"door"`, `"cave"` (default: `"walk"`) |

### Entry Point Object

```json
{ "id": "from-south", "tile": [10, 13], "facing": "up" }
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Named entry (used by exits from other maps) |
| `tile` | [x, y] | Spawn tile coordinate |
| `facing` | string | `"up"`, `"down"`, `"left"`, `"right"` (default: `"down"`) |

---

## `characters`

Each character generates an `NPC` + greeting `DialogueTree` in `rpg_npcs` / `rpg_dialogues`. Characters with `battleConfig` also get 3 auto-generated battle dialogues (intro, victory, defeat).

```json
{
  "id": "rival-carlos",
  "name": "Carlos",
  "type": "rival",
  "color": "#c0392b",
  "shape": "diamond",
  "facing": "down",
  "location": "riverside-park",
  "tile": [10, 6],
  "greeting": "Hey! You looking for a battle?",
  "battleConfig": {
    "beybladeId": "bey-carlos-storm",
    "arenaId": "arena-park",
    "difficulty": "medium",
    "canRematch": true,
    "bestOf": 3,
    "xpReward": { "playerXP": 50, "beybladeXP": 30 },
    "awardsBadgeId": "park-champion",
    "gate": {
      "minPlayerLevel": 3,
      "requiredBadges": ["some-badge"]
    }
  },
  "schedule": [
    { "timeSlot": "morning", "location": "riverside-park", "tile": [10, 6], "facing": "down" },
    { "timeSlot": "night", "location": "bey-city-streets", "tile": [5, 3], "facing": "left" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Local character ID. |
| `name` | string | Yes | Display name. |
| `type` | string | No | NPC type: `"blader"`, `"rival"`, `"quest-giver"`, `"shopkeeper"`, `"story"`, `"boss"`, etc. (default: `"blader"`). |
| `color` | string | No | Hex color for placeholder sprite/portrait (auto-assigned if omitted). |
| `shape` | string | No | Placeholder shape: `"circle"`, `"diamond"`, `"triangle"`, `"square"`, `"star"`, `"hexagon"` (auto-assigned). |
| `facing` | string | No | Default facing direction (default: `"down"`). |
| `location` | string | No | Which location this NPC spawns in (local ID). |
| `tile` | [x, y] | No | Spawn tile in that location. |
| `greeting` | string | No | Default dialogue when player talks to this NPC. |
| `battleConfig` | object | No | If present, this NPC is a battler. |
| `schedule` | array | No | Time-of-day schedule entries (overrides location/tile). |

### Battle Config

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `beybladeId` | string | — | Required. Beyblade the NPC uses. |
| `arenaId` | string | — | Required. Arena for the battle. |
| `difficulty` | string | `"medium"` | `"easy"`, `"medium"`, `"hard"`, `"hell"`. |
| `canRematch` | boolean | `false` | Whether player can re-battle. |
| `bestOf` | number | — | Series format: `1`, `3`, or `5`. |
| `xpReward` | object | — | `{ playerXP, beybladeXP, beybladeXPTarget }`. |
| `awardsBadgeId` | string | — | Badge earned on defeating this NPC (local ID). |
| `gate` | object | — | Requirements to battle (see Gate Condition). |

---

## `scenes`

Each scene generates a `StoryEvent` + `DialogueTree` in `rpg_story_events` / `rpg_dialogues`. Scenes with `actors` also generate a `Cutscene` in `rpg_cutscenes`.

```json
{
  "id": "carlos-challenge",
  "name": "Carlos Issues a Challenge",
  "type": "cutscene",
  "location": "riverside-park",
  "triggerMode": "interact",
  "triggerTile": [10, 7],
  "triggerOnce": true,
  "actors": [
    { "npcId": "rival-carlos", "tile": [10, 5], "facing": "down" }
  ],
  "dialogue": [
    { "rival-carlos": "Hey, you! Yeah, you with the beyblade!" },
    { "rival-carlos": "I bet you can't beat ME!" },
    { "choice": {
      "prompt": "What do you say?",
      "options": [
        { "label": "Bring it on!", "setFlag": "accepted-challenge", "goto": "accept" },
        { "label": "Maybe later...", "goto": "decline" }
      ]
    }},
    { "label": "accept", "rival-carlos": "That's the spirit!" },
    { "label": "decline", "rival-carlos": "Coward. I'll be waiting." }
  ],
  "completionFlags": { "met-carlos": true },
  "gate": { "minPlayerLevel": 2 }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Scene ID. |
| `name` | string | Yes | Display name. |
| `type` | string | No | `"cutscene"` or `"story-event"` (auto-detected if actors present). |
| `location` | string | No | Map where trigger is placed. |
| `triggerMode` | string | No | `"enter"`, `"interact"`, `"step"` (default: `"interact"`). |
| `triggerTile` | [x, y] | No | Tile that triggers this scene. |
| `triggerOnce` | boolean | No | Only fire once (default: `true`). |
| `actors` | array | No | NPCs positioned for the cutscene. |
| `dialogue` | array | No | Dialogue shorthand (see below). |
| `completionFlags` | object | No | Flags set when scene completes. |
| `gate` | object | No | Gate condition to trigger this scene. |

### Dialogue Shorthand Format

The dialogue array uses a compact format that gets parsed into a full `DialogueTree`:

**Speech line:**
```json
{ "speaker-id": "What they say." }
```

**Choice:**
```json
{
  "choice": {
    "prompt": "What do you say?",
    "options": [
      { "label": "Option A", "setFlag": "chose-a", "goto": "label-a" },
      { "label": "Option B", "goto": "label-b" }
    ]
  }
}
```

**Labeled node (jump target):**
```json
{ "label": "label-a", "speaker-id": "Response to option A." }
```

| Feature | Syntax | Description |
|---------|--------|-------------|
| Speech | `{ "speaker": "text" }` | Single speech node. Speaker ID matches a character ID. |
| Choice | `{ "choice": { ... } }` | Player choice with labeled options. |
| Label | `{ "label": "name", "speaker": "text" }` | Named node (target for `goto`). |
| goto | `"goto": "label-name"` | Jump to a labeled node (on choices or speech). |
| setFlag | `"setFlag": "flag-name"` | Set a boolean flag to `true`. |

Nodes chain automatically — each speech node's `nextNodeId` points to the following entry unless overridden by `goto`.

---

## `quests`

Each quest generates a `Quest` document in `rpg_quests`.

```json
{
  "id": "defeat-carlos",
  "title": "Prove Your Worth",
  "description": "Defeat Carlos in a Beyblade battle.",
  "category": "main",
  "prerequisites": ["explore-city"],
  "requiredFlags": { "all": { "met-carlos": true } },
  "objectives": [
    { "type": "defeat-npc", "target": "rival-carlos", "description": "Defeat Carlos" },
    { "type": "reach-map", "target": "bey-city-streets", "description": "Visit the city", "optional": true }
  ],
  "rewards": {
    "reputation": 10,
    "xp": { "playerXP": 75 },
    "badgeId": "park-champion",
    "setFlags": { "carlos-defeated": true },
    "items": [{ "itemId": "attack-ring-basic", "quantity": 1 }],
    "unlockMapIds": ["secret-area"]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Quest ID. |
| `title` | string | Yes | Quest title. |
| `description` | string | Yes | Quest description. |
| `category` | string | No | `"main"`, `"side"`, `"rival"`, `"tournament"`, `"hidden"` (default: `"main"`). |
| `prerequisites` | string[] | No | Quest IDs that must be completed first. |
| `requiredFlags` | object | No | Flag condition (`all`, `any`, `none` with boolean records). |
| `objectives` | array | Yes | Quest objectives (at least 1). |
| `rewards` | object | No | Rewards on completion. |

### Objective Types

| Type | Target | Description |
|------|--------|-------------|
| `defeat-npc` | character ID | Beat this NPC in battle |
| `talk-to-npc` | character ID | Talk to this NPC |
| `reach-map` | location ID | Visit this map |
| `collect-item` | item ID | Collect this item |
| `win-tournament` | tournament ID | Win a tournament |
| `complete-quest` | quest ID | Complete another quest |
| `trigger-event` | event ID | Trigger a story event |

---

## `badges`

Each badge generates a `BadgeDef` in `rpg_badges`.

```json
{
  "id": "park-champion",
  "name": "Park Champion",
  "category": "street",
  "color": "#f1c40f",
  "shape": "star",
  "description": "Awarded for defeating Carlos at Riverside Park.",
  "earnCondition": { "type": "defeat-npc", "targetId": "rival-carlos" },
  "regionId": "japan"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Badge ID. |
| `name` | string | Yes | Display name. |
| `category` | string | No | `"street"`, `"regional-qualifier"`, `"tournament"`, `"arc"`, `"hidden"` (default: `"street"`). |
| `color` | string | No | Hex color for placeholder icon. |
| `shape` | string | No | Placeholder shape. |
| `description` | string | No | Badge description. |
| `earnCondition` | object | Yes | `{ type, targetId }` — how badge is earned. |
| `regionId` | string | No | Region this badge belongs to. |

---

## `items`

Each item generates an `InventoryItem` in `rpg_items`.

```json
{
  "id": "stamina-potion",
  "name": "Stamina Potion",
  "category": "consumable",
  "color": "#2ecc71",
  "shape": "circle",
  "description": "Restores stamina.",
  "stackable": true,
  "maxStack": 5,
  "usable": true,
  "sellPrice": 20,
  "buyPrice": 40,
  "questRelated": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Item ID. |
| `name` | string | Yes | Display name. |
| `category` | string | No | `"consumable"`, `"key-item"`, `"beyblade-part"`, `"launcher"`, `"bit-chip"`, `"trophy"`, `"accessory"` (default: `"consumable"`). |
| `color` | string | No | Hex color for placeholder icon. |
| `shape` | string | No | Placeholder shape. |
| `description` | string | No | Item description. |
| `stackable` | boolean | No | Default: `true`. |
| `maxStack` | number | No | Max stack size. |
| `usable` | boolean | No | Default: `false`. |
| `sellPrice` | number | No | Sell price. |
| `buyPrice` | number | No | Buy price. |
| `questRelated` | boolean | No | Default: `false`. |

---

## Gate Condition (used in battleConfig, scenes)

```json
{
  "flags": { "all": { "met-carlos": true } },
  "minPlayerLevel": 5,
  "minBeybladeLevel": { "beybladeId": "dragoon_s", "level": 3 },
  "requiredBadges": ["park-champion", "city-explorer"],
  "anyBadgeFrom": ["badge-a", "badge-b"],
  "defeatedNPCs": ["rival-carlos"]
}
```

All fields are optional. If multiple are present, ALL must be satisfied.

---

## Placeholder Shapes

Available shapes for `color` + `shape` fields: `"circle"`, `"diamond"`, `"triangle"`, `"square"`, `"star"`, `"hexagon"`.

If not specified, colors and shapes are auto-assigned from a rotating palette. You can replace the placeholder assets later in the individual admin edit pages.

---

## ID Resolution

All IDs within the JSON are **local** — they reference other entities in the same script by their `id` field. The parser automatically:

1. Prefixes all IDs with the scenario slug (e.g. `riverside-park` → `episode-01-the-challenge-riverside-park`)
2. Resolves cross-references between entities (e.g. a quest targeting `rival-carlos` resolves to the prefixed NPC ID)
3. External IDs (not matching any local entity) are passed through unchanged

---

## What Gets Generated

| Section | Firestore Collection | Documents Per Entry |
|---------|---------------------|-------------------|
| locations | `rpg_maps` | 1 map per location |
| characters | `rpg_npcs` + `rpg_dialogues` | 1 NPC + 1 greeting dialogue + 3 battle dialogues (if battler) |
| scenes | `rpg_dialogues` + `rpg_story_events` + `rpg_cutscenes` | 1 dialogue + 1 story event + 1 cutscene (if actors) per scene |
| quests | `rpg_quests` | 1 per quest |
| badges | `rpg_badges` | 1 per badge |
| items | `rpg_items` | 1 per item |

---

## Full Example

See the "Load Example" button in the Scenario Generator for a complete working example with 2 locations, 3 characters, 2 scenes, 2 quests, 1 badge, and 2 items.
