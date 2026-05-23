# Diagram: Input Abstraction

> **Stage 0C Diagram 11** — Rule 10: Input Devices → Intent → Movement → Mechanics.

```mermaid
flowchart TD
  subgraph "Input Devices"
    KB[Keyboard WASD + JKLI]
    GP[Gamepad (future)]
    AI_IN[AI AIController.computeInput()]
  end

  subgraph "Encoding"
    BITMASK[uint16 bitmask<br/>bits 0–9]
    LEGACY[Record<string,boolean><br/>backward compat]
  end

  subgraph "Server Decode (normalizeInput)"
    NI[normalizeInput(data)<br/>bitmask number OR legacy object → PlayerInput]
  end

  subgraph "PlayerInput struct"
    PI[moveLeft, moveRight, moveUp, moveDown<br/>jump, attack, defense, dodge<br/>chargeHeld, specialTap<br/>comboKeys?: string[]]
  end

  subgraph "Intent Layer"
    MOVE[Movement intent<br/>applyMovementInput()]
    ACTION[Action intent<br/>applyActionInput()]
    COMBO_IN[Combo key intent<br/>appendKey → detectCombo()]
    CHARGE[Charge held intent<br/>power regen / special charge]
    SPEC[Special tap intent<br/>activateSpecialMove()]
  end

  subgraph "Movement System"
    FORCE[computeForceMagnitude(bey, arena)]
    DIR[direction vector from WASD]
    BODY[Matter.Body.applyForce()]
  end

  subgraph "Mechanics"
    ATK_BUFF[attackBuffTimer (J single-press)]
    DEF_BUFF[defenseBuffTimer (K single-press)]
    DODGE_BUFF[dodgeBuffTimer (L single-press)]
    JUMP[isAirborne, airborneTicksRemaining]
    CTRL_LOCK[controlLockedUntilMs check]
  end

  KB --> BITMASK
  GP --> BITMASK
  AI_IN --> PI
  BITMASK --> NI
  LEGACY --> NI
  NI --> PI

  PI --> MOVE
  PI --> ACTION
  PI --> COMBO_IN
  PI --> CHARGE
  PI --> SPEC

  MOVE --> CTRL_LOCK
  CTRL_LOCK --> FORCE
  FORCE --> DIR
  DIR --> BODY

  ACTION --> ATK_BUFF
  ACTION --> DEF_BUFF
  ACTION --> DODGE_BUFF
  ACTION --> JUMP

  CHARGE --> CHARGE_IN[power += regenRate<br/>per tick while held]
  SPEC --> SPEC_IN[activateSpecialMove()<br/>if power ≥ powerCost]
  COMBO_IN --> COMBO_DET[detectCombo() → ComboResult]
```

## Bitmask Encoding

| Bit | Key | Action |
|-----|-----|--------|
| 0 | moveLeft | WASD left |
| 1 | moveRight | WASD right |
| 2 | moveUp | WASD up |
| 3 | moveDown | WASD down |
| 4 | attack | J key |
| 5 | defense | K key |
| 6 | dodge | L key |
| 7 | jump | I key |
| 8 | chargeHeld | Space hold |
| 9 | specialTap | Space tap |

## Control Lock Sources

While `Date.now() < controlLockedUntilMs`, movement/action bits are IGNORED:
- Source "special" — special move executing
- Source "combo" — combo executing (lockMs from ComboResult)
