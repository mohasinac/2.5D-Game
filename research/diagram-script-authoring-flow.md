# Diagram 16 — Script Authoring Flow

Users may extend behavior via composition blocks. Visual blocks are authoring tools — NOT runtime truth. The script definition is the persistent truth. Runtime packages are the game truth. Editor state is ephemeral.

```mermaid
flowchart TD
  subgraph Editors["Authoring Editors (client-side tools — ephemeral state)"]
    SCRATCH[Scratch-like Block Editor\n/admin/scripts/scratch\nDrag-and-drop block composition\nNo code knowledge needed]
    NODE_GRAPH[Visual Node Graph Editor\n/admin/scripts/nodes\nNode connections + wiring\nIntermediate authoring]
    RAW_EDITOR[Raw Script Editor\n/admin/scripts/code\nDirect JSON/script editing\nAdvanced authoring]
    ADV_NODE[Advanced Node Editor\n/admin/scripts/advanced\nNode + live preview + simulation]
  end

  subgraph EditorGraph["Editor Graph (shared intermediate — not truth)"]
    GRAPH[EditorGraph\nNode positions, connections, viewport\nEditor-side representation only\nNot persisted as gameplay truth]
  end

  subgraph ScriptDef["Script Definition (persistent truth)"]
    SD[ScriptDefinition\nFirestore: script_definitions collection\nGameplay truth — what the script DOES\nNot editor metadata]
  end

  subgraph Validation["Validation + Compilation"]
    VAL[Validation\nSchema checks\nReference integrity\nBlock dependency checks]
    COMP[Compilation\nScript definition → composition blocks\nResolve block references\nType checking]
  end

  subgraph CompositionBlocks["Composition Blocks (registered block catalog)"]
    MOVE_BLK[movement_block\nForce vectors + orbit patterns]
    ROT_BLK[rotation_block\nSpin injection + counter-rotation]
    CONTACT_BLK[contact_block\nCollision handling + material effects]
    FORCE_BLK[force_block\nArbitrary force injection]
    WEIGHT_BLK[weight_block\nMass + inertia modifiers]
    CAM_BLK[camera_block\nShake + zoom + cut triggers]
    AUDIO_BLK[audio_block\nSFX + sting triggers]
    EFFECT_BLK[effect_block\nParticle + trail + flash triggers]
    ARENA_BLK[arena_block\nArena hazard interactions]
    HAZARD_BLK[hazard_block\nHazard activation + response]
    STATE_BLK[state_block\nMode changes + field overrides]
    MOD_BLK[modifier_block\nStat modifications + timers]
    PROJ_BLK[projectile_block\nSpawn + trajectory + impact]
    MODE_BLK[mode_block\nMode switch + threshold triggers]
    SPECIAL_BLK[special_move_block\nSpecial move step execution]
    AI_BLK[ai_block\nAI behavior injection]
    WORLD_BLK[world_state_block\nPersistent world state changes]
  end

  subgraph RuntimePackage["Runtime Package (game truth — server)"]
    RP[RuntimePackage\nCompiled + validated\nLoaded from Static Runtime Store\nnever fetched from DB in tick]
  end

  subgraph Engine["Engine (simulation)"]
    CORE[Core Simulation\nServer-authoritative\n60Hz fixed tick]
    CORE_MECH[Core Mechanics\nMechanicRegistry handlers]
    SCRIPT_EXEC[Script Execution\nComposition blocks execute\non top of core mechanics]
  end

  subgraph Firestore["Firestore Collections (Rule 7)"]
    FS_SCRIPT[script_definitions\nGameplay truth]
    FS_META[script_editor_metadata\nEditor layout — optional, non-gameplay]
    FS_BLOCKS[composition_blocks\nBlock type catalog + schemas]
  end

  SCRATCH --> GRAPH
  NODE_GRAPH --> GRAPH
  RAW_EDITOR --> GRAPH
  ADV_NODE --> GRAPH

  GRAPH --> SD
  SD --> VAL
  VAL --> COMP
  COMP --> CompositionBlocks
  CompositionBlocks --> RP
  RP --> CORE
  CORE --> CORE_MECH
  CORE_MECH --> SCRIPT_EXEC

  SD --> FS_SCRIPT
  GRAPH -.->|optional| FS_META
  CompositionBlocks --> FS_BLOCKS

  SCRATCH -.->|reads| FS_SCRIPT
  NODE_GRAPH -.->|reads| FS_SCRIPT
  RAW_EDITOR -.->|reads| FS_SCRIPT
  ADV_NODE -.->|reads| FS_SCRIPT
```

## Script Source of Truth Rules

| Item | Is Truth? | Where Stored | Notes |
|------|---------|-------------|-------|
| ScriptDefinition | ✅ YES — gameplay truth | `script_definitions` Firestore | What the script DOES |
| EditorGraph positions | ❌ NO — editor state | `script_editor_metadata` (optional) | Layout only |
| Visual block drag state | ❌ NO — ephemeral | Client memory only | Not persisted |
| Viewport scroll position | ❌ NO — ephemeral | Client memory only | Not persisted |
| Compiled RuntimePackage | ✅ YES — game truth | Static Runtime Store | Derived from ScriptDefinition |
| Composition block catalog | ✅ YES — authoring truth | `composition_blocks` Firestore | Block type registry |

## What Scripts May and May NOT Do

| May Do | May NOT Do |
|--------|-----------|
| Use composition block APIs | Replace physics simulation |
| Trigger presentation events (camera, audio, VFX) | Bypass deterministic core |
| Modify stat fields (via mechanic handlers) | Query databases at runtime |
| Compose mechanics into new sequences | Modify deterministic PRNG seed |
| Reference events (collision, tick, activation) | Inject runtime state from client |
| Use conditions (spin threshold, timer, health) | Override server-authoritative simulation |
| Chain multiple blocks sequentially | Access other players' private state |
| Query bey state (read only) | Execute arbitrary server code |

## Sandbox Requirement

Scripts execute in a sandboxed environment:
- Only composition block APIs exposed (not raw physics engine)
- No access to raw Firestore, network, or server filesystem
- No access to `Math.random()` — must use seeded PRNG API
- Execution time-limited per tick (prevent infinite loops)
- Side effects limited to: field modifications via whitelisted mechanic handlers + presentation event emission
