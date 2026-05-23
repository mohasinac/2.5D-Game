# Research Index

**Project**: Beyblade Game — Part System & Engine Research
**Maintained by**: Claude Code sessions
**Last updated**: 2026-05-23 (session 19 — Source verification + parts list expansion: Gen1/HMS/MFB/Burst/BX parts cached to linka/; batch-008 written)

> This index covers all research documents in the `research/` folder.
> Every file links back here via its navigation footer.
> See [progress.md](progress.md) for current stage status and active batch tracking.

---

## Overview

| File | Purpose |
|------|---------|
| [progress.md](progress.md) | Master stage tracker — status, active batch, batches written |

---

## Batches

Raw research output. Each batch is a focused investigation into a specific topic.

| # | File | Topic | Status |
|---|------|-------|--------|
| 000 | [batch-000-admin-audit.md](batches/batch-000-admin-audit.md) | Admin page audit — field coverage, missing pages, gap analysis | complete |
| 001 | [batch-001-schema-catalog.md](batches/batch-001-schema-catalog.md) | Firestore schema catalog — all collections, field types | complete |
| 002 | [batch-002-discovery-table.md](batches/batch-002-discovery-table.md) | Discovery table — all engine features found in code | complete |
| 003 | [batch-003-engine-capability-summary.md](batches/batch-003-engine-capability-summary.md) | Engine capability summary — what the server can do | complete |
| 004 | [batch-004-mfb-parts-disambiguation.md](batches/batch-004-mfb-parts-disambiguation.md) | MFB parts disambiguation — B:D correction, rubber tip vs CP, full performance tip catalog, Zeus AR two-component free-spin (session 8) | complete |
| 005 | [batch-005-burst-parts-disambiguation.md](batches/batch-005-burst-parts-disambiguation.md) | Burst parts disambiguation — Driver catalog, Drift/BD/B:D disambiguation, rubber behavior | complete |
| 006 | [batch-006-shape-material-behavior-matrix.md](batches/batch-006-shape-material-behavior-matrix.md) | **Shape / Material / Behavior matrix** — tips and contact points, all combinations | complete |
| 006-x | [batch-006-x-parts-disambiguation.md](batches/batch-006-x-parts-disambiguation.md) | BX Bit catalog — Flat/Rush/Needle/Gear Needle/Rubber Accel/Trans Kick; Ratchet naming; Gear Bit rack-and-pinion mechanic | complete |
| 007 | [batch-007-extended-tips-casings-gimmicks-disambiguation.md](batches/batch-007-extended-tips-casings-gimmicks-disambiguation.md) | Extended tips (WF/XF/WB/WD/EWD/EDS/TB/BS/LF/R²F corrections), casings, mechanical gimmicks (EG clutches, Magnacore, auto-change), plastic gen disambiguation | complete |
| 008 | [batch-008-source-verification-parts-expansion.md](batches/batch-008-source-verification-parts-expansion.md) | **Source verification + parts expansion** — URL fetch log (39 URLs, visited flag tracked); Gen1/HMS/MFB/Burst/BX parts expanded; 173 Burst drivers confirmed; 26 BX ratchets; 47+ BX blades with weights; 167+ Burst layers by sub-system; HMS AR/RC/WD weights | complete |

---

## Phases

Compiled phase documents synthesizing research into actionable design decisions.

