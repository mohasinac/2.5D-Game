[← Phase 22: Arena Builder](phase-22-arena-builder.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

---

# Phase 23 — Universal Preset Library + Arena Selection/Grouping

> **Stage 23** — Two interrelated systems:
>
> 1. **Universal Preset Library** — any game entity config can be saved as a named preset and reloaded via a searchable dropdown. Covers arena features, beyblade parts, full systems, combos, gimmicks, mechanics, special moves, behaviors, and whole arena configs.
>
> 2. **Arena Selection & Grouping** — StarCraft control-group model for the arena editor: multi-select features, form named live groups that move as a unit, save groups as templates, reload templates onto any arena with a center-point picker.
>
> **Alignment with Phase 21 Unified Foundation:**
> - Presets are the admin tooling layer for the three pillars — they are named, reusable snapshots of BehaviorDef, GeometryDef, or StatDef configurations
> - `ArenaFeatureGroupTemplate` is analogous to a `GimmickDef` (named collection of component configs with relative spatial layout)
> - The `PresetBar` component is the universal "load from library / save to library" widget, reusing the existing `SearchableSelect`

---

## Diagrams

### Preset Save/Load Flow

```
ADMIN EDITOR                    FIRESTORE
─────────────────────────────────────────────────────────────
 [ObstaclesTab]
  ┌──────────────────────────────┐
  │ [Load preset: ▼ Lava Ring.. ] │ [Load] │ [Save as Preset]
  └──────────────────────────────┘
         │ "Load"                      │ "Save"
         ▼                             ▼
  GET arena_feature_presets       POST arena_feature_presets
  (filtered: obstacle)            { name, featureType, config }
         │
         ▼
  Merge config into form
  (position fields preserved)
  ──────────────────────────────────────────────────────────
  Form:  radius=5, damage=20, color="#ff0000"  ← loaded
         x_cm=0, y_cm=0                        ← user sets
```

### Arena Selection & Grouping (StarCraft Model)

```
ARENA EDITOR CANVAS
──────────────────────────────────────────────────
 [Select Mode ON]    [Load Group Template ▼]

  ╔════════════════════════════════╗
  ║  🟡 obstacle-1 ┐  GROUP A     ║   🟡 = selected (yellow ring)
  ║  🟡 turret-2   ┘  [blue ring] ║   🔵 = group member
  ║       🔵 spinZone-3           ║
  ║   obstacle-4        pit-5     ║   unselected = normal
  ╚════════════════════════════════╝

  [Create Group] [Add to Group ▼] [Save as Template] [Delete] [Move]
  
  GROUPS PANEL (right sidebar):
  ├─ Group A  (2 members) ←─── click to highlight
  ├─ Group B  (4 members)
  └─ [+ New Group]

  Double-click Group A → "enter" group:
  ╔════════════════════════════════╗
  ║  🟡 obstacle-1   ← editable   ║   Others = dimmed 50%
  ║  🟡 turret-2     ← editable   ║
  ║       ░░ spinZone-3 ░░        ║
  ╚════════════════════════════════╝
  [← Exit Group]
```

### Universal Preset Library Page

```
/admin/preset-library
──────────────────────────────────────────────────────────────
 [Arena Features] [Bey Parts] [Bey Systems] [Gimmicks] [Combos]
 [Mechanics]      [Specials]  [Behaviors]   [Arenas]          
                                            ← SearchableTabSelect

 Search: [ lava ________________ ]

 ┌──────────────────────────────────────────────────────────┐
 │ Name              │ Tags          │ Actions              │
 ├───────────────────┼───────────────┼──────────────────────┤
 │ Lava Ring Medium  │ lava, obstacle│ [Preview] [Delete]   │
 │ Tracking Turret   │ turret, track │ [Preview] [Delete]   │
 │ Speed Loop Wide   │ speedPath     │ [Preview] [Delete]   │
 └──────────────────────────────────────────────────────────┘
 [+ Create New]
```

### Group Template Load: Center-Point Picker

```
LOAD TEMPLATE: "Defensive Corner Setup"
──────────────────────────────────────────��─
Template contents:
  ● obstacle   (offset: +15cm, +0cm)
  ● obstacle   (offset: +15cm, +5cm)
  ● turret     (offset: +20cm, +2cm)

Step 1: Select template  ✓
Step 2: Click arena to set center point

        ARENA CANVAS
  ┌──────────────────────���──┐
  │                         │
  │     + ← click here      │  cursor shows "+" until click
  │                         │
  └─────────────────────────┘

After click at (X, Y):
  obstacle-new-1  → (X+15, Y+0)
  obstacle-new-2  → (X+15, Y+5)
  turret-new-1    → (X+20, Y+2)
  
  New ArenaFeatureGroupInstance created → live group in ArenaConfig
```

---

## 0. Core Principle

> **A preset is a named, reusable snapshot of any configuration object, stripped of its position and ID.**

Loading a preset populates the current form; the user sets position and saves to the arena/bey. Saving a preset takes the current form state (minus position and `id`) and writes it to the appropriate Firestore collection.

This does not replace the three foundation pillars — it is the UI layer that makes them composable without manual re-entry.

---

## 1. Universal Preset Collections

### 1.1 Shared Document Shape

All preset collections use the same top-level shape:

```typescript
interface PresetDoc {
  id: string;
  name: string;
  category: string;            // collection name, for the master library UI
  config: Record<string, unknown>;  // the entity config sans id, position (x_cm/y_cm/x/y)
  tags?: string[];             // free-text tags for search/filter
  description?: string;
  createdBy?: string;          // user ID
  createdAt?: string;          // ISO timestamp
  updatedAt?: string;
}
```

Position fields (`x`, `y`, `x_cm`, `y_cm`) are stripped on save and left at 0 or set when placing.

### 1.2 New Firestore Collections

| Collection name | Covers | Editor |
|----------------|--------|--------|
| `arena_feature_presets` | One arena feature (obstacle, turret, spinZone, pit, portal, speedPath, waterBody, gravityHole, bump, elevationZone, loopTrack, modularSection, triggerZone, switch) | All arena feature tabs |
| `arena_feature_groups` | Named template of multiple features with relative offsets | ArenaEditorCanvas group panel |
| `beyblade_part_presets` | Individual part config (partId + configName + override fields) | SlotTab in BeybladeSystemEditor |
| `beyblade_part_group_presets` | Multi-slot combo (e.g. AR+WD+tip trio) | BeybladeSystemEditor multi-slot panel |
| `beyblade_system_templates` | Full beyblade system snapshot (all slots) | BeybladeSystemEditor overview tab |
| `combo_presets` | Combo config snapshot | ComboHUD admin, BeybladeEditPage |
| `gimmick_presets` | Gimmick recipe snapshot | GimmickDefsPage |
| `mechanic_presets` | MechanicInstance config snapshot | MechanicDefsPage |
| `special_move_presets` | Special move config snapshot | BeybladeEditPage |
| `behavior_presets` | Part behaviorId + behaviorParams | Part editor BehaviorTab |
| `arena_configs_presets` | Full ArenaConfig snapshot (whole arena) | ArenasListPage / ArenaEditPage |

**Total: 11 new collections** (2 arena-specific, 9 universal entity presets).

Add all to `client/src/lib/firebase.ts` COLLECTIONS constant and any server-side collections registry.

---

## 2. Client Infrastructure

### 2.1 Generic Hook: `usePresets`

**File:** `client/src/hooks/usePresets.ts`

```typescript
interface UsePresetsReturn {
  options: SelectOption[];                              // for SearchableSelect
  loadPreset: (id: string) => Record<string, unknown>; // returns config for merging
  savePreset: (name: string, config: Record<string, unknown>, tags?: string[]) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  loading: boolean;
}

function usePresets(category: string, filterTags?: string[]): UsePresetsReturn
```

Fetches from the corresponding Firestore collection. Memoizes options list. Accepts an optional `filterTags` array to narrow results (e.g., show only `"attack"` tagged obstacle presets).

For arena feature presets the category is `"arena_feature_presets"` and a `featureType` tag is used for filtering by feature kind.

### 2.2 Zustand Store Slices: `gameDataStore.ts`

**File:** `client/src/stores/gameDataStore.ts`

Add one slice per collection, following the same pattern as existing slices:

```typescript
// Slice pattern (repeated for each of the 11 collections):
arenaFeaturePresets: PresetDoc[];
arenaFeaturePresetsLoaded: boolean;
fetchArenaFeaturePresets: () => Promise<void>;
```

Or — if the existing pattern supports it — a single generic `presetsMap: Record<string, PresetDoc[]>` keyed by category string, with `fetchPresets(category: string)`.

### 2.3 Universal `PresetBar` Component

**File:** `client/src/components/admin/PresetBar.tsx`

```typescript
interface PresetBarProps {
  category: string;               // which collection to query
  filterTags?: string[];          // narrow the SearchableSelect options
  onLoad: (config: Record<string, unknown>) => void;  // merge into current form
  getCurrentConfig: () => Record<string, unknown>;    // get current form state for saving
  disabled?: boolean;
}
```

Renders:
```
[ SearchableSelect "Load preset..." ] [ Load ] | [ Save as Preset ]
```

"Load" button: calls `onLoad(preset.config)`.
"Save as Preset" button: opens an inline modal (name input + optional tags input) → calls `savePreset(name, getCurrentConfig(), tags)`.

Used in every editor that supports presets. Position fields are stripped in `savePreset` before writing.

---

## 3. Arena Feature Preset System

### 3.1 Per-Tab Integration

Add `<PresetBar />` at the top of the "Add new item" form in each arena feature tab:

| Tab | PresetBar category | filterTags |
|-----|--------------------|------------|
| ObstaclesTab | `arena_feature_presets` | `["obstacle"]` |
| TurretsTab | `arena_feature_presets` | `["turret"]` |
| PitsTab | `arena_feature_presets` | `["pit"]` |
| PortalsTab | `arena_feature_presets` | `["portal"]` |
| SpeedPathsTab | `arena_feature_presets` | `["speedPath"]` |
| WaterBodiesTab | `arena_feature_presets` | `["waterBody"]` |
| FeaturesTab (spinZone) | `arena_feature_presets` | `["spinZone"]` |
| FeaturesTab (gravityHole) | `arena_feature_presets` | `["gravityHole"]` |
| FeaturesTab (bump) | `arena_feature_presets` | `["bump"]` |
| PlatformsTab (elevZone) | `arena_feature_presets` | `["elevationZone"]` |
| PlatformsTab (loopTrack) | `arena_feature_presets` | `["loopTrack"]` |
| SwitchesTab | `arena_feature_presets` | `["switch"]` |

### 3.2 New Admin Page: Arena Feature Preset Library

**File:** `client/src/pages/admin/ArenaFeaturePresetsPage.tsx`

Route: `/admin/arena-feature-presets`

- List with `SearchableSelect` filter by feature type
- Each row: name, feature type badge, tags, "Delete" button, "Preview config" expand
- "Create New" button → form to manually enter a preset (name + featureType + JSON config textarea)
- Add route and nav item to `AdminLayout.tsx`

---

## 4. Selection & Grouping System

### 4.1 Architecture: StarCraft Control-Group Model

Groups are **live and persistent in `ArenaConfig`** — features remain independent entities but can be members of one or more named groups. Moving a group moves all its members by the same delta. Entering a group isolates selection to its members.

### 4.2 New Types

**File:** `shared/types/arenaConfigNew.ts`

```typescript
// Live group instance stored inline in ArenaConfig
export interface ArenaFeatureGroupInstance {
  id: string;
  name: string;
  memberRefs: Array<{
    featureType: string;   // "obstacle" | "turret" | "spinZone" | "pit" | "portal" | etc.
    featureId: string;     // matches the feature's own .id field
  }>;
  presetId?: string;       // which ArenaFeatureGroupTemplate this was loaded from
}

// Reusable template stored in Firestore arena_feature_groups
export interface ArenaFeatureGroupTemplate {
  id: string;
  name: string;
  description?: string;
  entries: Array<{
    featureType: string;
    config: Record<string, unknown>;   // full config sans absolute position
    offsetX_cm: number;                // relative to group center
    offsetY_cm: number;
  }>;
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
}
```

Add to `ArenaConfig`:
```typescript
featureGroups?: ArenaFeatureGroupInstance[];
```

Every existing feature config already has `id: string` — no changes needed to individual feature types.

### 4.3 `ArenaEditorCanvas` Component

**File:** `client/src/components/admin/ArenaEditorCanvas.tsx`

Supersedes `ArenaPreview` in the arena editor context. Renders identically but adds interactivity.

**Selection state:**
```typescript
const [selectionMode, setSelectionMode] = useState(false);
const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());
const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
const [dragSelectRect, setDragSelectRect] = useState<DOMRect | null>(null);
```

**Feature pointer handlers:**
- Normal click (selection mode): clear selection, select this feature
- Shift+click: toggle feature membership in `selectedFeatureIds`
- Normal click (not selection mode): open feature edit panel (existing behavior)
- Pointer drag on canvas background: draw selection rectangle, on release test all feature centers

**Visual feedback:**
- Selected features: yellow dashed outer ring (drawn in PIXI or SVG overlay)
- Active-group members: blue highlight ring
- Non-group features when a group is active: 50% opacity

**Groups panel** (collapsible side panel):
- List of all `featureGroups` by name
- Click group → sets `activeGroupId`, highlights members
- Double-click group → "enters" group: only members selectable, others dimmed
- "Exit group" button returns to global mode

**Selection toolbar** (floats above canvas when `selectedFeatureIds.size > 0`):

| Button | Action |
|--------|--------|
| "Create Group" | Modal (name) → new `ArenaFeatureGroupInstance` with selected IDs |
| "Add to group" | SearchableSelect of existing groups → appends selected IDs |
| "Save as template" | Modal (name + tags) → writes `ArenaFeatureGroupTemplate` to Firestore |
| "Delete selected" | Removes features from ArenaConfig arrays + from all group `memberRefs` |
| "Move selected" | Drag handle: applies same dx/dy to all selected feature positions |

**Group-level move**: when `activeGroupId` is set and any member feature is dragged, ALL members move by the same delta — not just the dragged one.

### 4.4 Loading a Group Template

In `ArenaEditorCanvas` toolbar:
1. "Load Group Template" button → `SearchableSelect` from `arena_feature_groups`
2. After selection: user clicks canvas to set center point
3. Each template entry instantiated with new `id` (nanoid) + position = center + offset
4. New `ArenaFeatureGroupInstance` created referencing new IDs
5. Added to `arena.featureGroups` → immediately live and selectable

### 4.5 Admin Pages

- `/admin/arena-feature-groups` → `ArenaFeatureGroupsPage.tsx` — list templates, show entry count, feature type breakdown, delete, rename

---

## 5. Beyblade Preset Integration

### 5.1 Per-Slot Part Presets (BeybladeSystemEditor)

**File:** `client/src/components/admin/beyblade-system/SlotTab.tsx`

Add `<PresetBar category="beyblade_part_presets" filterTags={[partType]} ... />` at the top of each slot tab. Loading a preset sets `selectedPartId` and `activeConfigName` in the slot.

### 5.2 Multi-Slot Part Group Presets

**File:** `client/src/components/admin/beyblade-system/BeybladeSystemEditor.tsx`

A new "Combos" sub-panel (separate from the existing Combos tab which handles in-game combo moves) shows popular part pairings:
- `<PresetBar category="beyblade_part_group_presets" ... />`
- Loading a part group preset sets multiple slots simultaneously
- Saving captures the current AR+WD (or AR+WD+tip) selection as a named pairing

### 5.3 Full System Templates (BeybladeSystemEditor overview tab)

Add to the existing overview tab:

```tsx
<PresetBar
  category="beyblade_system_templates"
  onLoad={(config) => {
    // Confirm dialog: "This will replace your current build"
    applySystemTemplate(config as BeybladeSystem);
  }}
  getCurrentConfig={() => serializeCurrentSystem()}
/>
```

### 5.4 Combo, Gimmick, Mechanic, Special Move Presets

Each existing admin page gains a `<PresetBar />`:

| Page | File | Category |
|------|------|---------|
| GimmickDefsPage | `pages/admin/GimmickDefsPage.tsx` | `gimmick_presets` |
| MechanicDefsPage | `pages/admin/MechanicDefsPage.tsx` | `mechanic_presets` |
| BeybladeEditPage (special move) | existing page | `special_move_presets` |
| Part editor behavior tab | `part-editor/PartTypeFields.tsx` | `behavior_presets` |
| BeybladeEditPage (combos section) | existing page | `combo_presets` |

### 5.5 Full Arena Config Presets

**ArenasListPage / ArenaEditPage** gain a `<PresetBar category="arena_configs_presets" ... />` in the arena header toolbar, allowing an entire `ArenaConfig` (minus `id`, `createdAt`, `createdBy`) to be saved and reloaded as a starting point.

---

## 6. Master Preset Library Page

**File:** `client/src/pages/admin/PresetLibraryPage.tsx`

Route: `/admin/preset-library`

A single page browsing all 11 preset categories:

- `SearchableTabSelect` for category navigation (left rail or top tabs)
- Each category tab: list of presets with name, tags, "Delete", "Duplicate", "Preview config" expand
- Global search box filtering across name + tags in the currently selected category
- "Create" button opens the appropriate form for that category
- Add route and nav item to `AdminLayout.tsx`

---

## 7. Seed Scripts

| Script | Collection | Content |
|--------|-----------|---------|
| `npm run seed:arena-feature-presets` | `arena_feature_presets` | ~20 starter presets (lava pit, tracking turret, speed ring, gravity hole, loop track 12cm, etc.) |
| `npm run seed:beyblade-part-presets` | `beyblade_part_presets` | ~15 popular part configs (Dranzer S AR + spiral config, HMC tip rubber mode, etc.) |
| `npm run seed:beyblade-system-templates` | `beyblade_system_templates` | 1 per archetype: Classic Attack, Classic Stamina, Classic Defense, Classic Balance |

---

## 8. Implementation Notes

### Backward Compatibility

- All preset collections are new — no existing collections change
- `featureGroups` is optional in `ArenaConfig` — existing arenas are unaffected
- `PresetBar` is additive — feature tabs continue to work without it

### Position Stripping

When saving to any preset collection, strip these fields from `config` before writing:
```typescript
const POSITION_FIELDS = ["x", "y", "x_cm", "y_cm", "id", "createdAt", "createdBy", "updatedAt"];
const stripped = Object.fromEntries(
  Object.entries(config).filter(([k]) => !POSITION_FIELDS.includes(k))
);
```

### Tag Conventions

Recommended tag vocabularies per category:

| Category | Example tags |
|---------|-------------|
| `arena_feature_presets` | `["lava", "obstacle", "large", "ring", "defensive"]` |
| `beyblade_part_presets` | `["attack", "mfb", "rubber", "sharp", "gen1"]` |
| `beyblade_system_templates` | `["attack", "burst", "competitive", "beginner"]` |
| `gimmick_presets` | `["magnacore", "free-spin", "auto-change"]` |

---

## Implementation Status (audit 2026-05-24)

| Component | Status | Notes |
|-----------|--------|-------|
| 11 new Firestore preset collections | ❓ Partial | Core collections (`mechanic_defs`, `gimmick_defs`, `geometry_defs`, `stat_defs`) done; arena template / beyblade template collections need verification |
| `PresetBar` component | ❓ Verify | Not confirmed in `client/src/components/` |
| `ArenaEditorCanvas` interactive canvas | ❌ Missing | Arena admin uses static views; drag-to-place canvas not implemented |
| Arena selection grouping (StarCraft model) | ❌ Missing | Not in arena configurator |
| `ArenaFeatureGroupInstance` / `ArenaFeatureGroupTemplate` types | ❓ Verify | Not confirmed in `arenaConfigNew.ts` |

---

[← Phase 22: Arena Builder](phase-22-arena-builder.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)
