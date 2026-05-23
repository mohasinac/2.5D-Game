# Diagram 15 — Research Flow

Every research fact must be tagged and validated before being used. Research produces files, files produce diagrams, diagrams produce mappings, mappings produce gap analysis, gap analysis produces implementation plans.

```mermaid
flowchart TD
  subgraph Sources["Source Layer"]
    LINKA[linka/ local files\nStarting hints ONLY\nNot authoritative]
    INTERNET[Internet Sources\n2+ sources required per FACT claim\nTT Japanese > HMSDB > PlasticsDB\nWBO wiki > Fandom > images]
    CODE[Existing Codebase\nStage 0A audit — fully read\nPhysics / Schema / Rooms / Admin]
  end

  subgraph FactExtraction["Fact Extraction (per batch)"]
    RAW[Raw Facts\nExtracted from sources]
    TAGGED["Tagged Facts\nFACT — confirmed by 2+ sources\nINFERENCE — 1 source + logic\nSPECULATION — possible, unverified\nUNKNOWN — missing data"]
    VALIDATION[Validation\nMinimum 2 independent sources\nfor any FACT claim]
  end

  subgraph Tables["Research Tables (per batch)"]
    T_FACTS[Facts Table\nItem / Raw Fact / Evidence Type / Confidence]
    T_SOURCES[Source Audit Table\nSource / Type / Trust / Used For]
    T_COVER[Coverage Table\nCategory / Count Researched / Total Known / Missing]
    T_LINK[Link Audit Table\nExample Link / Expanded Into / Additional Sources / Notes]
    T_STAT[Existing Stat Mapping\nFinding / Existing Field / New Field Proposed?]
    T_ENGINE[Multi-Engine Support\nFeature / 2D / 2.5D / 3D / Missing Work]
    T_SHARED[Shared Mechanics\nMechanic ID / Used By / Derived From]
    T_PRESENT[Presentation Triggers\nTrigger Level / Mechanic / Layer / Type / Evidence]
    T_DISCOVER[New Discoveries\nDiscovery / Category / Sources / Existing Support / Missing]
    T_VISUAL[Visual Facts (parts)\nFeature / Observation / Source / Confidence]
    T_GEOMETRY[Part Geometry\nPart / Geometry / Contact / Thickness / Symmetry]
    T_BEHAVIOR[Part Behavior\nPart / Behavior / Trigger / Runtime Effect]
  end

  subgraph Files["Output Files (research/ directory)"]
    F_PHASE[Phase Files\nresearch/phase-NN-*.md\nOne per stage]
    F_BATCH[Batch Files\nresearch/batch-NNN.md\nOne per batch within stage]
    F_DIAG[Diagram Files\nresearch/diagram-*.md\n17 Mermaid diagrams — all in research/]
    F_TABLE[Table Files\nresearch/table-*.md\nStandalone tables]
    F_VALID[Validation Files\nresearch/validation-findings.md\nresearch/gap-analysis.md]
  end

  subgraph Mapping["Engine Mapping"]
    RPROF[Research Profile\nGeometry / Weight / Material\nContact Points / Gimmick]
    EPROF[Engine Profile\nattackPoints / defensePoints / staminaPoints\nmass / gimmickIds / systemId]
    MAP_TABLE[Engine Mapping Table\nResearch Finding → Existing Field]
  end

  subgraph GapAnalysis["Gap Analysis (Stage 16)"]
    GAP_MECH[Mechanic Gaps\nMaps to existing? / Registry handler needed?]
    GAP_SCHEMA[Schema Gaps\nNew field needed? / Evidence 2+ sources?]
    GAP_COLL[Collection Gaps\nNew Firestore collection needed? / Admin UI?]
    GAP_PRESENT[Presentation Gaps\nNew client code required?]
  end

  subgraph Implementation["Implementation Plan (Stage 19)"]
    IMPL_TASKS[Ordered Task List\nFile / Action / Depends On / Verification\nMust be completed before Stage 20]
  end

  subgraph Execution["Code Generation (Stage 20)"]
    CODE_GEN[Implement in order\nVerify after each step\ntsc + npm test after each change]
  end

  LINKA --> RAW
  INTERNET --> RAW
  CODE --> RAW

  RAW --> TAGGED
  TAGGED --> VALIDATION
  VALIDATION --> Tables

  Tables --> Files
  Files --> F_DIAG

  F_PHASE --> Mapping
  Mapping --> RPROF
  RPROF --> EPROF
  EPROF --> MAP_TABLE
  MAP_TABLE --> GapAnalysis

  GapAnalysis --> GAP_MECH
  GapAnalysis --> GAP_SCHEMA
  GapAnalysis --> GAP_COLL
  GapAnalysis --> GAP_PRESENT

  GAP_MECH --> Implementation
  GAP_SCHEMA --> Implementation
  GAP_COLL --> Implementation
  GAP_PRESENT --> Implementation

  Implementation --> IMPL_TASKS
  IMPL_TASKS --> Execution
  Execution --> CODE_GEN
```