| Phase | File | Topic | Status |
|-------|------|-------|--------|
| 01 | [phase-01-terminology.md](phases/phase-01-terminology.md) | Terminology, definitions, concepts — type system, collision physics, attack mechanics | complete |
| 02 | [phase-02-special-moves.md](phases/phase-02-special-moves.md) | Special moves — mechanics, trigger conditions, behaviors; episode first-appearances (Appendix 2Z) | complete |
| 03 | [phase-03-specialmove-bey-map.md](phases/phase-03-specialmove-bey-map.md) | Special move → beyblade mapping | complete |
| 04 | [phase-04-combo-mapping.md](phases/phase-04-combo-mapping.md) | Combo / trigger mapping | complete |
| 05 | [phase-05-parts.md](phases/phase-05-parts.md) | 2.5D part system — part catalog, contact point mechanics, pockets, seed plan, gaps; Gear Part type (session 7) | complete |
| 06 | [phase-06-mechanics.md](phases/phase-06-mechanics.md) | Mechanic definitions | complete |
| 07a | [phase-07-gen1.md](phases/phase-07-gen1.md) | Generation 1 (Plastic) beyblade systems; narrative context Appendix N1 | complete |
| 07b | [phase-07-gen234.md](phases/phase-07-gen234.md) | Generations 2–4 (MFB, Burst, X) beyblade systems; narrative context Appendix N2 | complete |
| 08 | [phase-08-gimmicks.md](phases/phase-08-gimmicks.md) | Beyblade gimmick configs | complete |
| 09 | [phase-09-arenas.md](phases/phase-09-arenas.md) | Arena systems — shape, features, obstacles; episode stadium cross-ref Appendix 9Z | complete |
| 10 | [phase-10-arena-implementation.md](phases/phase-10-arena-implementation.md) | Arena implementations | complete |
| 11 | [phase-11-architecture.md](phases/phase-11-architecture.md) | Shared architecture | complete |
| 12 | [phase-12-seed-plan.md](phases/phase-12-seed-plan.md) | Seed planning | complete |
| 13 | [phase-13-controls.md](phases/phase-13-controls.md) | Controls / camera / audio | complete |
| 14 | [phase-14-game-modes.md](phases/phase-14-game-modes.md) | Game modes | complete |
| 16 | [phase-16-gap-analysis.md](phases/phase-16-gap-analysis.md) | Gap analysis | complete |
| 19 | [phase-19-impl-plan.md](phases/phase-19-impl-plan.md) | Implementation plan | complete |
| 20 | [phase-20-codegen.md](phases/phase-20-codegen.md) | Code generation | complete |
| 21 | [phase-21-unified-foundation.md](phases/phase-21-unified-foundation.md) | **Unified foundation — three-pillar architecture: BehaviorDef (mechanic_defs→gimmick_defs), GeometryDef (geometry_defs), StatDef (stat_defs). Universal basis for all entities.** | complete |

---

## Diagrams

Mermaid architecture and flow diagrams for the engine.

| File | Description |
|------|-------------|
| [diagram-arena-interaction.md](diagrams/diagram-arena-interaction.md) | Arena feature interaction flow (Rule 4) |
| [diagram-camera-flow.md](diagrams/diagram-camera-flow.md) | Camera system flow (Rule 12) |
| [diagram-data-flow.md](diagrams/diagram-data-flow.md) | Full data flow server → client (Rule 7) |
| [diagram-deterministic-flow.md](diagrams/diagram-deterministic-flow.md) | Deterministic replay flow (Rule 13) |
| [diagram-engine-capabilities.md](diagrams/diagram-engine-capabilities.md) | Engine capability map |
| [diagram-extraction-pipeline.md](diagrams/diagram-extraction-pipeline.md) | Research extraction pipeline (Rule 8) |
| [diagram-input-abstraction.md](diagrams/diagram-input-abstraction.md) | Input bitmask abstraction (Rule 10) |
| [diagram-mechanics.md](diagrams/diagram-mechanics.md) | Core mechanics diagram (Rule 1) |
| [diagram-mode-flow.md](diagrams/diagram-mode-flow.md) | Game mode state machine |
| [diagram-presentation-flow.md](diagrams/diagram-presentation-flow.md) | Presentation / renderer flow (Rule 6) |
| [diagram-research-flow.md](diagrams/diagram-research-flow.md) | Research workflow diagram (Rule 14) |
| [diagram-rotation-systems.md](diagrams/diagram-rotation-systems.md) | Rotation system mechanics (Rule 11) |
| [diagram-script-authoring-flow.md](diagrams/diagram-script-authoring-flow.md) | Script authoring flow (Rule 15) |
| [diagram-script-execution.md](diagrams/diagram-script-execution.md) | Script execution flow (Rule 15) |
| [diagram-sequence-launch.md](diagrams/diagram-sequence-launch.md) | Room launch sequence |
| [diagram-simulation-arch.md](diagrams/diagram-simulation-arch.md) | Simulation architecture (Rule 2) |
| [diagram-tilt-angle.md](diagrams/diagram-tilt-angle.md) | Tilt / wobble angle diagram |
| [diagram-tool-ecosystem.md](diagrams/diagram-tool-ecosystem.md) | Tool ecosystem map (Rule 9) |
