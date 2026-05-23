# Diagram: Mode Flow — Trigger → Config → Stats → Mechanics → Runtime

> **Stage 0C Diagram 3** — Mode change pipeline (Rule 4 Mode Change Research Rule).

```mermaid
flowchart TD
  subgraph "Mode Trigger Sources"
    T_WEAR[Wear threshold<br/>mechanism durability]
    T_SPIN[Spin threshold<br/>e.g. < 40% spin]
    T_PLAYER[Player manual input<br/>MODE_SWITCH_COOLDOWN_MS]
    T_COMBAT[Combat event<br/>on_hit, on_burst_attempt]
    T_GIMMICK[Gimmick activation<br/>engine_gear, final_drive]
  end

  subgraph "Config Resolution"
    AC[activePartConfigs MapSchema<br/>slot → config name]
    CSW[configLastSwitchAt MapSchema<br/>slot → epoch ms]
    MODE_CD[MODE_SWITCH_COOLDOWN_MS check]
    RESOLVE[resolveTipStats()<br/>override: tipShape, material,<br/>gripFactor, aggressiveness, freeSpin]
  end

  subgraph "Stat Changes (written to Beyblade schema)"
    GRIP[gripFactor]
    AGG[aggressiveness]
    FRICTION[surfaceFriction]
    DECAY[spinDecayMod → spinDecayRate]
    SSR[spinStealResist]
    RECOIL[recoilFactor]
  end

  subgraph "Runtime Effect"
    MOVEMENT[Movement pattern change<br/>orbit vs. fixed vs. aggressive]
    CONTACT[Contact behavior change<br/>material multiplier switch]
    PHYSICS[Physics body change<br/>frictionAir, friction]
  end

  T_WEAR --> T_GIMMICK
  T_SPIN --> T_GIMMICK
  T_PLAYER --> MODE_CD
  T_COMBAT --> T_GIMMICK
  T_GIMMICK --> AC

  MODE_CD --> AC
  AC --> CSW
  AC --> RESOLVE
  RESOLVE --> GRIP
  RESOLVE --> AGG
  RESOLVE --> FRICTION
  RESOLVE --> DECAY
  RESOLVE --> SSR
  RESOLVE --> RECOIL

  GRIP --> MOVEMENT
  AGG --> MOVEMENT
  FRICTION --> PHYSICS
  RECOIL --> CONTACT
  DECAY --> MOVEMENT
```

## Mode Systems Identified in Engine

| System | Trigger | Physical Change | Stat Changes | Runtime Changes |
|--------|---------|----------------|-------------|----------------|
| Tip config switch (e.g. FS→HMC) | Player/combat | tipShape override | gripFactor, aggressiveness | orbit vs. fixed movement |
| Sub-part activation | Gimmick/contact | pockets populate | spinStealResist, contactDamageMult | CP geometry changes |
| Final Drive (MFB) | Spin < threshold | tip flips to rubber flat | gripFactor high, aggressiveness high | sudden aggressive orbit |
| Engine Gear | coreReserveRemaining > 0 | attack burst release | attackBuffTimer set | linear impulse on hit |
| Counter-rotation | sequence trigger | spinDirection reverses | clash multiplier flips | collision calculus changes |
| Split bey | special move | isSplit=true, splitBodyX/Y set | 2 independent physics bodies | dual Matter.js bodies |
