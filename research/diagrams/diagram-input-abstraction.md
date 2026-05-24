[← Extraction Pipeline](diagram-extraction-pipeline.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Mechanics →](diagram-mechanics.md)

---

# Diagram: Input Abstraction

> **Stage 0C Diagram 11 (updated Phase 22)** — Four input sources → PlayerInput → Authority Blend → Physics.

```mermaid
flowchart TD
  subgraph "Input Sources"
    KB["Keyboard 9-key\nWASD I J K L SPACE\nZ/X/C optional fallback"]
    MKB["Mouse + Keyboard\ncursor=direction\nLClick tap=attack\nLClick hold=charge\nRClick=defense\nMid/X1=dodge"]
    GP["Gamepad\nLeft stick=direction\nA/Cross=attack  B/Circle=dodge\nX/Square=defense  Y/Tri=jump\nRT hold=charge  RT rel=special\nLB=cycle J-K-L"]
    TCH["Touch\nVirtual d-pad=WASD\nSwipe-up=I (jump)\nHold=charge  Tap=special\nATK DEF DDG J K L buttons"]
    AI_IN["AI AIController\nPlayerAI output bitmask\nonly for AI opponents"]
  end

  subgraph "Encoding"
    BITMASK["uint16 bitmask bits 0-12\nplus direction x,y analog"]
    LEGACY["Record string boolean\nbackward compat"]
  end

  subgraph "Server Decode"
    NI["normalizeInput(data)\nbitmask OR legacy object to PlayerInput"]
  end

  subgraph "PlayerInput struct"
    PI["moveLeft/Right/Up/Down 0-3\nattack/defense/dodge/jump 4-7\nchargeHeld/specialTap 8-9\nattitudeAggressive/Defensive/Stamina 10-12\ndirection x,y optional"]
  end

  subgraph "Authority Blend"
    NAT["NaturalMotion.ts\ncomputeNaturalForce\norbit+decisions+death spiral\nstabilisation+rage burst+rail"]
    AUTH["computeAuthority\nspin/momentum penalties\nhold/SPACE/clash boosts\narena multiplier lerp 0.08"]
    BLEND["applyBlendedMovement\nfinalForce = player x alpha + natural x 1-alpha"]
    STEER["applySteeringForce\ncentripetal perpendicular\nmomentum-preserving turn\nspin cost for sharp turns"]
  end

  subgraph "Action Layer"
    ATK["attack burst / finisher"]
    DEF["type-aware defense\ndefense to guard\nattack to auto-dodge\nstamina to evasion\nbalanced to context"]
    DODGE["inertia-arc dodge\ncurves around threats\nor lateral if no threat"]
    JUMP["I key contextual\nspin less than 40pct stabilise\nspin 40pct or more jump attempt"]
    COMBO["appendKey to detectCombo"]
    CHARGE["power regen + damp\nwhile chargeHeld"]
    SPEC["activateSpecialMove\nif power >= threshold"]
  end

  KB --> BITMASK
  MKB --> BITMASK
  GP --> BITMASK
  TCH --> BITMASK
  AI_IN --> PI
  BITMASK --> NI
  LEGACY --> NI
  NI --> PI

  PI --> BLEND
  PI --> ATK
  PI --> DEF
  PI --> DODGE
  PI --> JUMP
  PI --> COMBO
  PI --> CHARGE
  PI --> SPEC

  NAT --> BLEND
  AUTH --> BLEND
  BLEND --> STEER
  STEER --> BODY["Matter.js applyForce"]
```

## Bitmask Encoding (bits 0–12)

| Bit | Key | Action |
|-----|-----|--------|
| 0 | moveLeft | A / ← |
| 1 | moveRight | D / → |
| 2 | moveUp | W / ↑ |
| 3 | moveDown | S / ↓ |
| 4 | attack | mouse LClick-tap / Z fallback |
| 5 | defense | mouse RClick / X fallback |
| 6 | dodge | mouse mid/X1 / C fallback |
| 7 | jump (upper-pull) | I key |
| 8 | chargeHeld | SPACE hold / mouse LClick-hold ≥200ms |
| 9 | specialTap | SPACE release / mouse LClick-release |
| 10 | attitudeAggressive | J |
| 11 | attitudeDefensive | K |
| 12 | attitudeStamina | L |
| — | direction {x,y} | cursor / stick analog (non-bitmask) |

## Control Lock Sources

While `Date.now() < controlLockedUntilMs`, movement/action bits are IGNORED:
- Source `"special"` — special move executing (existing)
- Source `"combo"` — combo executing (existing)
- Source `"playerStun"` — heavy collision stun 350ms (Phase 22 §8)
- Source `"aiStun"` — heavy collision AI stun 80ms (Phase 22 §8)
- Source `"aiSurrendered"` — player held >3s; AI defers entirely (Phase 22 §2.2)
- Source `"airborne"` — gripFactor=0 while airborne; no orbit force (Phase 22 §7)

## Authority Blend Layer

`α = computeAuthority()` blends player force with Control AI natural force every tick.
α = 0 → bey fully autonomous. α = 1 → player has full control. Default resting ~0.30.
Smoothed via `lerp(prev, target, 0.08)` — cannot instantly snap to new authority.
See Phase 22 §2 for full formula.

---

[← Extraction Pipeline](diagram-extraction-pipeline.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Mechanics →](diagram-mechanics.md)