## Fact Tag Definitions

| Tag | Meaning | Sources Required | Use In Engine? |
|-----|---------|-----------------|----------------|
| `FACT` | Confirmed by 2+ independent sources | 2 minimum | Yes — can use directly |
| `INFERENCE` | Derived from 1 source + logical reasoning | 1 + logic chain | Use with note, verify before impl |
| `SPECULATION` | Possible but unverified | 0 | Do NOT use in engine — mark UNKNOWN and research |
| `UNKNOWN` | Missing data — needs research | 0 | Blocked — must resolve before implementation |

## Batch Research Protocol (per batch — non-negotiable order)

```
1. Read local linka/ file → extract claims and URLs (starting hints only, NOT facts)
2. Expand outward — research whole system family, predecessors, successors, variants
3. Search internet with expanded queries (multiple query forms per item)
4. Retrieve minimum 2 independent sources
5. Check: can this map to an EXISTING stat/field? If yes → use existing (Rule 1)
6. Ask: is this a PATTERN shared across multiple items → reusable mechanic?
          Or truly unique → per-gimmick recipe?
7. Classify: FACT / INFERENCE / SPECULATION / UNKNOWN
8. Write to batch file BEFORE continuing to next item
9. Update coverage table and link audit table in batch file
10. After batch: write "Shared Mechanics Discovered" section
```

## Stage Execution Order (from Master Table)

| Stage | Status | Phase File |
|-------|--------|-----------|
| 0 — Engine Audit | ✅ COMPLETE | phase-00-engine-audit.md |
| 1 — Terminology | ☐ pending | phase-01-terminology.md |
| 2 — Special Moves | ☐ pending | phase-02-special-moves.md |
| 3 — Move→Bey Map | ☐ pending | phase-03-specialmove-bey-map.md |
| 4 — Combos | ☐ pending | phase-04-combos.md |
| 5 — Parts | ☐ pending | phase-05-parts.md |
| 6 — Mechanic Defs | ☐ pending | phase-06-part-systems.md |
| 7 — Bey Systems | ☐ pending | phase-07-bey-systems.md |
| 8 — Gimmick Configs | ☐ pending | phase-08-bey-gimmicks.md |
| 9 — Arena Systems | ☐ pending | phase-09-arena-systems.md |
| 10 — Arena Impl | ☐ pending | phase-10-arena-implementation.md |
| 11 — Architecture | ☐ pending | phase-11-shared-architecture.md |
| 12 — Seed Planning | ☐ pending | phase-12-seeds.md |
| 13 — Controls/Camera | ☐ pending | phase-13-controls-camera-audio.md |
| 14 — Game Modes | ☐ pending | phase-14-game-modes.md |
| 15 — Engine Mapping | ☐ pending | (cross-reference of phases 1–14) |
| 16 — Gap Analysis | ☐ pending | phase-16-gap-analysis.md |
| 17 — Runtime Arch | ☐ pending | (from phase-11 + phase-16) |
| 18 — Seed Planning | ☐ pending | (from phases 10 + 12) |
| 19 — Impl Plan | ☐ pending | phase-19-implementation-plan.md |
| 20 — Code Gen | ☐ pending | implementation in src/ + scripts/ |
