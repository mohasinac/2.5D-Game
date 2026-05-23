# Diagram 11 — Input Abstraction (Device-Agnostic Gameplay)

Input devices must not directly control gameplay. The existing `uint16` bitmask IS the Input Actions layer — it is already device-agnostic. The physical key bindings and bitmask encoding belong to the device adapter. An Intent Layer must be added between the bitmask and physics forces.

```mermaid
flowchart TD
  subgraph Devices["Input Device Layer (device-specific)"]
    KBD[Keyboard\nWASD + arrow keys + spacebar\nleft/right/up/down/attack/defense/dodge/jump\ncharge/special]
    GAMEPAD[Gamepad\nGamepad API left stick + buttons\ncurrent: existing mapping in useGameInput.ts]
    TOUCH[Touch / Mobile\nfuture — drag controls + on-screen buttons]
    MOUSE[Mouse\nfuture — aim assist + click actions]
  end

  subgraph ActionLayer["Input Actions Layer (uint16 bitmask — device-agnostic)"]
    BITMASK["uint16 bitmask (existing, preserved)\nbit 0 = moveLeft\nbit 1 = moveRight\nbit 2 = moveUp\nbit 3 = moveDown\nbit 4 = attack\nbit 5 = defense\nbit 6 = dodge\nbit 7 = jump\nbit 8 = chargeHeld\nbit 9 = specialTap"]
  end

  subgraph IntentLayer["Intent Layer (NEW — to be added Stage 13)"]
    INTENT_MOVE[Movement Intent\norbit-clockwise / burst-forward\nanchor-in-place / retreat]
    INTENT_ATTACK[Attack Intent\nsmash / upper / glancing / charge]
    INTENT_DEFEND[Defense/Dodge Intent\nblock / dodge / jump / emergency]
    INTENT_COMBO[Combo Window Check\nsliding-3 window evaluation\ncooldown + power check]
    INTENT_SPECIAL[Special Move Check\nspecialTap + power threshold\n150ms tap-vs-hold]
    INTENT_MODE[Mode Switch Intent\nmanual mode trigger]
    INTENT_CAM[Camera Intent\ncamera reset / zoom]
  end

  subgraph MovementSystem["Movement System (existing, preserved)"]
    MOVE_FORCE[Force Application\napplyMovementInput(bey, decoded)\nDirect vector forces from intent]
    ACTION_FORCE[Action Forces\napplyActionInput(bey, decoded)\nAttack/defense/dodge/jump]
  end

  subgraph MechanicDispatch["Mechanic Dispatch (existing + new MechanicRegistry)"]
    MECH_REG[MechanicRegistry\ndispatchTick() + dispatchCollision()\nengine-mode aware adapters]
    COMBO_SYS[Combo System\ndetectCombo() sliding window\nBehaviorRef execution]
    SPECIAL_SYS[Special Move System\nspecialTap → power check → execute]
  end

  KBD --> BITMASK
  GAMEPAD --> BITMASK
  TOUCH -.->|future| BITMASK
  MOUSE -.->|future| BITMASK

  BITMASK --> INTENT_MOVE
  BITMASK --> INTENT_ATTACK
  BITMASK --> INTENT_DEFEND
  BITMASK --> INTENT_COMBO
  BITMASK --> INTENT_SPECIAL
  BITMASK --> INTENT_MODE
  BITMASK --> INTENT_CAM

  INTENT_MOVE --> MOVE_FORCE
  INTENT_ATTACK --> ACTION_FORCE
  INTENT_DEFEND --> ACTION_FORCE
  INTENT_COMBO --> COMBO_SYS
  INTENT_SPECIAL --> SPECIAL_SYS
  INTENT_MODE --> MECH_REG

  MOVE_FORCE --> MECH_REG
  ACTION_FORCE --> MECH_REG
  COMBO_SYS --> MECH_REG
  SPECIAL_SYS --> MECH_REG
```

## Current State vs. Target State

| Layer | Current State | Target State (Stage 13) |
|-------|-------------|------------------------|
| Device Layer | Keyboard + Gamepad in `useGameInput.ts` | Same + Touch/Mobile future path |
| Input Actions (bitmask) | ✅ uint16 bitmask — existing, preserved | ✅ preserved as-is |
| Intent Layer | ❌ ABSENT — bitmask applied directly to forces | NEW: context-sensitive intent parsing |
| Combo Window | ⚠️ in room physics, not input layer | Move to Intent Layer |
| Special Move tap | ⚠️ 150ms threshold in room, not input layer | Move to Intent Layer |
| Movement System | ✅ applyMovementInput / applyActionInput | ✅ preserved, called from Intent Layer |
| Mechanic Dispatch | ❌ inline in rooms | NEW: MechanicRegistry dispatch |

## Unified Action Table (Rule 12)

| Intent | Keyboard | Gamepad | Touch (future) | Notes |
|--------|---------|---------|----------------|-------|
| Move / Aim | WASD / Arrow keys | Left stick | Drag pad | Analog on gamepad → magnitude |
| Attack | J / Btn-A | Button-A | Attack button | bit 4 |
| Defense | K / Btn-B | Button-B | Defense button | bit 5 |
| Dodge | L / Btn-X | Button-X | Dodge button | bit 6 |
| Jump | Space / Btn-Y | Button-Y | Jump button | bit 7 |
| Charge | Hold Space | Hold Btn-Y | Hold jump | bit 8 |
| Special | Tap Space | Tap Btn-Y | Tap special | bit 9 + 150ms threshold |
| Camera reset | C / Btn-LB | Left Bumper | Camera button | client-only |
| Zoom in | + key | Btn-RB | Pinch out | client-only |
| Zoom out | - key | Btn-LT | Pinch in | client-only |
| Pause | Esc / Btn-Start | Start | Pause button | client-only |

**Responsive Parity Rule**: drag-launch, button-launch, and trigger-launch must create equivalent gameplay. No platform advantage.

## What Intent Layer Must Do

```
Bitmask received → Intent Layer parses:
  1. Is this a combo window? Check sliding-3 sequence + cooldown + power
  2. Is this a special move tap? Check 150ms threshold + power level
  3. Is this a charge input? Check bit 8 duration for charge scale
  4. What movement intent? Translate bit 0-3 to intent string + magnitude
  5. What action intent? Translate bits 4-9 to intent type + context
  6. Camera intent? Separate path — does NOT affect physics
```

Intent strings (not device-specific):
```
movement: "orbit-cw", "orbit-ccw", "burst-north", "burst-south", "burst-east", "burst-west",
          "anchor", "retreat-north", etc.
attack:   "smash", "upper", "charge-smash", "glancing"
defense:  "block", "dodge-north", "dodge-south", "jump", "emergency-dodge"
special:  "special-tap", "special-charge", "special-release"
combo:    "combo-step-1", "combo-step-2", "combo-step-3", "combo-fire"
```
