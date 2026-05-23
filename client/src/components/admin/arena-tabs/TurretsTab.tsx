import { C } from "@/styles/theme";
import type { ArenaConfig, TurretConfig, TurretAttackType, TurretFirePattern } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import RotationBlockEditor from "./RotationBlockEditor";
import FeatureAnimationPanel from "./FeatureAnimationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useTurretAttackTypes } from "@/hooks/useTurretAttackTypes";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { useElementTypes } from "@/hooks/useElementTypes";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return Math.floor(Date.now() % 1000000); }

const DEFAULT: Omit<TurretConfig, "id"> = {
  x: 0, y: 0, radius: 25, health: 500,
  attackType: "periodic", attackDamage: 15, attackRange: 250, attackCooldown: 3,
  bulletSpeed: 200, bulletCount: 1,
};

const COMMON_FIELDS: { field: keyof TurretConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "x", label: "X (px from center)", min: -500, max: 500, step: 10 },
  { field: "y", label: "Y (px from center)", min: -500, max: 500, step: 10 },
  { field: "radius", label: "Turret Size (px)", min: 15, max: 50, step: 5 },
  { field: "health", label: "Health", min: 100, max: 2000, step: 100 },
  { field: "attackDamage", label: "Damage Per Hit", min: 5, max: 75, step: 5 },
  { field: "attackRange", label: "Attack Range (px)", min: 100, max: 500, step: 25 },
  { field: "attackCooldown", label: "Cooldown (s)", min: 0.5, max: 10, step: 0.5 },
];

const FIRE_PATTERNS: { value: TurretFirePattern; label: string }[] = [
  { value: "nearest",     label: "Nearest" },
  { value: "furthest",    label: "Furthest" },
  { value: "random",      label: "Random" },
  { value: "round_robin", label: "Round Robin" },
  { value: "lowest_spin", label: "Lowest Spin" },
  { value: "highest_spin",label: "Highest Spin" },
  { value: "center",      label: "Center" },
  { value: "sweep_cw",    label: "Sweep CW" },
];

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1, width = 80) {
  return (
    <input
      type="number" value={val ?? def} step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
    />
  );
}

