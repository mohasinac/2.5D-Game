[← Presentation Flow](diagram-presentation-flow.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Rotation Systems →](diagram-rotation-systems.md)

---

# Diagram: Research Flow

> **Stage 0C Diagram 15** — Rule 14: Research → Tagged Facts → Validation → Tables → Files → Diagrams → Mapping → Gap Analysis → Runtime Planning → Implementation → Testing.

```mermaid
flowchart TD
  subgraph "Source Material"
    SRC_CODE[server/ + client/ TypeScript<br/>authoritative source<br/>monorepo: server/ client/ shared/]
    SRC_SCHEMA[Colyseus @Schema files<br/>GameState, Beyblade, ArenaState<br/>MechanicInstance, DetachedBodySchema]
    SRC_ADMIN[Admin UI pages (48 total)<br/>form fields = data model surface]
    SRC_CONSTANTS[server/shared/constants/ + shared/types/<br/>hardcoded registries<br/>MechanicRegistry (31 handlers)]
    SRC_LINKA[research/ folder<br/>researcher notes — hints only]
  end

  subgraph "Fact Tagging"
    FT_FACT[FACT — confirmed in code]
    FT_INF[INFERENCE — deduced from code]
    FT_SPEC[SPECULATION — guessed from context]
    FT_UNK[UNKNOWN — no source found]
  end

  subgraph "Validation Gate"
    VG_READ[Read source file]
    VG_GREP[Grep for symbol]
    VG_CROSS[Cross-check across files]
    VG_PROMOTE[SPECULATION → INFERENCE → FACT<br/>on confirmation]
    VG_REJECT[SPECULATION → UNKNOWN<br/>on contradiction]
  end

  subgraph "Research Artifacts"
    RA_BATCH[batch-NNN-*.md<br/>field-by-field audit]
    RA_DISCOVERY[batch-002-discovery-table.md<br/>36 discoveries with tags]
    RA_DIAG[diagram-*.md<br/>17 Mermaid system diagrams]
    RA_PROGRESS[progress.md<br/>stage tracker with %]
  end

  subgraph "Analysis Phase"
    AP_TABLE[Capability tables<br/>feature × status matrix]
    AP_GAP[Gap analysis<br/>missing / broken / partial]
    AP_MAP[Source → Runtime mapping<br/>what field drives what behavior]
  end

  subgraph "Planning Phase"
    PP_PHASE[phases/phase-NN-*.md<br/>per-stage implementation plan]
    PP_SEED[Seed script requirements<br/>initial data for each collection]
    PP_SCHEMA[Schema extensions needed<br/>new Colyseus fields]
    PP_ADMIN[Admin UI rebuild spec<br/>form fields per collection]
  end

  subgraph "Implementation Phase"
    IP_SERVER[Server-side engine code<br/>server/physics/ MechanicRegistry<br/>PartSystemManager, GimmickExpander<br/>BehaviorRef dispatch — ✅ 31 handlers wired]
    IP_CLIENT[Client-side React admin UI<br/>client/src/pages/admin/ (48 pages)<br/>SearchableSelect / forms]
    IP_SEED[Seed scripts<br/>scripts/*.ts — 9 seed targets]
    IP_SHARED[shared/types/ + server/shared/<br/>type contracts, bitmask, comboSystem]
  end

  subgraph "Testing Phase"
    TP_UNIT[Unit: physics formulas<br/>stat delta application]
    TP_INT[Integration: room lifecycle<br/>onCreate → tick → end]
    TP_E2E[E2E: full match simulation<br/>AI vs AI determinism check]
  end

  SRC_CODE --> FT_FACT
  SRC_SCHEMA --> FT_FACT
  SRC_ADMIN --> FT_INF
  SRC_CONSTANTS --> FT_FACT
  SRC_LINKA --> FT_SPEC

  FT_FACT --> VG_CROSS
  FT_INF --> VG_READ
  FT_SPEC --> VG_GREP
  FT_UNK --> VG_READ

  VG_READ --> VG_PROMOTE
  VG_GREP --> VG_PROMOTE
  VG_CROSS --> VG_PROMOTE
  VG_READ --> VG_REJECT
  VG_GREP --> VG_REJECT

  VG_PROMOTE --> RA_BATCH
  VG_PROMOTE --> RA_DISCOVERY
  RA_BATCH --> RA_DIAG
  RA_DISCOVERY --> RA_DIAG

  RA_BATCH --> AP_TABLE
  RA_DISCOVERY --> AP_GAP
  RA_DIAG --> AP_MAP

  AP_TABLE --> PP_PHASE
  AP_GAP --> PP_PHASE
  AP_GAP --> PP_ADMIN
  AP_MAP --> PP_SCHEMA
  AP_MAP --> PP_SEED

  PP_PHASE --> IP_SERVER
  PP_PHASE --> IP_CLIENT
  PP_SEED --> IP_SEED
  PP_SCHEMA --> IP_SHARED
  PP_ADMIN --> IP_CLIENT

  IP_SERVER --> TP_UNIT
  IP_SERVER --> TP_INT
  IP_CLIENT --> TP_INT
  IP_SEED --> TP_INT
  TP_INT --> TP_E2E

  RA_PROGRESS --> PP_PHASE
```

## Verification Threshold

| Tag | Promotion Criteria |
|-----|------------------|
| `FACT` | Symbol found in source file, behavior confirmed in code |
| `INFERENCE` | Deduced from related code; no direct confirmation |
| `SPECULATION` | Assumed from naming or context; may be wrong |
| `UNKNOWN` | No source found; requires search or external input |

## Stage Gate Criteria

| Stage | Inputs Required | Output Artifact |
|-------|----------------|----------------|
| 0E | Admin pages list | batch-000 admin audit |
| 0A | Schema files + constants | batch-001 schema catalog |
| 0B | batch-000 + batch-001 | batch-002 discovery table |
| 0C | batch-001 + batch-002 | 17 diagram files |
| 0D | All batch files | batch-003 capability summary + phase-00 |
| 1–20 | phase-00 + batch files | Implementation + seed scripts |

---

[← Presentation Flow](diagram-presentation-flow.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Rotation Systems →](diagram-rotation-systems.md)