function TypeSpecificParams({ turret, update }: { turret: TurretConfig; update: (field: keyof TurretConfig, value: any) => void }) {
  const t = turret.attackType;
  if (t === "periodic" || t === "random") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
          <span>Bullet Speed (px/s)</span>
          <span style={{ color: C.text, fontFamily: "monospace" }}>{turret.bulletSpeed ?? 200}</span>
        </div>
        <input type="range" min={50} max={800} step={25} value={turret.bulletSpeed ?? 200}
          onChange={e => update("bulletSpeed", +e.target.value)} style={{ width: "100%", accentColor: C.red }} />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
          <span>Bullets / Shot</span>
          <span style={{ color: C.text, fontFamily: "monospace" }}>{turret.bulletCount ?? 1}</span>
        </div>
        <input type="range" min={1} max={10} step={1} value={turret.bulletCount ?? 1}
          onChange={e => update("bulletCount", +e.target.value)} style={{ width: "100%", accentColor: C.red }} />
      </div>
    </div>
  );
  if (t === "beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Beam Duration (s)</label>
        {numInput(turret.beamDuration, 3, v => update("beamDuration", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Charge Period (s)</label>
        {numInput(turret.beamChargePeriod, 1.5, v => update("beamChargePeriod", v), 0.5)}
      </div>
    </div>
  );
  if (t === "aoe") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>AoE Radius (px)</label>
        {numInput(turret.aoeRadius, 80, v => update("aoeRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Damage Radius (px)</label>
        {numInput(turret.aoeDamageRadius, 50, v => update("aoeDamageRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "boomerang") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Return Time (s)</label>
      {numInput(turret.boomerangReturnTime, 3, v => update("boomerangReturnTime", v), 0.5)}
    </div>
  );
  if (t === "laser_sweep") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Sweep Arc (°)</label>
        {numInput(turret.laserSweepArcDeg, 180, v => update("laserSweepArcDeg", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Sweep Speed (°/s)</label>
        {numInput(turret.laserSweepSpeedDeg, 90, v => update("laserSweepSpeedDeg", v), 10)}
      </div>
    </div>
  );
  if (t === "sniper") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Charge Time (s)</label>
      {numInput(turret.sniperChargeSec, 2, v => update("sniperChargeSec", v), 0.5)}
    </div>
  );
  if (t === "shotgun") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Cone Half-Angle (°)</label>
      {numInput(turret.shotgunConeHalfDeg, 30, v => update("shotgunConeHalfDeg", v), 5)}
    </div>
  );
  if (t === "mine_layer") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Trigger Radius (px)</label>
        {numInput(turret.mineTriggerRadius, 50, v => update("mineTriggerRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Lifetime (s, 0=∞)</label>
        {numInput(turret.mineLifetimeSec, 10, v => update("mineLifetimeSec", v), 1)}
      </div>
    </div>
  );
  if (t === "gravity_cannon") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Force (N)</label>
        {numInput(turret.gravityCannonForce, 0.01, v => update("gravityCannonForce", v), 0.001)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Duration (s)</label>
        {numInput(turret.gravityCannonDurationSec, 4, v => update("gravityCannonDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "emp") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Disable Ticks</label>
      {numInput(turret.empDisableTicks, 120, v => update("empDisableTicks", Math.round(v)), 10)}
    </div>
  );
  if (t === "tracking_missile") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Tracking (°/s)</label>
      {numInput(turret.missileTrackingDeg, 180, v => update("missileTrackingDeg", v), 10)}
    </div>
  );
  if (t === "burst_fire") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Burst Count</label>
        {numInput(turret.burstCount, 4, v => update("burstCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Interval (s)</label>
        {numInput(turret.burstIntervalSec, 0.15, v => update("burstIntervalSec", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Reload (s)</label>
        {numInput(turret.burstReloadSec, 2, v => update("burstReloadSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "plasma_ring") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Expand Speed (px/s)</label>
        {numInput(turret.plasmaRingExpandSpeed, 150, v => update("plasmaRingExpandSpeed", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Max Radius (px)</label>
        {numInput(turret.plasmaRingMaxRadius, 200, v => update("plasmaRingMaxRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "tractor_beam") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Pull Force (N)</label>
      {numInput(turret.tractorBeamForce, 0.01, v => update("tractorBeamForce", v), 0.001)}
    </div>
  );

  // ── Phase ZP — Pokémon attacks ────────────────────────────────────────────
  if (t === "surf") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Wave Width (px)</label>
        {numInput(turret.surfWaveWidthPx, 120, v => update("surfWaveWidthPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Wave Speed (px/s)</label>
        {numInput(turret.surfWaveSpeedPx, 400, v => update("surfWaveSpeedPx", v), 20)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slow Mult</label>
        {numInput(turret.surfSlowMult, 0.6, v => update("surfSlowMult", v), 0.05)}
      </div>
    </div>
  );
  if (t === "hydro_pump") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Knockback</label>
        {numInput(turret.hydroPumpKnockback, 0.08, v => update("hydroPumpKnockback", v), 0.005)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Slow Duration (s)</label>
        {numInput(turret.hydroPumpSlowDurationSec, 2, v => update("hydroPumpSlowDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "fire_spin") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Ring Radius (px)</label>
        {numInput(turret.fireSpinRadiusPx, 60, v => update("fireSpinRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.fireSpinDurationSec, 3, v => update("fireSpinDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Spin Drain/s</label>
        {numInput(turret.fireSpinSpinDrainPerSec, 40, v => update("fireSpinSpinDrainPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "thunderbolt") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Stun Duration (s)</label>
      {numInput(turret.thunderboltStunSec, 1.5, v => update("thunderboltStunSec", v), 0.25)}
    </div>
  );
  if (t === "psychic") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Cycle (s)</label>
        {numInput(turret.psychicCycleIntervalSec, 2, v => update("psychicCycleIntervalSec", v), 0.25)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Force (N)</label>
        {numInput(turret.psychicForce, 0.006, v => update("psychicForce", v), 0.001)}
      </div>
    </div>
  );
  if (t === "gust") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Wind Angle (°)</label>
        {numInput(turret.gustAngleDeg, 0, v => update("gustAngleDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Force (N)</label>
        {numInput(turret.gustForce, 0.01, v => update("gustForce", v), 0.001)}
      </div>
    </div>
  );
  if (t === "shadow_ball") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Speed (px/s)</label>
        {numInput(turret.shadowBallSpeedPx, 180, v => update("shadowBallSpeedPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Fragments</label>
        {numInput(turret.shadowBallFragments, 3, v => update("shadowBallFragments", Math.round(v)), 1)}
      </div>
    </div>
  );
  if (t === "fire_blast") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Petals</label>
        {numInput(turret.fireBlastPetals, 5, v => update("fireBlastPetals", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Burn/s</label>
        {numInput(turret.fireBlastBurnPerSec, 8, v => update("fireBlastBurnPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Burn Dur (s)</label>
        {numInput(turret.fireBlastBurnDurationSec, 3, v => update("fireBlastBurnDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "sludge_bomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Zone Radius (px)</label>
        {numInput(turret.sludgeBombRadiusPx, 70, v => update("sludgeBombRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Lifetime (s)</label>
        {numInput(turret.sludgeBombLifetimeSec, 6, v => update("sludgeBombLifetimeSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slow Mult</label>
        {numInput(turret.sludgeBombSlowMult, 0.5, v => update("sludgeBombSlowMult", v), 0.05)}
      </div>
    </div>
  );
  if (t === "toxic_spikes") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Spike Count</label>
        {numInput(turret.toxicSpikeCount, 4, v => update("toxicSpikeCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Trigger (px)</label>
        {numInput(turret.toxicSpikeTriggerPx, 30, v => update("toxicSpikeTriggerPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Poison/s</label>
        {numInput(turret.toxicSpikePoisonPerSec, 6, v => update("toxicSpikePoisonPerSec", v), 1)}
      </div>
    </div>
  );
  if (t === "roar") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Scramble Duration (s)</label>
      {numInput(turret.roarScrambleSec, 2, v => update("roarScrambleSec", v), 0.25)}
    </div>
  );
  if (t === "multi_missile") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Missile Count</label>
        {numInput(turret.multiMissileCount, 3, v => update("multiMissileCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Spread Delay (s)</label>
        {numInput(turret.multiMissileSpreadDelaySec, 0.15, v => update("multiMissileSpreadDelaySec", v), 0.05)}
      </div>
    </div>
  );

  // ── Phase ZP-2 — extended attacks ────────────────────────────────────────
  if (t === "blizzard") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Cone Half (°)</label>
        {numInput(turret.blizzardConeHalfDeg, 50, v => update("blizzardConeHalfDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Freeze (s)</label>
        {numInput(turret.blizzardFreezeDurationSec, 2, v => update("blizzardFreezeDurationSec", v), 0.25)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Ice Patch (s)</label>
        {numInput(turret.blizzardIcePatchDurationSec, 4, v => update("blizzardIcePatchDurationSec", v), 0.5)}
      </div>
      <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.faint, gridColumn: "span 3" }}>
        <input type="checkbox" checked={turret.blizzardIcePatches ?? true} onChange={e => update("blizzardIcePatches", e.target.checked)} />
        Drop Ice Floor Patches
      </label>
    </div>
  );
  if (t === "earthquake") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Wave Count</label>
        {numInput(turret.earthquakeWaves, 3, v => update("earthquakeWaves", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Wave Interval (s)</label>
        {numInput(turret.earthquakeWaveIntervalSec, 0.3, v => update("earthquakeWaveIntervalSec", v), 0.05)}
      </div>
    </div>
  );
  if (t === "flamethrower") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Beam Width (px)</label>
        {numInput(turret.flamethrowerBeamWidthPx, 15, v => update("flamethrowerBeamWidthPx", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Burn/s</label>
        {numInput(turret.flamethrowerBurnPerSec, 8, v => update("flamethrowerBurnPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Burn Dur (s)</label>
        {numInput(turret.flamethrowerBurnDurationSec, 3, v => update("flamethrowerBurnDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "ice_beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Freeze (s)</label>
        {numInput(turret.iceBeamFreezeDurationSec, 2, v => update("iceBeamFreezeDurationSec", v), 0.25)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Spin Drain/s</label>
        {numInput(turret.iceBeamSpinDrainPerSec, 60, v => update("iceBeamSpinDrainPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "dragon_breath") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Cone Half (°)</label>
        {numInput(turret.dragonBreathConeHalfDeg, 25, v => update("dragonBreathConeHalfDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Stagger %</label>
        {numInput((turret.dragonBreathStaggerChance ?? 0.35) * 100, 35, v => update("dragonBreathStaggerChance", v / 100), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Stagger (s)</label>
        {numInput(turret.dragonBreathStaggerSec, 1, v => update("dragonBreathStaggerSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "confuse_ray") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Confusion (s)</label>
      {numInput(turret.confuseRayDurationSec, 3, v => update("confuseRayDurationSec", v), 0.25)}
    </div>
  );
  if (t === "leech_seed") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.leechSeedDurationSec, 6, v => update("leechSeedDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>HP Drain/s</label>
        {numInput(turret.leechSeedHealthPerSec, 5, v => update("leechSeedHealthPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Spin Drain/s</label>
        {numInput(turret.leechSeedSpinPerSec, 20, v => update("leechSeedSpinPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "vine_whip") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Grip (s)</label>
        {numInput(turret.vineWhipGripDurationSec, 2, v => update("vineWhipGripDurationSec", v), 0.25)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Pull Force (N)</label>
        {numInput(turret.vineWhipPullForce, 0.015, v => update("vineWhipPullForce", v), 0.001)}
      </div>
    </div>
  );
  if (t === "sticky_web") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Radius (px)</label>
        {numInput(turret.stickyWebRadiusPx, 60, v => update("stickyWebRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.stickyWebDurationSec, 8, v => update("stickyWebDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slow Mult</label>
        {numInput(turret.stickyWebSlowMult, 0.1, v => update("stickyWebSlowMult", v), 0.05)}
      </div>
    </div>
  );
  if (t === "hyper_beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Charge (s)</label>
        {numInput(turret.hyperBeamChargeSec, 4, v => update("hyperBeamChargeSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Recharge (s)</label>
        {numInput(turret.hyperBeamRechargeSec, 5, v => update("hyperBeamRechargeSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "gravity_field") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Force (N)</label>
        {numInput(turret.gravityFieldForce, 0.008, v => update("gravityFieldForce", v), 0.001)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Duration (s)</label>
        {numInput(turret.gravityFieldDurationSec, 4, v => update("gravityFieldDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "sand_tomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Radius (px)</label>
        {numInput(turret.sandTombRadiusPx, 70, v => update("sandTombRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.sandTombDurationSec, 3, v => update("sandTombDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pushback (N)</label>
        {numInput(turret.sandTombPushbackForce, 0.007, v => update("sandTombPushbackForce", v), 0.001)}
      </div>
    </div>
  );
  if (t === "zap_cannon") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Speed (px/s)</label>
        {numInput(turret.zapCannonSpeedPx, 100, v => update("zapCannonSpeedPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Paralysis (s)</label>
        {numInput(turret.zapCannonParalysisSec, 3, v => update("zapCannonParalysisSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "overheat") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
        {numInput(turret.overheatDamageMult, 3.0, v => update("overheatDamageMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>CD Mult</label>
        {numInput(turret.overheatCooldownMult, 3.0, v => update("overheatCooldownMult", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Penalty Shots</label>
        {numInput(turret.overheatPenaltyShots, 2, v => update("overheatPenaltyShots", Math.round(v)), 1)}
      </div>
    </div>
  );
  if (t === "chain_lightning") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Jumps</label>
        {numInput(turret.chainLightningJumps, 3, v => update("chainLightningJumps", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Dmg Decay</label>
        {numInput((turret.chainLightningDecay ?? 0.5) * 100, 50, v => update("chainLightningDecay", v / 100), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Stun (s)</label>
        {numInput(turret.chainLightningStunSec, 0.8, v => update("chainLightningStunSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "spore") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius (px)</label>
        {numInput(turret.sporeRadiusPx, 60, v => update("sporeRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.sporeDurationSec, 4, v => update("sporeDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Drain Mult</label>
        {numInput(turret.sporeSpinDrainMult, 2.0, v => update("sporeSpinDrainMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Sleep (s)</label>
        {numInput(turret.sporeSleepDurationSec, 2, v => update("sporeSleepDurationSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "dark_void") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Void Count</label>
        {numInput(turret.darkVoidCount, 3, v => update("darkVoidCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Speed (px/s)</label>
        {numInput(turret.darkVoidSpeedPx, 150, v => update("darkVoidSpeedPx", v), 10)}
      </div>
    </div>
  );
  if (t === "rock_slide") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Boulders</label>
        {numInput(turret.rockSlideBoulderCount, 5, v => update("rockSlideBoulderCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Scatter (px)</label>
        {numInput(turret.rockSlideScatterPx, 120, v => update("rockSlideScatterPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE (px)</label>
        {numInput(turret.rockSlideBoulderAoePx, 30, v => update("rockSlideBoulderAoePx", v), 5)}
      </div>
    </div>
  );
  if (t === "whirlpool") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Radius (px)</label>
        {numInput(turret.whirlpoolRadiusPx, 80, v => update("whirlpoolRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Orbit Force</label>
        {numInput(turret.whirlpoolOrbitForce, 0.006, v => update("whirlpoolOrbitForce", v), 0.001)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.whirlpoolDurationSec, 4, v => update("whirlpoolDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "stealth_rock") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Count</label>
        {numInput(turret.stealthRockCount, 6, v => update("stealthRockCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.stealthRockRadiusPx, 40, v => update("stealthRockRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Dmg/s</label>
        {numInput(turret.stealthRockDmgPerSec, 4, v => update("stealthRockDmgPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Lifetime (s)</label>
        {numInput(turret.stealthRockDurationSec, 10, v => update("stealthRockDurationSec", v), 1)}
      </div>
    </div>
  );
  // ── Round 3: Fire type ─────────────────────────────────────────────────
  if (t === "ember") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Burn Ticks</label>
        {numInput(turret.emberBurnTicks, 3, v => update("emberBurnTicks", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Tick Dmg</label>
        {numInput(turret.emberBurnTickDmg, 5, v => update("emberBurnTickDmg", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Interval (s)</label>
        {numInput(turret.emberBurnIntervalSec, 0.5, v => update("emberBurnIntervalSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "magma_storm") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Ring Radius (px)</label>
        {numInput(turret.magmaStormRingRadiusPx, 100, v => update("magmaStormRingRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Ring Width (px)</label>
        {numInput(turret.magmaStormRingWidthPx, 24, v => update("magmaStormRingWidthPx", v), 2)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Rotation (°/s)</label>
        {numInput(turret.magmaStormRotationSpeedDeg, 30, v => update("magmaStormRotationSpeedDeg", v), 5)}
      </div>
    </div>
  );
  if (t === "eruption") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Geyser AoE (px)</label>
        {numInput(turret.eruptionGeyserAoePx, 80, v => update("eruptionGeyserAoePx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Extra Dmg/Bey</label>
        {numInput(turret.eruptionExtraDmgPerBey, 10, v => update("eruptionExtraDmgPerBey", v), 1)}
      </div>
    </div>
  );
  // ── Water type ──────────────────────────────────────────────────────────
  if (t === "bubble_beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Bubbles</label>
        {numInput(turret.bubbleBeamCount, 3, v => update("bubbleBeamCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Slow Mult</label>
        {numInput(turret.bubbleBeamSlowMult, 0.65, v => update("bubbleBeamSlowMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slow Dur (s)</label>
        {numInput(turret.bubbleBeamSlowDurationSec, 1.5, v => update("bubbleBeamSlowDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "aqua_ring") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Duration (s)</label>
        {numInput(turret.aquaRingDurationSec, 4, v => update("aquaRingDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Spin Drain/s</label>
        {numInput(turret.aquaRingSpinDrainPerSec, 25, v => update("aquaRingSpinDrainPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "origin_pulse") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Wave Count</label>
        {numInput(turret.originPulseWaveCount, 2, v => update("originPulseWaveCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Push Force</label>
        {numInput(turret.originPulsePushForce, 0.06, v => update("originPulsePushForce", v), 0.005)}
      </div>
    </div>
  );
  // ── Ice type ────────────────────────────────────────────────────────────
  if (t === "icicle_spear") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Spears</label>
        {numInput(turret.icicleSpearCount, 5, v => update("icicleSpearCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Interval (ms)</label>
        {numInput(turret.icicleSpearIntervalMs, 80, v => update("icicleSpearIntervalMs", v), 10)}
      </div>
    </div>
  );
  if (t === "hail") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Chunks</label>
        {numInput(turret.hailChunkCount, 6, v => update("hailChunkCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Scatter (px)</label>
        {numInput(turret.hailScatterRadiusPx, 100, v => update("hailScatterRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>AoE (px)</label>
        {numInput(turret.hailChunkAoePx, 25, v => update("hailChunkAoePx", v), 5)}
      </div>
    </div>
  );
  if (t === "glacial_lance") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Width (px)</label>
        {numInput(turret.glacialLanceWidthPx, 60, v => update("glacialLanceWidthPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Freeze (s)</label>
        {numInput(turret.glacialLanceFreezeSec, 4, v => update("glacialLanceFreezeSec", v), 0.5)}
      </div>
    </div>
  );
  // ── Lightning type ──────────────────────────────────────────────────────
  if (t === "thunder_wave") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Speed Mult</label>
        {numInput(turret.thunderWaveSpeedMult, 0.5, v => update("thunderWaveSpeedMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Duration (s)</label>
        {numInput(turret.thunderWaveDurationSec, 3, v => update("thunderWaveDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "discharge") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.dischargeRadiusPx, 150, v => update("dischargeRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Spin Drain/s</label>
        {numInput(turret.dischargeSpinDrainPerSec, 30, v => update("dischargeSpinDrainPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "bolt_strike") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Bolts</label>
        {numInput(turret.boltStrikeBolts, 1, v => update("boltStrikeBolts", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Paralysis (s)</label>
        {numInput(turret.boltStrikeParalysisSec, 2, v => update("boltStrikeParalysisSec", v), 0.5)}
      </div>
    </div>
  );
  // ── Wind type ───────────────────────────────────────────────────────────
  if (t === "air_slash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Flinch Chance</label>
        {numInput(turret.airSlashFlinchChance, 0.3, v => update("airSlashFlinchChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Flinch (s)</label>
        {numInput(turret.airSlashFlinchSec, 0.5, v => update("airSlashFlinchSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "hurricane") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Speed (px/s)</label>
        {numInput(turret.hurricaneSpeedPx, 200, v => update("hurricaneSpeedPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Zone (s)</label>
        {numInput(turret.hurricaneSpinZoneSec, 2, v => update("hurricaneSpinZoneSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "aeroblast") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Beam Width (px)</label>
        {numInput(turret.aeroblastBeamWidthPx, 50, v => update("aeroblastBeamWidthPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Push Force</label>
        {numInput(turret.aeroblastPushForce, 0.08, v => update("aeroblastPushForce", v), 0.005)}
      </div>
    </div>
  );
  // ── Earth type ──────────────────────────────────────────────────────────
  if (t === "stone_edge") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Shards</label>
        {numInput(turret.stoneEdgeShards, 3, v => update("stoneEdgeShards", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Crit Chance</label>
        {numInput(turret.stoneEdgeCritChance, 0.5, v => update("stoneEdgeCritChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Crit Mult</label>
        {numInput(turret.stoneEdgeCritMult, 1.5, v => update("stoneEdgeCritMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "dig") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Delay (ms)</label>
        {numInput(turret.digDelayMs, 800, v => update("digDelayMs", v), 50)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Surface AoE (px)</label>
        {numInput(turret.digAoePx, 50, v => update("digAoePx", v), 5)}
      </div>
    </div>
  );
  if (t === "tectonic_rage") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Fissures</label>
        {numInput(turret.tectonicRageFissures, 4, v => update("tectonicRageFissures", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Width (px)</label>
        {numInput(turret.tectonicRageFissureWidthPx, 40, v => update("tectonicRageFissureWidthPx", v), 5)}
      </div>
    </div>
  );
  // ── Metal type ──────────────────────────────────────────────────────────
  if (t === "flash_cannon") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 100 }}>Beam Dur (s)</label>
      {numInput(turret.flashCannonBeamDurationSec, 0.3, v => update("flashCannonBeamDurationSec", v), 0.05)}
    </div>
  );
  if (t === "bullet_punch") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Hits</label>
        {numInput(turret.bulletPunchHits, 3, v => update("bulletPunchHits", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Interval (ms)</label>
        {numInput(turret.bulletPunchIntervalMs, 80, v => update("bulletPunchIntervalMs", v), 10)}
      </div>
    </div>
  );
  if (t === "steel_surge") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Speed (px/s)</label>
        {numInput(turret.steelSurgeExpandSpeedPx, 250, v => update("steelSurgeExpandSpeedPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg/Tick</label>
        {numInput(turret.steelSurgeDmgPerTick, 20, v => update("steelSurgeDmgPerTick", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.steelSurgeDurationSec, 3, v => update("steelSurgeDurationSec", v), 0.5)}
      </div>
    </div>
  );
  // ── Nature type ─────────────────────────────────────────────────────────
  if (t === "absorb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.absorbDurationSec, 4, v => update("absorbDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>HP Drain/s</label>
        {numInput(turret.absorbHpPerSec, 8, v => update("absorbHpPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Spin Drain/s</label>
        {numInput(turret.absorbSpinPerSec, 15, v => update("absorbSpinPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "petal_dance") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Petals</label>
        {numInput(turret.petalDancePetals, 20, v => update("petalDancePetals", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.petalDanceDurationSec, 3, v => update("petalDanceDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Scatter (px)</label>
        {numInput(turret.petalDanceScatterPx, 120, v => update("petalDanceScatterPx", v), 10)}
      </div>
    </div>
  );
  if (t === "bloom_doom") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Absorb (s)</label>
        {numInput(turret.bloomDoomAbsorbSec, 2, v => update("bloomDoomAbsorbSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Burst Force Mult</label>
        {numInput(turret.bloomDoomBurstForceMult, 0.00002, v => update("bloomDoomBurstForceMult", v), 0.000005)}
      </div>
    </div>
  );
  // ── Shadow type ─────────────────────────────────────────────────────────
  if (t === "night_shade") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>HP Fraction</label>
      {numInput(turret.nightShadeHpFraction, 0.25, v => update("nightShadeHpFraction", v), 0.05)}
    </div>
  );
  if (t === "shadow_force") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Speed (px/s)</label>
      {numInput(turret.shadowForceSpeedPx, 250, v => update("shadowForceSpeedPx", v), 10)}
    </div>
  );
  if (t === "phantom_force") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Duration (s)</label>
        {numInput(turret.phantomForceDurationSec, 3, v => update("phantomForceDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/s</label>
        {numInput(turret.phantomForceDmgPerSec, 15, v => update("phantomForceDmgPerSec", v), 1)}
      </div>
    </div>
  );
  // ── Light type ──────────────────────────────────────────────────────────
  if (t === "flash") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Blind (s)</label>
      {numInput(turret.flashBlindSec, 1.5, v => update("flashBlindSec", v), 0.1)}
    </div>
  );
  if (t === "solar_beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Charge (s)</label>
        {numInput(turret.solarBeamChargeSec, 1.0, v => update("solarBeamChargeSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
        {numInput(turret.solarBeamDamageMult, 2.5, v => update("solarBeamDamageMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "solar_flare") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Blind (s)</label>
        {numInput(turret.solarFlareBlindSec, 3, v => update("solarFlareBlindSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Flat Dmg</label>
        {numInput(turret.solarFlareDamage, 40, v => update("solarFlareDamage", v), 5)}
      </div>
    </div>
  );
  // ── Thunder/Storm type ──────────────────────────────────────────────────
  if (t === "spark") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Wet Dmg Mult</label>
      {numInput(turret.sparkWetDamageMult, 2.0, v => update("sparkWetDamageMult", v), 0.1)}
    </div>
  );
  if (t === "magnetic_field") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Duration (s)</label>
        {numInput(turret.magneticFieldDurationSec, 4, v => update("magneticFieldDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Orbit Force</label>
        {numInput(turret.magneticFieldOrbitForce, 0.012, v => update("magneticFieldOrbitForce", v), 0.001)}
      </div>
    </div>
  );
  if (t === "thunder_storm") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.thunderStormDurationSec, 8, v => update("thunderStormDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Strike Int (s)</label>
        {numInput(turret.thunderStormStrikeIntervalSec, 1.5, v => update("thunderStormStrikeIntervalSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Strike Dmg</label>
        {numInput(turret.thunderStormStrikeDmg, 15, v => update("thunderStormStrikeDmg", v), 1)}
      </div>
    </div>
  );
  // ── Void type ───────────────────────────────────────────────────────────
  if (t === "distortion") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Teleport Radius (cm)</label>
      {numInput(turret.distortionTeleportRadiusCm, 20, v => update("distortionTeleportRadiusCm", v), 2)}
    </div>
  );
  if (t === "black_hole_shot") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.blackHoleShotRadiusPx, 80, v => update("blackHoleShotRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Pull Force</label>
        {numInput(turret.blackHoleShotForce, 0.01, v => update("blackHoleShotForce", v), 0.001)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.blackHoleShotDurationSec, 3, v => update("blackHoleShotDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "spacial_rend") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.spacialRendDamage, 50, v => update("spacialRendDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Scatter Radius (cm)</label>
        {numInput(turret.spacialRendTeleportRadiusCm, 20, v => update("spacialRendTeleportRadiusCm", v), 2)}
      </div>
    </div>
  );
  // ── Fighting / Impact ───────────────────────────────────────────────────
  if (t === "cross_slash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Range (px)</label>
        {numInput(turret.crossSlashRangePx, 80, v => update("crossSlashRangePx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Bonus Mult</label>
        {numInput(turret.crossSlashBonusMult, 1.5, v => update("crossSlashBonusMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "impact_burst") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Knockback</label>
        {numInput(turret.impactBurstKnockback, 0.07, v => update("impactBurstKnockback", v), 0.005)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Confusion (s)</label>
        {numInput(turret.impactBurstConfusionSec, 1.5, v => update("impactBurstConfusionSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "armor_pierce") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Shatter Dur (s)</label>
      {numInput(turret.armorPierceShatterSec, 3, v => update("armorPierceShatterSec", v), 0.5)}
    </div>
  );
  if (t === "flurry_barrage") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Shots</label>
        {numInput(turret.flurryBarrageHits, 5, v => update("flurryBarrageHits", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Escalate Mult</label>
        {numInput(turret.flurryBarrageEscalateMult, 0.3, v => update("flurryBarrageEscalateMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Interval (ms)</label>
        {numInput(turret.flurryBarrageIntervalMs, 80, v => update("flurryBarrageIntervalMs", v), 10)}
      </div>
    </div>
  );
  if (t === "mach_shot") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 100 }}>Speed Mult</label>
      {numInput(turret.machShotSpeedMult, 4.0, v => update("machShotSpeedMult", v), 0.5)}
    </div>
  );
  if (t === "gravity_grip") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Hold (s)</label>
        {numInput(turret.gravityGripHoldSec, 2, v => update("gravityGripHoldSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Drain/s</label>
        {numInput(turret.gravityGripSpinDrainPerSec, 40, v => update("gravityGripSpinDrainPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "ram_charge") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Stun Chance</label>
        {numInput(turret.ramChargeStunChance, 0.3, v => update("ramChargeStunChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Stun (s)</label>
        {numInput(turret.ramChargeStunSec, 1.0, v => update("ramChargeStunSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "graviton_throw") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Push Force</label>
      {numInput(turret.gravitonThrowForce, 0.12, v => update("gravitonThrowForce", v), 0.01)}
    </div>
  );
  // ── Close-range ─────────────────────────────────────────────────────────
  if (t === "razor_spin") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.razorSpinRadiusPx, 70, v => update("razorSpinRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg/s</label>
        {numInput(turret.razorSpinDmgPerSec, 20, v => update("razorSpinDmgPerSec", v), 1)}
      </div>
    </div>
  );
  if (t === "point_blank") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Max Range (px)</label>
        {numInput(turret.pointBlankRangePx, 60, v => update("pointBlankRangePx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Dmg Mult</label>
        {numInput(turret.pointBlankDamageMult, 3.0, v => update("pointBlankDamageMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "static_field") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.staticFieldRadiusPx, 80, v => update("staticFieldRadiusPx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Shock Dmg</label>
        {numInput(turret.staticFieldShockDmg, 15, v => update("staticFieldShockDmg", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Cooldown (ms)</label>
        {numInput(turret.staticFieldCooldownMs, 1000, v => update("staticFieldCooldownMs", v), 100)}
      </div>
    </div>
  );
  if (t === "acid_spray") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Cone Half (°)</label>
        {numInput(turret.acidSprayConeHalfDeg, 25, v => update("acidSprayConeHalfDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Def Break Mult</label>
        {numInput(turret.acidSprayDefBreakMult, 1.5, v => update("acidSprayDefBreakMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Debuff (s)</label>
        {numInput(turret.acidSprayDebuffSec, 3, v => update("acidSprayDebuffSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "shockwave") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.shockwaveRadiusPx, 120, v => update("shockwaveRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Push Force</label>
        {numInput(turret.shockwavePushForce, 0.08, v => update("shockwavePushForce", v), 0.005)}
      </div>
    </div>
  );
  if (t === "spin_slash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Arms</label>
        {numInput(turret.spinSlashArms, 3, v => update("spinSlashArms", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Speed (°/s)</label>
        {numInput(turret.spinSlashSpeedDeg, 180, v => update("spinSlashSpeedDeg", v), 10)}
      </div>
    </div>
  );
  if (t === "guillotine") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Threshold</label>
        {numInput(turret.guillotineSpinThreshold, 0.25, v => update("guillotineSpinThreshold", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.guillotineDamage, 120, v => update("guillotineDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "anti_grav") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Airborne (s)</label>
        {numInput(turret.antiGravAirborneSec, 1.5, v => update("antiGravAirborneSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slam AoE (px)</label>
        {numInput(turret.antiGravSlamAoePx, 70, v => update("antiGravSlamAoePx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Slam Dmg</label>
        {numInput(turret.antiGravSlamDamage, 30, v => update("antiGravSlamDamage", v), 5)}
      </div>
    </div>
  );
  // ── Bug / Dark / Steel / Normal ─────────────────────────────────────────
  if (t === "drain_sting") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Steal Fraction</label>
        {numInput(turret.drainStingFraction, 0.1, v => update("drainStingFraction", v), 0.01)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Range (px)</label>
        {numInput(turret.drainStingRangePx, 70, v => update("drainStingRangePx", v), 5)}
      </div>
    </div>
  );
  if (t === "string_shot") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Speed Mult</label>
        {numInput(turret.stringShotSpeedMult, 0.3, v => update("stringShotSpeedMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Duration (s)</label>
        {numInput(turret.stringShotDurationSec, 3, v => update("stringShotDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "silver_wind") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.silverWindRadiusPx, 150, v => update("silverWindRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.silverWindDamage, 35, v => update("silverWindDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "sting_bolt") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Crit Chance</label>
        {numInput(turret.stingBoltCritChance, 0.3, v => update("stingBoltCritChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Crit Mult</label>
        {numInput(turret.stingBoltCritMult, 2.0, v => update("stingBoltCritMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "dark_pulse") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.darkPulseRadiusPx, 160, v => update("darkPulseRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Stagger (s)</label>
        {numInput(turret.darkPulseStaggerSec, 1.0, v => update("darkPulseStaggerSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Spin Drain %</label>
        {numInput(turret.darkPulseSpinDrainFraction, 0.25, v => update("darkPulseSpinDrainFraction", v), 0.05)}
      </div>
    </div>
  );
  if (t === "steel_ram") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Knockback</label>
        {numInput(turret.steelRamKnockback, 0.09, v => update("steelRamKnockback", v), 0.005)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Stun (s)</label>
        {numInput(turret.steelRamStunSec, 0.8, v => update("steelRamStunSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "metal_sound") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Def Break Mult</label>
        {numInput(turret.metalSoundDefBreakMult, 1.8, v => update("metalSoundDefBreakMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Duration (s)</label>
        {numInput(turret.metalSoundDurationSec, 4, v => update("metalSoundDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "magnet_bomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Pull (s)</label>
        {numInput(turret.magnetBombPullSec, 1.0, v => update("magnetBombPullSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Explosion (px)</label>
        {numInput(turret.magnetBombRadiusPx, 200, v => update("magnetBombRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Push Force</label>
        {numInput(turret.magnetBombPushForce, 0.18, v => update("magnetBombPushForce", v), 0.01)}
      </div>
    </div>
  );
  if (t === "drill_shot") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Crit Chance</label>
        {numInput(turret.drillShotCritChance, 0.25, v => update("drillShotCritChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pierce (px)</label>
        {numInput(turret.drillShotPiercePx, 80, v => update("drillShotPiercePx", v), 5)}
      </div>
    </div>
  );
  if (t === "hyper_voice") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.hyperVoiceDamage, 25, v => update("hyperVoiceDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Stagger (s)</label>
        {numInput(turret.hyperVoiceStaggerSec, 0.5, v => update("hyperVoiceStaggerSec", v), 0.1)}
      </div>
    </div>
  );
  // ── Stat-change ─────────────────────────────────────────────────────────
  if (t === "swords_dance") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Charges</label>
        {numInput(turret.swordsDanceCharges, 3, v => update("swordsDanceCharges", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg Mult</label>
        {numInput(turret.swordsDanceMult, 2.0, v => update("swordsDanceMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "tail_whip") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.tailWhipRadiusPx, 140, v => update("tailWhipRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Taken Mult</label>
        {numInput(turret.tailWhipDamageMult, 1.3, v => update("tailWhipDamageMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.tailWhipDurationSec, 4, v => update("tailWhipDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "growl") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.growlRadiusPx, 140, v => update("growlRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Drain Mult</label>
        {numInput(turret.growlSpinDrainMult, 1.5, v => update("growlSpinDrainMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.growlDurationSec, 4, v => update("growlDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "meditate") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Dmg Mult</label>
      {numInput(turret.meditateMult, 4.0, v => update("meditateMult", v), 0.5)}
    </div>
  );
  if (t === "nasty_plot") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Bypass Shots</label>
      {numInput(turret.nastyPlotCharges, 5, v => update("nastyPlotCharges", Math.round(v)), 1)}
    </div>
  );
  if (t === "agility") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Charges</label>
        {numInput(turret.agilityCharges, 6, v => update("agilityCharges", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Cooldown Mult</label>
        {numInput(turret.agilityCooldownMult, 0.5, v => update("agilityCooldownMult", v), 0.05)}
      </div>
    </div>
  );
  // ── Poison / Psychic / Dragon / Ghost / Fairy ───────────────────────────
  if (t === "poison_jab") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Stacks</label>
        {numInput(turret.poisonJabStacks, 1, v => update("poisonJabStacks", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>DoT/s/Stack</label>
        {numInput(turret.poisonJabDotPerSec, 5, v => update("poisonJabDotPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>DoT Dur (s)</label>
        {numInput(turret.poisonJabDotDurationSec, 4, v => update("poisonJabDotDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "future_sight") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Delay (s)</label>
        {numInput(turret.futureSightDelaySec, 3.0, v => update("futureSightDelaySec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Dmg Mult</label>
        {numInput(turret.futureSightDamageMult, 1.5, v => update("futureSightDamageMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "dragon_slash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>Hits</label>
        {numInput(turret.dragonSlashHits, 3, v => update("dragonSlashHits", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Stagger Chance</label>
        {numInput(turret.dragonSlashStaggerChance, 0.4, v => update("dragonSlashStaggerChance", v), 0.05)}
      </div>
    </div>
  );
  if (t === "outrage") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Rampage (s)</label>
        {numInput(turret.outrageRampageSec, 3.0, v => update("outrageRampageSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Recoil (s)</label>
        {numInput(turret.outrageRecoilSec, 2.0, v => update("outrageRecoilSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Hit Int (ms)</label>
        {numInput(turret.outrageHitIntervalMs, 300, v => update("outrageHitIntervalMs", v), 50)}
      </div>
    </div>
  );
  if (t === "hex") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Status Mult</label>
      {numInput(turret.hexStatusMult, 2.0, v => update("hexStatusMult", v), 0.1)}
    </div>
  );
  if (t === "ghost_strike") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 100 }}>Max Range (px)</label>
      {numInput(turret.ghostStrikeRangePx, 80, v => update("ghostStrikeRangePx", v), 5)}
    </div>
  );
  if (t === "moonblast") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Knockback</label>
      {numInput(turret.moonblastKnockback, 0.07, v => update("moonblastKnockback", v), 0.005)}
    </div>
  );
  if (t === "dazzling_gleam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.dazzlingGleamRadiusPx, 120, v => update("dazzlingGleamRadiusPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Lock (s)</label>
        {numInput(turret.dazzlingGleamLockSec, 0.8, v => update("dazzlingGleamLockSec", v), 0.1)}
      </div>
    </div>
  );
  // ── Weather / Environment ───────────────────────────────────────────────
  if (["sunny_day","rain_dance","sandstorm","hail_weather","misty_terrain","grassy_terrain","electric_terrain","psychic_terrain"].includes(t)) return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Duration (s)</label>
      {numInput(t.includes("terrain") ? turret.terrainDurationSec : turret.weatherDurationSec, 8,
        v => update(t.includes("terrain") ? "terrainDurationSec" : "weatherDurationSec", v), 1)}
    </div>
  );
  // ── Charge moves ────────────────────────────────────────────────────────
  if (t === "charge") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Dmg Mult</label>
        {numInput(turret.chargeDamageMult, 1.8, v => update("chargeDamageMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Paralysis Chance</label>
        {numInput(turret.chargeParalysisChance, 0.3, v => update("chargeParalysisChance", v), 0.05)}
      </div>
    </div>
  );
  if (t === "skull_bash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Charge (s)</label>
        {numInput(turret.chargeCannonChargeSec, 1.5, v => update("chargeCannonChargeSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Knockdown (s)</label>
        {numInput(turret.chargeCannonKnockdownSec, 1.5, v => update("chargeCannonKnockdownSec", v), 0.1)}
      </div>
    </div>
  );
  // ── Speed / Power ────────────────────────────────────────────────────────
  if (t === "flare_blitz") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Recoil Frac</label>
        {numInput(turret.flareBlitzRecoilFraction, 0.33, v => update("flareBlitzRecoilFraction", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Burn (s)</label>
        {numInput(turret.flareBlitzBurnSec, 3, v => update("flareBlitzBurnSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "thunder_ram") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Paralysis Chance</label>
        {numInput(turret.thunderRamParalysisChance, 0.2, v => update("thunderRamParalysisChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Recoil Frac</label>
        {numInput(turret.thunderRamRecoilFraction, 0.33, v => update("thunderRamRecoilFraction", v), 0.05)}
      </div>
    </div>
  );
  // ── Launcher / Airborne ─────────────────────────────────────────────────
  if (t === "uppercut") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Range (px)</label>
        {numInput(turret.uppercutRangePx, 80, v => update("uppercutRangePx", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Airborne (s)</label>
        {numInput(turret.uppercutAirborneSec, 1.2, v => update("uppercutAirborneSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "launch_spike") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Spike AoE (px)</label>
      {numInput(turret.launchSpikeAoePx, 60, v => update("launchSpikeAoePx", v), 5)}
    </div>
  );
  // ── Mortal Kombat inspired ──────────────────────────────────────────────
  if (t === "spear_chain") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Speed (px/s)</label>
        {numInput(turret.spearChainSpeedPx, 300, v => update("spearChainSpeedPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pull Force</label>
        {numInput(turret.spearChainPullForce, 0.12, v => update("spearChainPullForce", v), 0.01)}
      </div>
    </div>
  );
  if (t === "cryo_lance") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Shatter Mult</label>
      {numInput(turret.cryoLanceShatterMult, 2.5, v => update("cryoLanceShatterMult", v), 0.1)}
    </div>
  );
  if (t === "ring_blade") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Width (px)</label>
        {numInput(turret.ringBladeWidthPx, 20, v => update("ringBladeWidthPx", v), 2)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Passes</label>
        {numInput(turret.ringBladePasses, 2, v => update("ringBladePasses", Math.round(v)), 1)}
      </div>
    </div>
  );
  if (t === "portal_strike") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Burst Radius (px)</label>
      {numInput(turret.portalStrikeBurstRadiusPx, 100, v => update("portalStrikeBurstRadiusPx", v), 10)}
    </div>
  );
  if (t === "dragon_fireball") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Bounces</label>
        {numInput(turret.dragonFireballBounces, 3, v => update("dragonFireballBounces", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE (px)</label>
        {numInput(turret.dragonFireballAoePx, 40, v => update("dragonFireballAoePx", v), 5)}
      </div>
    </div>
  );
  if (t === "inferno_slam") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>AoE (px)</label>
      {numInput(turret.infernoSlamAoePx, 120, v => update("infernoSlamAoePx", v), 10)}
    </div>
  );
  // ── Defensive self-buff ─────────────────────────────────────────────────
  if (t === "harden") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Invuln Duration (s)</label>
      {numInput(turret.hardenDurationSec, 1.5, v => update("hardenDurationSec", v), 0.1)}
    </div>
  );
  if (t === "defense_curl") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Invuln (s)</label>
        {numInput(turret.defenseCurlDurationSec, 1.0, v => update("defenseCurlDurationSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Next Shot Mult</label>
        {numInput(turret.defenseCurlDamageMult, 1.5, v => update("defenseCurlDamageMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "withdraw") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Invuln Duration (s)</label>
      {numInput(turret.withdrawDurationSec, 2.0, v => update("withdrawDurationSec", v), 0.1)}
    </div>
  );
  // ── Size & Weight Scaling ─────────────────────────────────────────────────
  if (t === "enlarge") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Radius Scale</label>
        {numInput(turret.enlargeRadiusScale, 1.5, v => update("enlargeRadiusScale", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Collision Mult</label>
        {numInput(turret.enlargeCollisionMult, 1.8, v => update("enlargeCollisionMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Speed Mult</label>
        {numInput(turret.enlargeSpeedMult, 0.7, v => update("enlargeSpeedMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.enlargeDurationSec, 6, v => update("enlargeDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "shrink") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Radius Scale</label>
        {numInput(turret.shrinkRadiusScale, 0.5, v => update("shrinkRadiusScale", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Speed Mult</label>
        {numInput(turret.shrinkSpeedMult, 1.3, v => update("shrinkSpeedMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.shrinkDurationSec, 5, v => update("shrinkDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "mass_shift") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>KB Resist</label>
        {numInput(turret.massShiftKbResist, 0.6, v => update("massShiftKbResist", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Collision Mult</label>
        {numInput(turret.massShiftCollisionMult, 2.0, v => update("massShiftCollisionMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.massShiftDurationSec, 5, v => update("massShiftDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "density_crush") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE Radius</label>
        {numInput(turret.densityCrushRadius, 60, v => update("densityCrushRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.densityCrushDamage, 80, v => update("densityCrushDamage", v), 5)}
      </div>
    </div>
  );
  // ── Full Transformations ──────────────────────────────────────────────────
  if (t === "hollow_transform") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.hollowTransformDurationSec, 8, v => update("hollowTransformDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Cero Dmg</label>
        {numInput(turret.hollowTransformCeroDmg, 40, v => update("hollowTransformCeroDmg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pulse (ms)</label>
        {numInput(turret.hollowTransformPulseMs, 1200, v => update("hollowTransformPulseMs", v), 100)}
      </div>
    </div>
  );
  if (t === "kyuubi_mode") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.kyuubiModeDurationSec, 10, v => update("kyuubiModeDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Aura Radius</label>
        {numInput(turret.kyuubiModeAuraRadius, 100, v => update("kyuubiModeAuraRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DPS</label>
        {numInput(turret.kyuubiModeAuraDps, 12, v => update("kyuubiModeAuraDps", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Speed Mult</label>
        {numInput(turret.kyuubiModeSpeedMult, 1.4, v => update("kyuubiModeSpeedMult", v), 0.05)}
      </div>
    </div>
  );
  if (t === "bijuu_mode") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.bijuuModeDurationSec, 8, v => update("bijuuModeDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>AoE Radius</label>
        {numInput(turret.bijuuModeAoeRadius, 80, v => update("bijuuModeAoeRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE Dmg</label>
        {numInput(turret.bijuuModeAoeDmg, 20, v => update("bijuuModeAoeDmg", v), 5)}
      </div>
    </div>
  );
  if (t === "tailed_beast_bomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.tailedBeastBombRadius, 200, v => update("tailedBeastBombRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.tailedBeastBombDamage, 180, v => update("tailedBeastBombDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "curse_mark_2") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.curseMark2DurationSec, 7, v => update("curseMark2DurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Crit Mult</label>
        {numInput(turret.curseMark2CritMult, 2.5, v => update("curseMark2CritMult", v), 0.25)}
      </div>
    </div>
  );
  if (t === "six_paths_mode") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.sixPathsDurationSec, 10, v => update("sixPathsDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
        {numInput(turret.sixPathsDamageMult, 1.5, v => update("sixPathsDamageMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "ten_tails_jinchuriki") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.tenTailsRadius, 250, v => update("tenTailsRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Drain/s</label>
        {numInput(turret.tenTailsSpinDrain, 80, v => update("tenTailsSpinDrain", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.tenTailsDurationSec, 8, v => update("tenTailsDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "berserk_hollow") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.berserkHollowDurationSec, 6, v => update("berserkHollowDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Min Dmg</label>
        {numInput(turret.berserkHollowMinDmg, 15, v => update("berserkHollowMinDmg", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Max Dmg</label>
        {numInput(turret.berserkHollowMaxDmg, 80, v => update("berserkHollowMaxDmg", v), 5)}
      </div>
    </div>
  );
  // ── Deidara ───────────────────────────────────────────────────────────────
  if (t === "clay_spider") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Speed px/s</label>
        {numInput(turret.claySpiderSpeed, 150, v => update("claySpiderSpeed", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Expl Radius</label>
        {numInput(turret.claySpiderRadius, 50, v => update("claySpiderRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.claySpiderDamage, 35, v => update("claySpiderDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "clay_dragon") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Expl Radius</label>
        {numInput(turret.clayDragonRadius, 120, v => update("clayDragonRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.clayDragonDamage, 80, v => update("clayDragonDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "clay_bomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Expl Radius</label>
        {numInput(turret.clayBombRadius, 180, v => update("clayBombRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.clayBombDamage, 120, v => update("clayBombDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "clay_clones_c4") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DoT/s</label>
        {numInput(turret.clayC4DotPerSec, 25, v => update("clayC4DotPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.clayC4DurationSec, 5, v => update("clayC4DurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "katsu") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Dmg/Clay</label>
      {numInput(turret.katsuDmgPerClay, 60, v => update("katsuDmgPerClay", v), 5)}
    </div>
  );
  // ── Akatsuki ─────────────────────────────────────────────────────────────
  if (t === "shinra_tensei") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Force</label>
        {numInput(turret.shinraTenseiForce, 1200, v => update("shinraTenseiForce", v), 50)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.shinraTenseiRadius, 250, v => update("shinraTenseiRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "chibaku_tensei") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hold (s)</label>
        {numInput(turret.chibakuTenseiHoldSec, 3, v => update("chibakuTenseiHoldSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Crush Radius</label>
        {numInput(turret.chibakuTenseiCrushRadius, 60, v => update("chibakuTenseiCrushRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Crush Dmg</label>
        {numInput(turret.chibakuTenseiCrushDamage, 100, v => update("chibakuTenseiCrushDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "samehada_drain") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Drain/s</label>
        {numInput(turret.samedhadrainPerSec, 150, v => update("samedhadrainPerSec", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.samehaDrainRadius, 60, v => update("samehaDrainRadius", v), 5)}
      </div>
    </div>
  );
  if (t === "shark_bomb") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.sharkBombDamage, 65, v => update("sharkBombDamage", v), 5)}
    </div>
  );
  if (t === "earth_grudge_fear") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hold (s)</label>
        {numInput(turret.earthGrudgeHoldSec, 2.5, v => update("earthGrudgeHoldSec", v), 0.25)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DPS</label>
        {numInput(turret.earthGrudgeDps, 10, v => update("earthGrudgeDps", v), 1)}
      </div>
    </div>
  );
  if (t === "jashin_ritual") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Reflect Frac</label>
        {numInput(turret.jashinReflectFraction, 0.8, v => update("jashinReflectFraction", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Link (s)</label>
        {numInput(turret.jashinLinkDurationSec, 8, v => update("jashinLinkDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "paper_bomb_storm") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.paperBombRadius, 220, v => update("paperBombRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.paperBombDamage, 110, v => update("paperBombDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "kamui") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Absorb (s)</label>
      {numInput(turret.kamuiDurationSec, 3, v => update("kamuiDurationSec", v), 0.5)}
    </div>
  );
  if (t === "limbo_hengoku") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Hits</label>
        {numInput(turret.limboHits, 4, v => update("limboHits", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Hit</label>
        {numInput(turret.limboDmgPerHit, 20, v => update("limboDmgPerHit", v), 1)}
      </div>
    </div>
  );
  if (t === "wood_dragon") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Trap (s)</label>
        {numInput(turret.woodDragonTrapSec, 3, v => update("woodDragonTrapSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Drain/s</label>
        {numInput(turret.woodDragonSpinDrain, 120, v => update("woodDragonSpinDrain", v), 10)}
      </div>
    </div>
  );
  // ── Obito Uchiha moves ────────────────────────────────────────────────────
  if (t === "spiral_eye") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Pull Force</label>
        {numInput(turret.spiralEyePullForce, 400, v => update("spiralEyePullForce", v), 50)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Fling Force</label>
        {numInput(turret.spiralEyeFlingForce, 1600, v => update("spiralEyeFlingForce", v), 100)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.spiralEyeDurationSec, 2.5, v => update("spiralEyeDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "phantom_pass") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.phantomPassDurationSec, 2, v => update("phantomPassDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Burst Radius</label>
        {numInput(turret.phantomPassBurstRadius, 120, v => update("phantomPassBurstRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Burst Dmg</label>
        {numInput(turret.phantomPassBurstDamage, 60, v => update("phantomPassBurstDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "black_zetsu_bind") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Bind (s)</label>
        {numInput(turret.blackZetsuBindSec, 3, v => update("blackZetsuBindSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Drain DPS</label>
        {numInput(turret.blackZetsuDrainDps, 15, v => update("blackZetsuDrainDps", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Drain/s</label>
        {numInput(turret.blackZetsuSpinDrain, 80, v => update("blackZetsuSpinDrain", v), 10)}
      </div>
    </div>
  );
  if (t === "orange_mask_dash") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Range (px)</label>
      {numInput(turret.orangeMaskRange, 300, v => update("orangeMaskRange", v), 20)}
    </div>
  );
  if (t === "ten_tails_bijuudama") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.tenTailsBijuudamaRadius, 320, v => update("tenTailsBijuudamaRadius", v), 20)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.tenTailsBijuudamaDamage, 1800, v => update("tenTailsBijuudamaDamage", v), 50)}
      </div>
    </div>
  );
  if (t === "truth_seeker_orbs") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Orbs</label>
        {numInput(turret.truthSeekerOrbCount, 6, v => update("truthSeekerOrbCount", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DPS</label>
        {numInput(turret.truthSeekerOrbDps, 25, v => update("truthSeekerOrbDps", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Radius</label>
        {numInput(turret.truthSeekerOrbRadius, 40, v => update("truthSeekerOrbRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Duration</label>
        {numInput(turret.truthSeekerDurationSec, 5, v => update("truthSeekerDurationSec", v), 0.5)}
      </div>
    </div>
  );
  // ── Rinnegan / Pain path techniques ──────────────────────────────────────
  if (t === "bansho_tenin") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Pull Force</label>
        {numInput(turret.banshoTenInForce, 1000, v => update("banshoTenInForce", v), 50)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.banshoTenInRadius, 350, v => update("banshoTenInRadius", v), 25)}
      </div>
    </div>
  );
  if (t === "human_path") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>HP Fraction</label>
      {numInput(turret.humanPathHealthFraction, 0.5, v => update("humanPathHealthFraction", v), 0.05)}
    </div>
  );
  if (t === "preta_path") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Duration (s)</label>
      {numInput(turret.pretaPathDurationSec, 2.5, v => update("pretaPathDurationSec", v), 0.5)}
    </div>
  );
  if (t === "asura_path") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg/Missile</label>
        {numInput(turret.asuraPathMissileDamage, 40, v => update("asuraPathMissileDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Knockback</label>
        {numInput(turret.asuraPathMissileKnockback, 500, v => update("asuraPathMissileKnockback", v), 50)}
      </div>
    </div>
  );
  // ── Minato / Advanced Naruto ──────────────────────────────────────────────
  if (t === "flying_thunder_god") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.flyingThunderGodDamage, 80, v => update("flyingThunderGodDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Stun (s)</label>
        {numInput(turret.flyingThunderGodStunSec, 0.6, v => update("flyingThunderGodStunSec", v), 0.1)}
      </div>
    </div>
  );
  if (t === "rasenshuriken") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.rasenShurikenRadius, 80, v => update("rasenShurikenRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.rasenShurikenDamage, 140, v => update("rasenShurikenDamage", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Spin Drain</label>
        {numInput(turret.rasenShurikenSpinDrain, 300, v => update("rasenShurikenSpinDrain", v), 20)}
      </div>
    </div>
  );
  if (t === "odama_rasengan") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.odamaRasenganRadius, 100, v => update("odamaRasenganRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.odamaRasenganDamage, 160, v => update("odamaRasenganDamage", v), 10)}
      </div>
    </div>
  );
  // ── Eight Gates ───────────────────────────────────────────────────────────
  if (t === "eight_gates_release") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.eightGatesDurationSec, 4, v => update("eightGatesDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Speed ×</label>
        {numInput(turret.eightGatesSpeedMult, 2.0, v => update("eightGatesSpeedMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg ×</label>
        {numInput(turret.eightGatesDamageMult, 1.8, v => update("eightGatesDamageMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>HP Cost/s</label>
        {numInput(turret.eightGatesHealthCostPerSec, 20, v => update("eightGatesHealthCostPerSec", v), 5)}
      </div>
    </div>
  );
  if (t === "evening_elephant") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.eveningElephantDamage, 200, v => update("eveningElephantDamage", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.eveningElephantRadius, 60, v => update("eveningElephantRadius", v), 5)}
      </div>
    </div>
  );
  if (t === "night_guy") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.nightGuyDamage, 600, v => update("nightGuyDamage", v), 25)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Knockback</label>
        {numInput(turret.nightGuyKnockback, 3000, v => update("nightGuyKnockback", v), 100)}
      </div>
    </div>
  );
  // ── Legendary / Otsutsuki ─────────────────────────────────────────────────
  if (t === "tengai_shinsei") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.tengaiShinSeiRadius, 200, v => update("tengaiShinSeiRadius", v), 20)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.tengaiShinSeiDamage, 500, v => update("tengaiShinSeiDamage", v), 25)}
      </div>
    </div>
  );
  if (t === "kaguya_bones") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Bone Count</label>
        {numInput(turret.kaguyaBoneCount, 5, v => update("kaguyaBoneCount", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg/Spike</label>
        {numInput(turret.kaguyaBoneDamage, 60, v => update("kaguyaBoneDamage", v), 5)}
      </div>
    </div>
  );
  // ── Bleach: Aizen / Barragan / Grimmjow ──────────────────────────────────
  if (t === "kyoka_suigetsu") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Duration (s)</label>
      {numInput(turret.kyokaSuigetsuDurationSec, 3, v => update("kyokaSuigetsuDurationSec", v), 0.5)}
    </div>
  );
  if (t === "respira") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.respiraDurationSec, 4, v => update("respiraDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.respiraRadius, 150, v => update("respiraRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Spin Decay×</label>
        {numInput(turret.respiraSpinDecayMult, 5, v => update("respiraSpinDecayMult", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 50 }}>DPS</label>
        {numInput(turret.respiraDps, 10, v => update("respiraDps", v), 1)}
      </div>
    </div>
  );
  if (t === "desgarron") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg/Slash</label>
        {numInput(turret.desgarronDamage, 80, v => update("desgarronDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slashes</label>
        {numInput(turret.desgarronSlashes, 5, v => update("desgarronSlashes", v), 1)}
      </div>
    </div>
  );
  // ── Dragon Ball ───────────────────────────────────────────────────────────
  if (t === "kamehameha") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.kamehamehaDamage, 120, v => update("kamehamehaDamage", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Width (px)</label>
        {numInput(turret.kamehamehaWidth, 60, v => update("kamehamehaWidth", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Range (px)</label>
        {numInput(turret.kamehamehaRange, 400, v => update("kamehamehaRange", v), 20)}
      </div>
    </div>
  );
  if (t === "spirit_bomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Charge (s)</label>
        {numInput(turret.spiritBombChargeSec, 3, v => update("spiritBombChargeSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius (px)</label>
        {numInput(turret.spiritBombRadius, 180, v => update("spiritBombRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.spiritBombDamage, 400, v => update("spiritBombDamage", v), 25)}
      </div>
    </div>
  );
  if (t === "final_flash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.finalFlashDamage, 200, v => update("finalFlashDamage", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Knockback</label>
        {numInput(turret.finalFlashKnockback, 1500, v => update("finalFlashKnockback", v), 100)}
      </div>
    </div>
  );
  if (t === "death_beam") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.deathBeamDamage, 90, v => update("deathBeamDamage", v), 5)}
    </div>
  );
  // ── Street Fighter ────────────────────────────────────────────────────────
  if (t === "hadoken") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.hadokenDamage, 25, v => update("hadokenDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Speed px/s</label>
        {numInput(turret.hadokenSpeed, 400, v => update("hadokenSpeed", v), 20)}
      </div>
    </div>
  );
  if (t === "shoryuken") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Airborne (s)</label>
        {numInput(turret.shoryukenAirborneSec, 0.6, v => update("shoryukenAirborneSec", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Burn/s</label>
        {numInput(turret.shoryukenBurnPerSec, 10, v => update("shoryukenBurnPerSec", v), 1)}
      </div>
    </div>
  );
  if (t === "sonic_boom") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.sonicBoomDamage, 20, v => update("sonicBoomDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Speed px/s</label>
        {numInput(turret.sonicBoomSpeed, 700, v => update("sonicBoomSpeed", v), 50)}
      </div>
    </div>
  );
  if (t === "flash_kick") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE Radius</label>
        {numInput(turret.flashKickRadius, 80, v => update("flashKickRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.flashKickDamage, 30, v => update("flashKickDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "raging_demon") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Threshold</label>
        {numInput(turret.ragingDemonThreshold, 0.25, v => update("ragingDemonThreshold", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
        {numInput(turret.ragingDemonMult, 3.0, v => update("ragingDemonMult", v), 0.25)}
      </div>
    </div>
  );
  if (t === "spiral_drill") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hits</label>
        {numInput(turret.spiralDrillHits, 3, v => update("spiralDrillHits", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Hit</label>
        {numInput(turret.spiralDrillDmgPerHit, 12, v => update("spiralDrillDmgPerHit", v), 1)}
      </div>
    </div>
  );
  if (t === "hundred_kicks") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hits</label>
        {numInput(turret.hundredKicksHits, 10, v => update("hundredKicksHits", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Interval (ms)</label>
        {numInput(turret.hundredKicksIntervalMs, 40, v => update("hundredKicksIntervalMs", v), 5)}
      </div>
    </div>
  );
  if (t === "electric_body") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius</label>
        {numInput(turret.electricBodyRadius, 70, v => update("electricBodyRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DPS</label>
        {numInput(turret.electricBodyDpsPerSec, 8, v => update("electricBodyDpsPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.electricBodyDurationSec, 4, v => update("electricBodyDurationSec", v), 1)}
      </div>
    </div>
  );
  // ── Bleach Bankai ─────────────────────────────────────────────────────────
  if (t === "tensa_zangetsu") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.tensaZangetsuDamage, 80, v => update("tensaZangetsuDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Width (px)</label>
        {numInput(turret.tensaZangetsuWidth, 12, v => update("tensaZangetsuWidth", v), 1)}
      </div>
    </div>
  );
  if (t === "senbonzakura") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Shards</label>
        {numInput(turret.senbonzakuraShards, 30, v => update("senbonzakuraShards", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Dmg/Shard</label>
        {numInput(turret.senbonzakuraDmgPerShard, 5, v => update("senbonzakuraDmgPerShard", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius</label>
        {numInput(turret.senbonzakuraRadius, 200, v => update("senbonzakuraRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "daiguren_ice") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Freeze (s)</label>
        {numInput(turret.daiGurenFreezeSec, 3, v => update("daiGurenFreezeSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Expand px/s</label>
        {numInput(turret.daiGurenExpandSpeed, 120, v => update("daiGurenExpandSpeed", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Max Radius</label>
        {numInput(turret.daiGurenMaxRadius, 180, v => update("daiGurenMaxRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "absolute_zero") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Freeze (s)</label>
        {numInput(turret.absoluteZeroFreezeSec, 2, v => update("absoluteZeroFreezeSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Shatter Dmg</label>
        {numInput(turret.absoluteZeroShatterDmg, 120, v => update("absoluteZeroShatterDmg", v), 10)}
      </div>
    </div>
  );
  if (t === "muken_poison") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Init Radius</label>
        {numInput(turret.mukenPoisonInitRadius, 60, v => update("mukenPoisonInitRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Expand px/s</label>
        {numInput(turret.mukenPoisonExpandSpeed, 30, v => update("mukenPoisonExpandSpeed", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DoT/s</label>
        {numInput(turret.mukenPoisonDotPerSec, 12, v => update("mukenPoisonDotPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.muken_poisonDurationSec, 8, v => update("muken_poisonDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "zanka_incinerate") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DoT/s</label>
        {numInput(turret.zankaFieldDotPerSec, 15, v => update("zankaFieldDotPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Fire Boost</label>
        {numInput(turret.zankaFireBoostMult, 1.5, v => update("zankaFireBoostMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.zankaFieldDurationSec, 6, v => update("zankaFieldDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "suzumebachi") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>1st Hit Dmg</label>
        {numInput(turret.suzumebachiFirstHitDmg, 10, v => update("suzumebachiFirstHitDmg", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Kill Threshold</label>
        {numInput(turret.suzumebachiKillThreshold, 0.15, v => update("suzumebachiKillThreshold", v), 0.05)}
      </div>
    </div>
  );
  if (t === "hihio_construct") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Sweep Arc°</label>
        {numInput(turret.hihioSweepArcDeg, 90, v => update("hihioSweepArcDeg", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.hihioDamage, 40, v => update("hihioDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Trail ms</label>
        {numInput(turret.hihioTrailLingerMs, 800, v => update("hihioTrailLingerMs", v), 100)}
      </div>
    </div>
  );
  // ── Naruto ────────────────────────────────────────────────────────────────
  if (t === "rasengan") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius</label>
        {numInput(turret.rasenganRadius, 30, v => update("rasenganRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.rasenganDamage, 55, v => update("rasenganDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Knockback</label>
        {numInput(turret.rasenganKnockback, 700, v => update("rasenganKnockback", v), 50)}
      </div>
    </div>
  );
  if (t === "chidori") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Length (px)</label>
        {numInput(turret.chidoriLength, 200, v => update("chidoriLength", v), 20)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.chidoriDamage, 70, v => update("chidoriDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "shadow_clone") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Directions</label>
        {numInput(turret.shadowCloneDirections, 4, v => update("shadowCloneDirections", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Hit</label>
        {numInput(turret.shadowCloneDmgPerHit, 15, v => update("shadowCloneDmgPerHit", v), 1)}
      </div>
    </div>
  );
  if (t === "sand_burial") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.sandBurialRadius, 60, v => update("sandBurialRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hold (s)</label>
        {numInput(turret.sandBurialHoldSec, 2, v => update("sandBurialHoldSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.sandBurialDamage, 50, v => update("sandBurialDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "fireball_jutsu") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Cone Half°</label>
        {numInput(turret.fireballJutsuConeHalfDeg, 25, v => update("fireballJutsuConeHalfDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Range (px)</label>
        {numInput(turret.fireballJutsuRange, 250, v => update("fireballJutsuRange", v), 20)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.fireballJutsuDamage, 35, v => update("fireballJutsuDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "eight_trigrams") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Hits</label>
        {numInput(turret.eightTrigramsHits, 8, v => update("eightTrigramsHits", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Hit</label>
        {numInput(turret.eightTriggramsDmgPerHit, 8, v => update("eightTriggramsDmgPerHit", v), 1)}
      </div>
    </div>
  );
  if (t === "amaterasu") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DoT/s</label>
        {numInput(turret.amaterasuDotPerSec, 20, v => update("amaterasuDotPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.amaterasuDurationSec, 10, v => update("amaterasuDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius</label>
        {numInput(turret.amaterasuRadius, 40, v => update("amaterasuRadius", v), 5)}
      </div>
    </div>
  );
  if (t === "susanoo") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Shield (s)</label>
        {numInput(turret.susanooShieldSec, 5, v => update("susanooShieldSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Counter Dmg</label>
        {numInput(turret.susanooCounterDmg, 30, v => update("susanooCounterDmg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pulse (ms)</label>
        {numInput(turret.susanooPulseIntervalMs, 1500, v => update("susanooPulseIntervalMs", v), 100)}
      </div>
    </div>
  );
  // ── Ninja techniques ──────────────────────────────────────────────────────
  if (t === "substitution") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Invuln (s)</label>
      {numInput(turret.substitutionInvulSec, 1.5, v => update("substitutionInvulSec", v), 0.1)}
    </div>
  );
  if (t === "shadow_shuriken") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Diverge°</label>
        {numInput(turret.shadowShurikenAngleDeg, 15, v => update("shadowShurikenAngleDeg", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dmg Each</label>
        {numInput(turret.shadowShurikenDmg, 20, v => update("shadowShurikenDmg", v), 1)}
      </div>
    </div>
  );
  if (t === "kunai_barrage") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Count</label>
        {numInput(turret.kunaiBarrageCount, 5, v => update("kunaiBarrageCount", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Spread°</label>
        {numInput(turret.kunaiBarrageSpreadDeg, 60, v => update("kunaiBarrageSpreadDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Kunai</label>
        {numInput(turret.kunaiBarrageDmgPerHit, 12, v => update("kunaiBarrageDmgPerHit", v), 1)}
      </div>
    </div>
  );
  if (t === "smoke_bomb") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Gain×</label>
        {numInput(turret.smokeBombSpinGainMult, 0.5, v => update("smokeBombSpinGainMult", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.smokeBombDurationSec, 4, v => update("smokeBombDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "wire_trap") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pull Force</label>
        {numInput(turret.wireTrapPullForce, 500, v => update("wireTrapPullForce", v), 50)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hold (s)</label>
        {numInput(turret.wireTrapHoldSec, 2, v => update("wireTrapHoldSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "exploding_tag") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Trigger Radius</label>
        {numInput(turret.explodingTagRadius, 50, v => update("explodingTagRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.explodingTagDamage, 70, v => update("explodingTagDamage", v), 5)}
      </div>
    </div>
  );
  // ── Transformations ───────────────────────────────────────────────────────
  if (t === "ultra_form") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Boost Mult</label>
        {numInput(turret.ultraFormBoostMult, 1.5, v => update("ultraFormBoostMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.ultraFormDurationSec, 8, v => update("ultraFormDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "demon_form") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Crit Chance</label>
        {numInput(turret.demonFormCritChance, 1.0, v => update("demonFormCritChance", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.demonFormDurationSec, 6, v => update("demonFormDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "sage_mode") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Power Mult</label>
        {numInput(turret.sageModePowerMult, 1.8, v => update("sageModePowerMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Regen/s</label>
        {numInput(turret.sageModeRegenPerSec, 5, v => update("sageModeRegenPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.sageModeDurationSec, 10, v => update("sageModeDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "bankai_release") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Dmg Mult</label>
        {numInput(turret.bankaiDamageMult, 2.0, v => update("bankaiDamageMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pulse Radius</label>
        {numInput(turret.bankaiPulseRadius, 150, v => update("bankaiPulseRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.bankaiDurationSec, 8, v => update("bankaiDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "susanoo_full") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Shield Rad</label>
        {numInput(turret.susanooFullRadius, 120, v => update("susanooFullRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Counter Dmg</label>
        {numInput(turret.susanooFullCounterDmg, 50, v => update("susanooFullCounterDmg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.susanooFullDurationSec, 6, v => update("susanooFullDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "titan_shift") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pulse Radius</label>
        {numInput(turret.titanShiftPulseRadius, 160, v => update("titanShiftPulseRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Pulse Dmg</label>
        {numInput(turret.titanShiftPulseDmg, 25, v => update("titanShiftPulseDmg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pulse (ms)</label>
        {numInput(turret.titanShiftPulseIntervalMs, 1000, v => update("titanShiftPulseIntervalMs", v), 100)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.titanShiftDurationSec, 7, v => update("titanShiftDurationSec", v), 1)}
      </div>
    </div>
  );
  // ── Summons ───────────────────────────────────────────────────────────────
  if (t === "summon_toad") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slam Radius</label>
        {numInput(turret.summonToadRadius, 200, v => update("summonToadRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.summonToadDamage, 80, v => update("summonToadDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "summon_snake") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Hold (s)</label>
        {numInput(turret.summonSnakeHoldSec, 2, v => update("summonSnakeHoldSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Poison/s</label>
        {numInput(turret.summonSnakeDotPerSec, 15, v => update("summonSnakeDotPerSec", v), 1)}
      </div>
    </div>
  );
  if (t === "summon_slug") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Heal/s</label>
        {numInput(turret.summonSlugHealPerSec, 10, v => update("summonSlugHealPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.summonSlugDurationSec, 5, v => update("summonSlugDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "summon_kirin") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.summonKirinDamage, 150, v => update("summonKirinDamage", v), 10)}
    </div>
  );
  if (t === "summon_eagle") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Dive Radius</label>
        {numInput(turret.summonEagleRadius, 100, v => update("summonEagleRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.summonEagleDamage, 60, v => update("summonEagleDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "summon_clones") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Clones</label>
        {numInput(turret.summonClonesCount, 8, v => update("summonClonesCount", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Clone</label>
        {numInput(turret.summonClonesDmgPerHit, 12, v => update("summonClonesDmgPerHit", v), 1)}
      </div>
    </div>
  );
  // ── Tekken ────────────────────────────────────────────────────────────────
  if (t === "devil_beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.devilBeamDamage, 85, v => update("devilBeamDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Width (px)</label>
        {numInput(turret.devilBeamWidth, 10, v => update("devilBeamWidth", v), 1)}
      </div>
    </div>
  );
  if (t === "wind_god_fist") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.windGodFistDamage, 55, v => update("windGodFistDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Launch Force</label>
        {numInput(turret.windGodFistLaunchForce, 600, v => update("windGodFistLaunchForce", v), 50)}
      </div>
    </div>
  );
  if (t === "hellsweep") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.hellsweepDamage, 30, v => update("hellsweepDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Knockdown (s)</label>
        {numInput(turret.hellsweepKnockdownSec, 1.5, v => update("hellsweepKnockdownSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "laser_scraper") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Sweep Arc°</label>
        {numInput(turret.laserScraperArcDeg, 120, v => update("laserScraperArcDeg", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Degree</label>
        {numInput(turret.laserScraperDmgPerDeg, 0.3, v => update("laserScraperDmgPerDeg", v), 0.05)}
      </div>
    </div>
  );
  if (t === "rage_drive") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
      {numInput(turret.rageDriveMult, 2.5, v => update("rageDriveMult", v), 0.25)}
    </div>
  );
  if (t === "heat_smash") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.heatSmashDamage, 65, v => update("heatSmashDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Ignite (s)</label>
        {numInput(turret.heatSmashIgniteSec, 3, v => update("heatSmashIgniteSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "ki_charge_tek") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Boost Mult</label>
        {numInput(turret.kiChargeTekBoostMult, 1.8, v => update("kiChargeTekBoostMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Charges</label>
        {numInput(turret.kiChargeTekCharges, 1, v => update("kiChargeTekCharges", v), 1)}
      </div>
    </div>
  );
  if (t === "twin_pistols") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Shot</label>
        {numInput(turret.twinPistolsDmgPerShot, 18, v => update("twinPistolsDmgPerShot", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Converge px</label>
        {numInput(turret.twinPistolsConvergePx, 120, v => update("twinPistolsConvergePx", v), 10)}
      </div>
    </div>
  );
  // ── Time-based ────────────────────────────────────────────────────────────
  if (t === "time_warp") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Rewind (s)</label>
      {numInput(turret.timeWarpRewindSec, 2, v => update("timeWarpRewindSec", v), 0.5)}
    </div>
  );
  if (t === "time_stop") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Freeze (s)</label>
      {numInput(turret.timeStopDurationSec, 1.5, v => update("timeStopDurationSec", v), 0.25)}
    </div>
  );
  if (t === "time_loop") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Loop Delay (s)</label>
      {numInput(turret.timeLoopDelaySec, 2, v => update("timeLoopDelaySec", v), 0.5)}
    </div>
  );
  if (t === "time_acceleration") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Decay Mult</label>
        {numInput(turret.timeAccelDecayMult, 3, v => update("timeAccelDecayMult", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.timeAccelDurationSec, 5, v => update("timeAccelDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "age_drain") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Drain Frac/s</label>
      {numInput(turret.ageDrainFractionPerSec, 0.02, v => update("ageDrainFractionPerSec", v), 0.005)}
    </div>
  );
  // ── Extended Bankai ───────────────────────────────────────────────────────
  if (t === "gigantification") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Slam Radius</label>
        {numInput(turret.gigantificationRadius, 220, v => update("gigantificationRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.gigantificationDamage, 90, v => update("gigantificationDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "ryujin_jakka_full") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>DPS</label>
        {numInput(turret.ryujinJakkaFullDps, 20, v => update("ryujinJakkaFullDps", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.ryujinJakkaFullDurationSec, 8, v => update("ryujinJakkaFullDurationSec", v), 1)}
      </div>
    </div>
  );
  if (t === "minazuki_heal") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Heal/s</label>
        {numInput(turret.minazukiHealPerSec, 8, v => update("minazukiHealPerSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.minazukiRadius, 150, v => update("minazukiRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "katen_kyokotsu") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.katenDamage, 40, v => update("katenDamage", v), 5)}
    </div>
  );
  if (t === "senbonzakura_kageyoshi") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Waves</label>
        {numInput(turret.senbonzakuraKageyoshiWaves, 3, v => update("senbonzakuraKageyoshiWaves", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Wave</label>
        {numInput(turret.senbonzakuraKageyoshiDmgPerWave, 30, v => update("senbonzakuraKageyoshiDmgPerWave", v), 5)}
      </div>
    </div>
  );
  if (t === "daiguren_full") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.daiGurenFullRadius, 200, v => update("daiGurenFullRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.daiGurenFullDamage, 100, v => update("daiGurenFullDamage", v), 5)}
      </div>
    </div>
  );
  // ── Arrancar / Espada ─────────────────────────────────────────────────────
  if (t === "cero") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.ceroDamage, 60, v => update("ceroDamage", v), 5)}
    </div>
  );
  if (t === "gran_rey_cero") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.granReyCeroDamage, 80, v => update("granReyCeroDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE Radius</label>
        {numInput(turret.granReyCeroRadius, 120, v => update("granReyCeroRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "cero_oscuras") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.ceroOscurasDamage, 100, v => update("ceroOscurasDamage", v), 5)}
    </div>
  );
  if (t === "bala") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Hits</label>
        {numInput(turret.balaHits, 5, v => update("balaHits", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg/Hit</label>
        {numInput(turret.balaDmgPerHit, 12, v => update("balaDmgPerHit", v), 1)}
      </div>
    </div>
  );
  if (t === "hierro") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Dmg Reduction</label>
        {numInput(turret.hierroDamageReduction, 0.4, v => update("hierroDamageReduction", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.hierroDurationSec, 4, v => update("hierroDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "descorrer") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Pull Radius</label>
        {numInput(turret.descorrerRadius, 180, v => update("descorrerRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Pull Force</label>
        {numInput(turret.descorrerPullForce, 600, v => update("descorrerPullForce", v), 50)}
      </div>
    </div>
  );
  if (t === "lanza_del_relampago") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Explosion Rad</label>
        {numInput(turret.lanzaExplosionRadius, 150, v => update("lanzaExplosionRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.lanzaDamage, 120, v => update("lanzaDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "santa_teresa") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Wave Width</label>
        {numInput(turret.santaTeresaWidth, 80, v => update("santaTeresaWidth", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Knockback</label>
        {numInput(turret.santaTeresaKnockback, 900, v => update("santaTeresaKnockback", v), 50)}
      </div>
    </div>
  );
  if (t === "resurreccion") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.resurreccionDurationSec, 8, v => update("resurreccionDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
        {numInput(turret.resurreccionDamageMult, 1.8, v => update("resurreccionDamageMult", v), 0.1)}
      </div>
    </div>
  );
  // ── Gotei-13 / Kido ───────────────────────────────────────────────────────
  if (t === "reiatsu_burst") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius</label>
        {numInput(turret.reiatsuBurstRadius, 140, v => update("reiatsuBurstRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Spin Drain/s</label>
        {numInput(turret.reiatsuBurstSpinDrain, 100, v => update("reiatsuBurstSpinDrain", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.reiatsuBurstDurationSec, 3, v => update("reiatsuBurstDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "kido_hado_31") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.kidoHado31Damage, 35, v => update("kidoHado31Damage", v), 5)}
    </div>
  );
  if (t === "kido_hado_63") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.kidoHado63Damage, 60, v => update("kidoHado63Damage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Paralysis (s)</label>
        {numInput(turret.kidoHado63ParalysisSec, 1, v => update("kidoHado63ParalysisSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "kido_hado_90") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.kidoHado90Damage, 80, v => update("kidoHado90Damage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Trap (s)</label>
        {numInput(turret.kidoHado90TrapSec, 2.5, v => update("kidoHado90TrapSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "kido_bakudo_61") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Lock (s)</label>
      {numInput(turret.kidoBakudo61LockSec, 3, v => update("kidoBakudo61LockSec", v), 0.5)}
    </div>
  );
  if (t === "kido_bakudo_99") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Lock (s)</label>
      {numInput(turret.kidoBakudo99LockSec, 4, v => update("kidoBakudo99LockSec", v), 0.5)}
    </div>
  );
  if (t === "roar_of_seireitei") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Radius</label>
        {numInput(turret.roarRadius, 250, v => update("roarRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.roarDamage, 150, v => update("roarDamage", v), 10)}
      </div>
    </div>
  );
  if (["shunpo","sonido","pesquisa"].includes(t)) return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.faint }}>
      No additional params — effect is instant.
    </div>
  );
  // ── Visored / Hollowification ─────────────────────────────────────────────
  if (t === "mask_on") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.maskOnDurationSec, 8, v => update("maskOnDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Dmg Mult</label>
        {numInput(turret.maskOnDamageMult, 1.6, v => update("maskOnDamageMult", v), 0.1)}
      </div>
    </div>
  );
  if (t === "hollow_cero" || t === "inner_hollow") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.hollowCeroDamage, 75, v => update("hollowCeroDamage", v), 5)}
    </div>
  );
  if (t === "getsuga_tensho") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.getsugatenshoDamage, 65, v => update("getsugatenshoDamage", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>AoE Radius</label>
        {numInput(turret.getsugatenshoRadius, 180, v => update("getsugatenshoRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "mugetsu") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
      {numInput(turret.mugetsuDamage, 200, v => update("mugetsuDamage", v), 10)}
    </div>
  );
  if (t === "fullbring_boost") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.faint }}>
      Absorbs next hit to empower next attack. No params.
    </div>
  );
  // ── Itachi / Genjutsu ─────────────────────────────────────────────────────
  if (t === "tsukuyomi") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Inversion (s)</label>
      {numInput(turret.tsukuyomiDurationSec, 3, v => update("tsukuyomiDurationSec", v), 0.5)}
    </div>
  );
  if (t === "amaterasu_mark") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Mark (s)</label>
        {numInput(turret.amaterasuMarkDurationSec, 10, v => update("amaterasuMarkDurationSec", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Trigger Dmg</label>
        {numInput(turret.amaterasuMarkTriggerDmg, 50, v => update("amaterasuMarkTriggerDmg", v), 5)}
      </div>
    </div>
  );
  if (t === "izanagi") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Charges</label>
      {numInput(turret.izanagiCharges, 1, v => update("izanagiCharges", v), 1)}
    </div>
  );
  if (t === "izanami") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Loop (s)</label>
      {numInput(turret.izanamiLoopSec, 2, v => update("izanamiLoopSec", v), 0.5)}
    </div>
  );
  if (t === "sharingan_lock") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Mirror (s)</label>
      {numInput(turret.sharinganLockSec, 2.5, v => update("sharinganLockSec", v), 0.5)}
    </div>
  );
  if (t === "crow_genjutsu") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Chaos (s)</label>
      {numInput(turret.crowGenjutsuDurationSec, 2, v => update("crowGenjutsuDurationSec", v), 0.5)}
    </div>
  );
  if (t === "susanoo_itachi") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Seal (s)</label>
        {numInput(turret.susanooItachiSealSec, 5, v => update("susanooItachiSealSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Spin Drain/s</label>
        {numInput(turret.susanooItachiSpinDrainPerSec, 150, v => update("susanooItachiSpinDrainPerSec", v), 10)}
      </div>
    </div>
  );
  // ── Extended summons ──────────────────────────────────────────────────────
  if (t === "summon_ryuchi") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Hold (s)</label>
        {numInput(turret.summonRyuchiHoldSec, 2, v => update("summonRyuchiHoldSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Venom/s</label>
        {numInput(turret.summonRyuchiDotPerSec, 18, v => update("summonRyuchiDotPerSec", v), 1)}
      </div>
    </div>
  );
  if (t === "summon_myoboku") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Oil Damage</label>
        {numInput(turret.summonMyobokuOilDmg, 50, v => update("summonMyobokuOilDmg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Boost (s)</label>
        {numInput(turret.summonMyobokuBoostSec, 5, v => update("summonMyobokuBoostSec", v), 1)}
      </div>
    </div>
  );
  if (t === "summon_garuda") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Wind Radius</label>
        {numInput(turret.summonGarudaRadius, 160, v => update("summonGarudaRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.summonGarudaDamage, 55, v => update("summonGarudaDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "summon_enma") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Reach (px)</label>
        {numInput(turret.summonEnmaReach, 300, v => update("summonEnmaReach", v), 20)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.summonEnmaDamage, 45, v => update("summonEnmaDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "summon_gamaken") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Spin Arc°</label>
        {numInput(turret.summonGamakenArcDeg, 360, v => update("summonGamakenArcDeg", v), 30)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Damage</label>
        {numInput(turret.summonGamakenDamage, 70, v => update("summonGamakenDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "summon_slugs_army") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.faint }}>
      Swarming DoT field. No additional params.
    </div>
  );
  if (t === "edo_tensei") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>HP Fraction</label>
      {numInput(turret.edoTenseiHpFraction, 0.25, v => update("edoTenseiHpFraction", v), 0.05)}
    </div>
  );
  if (t === "cosmic_power") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Atk Reduction</label>
        {numInput(turret.cosmicPowerAtkReduction, 0.75, v => update("cosmicPowerAtkReduction", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Range Boost</label>
        {numInput(turret.cosmicPowerRangeBoost, 1.5, v => update("cosmicPowerRangeBoost", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.cosmicPowerDurationSec, 5, v => update("cosmicPowerDurationSec", v), 1)}
      </div>
    </div>
  );

  // ── Illusion / Deception moves ────────────────────────────────────────────
  if (t === "mirror_world") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Offset (px)</label>
        {numInput(turret.mirrorWorldOffsetPx, 180, v => update("mirrorWorldOffsetPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.mirrorWorldDurationSec, 3.5, v => update("mirrorWorldDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "perfect_mirage") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Invisible (s)</label>
      {numInput(turret.perfectMirageDurationSec, 2.5, v => update("perfectMirageDurationSec", v), 0.5)}
    </div>
  );
  if (t === "broken_reality") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Scatter Radius</label>
      {numInput(turret.brokenRealityScatterPx, 350, v => update("brokenRealityScatterPx", v), 20)}
    </div>
  );
  if (t === "phantasmal_shift") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Dmg Reduction</label>
        {numInput(turret.phantasmalShiftDamageReduction, 0.5, v => update("phantasmalShiftDamageReduction", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.phantasmalShiftDurationSec, 3, v => update("phantasmalShiftDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "echo_image") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Offset (px)</label>
        {numInput(turret.echoImageOffsetPx, 120, v => update("echoImageOffsetPx", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Decoy HP</label>
        {numInput(turret.echoImageHitpoints, 1, v => update("echoImageHitpoints", v), 1)}
      </div>
    </div>
  );
  if (t === "genjutsu_veil") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Drift/tick (px)</label>
        {numInput(turret.genjutsuVeilDriftPx, 10, v => update("genjutsuVeilDriftPx", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.genjutsuVeilDurationSec, 4, v => update("genjutsuVeilDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "false_flag") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Swap Duration</label>
      {numInput(turret.falseFlagDurationSec, 5, v => update("falseFlagDurationSec", v), 0.5)}
    </div>
  );
  if (t === "mind_fracture") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Duration (s)</label>
      {numInput(turret.mindFractureDurationSec, 3, v => update("mindFractureDurationSec", v), 0.5)}
    </div>
  );

  // ── Contra bey power-ups ─────────────────────────────────────────────────
  if (t === "spread_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Vectors</label>
        {numInput(turret.spreadBeyCount, 5, v => update("spreadBeyCount", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Arc Half°</label>
        {numInput(turret.spreadBeyArcHalfDeg, 30, v => update("spreadBeyArcHalfDeg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Dmg/vector</label>
        {numInput(turret.spreadBeyDamage, 25, v => update("spreadBeyDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "railbey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Speed×</label>
        {numInput(turret.railbeySpeedMult, 4.0, v => update("railbeySpeedMult", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.railbeyDurationSec, 1.5, v => update("railbeyDurationSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Pierce Dmg</label>
        {numInput(turret.railbeyPierceDmg, 40, v => update("railbeyPierceDmg", v), 5)}
      </div>
    </div>
  );
  if (t === "minigun_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Pulses</label>
        {numInput(turret.minigunBeyPulses, 12, v => update("minigunBeyPulses", v), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Interval (ms)</label>
        {numInput(turret.minigunBeyIntervalMs, 60, v => update("minigunBeyIntervalMs", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Dmg/pulse</label>
        {numInput(turret.minigunBeyDmgPerPulse, 8, v => update("minigunBeyDmgPerPulse", v), 1)}
      </div>
    </div>
  );
  if (t === "heat_seeker_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Ram Speed</label>
        {numInput(turret.heatSeekerBeySpeed, 600, v => update("heatSeekerBeySpeed", v), 50)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Impact Dmg</label>
        {numInput(turret.heatSeekerBeyDamage, 70, v => update("heatSeekerBeyDamage", v), 5)}
      </div>
    </div>
  );
  if (t === "bomb_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Fuse (s)</label>
        {numInput(turret.bombBeyFuseSec, 4, v => update("bombBeyFuseSec", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Radius (px)</label>
        {numInput(turret.bombBeyRadius, 160, v => update("bombBeyRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Damage</label>
        {numInput(turret.bombBeyDamage, 200, v => update("bombBeyDamage", v), 10)}
      </div>
    </div>
  );
  if (t === "shield_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Retaliation Dmg</label>
        {numInput(turret.shieldBeyRetaliationDmg, 80, v => update("shieldBeyRetaliationDmg", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Burst Radius</label>
        {numInput(turret.shieldBeyBurstRadius, 120, v => update("shieldBeyBurstRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "turbo_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Speed×</label>
        {numInput(turret.turboBeySpeedMult, 1.8, v => update("turboBeySpeedMult", v), 0.1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Spin Boost</label>
        {numInput(turret.turboBeySpinBoost, 0.3, v => update("turboBeySpinBoost", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Duration (s)</label>
        {numInput(turret.turboBeyDurationSec, 5, v => update("turboBeyDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "cannon_bey") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Launch Force</label>
        {numInput(turret.cannonBeyForce, 3000, v => update("cannonBeyForce", v), 100)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Impact Dmg</label>
        {numInput(turret.cannonBeyDamage, 120, v => update("cannonBeyDamage", v), 10)}
      </div>
    </div>
  );

  return null;
}

export default function TurretsTab({ config, onChange }: Props) {
  const items = config.turrets ?? [];
  const { types: attackTypes, loading: typesLoading } = useTurretAttackTypes();
  const { assets: turretAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.TURRET_ASSETS);
  const { configs: elementTypes, loading: elemLoading } = useElementTypes();
  const assetOpts = turretAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));
  const attackTypeOpts = attackTypes.map(t => ({ value: t.id, label: t.label, hint: t.description }));
  const elemOpts = elementTypes.map(e => ({ value: e.id, label: e.name ?? e.id }));

  const add = () => {
    if (items.length >= 8) return;
    onChange({ turrets: [...items, { ...DEFAULT, id: makeId() }] });
  };

  const remove = (id: number | undefined) =>
    onChange({ turrets: items.filter(t => t.id !== id) });

  const update = (id: number | undefined, field: keyof TurretConfig, value: any) =>
    onChange({ turrets: items.map(t => t.id === id ? { ...t, [field]: value } : t) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{items.length} / 8 turrets</span>
        <button onClick={add} disabled={items.length >= 8} style={{ padding: "5px 14px", background: C.red, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: items.length >= 8 ? 0.4 : 1 }}>
          + Add Turret
        </button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔫</div>
          <p>No turrets yet. Turrets fire at beyblades that enter their range.</p>
        </div>
      )}

      {items.map((turret, idx) => (
        <div key={turret.id ?? idx} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>🔫 Turret #{idx + 1}</span>
              {turret.behaviorId && (
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
                  Behavior: {turret.behaviorId}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={turret.indestructible ?? false} onChange={e => update(turret.id, "indestructible", e.target.checked)} />
                Indestructible
              </label>
              <button onClick={() => remove(turret.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
          </div>

          {/* Attack type */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 6 }}>Attack Type</label>
            <SearchableSelect
              value={turret.attackType ?? "periodic"}
              options={attackTypeOpts}
              onChange={v => update(turret.id, "attackType", v as TurretAttackType)}
              disabled={typesLoading}
              emptyLabel={typesLoading ? "Loading…" : "No attack types found"}
              style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </div>

          {/* Type-specific config */}
          <div style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 6 }}>Attack Type Config</div>
            <TypeSpecificParams turret={turret} update={(field, val) => update(turret.id, field, val)} />
          </div>

          {/* Fire pattern */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Fire Pattern</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {FIRE_PATTERNS.map(p => (
                <button key={p.value} onClick={() => update(turret.id, "firePattern", p.value)}
                  style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                    background: (turret.firePattern ?? "nearest") === p.value ? C.red : "transparent",
                    color: (turret.firePattern ?? "nearest") === p.value ? C.white : C.muted,
                    border: `1px solid ${(turret.firePattern ?? "nearest") === p.value ? C.red : C.border}` }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sprite pickers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Turret Sprite</label>
              <SearchableSelect
                value={turret.spriteId ?? ""}
                options={assetOpts}
                onChange={v => update(turret.id, "spriteId" as any, v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No turret assets found"}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Projectile Sprite</label>
              <SearchableSelect
                value={(turret as any).projectileSpriteId ?? ""}
                options={assetOpts}
                onChange={v => update(turret.id, "projectileSpriteId" as any, v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No turret assets found"}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </div>
          </div>

          {/* Element type */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Element Type</label>
            <SearchableSelect
              value={(turret.elementType as any) ?? ""}
              options={elemOpts}
              onChange={v => update(turret.id, "elementType" as any, v || undefined)}
              disabled={elemLoading}
              emptyLabel={elemLoading ? "Loading…" : "No element types"}
              style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </div>

          {/* Common sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {COMMON_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>{label}</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{(turret as any)[field] ?? 0}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(turret as any)[field] ?? min}
                  onChange={e => update(turret.id, field, +e.target.value)}
                  style={{ width: "100%", accentColor: C.red }}
                />
              </div>
            ))}
          </div>

          {/* Behavior override */}
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior ID (optional)</label>
              <input
                type="text"
                value={turret.behaviorId ?? ""}
                onChange={e => update(turret.id, "behaviorId", e.target.value || undefined)}
                placeholder="e.g. movement.orbit"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior Params (JSON)</label>
              <textarea
                value={turret.behaviorParams ? JSON.stringify(turret.behaviorParams, null, 2) : ""}
                onChange={e => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : undefined;
                    update(turret.id, "behaviorParams", parsed);
                  } catch { /* invalid JSON, ignore */ }
                }}
                placeholder='{ "strength": 0.5 }'
                rows={2}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Feature Animation */}
          <div style={{ marginTop: 12, background: C.bg2, borderRadius: 8, padding: 10 }}>
            <FeatureAnimationPanel
              value={turret.featureAnimation}
              onChange={v => update(turret.id, "featureAnimation", v)}
              featureId={String(turret.id ?? idx)}
            />
          </div>

          {/* Controlled-by-switch */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Controlled By Switch ID</label>
            <input
              type="text"
              value={(turret as any).controlledBySwitchId ?? ""}
              onChange={e => update(turret.id, "controlledBySwitchId" as any, e.target.value || undefined)}
              placeholder="e.g. sw1"
              style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" as const }}
            />
          </div>

          {/* Rotation + Self-rotation */}
          <RotationBlockEditor
            value={turret.rotation}
            onChange={v => update(turret.id, "rotation", v)}
            label="Base Rotation"
          />
          <SelfRotationPanel
            rotation={turret.rotation?.initialAngleDeg}
            selfRotation={turret.selfRotation}
            onChangeRotation={v => update(turret.id, "rotation" as any, v !== undefined ? { ...(turret.rotation ?? { mode: "static" as const }), initialAngleDeg: v } : undefined)}
            onChangeSelfRotation={v => update(turret.id, "selfRotation" as any, v)}
          />
        </div>
      ))}
    </div>
  );
}
