// TurretDispatch.ts — central dispatch for all turret attack types.
// Imports handler functions from TurretProcessor and routes based on attackType.
// Called from BattleRoom.tickArenaEffects() once per server tick (60 Hz).

import type { Beyblade } from "../../rooms/schema/GameState";
import type { TurretRuntimeState, TurretProcessorBridge } from "./TurretProcessor";
export type { TurretProcessorBridge };
import { selectTarget } from "./TurretProcessor";

// ── Import fire/trigger handlers ────────────────────────────────────────────
import {
  processLaserSweep, processEMP, processTractorBeam, steerTrackingMissile,
  checkBurstFire, getShotgunAngles,
  processSurf, processHydroPump, processFireSpinTick,
  processThunderbolt, processPsychic, processGust,
  processFireBlast, createSludgeBombZone, createToxicSpikes,
  processRoar, selectMultiMissileTargets,
  processBlizzard, processEarthquakeRing, processFlamethrower,
  processIceBeam, processDragonBreath, processConfuseRay,
  createStickyWeb, processGravityFieldTick, processSandTombTick,
  createZapCannon, processChainLightning, processSporeCloudTick,
  createDarkVoid, processRockSlide,
  createStealthRocks, applyEmberBurn, applyActiveBurns, processMagmaStorm,
  processEruption, applyBubbleBeamSlow, processAquaRingTick,
  applyOriginPulseWave, applyIcicleSpear, applyHailChunk, applyGlacialLance,
  applyThunderWave, applyDischarge, applyBoltStrike,
  applyAirSlash, applyHurricaneSpinZone, applyAeroblast,
  applyStoneEdgeShard, applyDigSurface, applyTectonicRage,
} from "./TurretProcessor";

import {
  processLeechSeedTick, processVineWhipTick, processWhirlpoolTick,
  applyZapCannonHit,
} from "./TurretProcessor";

import {
  applyShinraTensei, triggerChibakuTensei, processChibakuTenseiTick,
  applySamehadaDrain, applySharkBomb,
  triggerEarthGrudgeFear, processEarthGrudgeTick,
  triggerJashinRitual, applyJashinMirrorDamage,
  applyPaperBombStorm, applyKamui, processKamuiTick,
  applyLimboHengoku, triggerWoodDragon, processWoodDragonTick,
  triggerSpiralEye, processSpiralEyeTick,
  applyPhantomPass, processPhantomPassTick,
  triggerBlackZetsuBind, processBlackZetsuTick,
  applyOrangeMaskDash, applyTenTailsBijuudama,
  triggerTruthSeekerOrbs, processTruthSeekerOrbsTick,
  applyBanshoTenIn, applyHumanPath, applyPretaPath, processPretaPathTick, applyAsuraPath,
  applyFlyingThunderGod, applyRasenShuriken, applyOdamaRasengan,
  triggerEightGates, processEightGatesTick,
  applyEveningElephant, applyNightGuy,
  applyTengaiShinSei, applyKaguyaBones,
  triggerKyokaSuigetsu, processKyokaSuigetsuTick,
  triggerRespira, processRespiraTick,
  applyDesgarron,
  applyKamehameha, triggerSpiritBomb, processSpiritBombTick,
  applyFinalFlash, applyDeathBeam,
  triggerMirrorWorld, processMirrorWorldTick,
  applyPerfectMirage, processPerfectMirageTick,
  applyBrokenReality, applyPhantasmalShift, processPhantasmalShiftTick,
  triggerGenjutsuVeil, processGenjutsuVeilTick,
  triggerFalseFlag, processFalseFlagTick,
  applyMindFracture, processMindFractureTick,
  applySpreadBey, applyRailbey, processRailbeyTick,
  applyMinigunBey, processMinigunBeyTick,
  applyHeatSeekerBey,
  applyBombBey, processBombBeyTick,
  applyShieldBey, applyTurboBey, processTurboBeyTick,
  applyCannonBey,
  applySpeedSurge, processSpeedSurgeTick,
  applyGravityFlip, processGravityFlipTick,
  applyMagnetBey, processMagnetBeyTick,
  applyBounceStorm, processBounceStormTick,
  applyFreezeStep, processFreezeStepTick,
  applyGhostWalk, processGhostWalkTick,
  applyBoomerangPath, processBoomerangPathTick,
  applyTeleportDash, processTeleportDashTick,
} from "./TurretProcessor";

import {
  triggerHundredKicks, processHundredKicksTick,
  triggerElectricBody, processElectricBodyTick,
  triggerDaiGurenIce, processDaiGurenTick,
  triggerMukenPoison, processMukenPoisonTick,
  triggerZankaIncinerate, processZankaFieldTick,
  applySuzumebachi, triggerHihioConstruct, processHihioSweepTick,
  triggerSandBurial, processSandBurialTick,
  triggerAmaterasu, processAmaterasuTick,
  triggerSusanoo, processSusanooTick,
} from "./TurretProcessor";

import {
  triggerHarden, triggerDefenseCurl, triggerWithdraw,
} from "./TurretProcessor";

import {
  placeClaySpider, processClaySpiderTick,
  placeClayDragon, processClayDragonTick,
  placeClayBomb, processClayBombTick,
  applyClayC4, processClayC4Tick,
  applyKatsu,
} from "./TurretProcessor";

import {
  processBerserkHollowTick,
} from "./TurretProcessor";

import {
  applyGohanMasenko, triggerGohanPowerUp, applyGohanMysticUnleash,
  applyGalickGun, applyBigBangAttack, applyFinalExplosion,
  applySolarKamehameha, triggerCellJrSpawn, processCellJrTick, triggerPerfectFormCell,
  applyChocolateBeam, processChocolateBeamTick, triggerBuuAbsorption, applyKidBuuScream,
  triggerDeathBall, processDeathBallTick, applyNovaStrike, triggerGoldenFrieza,
} from "./TurretProcessor";

import {
  triggerGearSecond, processGearSecondTick, applyGearFourth, applyConquerorsHaki,
  applyThreeSwordStyle, applyDiableJambe, processDiableJambeTick,
  applyWaterBreathing, applyHinokamiKagura, applyThunderBreathing,
  applyBeastBreathing, applyFlameBreathing,
  applyThunderSpear, applyOmniDirectional, applyHardening, applyFoundingTitan, processFoundingTitanTick,
} from "./TurretProcessor";

// ── Generic fallback ─────────────────────────────────────────────────────────

function applyGenericDamageKnockback(
  turretConfig: any,
  target: Beyblade | null,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
  tx: number,
  ty: number,
  aoe = false,
): void {
  const range = (turretConfig.attackRange ?? 25) * 24;
  const dmg = turretConfig.attackDamage ?? 10;
  const force = turretConfig.attackForce ?? 80;

  if (aoe) {
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - tx, dy = b.y - ty;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > range) continue;
      b.health -= dmg;
      b.damageReceived += dmg;
      const len = dist || 1;
      bridge.applyKnockback(b.id, { x: dx / len, y: dy / len }, force);
    }
  } else if (target) {
    target.health -= dmg;
    target.damageReceived += dmg;
    const dx = target.x - tx, dy = target.y - ty;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyKnockback(target.id, { x: dx / len, y: dy / len }, force);
  }
}

// ── Main dispatch: on-fire (called when cooldown expires) ────────────────────

export function dispatchTurretFire(
  attackType: string,
  turretConfig: any,
  runtime: TurretRuntimeState,
  target: Beyblade | null,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
  tx: number,
  ty: number,
  nowMs: number,
): void {
  switch (attackType) {
    // ── Legacy ───────────────────────────────────────────────────────────────
    case "random":
    case "periodic":
      applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false);
      break;
    case "aoe":
      applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true);
      break;
    case "beam":
    case "laser_sweep":
      // Tick-only — handled in dispatchTurretTick each frame; no burst on fire
      break;
    case "emp":
      processEMP(turretConfig, beyblades, nowMs);
      break;
    case "tractor_beam":
      // Tick-only
      break;
    case "tracking_missile":
    case "burst_fire":
    case "plasma_ring":
      applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false);
      break;
    case "sniper":
      if (target) {
        const dmg = (turretConfig.attackDamage ?? 10) * 2.5;
        target.health -= dmg;
        target.damageReceived += dmg;
      }
      break;
    case "shotgun": {
      const baseAngleDeg = Math.atan2((target?.y ?? ty) - ty, (target?.x ?? tx) - tx) * (180 / Math.PI);
      const angles = getShotgunAngles(baseAngleDeg, turretConfig.shotgunSpreadDeg ?? 30, turretConfig.shotgunPellets ?? 5);
      for (const b of beyblades) {
        if (!b.isActive || b.isRingOut) continue;
        const bAngle = Math.atan2(b.y - ty, b.x - tx) * (180 / Math.PI);
        for (const aDeg of angles) {
          if (Math.abs(aDeg - bAngle) < 10) {
            b.health -= turretConfig.attackDamage ?? 8;
            b.damageReceived += turretConfig.attackDamage ?? 8;
            const aRad = aDeg * (Math.PI / 180);
            bridge.applyKnockback(b.id, { x: Math.cos(aRad), y: Math.sin(aRad) }, turretConfig.attackForce ?? 60);
            break;
          }
        }
      }
      break;
    }
    case "mine_layer":
      runtime.explodingTagX = target?.x ?? tx;
      runtime.explodingTagY = target?.y ?? ty;
      runtime.explodingTagActive = true;
      break;
    case "gravity_cannon":
      runtime.blackHoleCenterX = target?.x ?? tx;
      runtime.blackHoleCenterY = target?.y ?? ty;
      runtime.blackHoleExpiresMs = nowMs + (turretConfig.gravityCannonDurationMs ?? 3000);
      break;
    // ── Water ────────────────────────────────────────────────────────────────
    case "surf": processSurf(turretConfig, beyblades, 0, bridge); break;
    case "hydro_pump": if (target) processHydroPump(turretConfig, target, bridge); break;
    case "aqua_ring":
      if (target) { runtime.aquaRingTargetId = target.id; runtime.aquaRingExpiresMs = nowMs + (turretConfig.aquaRingDurationMs ?? 4000); }
      break;
    case "bubble_beam": if (target) applyBubbleBeamSlow(turretConfig, target, nowMs); break;
    case "origin_pulse": applyOriginPulseWave(turretConfig, beyblades, bridge); break;
    // ── Fire ─────────────────────────────────────────────────────────────────
    case "fire_spin": if (target) applyEmberBurn(turretConfig, target, nowMs); break;
    case "flamethrower": if (target) processFlamethrower(turretConfig, target, tx, ty, 1000 / 60); break;
    case "fire_blast": processFireBlast(turretConfig, beyblades, tx, ty, 0); break;
    case "ember": if (target) applyEmberBurn(turretConfig, target, nowMs); break;
    case "magma_storm": processMagmaStorm(turretConfig, runtime, beyblades, 1000 / 60); break;
    case "eruption": processEruption(turretConfig, beyblades, nowMs); break;
    // ── Ice ──────────────────────────────────────────────────────────────────
    case "ice_beam": if (target) processIceBeam(turretConfig, target, nowMs, bridge); break;
    case "blizzard": processBlizzard(turretConfig, beyblades, tx, ty, 0, nowMs, bridge); break;
    case "icicle_spear": if (target) applyIcicleSpear(turretConfig, target); break;
    case "hail": applyHailChunk(turretConfig, beyblades, tx, ty, bridge); break;
    case "glacial_lance": applyGlacialLance(turretConfig, beyblades, nowMs, bridge); break;
    // ── Lightning ────────────────────────────────────────────────────────────
    case "thunderbolt": if (target) processThunderbolt(turretConfig, target, nowMs); break;
    case "thunder_wave": applyThunderWave(turretConfig, beyblades, nowMs); break;
    case "discharge": applyDischarge(turretConfig, beyblades, bridge); break;
    case "bolt_strike": applyBoltStrike(turretConfig, beyblades, nowMs); break;
    case "zap_cannon": if (target) { createZapCannon(turretConfig, target, tx, ty); runtime.heatSeekerBeyTargetId = target.id; } break;
    case "chain_lightning": processChainLightning(turretConfig, beyblades, tx, ty, nowMs); break;
    case "magnetic_field":
      runtime.magneticFieldExpiresMs = nowMs + (turretConfig.magneticFieldDurationMs ?? 4000);
      break;
    case "thunder_storm":
      runtime.thunderStormExpiresMs = nowMs + (turretConfig.thunderStormDurationMs ?? 6000);
      runtime.thunderStormNextStrikeMs = nowMs;
      break;
    // ── Wind ─────────────────────────────────────────────────────────────────
    case "gust": processGust(turretConfig, beyblades, bridge); break;
    case "air_slash": if (target) applyAirSlash(turretConfig, target, nowMs, Math.random); break;
    case "hurricane": applyHurricaneSpinZone(turretConfig, beyblades, tx, ty, bridge); break;
    case "aeroblast": applyAeroblast(turretConfig, beyblades, bridge); break;
    // ── Psychic ──────────────────────────────────────────────────────────────
    case "psychic": processPsychic(turretConfig, beyblades, nowMs, 1000 / 60, bridge); break;
    case "confuse_ray": if (target) processConfuseRay(turretConfig, target, nowMs); break;
    case "roar": processRoar(turretConfig, beyblades, tx, ty, nowMs); break;
    // ── Earth / Rock ─────────────────────────────────────────────────────────
    case "earthquake": processEarthquakeRing(turretConfig, beyblades, tx, ty, 0, bridge); break;
    case "rock_slide": processRockSlide(turretConfig, beyblades, tx, ty, Math.random); break;
    case "stone_edge": if (target) applyStoneEdgeShard(turretConfig, target, Math.random); break;
    case "dig": applyDigSurface(turretConfig, beyblades, tx, ty, bridge); break;
    case "tectonic_rage": applyTectonicRage(turretConfig, beyblades, [0, 120, 240], bridge); break;
    // ── Poison / Status ──────────────────────────────────────────────────────
    case "toxic_spikes": createToxicSpikes(turretConfig, target?.x ?? tx, target?.y ?? ty, nowMs); break;
    case "sludge_bomb": createSludgeBombZone(turretConfig, target?.x ?? tx, target?.y ?? ty, nowMs); break;
    // ── Grass / Nature ───────────────────────────────────────────────────────
    case "leech_seed":
      if (target) { runtime.leechSeedTargetId = target.id; runtime.leechSeedExpiresMs = nowMs + (turretConfig.leechSeedDurationMs ?? 5000); }
      break;
    case "vine_whip":
      if (target) { runtime.vineWhipTargetId = target.id; runtime.vineWhipExpiresMs = nowMs + (turretConfig.vineWhipDurationMs ?? 2000); }
      break;
    case "sticky_web": createStickyWeb(turretConfig, target?.x ?? tx, target?.y ?? ty, nowMs); break;
    case "spore":
      runtime.sporeCenterX = target?.x ?? tx;
      runtime.sporeCenterY = target?.y ?? ty;
      runtime.sporeExpiresMs = nowMs + (turretConfig.sporeDurationMs ?? 4000);
      break;
    // ── Shadow / Ghost ───────────────────────────────────────────────────────
    case "shadow_ball": createDarkVoid(turretConfig, beyblades, tx, ty); break;
    case "dark_void": createDarkVoid(turretConfig, beyblades, tx, ty); break;
    // ── Gravity ──────────────────────────────────────────────────────────────
    case "gravity_cannon":
    case "gravity_field":
      runtime.gravityFieldExpiresMs = nowMs + (turretConfig.gravityFieldDurationMs ?? 5000);
      break;
    case "sand_tomb":
      runtime.sandTombCenterX = target?.x ?? tx;
      runtime.sandTombCenterY = target?.y ?? ty;
      runtime.sandTombExpiresMs = nowMs + (turretConfig.sandTombDurationMs ?? 4000);
      break;
    case "whirlpool":
      runtime.whirlpoolCenterX = target?.x ?? tx;
      runtime.whirlpoolCenterY = target?.y ?? ty;
      runtime.whirlpoolExpiresMs = nowMs + (turretConfig.whirlpoolDurationMs ?? 4000);
      break;
    case "stealth_rock": createStealthRocks(turretConfig, tx, ty, nowMs, Math.random); break;
    case "multi_missile": {
      const targets = selectMultiMissileTargets(turretConfig, beyblades, tx, ty);
      for (const t of targets) { applyGenericDamageKnockback(turretConfig, t, beyblades, bridge, tx, ty, false); }
      break;
    }
    // ── Dragon Ball ──────────────────────────────────────────────────────────
    case "kamehameha": applyKamehameha(turretConfig, beyblades, bridge); break;
    case "spirit_bomb": triggerSpiritBomb(turretConfig, runtime, nowMs); break;
    case "final_flash": if (target) applyFinalFlash(turretConfig, target, bridge); break;
    case "death_beam": if (target) applyDeathBeam(turretConfig, target); break;
    // Gohan chain
    case "gohan_masenko": if (target) applyGohanMasenko(turretConfig, target, bridge); break;
    case "gohan_power_up": triggerGohanPowerUp(turretConfig, runtime, nowMs); break;
    case "gohan_mystic_unleash": applyGohanMysticUnleash(turretConfig, beyblades, bridge, tx, ty); break;
    // Vegeta chain
    case "galick_gun": applyGalickGun(turretConfig, beyblades, bridge, tx, ty); break;
    case "big_bang_attack": if (target) applyBigBangAttack(turretConfig, target, bridge); break;
    case "final_explosion": applyFinalExplosion(turretConfig, runtime, beyblades, bridge, tx, ty, nowMs); break;
    // Cell chain
    case "solar_kamehameha": applySolarKamehameha(turretConfig, beyblades, bridge, tx, ty); break;
    case "cell_jr_spawn": triggerCellJrSpawn(turretConfig, runtime, beyblades, tx, ty, nowMs); break;
    case "perfect_form_cell": triggerPerfectFormCell(turretConfig, runtime, nowMs); break;
    // Buu chain
    case "chocolate_beam": if (target) applyChocolateBeam(turretConfig, runtime, target, nowMs); break;
    case "buu_absorption": if (target) triggerBuuAbsorption(turretConfig, runtime, target, nowMs); break;
    case "kid_buu_scream": applyKidBuuScream(turretConfig, beyblades, bridge, tx, ty); break;
    // Frieza chain
    case "death_ball": triggerDeathBall(turretConfig, runtime, tx, ty, nowMs); break;
    case "nova_strike": if (target) applyNovaStrike(turretConfig, target, bridge); break;
    case "golden_frieza": triggerGoldenFrieza(turretConfig, runtime, nowMs); break;
    // ── Naruto ───────────────────────────────────────────────────────────────
    case "rasengan": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "chidori": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "shadow_clone": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "sand_burial": if (target) triggerSandBurial(turretConfig, runtime, target, nowMs); break;
    case "fireball_jutsu": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "eight_trigrams": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "amaterasu": if (target) triggerAmaterasu(turretConfig, runtime, target, nowMs); break;
    case "susanoo": triggerSusanoo(turretConfig, runtime, nowMs); break;
    case "rasenshuriken": if (target) applyRasenShuriken(turretConfig, target, beyblades, bridge); break;
    case "odama_rasengan": if (target) applyOdamaRasengan(turretConfig, target, beyblades, bridge); break;
    case "flying_thunder_god": applyFlyingThunderGod(turretConfig, beyblades, bridge, nowMs); break;
    case "eight_gates_release": if (target) triggerEightGates(turretConfig, runtime, target, nowMs); break;
    case "evening_elephant": if (target) applyEveningElephant(turretConfig, target, beyblades, bridge); break;
    case "night_guy": if (target) applyNightGuy(turretConfig, target, bridge); break;
    case "tengai_shinsei": applyTengaiShinSei(turretConfig, beyblades, bridge); break;
    case "kaguya_bones": applyKaguyaBones(turretConfig, beyblades, bridge); break;
    // ── Bleach ───────────────────────────────────────────────────────────────
    case "tensa_zangetsu": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "senbonzakura": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "daiguren_ice": triggerDaiGurenIce(turretConfig, runtime, tx, ty, nowMs); break;
    case "absolute_zero": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "muken_poison": triggerMukenPoison(turretConfig, runtime, tx, ty, nowMs); break;
    case "zanka_incinerate": triggerZankaIncinerate(turretConfig, runtime, tx, ty, nowMs); break;
    case "suzumebachi": if (target) applySuzumebachi(turretConfig, runtime, target); break;
    case "hihio_construct": triggerHihioConstruct(turretConfig, runtime, nowMs); break;
    case "kyoka_suigetsu": triggerKyokaSuigetsu(turretConfig, runtime, beyblades, nowMs); break;
    case "respira": triggerRespira(turretConfig, runtime, nowMs); break;
    case "desgarron": applyDesgarron(turretConfig, beyblades, bridge); break;
    // ── Bleach extended ──────────────────────────────────────────────────────
    case "gigantification": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "ryujin_jakka_full": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "minazuki_heal": break; // Heals turret — no bey effect on fire
    case "katen_kyokotsu": if (target) { target.health -= turretConfig.attackDamage ?? 15; } break;
    case "senbonzakura_kageyoshi": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "daiguren_full": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Arrancar ─────────────────────────────────────────────────────────────
    case "cero": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "gran_rey_cero": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "cero_oscuras": if (target) { target.health -= (turretConfig.attackDamage ?? 25); target.damageReceived += (turretConfig.attackDamage ?? 25); } break;
    case "bala": if (target) { for (let i = 0; i < 5; i++) { target.health -= (turretConfig.attackDamage ?? 5); target.damageReceived += (turretConfig.attackDamage ?? 5); } } break;
    case "hierro": break; // Self-buff — no bey effect on fire
    case "sonido": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "pesquisa": break; // Target selection helper — just resets target
    case "descorrer": applyBanshoTenIn(turretConfig, beyblades, bridge); break;
    case "lanza_del_relampago": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "santa_teresa": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "resurrección": runtime.resurreccionUntilMs = nowMs + (turretConfig.resurreccionDurationMs ?? 8000); break;
    // ── Gotei / Kido ─────────────────────────────────────────────────────────
    case "shunpo": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "reiatsu_burst": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "kido_hado_31": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "kido_hado_63": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "kido_hado_90": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "kido_bakudo_61": if (target) { target.controlLockedUntilMs = nowMs + 2000; target.controlLockSource = "kido_bakudo_61"; } break;
    case "kido_bakudo_99": if (target) { target.controlLockedUntilMs = nowMs + 3000; target.controlLockSource = "kido_bakudo_99"; } break;
    case "roar_of_seireitei": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Visored / Hollow ─────────────────────────────────────────────────────
    case "mask_on": runtime.maskOnUntilMs = nowMs + (turretConfig.maskDurationMs ?? 8000); break;
    case "hollow_cero": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "inner_hollow": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "getsuga_tensho": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "mugetsu": if (target) { target.health -= (turretConfig.attackDamage ?? 60); target.damageReceived += (turretConfig.attackDamage ?? 60); } break;
    case "fullbring_boost": break; // Buff — no immediate bey effect
    // ── Itachi / Genjutsu ────────────────────────────────────────────────────
    case "tsukuyomi": if (target) { runtime.tsukuyomiTargetId = target.id; runtime.tsukuyomiUntilMs = nowMs + 3000; target.controlLockedUntilMs = nowMs + 3000; target.controlLockSource = "tsukuyomi"; } break;
    case "amaterasu_mark": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "izanagi": runtime.izanagiChargesLeft = (runtime.izanagiChargesLeft ?? 0) + 1; break;
    case "izanami": if (target) { runtime.izanamiTargetId = target.id; runtime.izanamiUntilMs = nowMs + 2000; } break;
    case "sharingan_lock": if (target) { target.controlLockedUntilMs = nowMs + 2500; target.controlLockSource = "sharingan_lock"; } break;
    case "crow_genjutsu": { for (const b of beyblades) { if (b.isActive) { b.controlLockedUntilMs = nowMs + 2000; b.controlLockSource = "crow_genjutsu"; } } break; }
    case "susanoo_itachi": if (target) { runtime.susanooItachiTargetId = target.id; runtime.susanooItachiUntilMs = nowMs + 3000; } break;
    // ── Akatsuki ─────────────────────────────────────────────────────────────
    case "shinra_tensei": applyShinraTensei(turretConfig, beyblades, bridge, tx, ty); break;
    case "chibaku_tensei": triggerChibakuTensei(turretConfig, runtime, tx, ty, nowMs); break;
    case "samehada_drain": break; // Tick-only
    case "shark_bomb": if (target) applySharkBomb(turretConfig, target, bridge); break;
    case "earth_grudge_fear": if (target) triggerEarthGrudgeFear(turretConfig, runtime, target, nowMs); break;
    case "jashin_ritual": if (target) triggerJashinRitual(turretConfig, runtime, target, nowMs); break;
    case "paper_bomb_storm": applyPaperBombStorm(turretConfig, beyblades, bridge, tx, ty); break;
    case "kamui": if (target) applyKamui(turretConfig, runtime, target, nowMs); break;
    case "limbo_hengoku": if (target) applyLimboHengoku(turretConfig, target, bridge); break;
    case "wood_dragon": if (target) triggerWoodDragon(turretConfig, runtime, target, nowMs); break;
    // ── Obito ────────────────────────────────────────────────────────────────
    case "spiral_eye": triggerSpiralEye(turretConfig, runtime, nowMs); break;
    case "phantom_pass": if (target) applyPhantomPass(turretConfig, runtime, target, beyblades, bridge, nowMs); break;
    case "black_zetsu_bind": if (target) triggerBlackZetsuBind(turretConfig, runtime, target, nowMs); break;
    case "orange_mask_dash": if (target) applyOrangeMaskDash(turretConfig, target, bridge); break;
    case "ten_tails_bijuudama": applyTenTailsBijuudama(turretConfig, beyblades, bridge); break;
    case "truth_seeker_orbs": if (target) triggerTruthSeekerOrbs(turretConfig, runtime, target, nowMs); break;
    // ── Rinnegan ─────────────────────────────────────────────────────────────
    case "bansho_tenin": applyBanshoTenIn(turretConfig, beyblades, bridge); break;
    case "human_path": if (target) applyHumanPath(turretConfig, target); break;
    case "preta_path": if (target) applyPretaPath(turretConfig, runtime, target, nowMs); break;
    case "asura_path": applyAsuraPath(turretConfig, beyblades, bridge); break;
    // ── Street Fighter ───────────────────────────────────────────────────────
    case "hadoken": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "shoryuken": if (target) { target.health -= (turretConfig.attackDamage ?? 20); target.beyTiltAngle = Math.min(90, (target.beyTiltAngle ?? 0) + 30); } break;
    case "sonic_boom": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "flash_kick": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "raging_demon": if (target && target.spin < target.maxSpin * 0.25) { target.health -= (turretConfig.attackDamage ?? 10) * 3; target.damageReceived += (turretConfig.attackDamage ?? 10) * 3; } break;
    case "spiral_drill": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "hundred_kicks": if (target) triggerHundredKicks(turretConfig, runtime, target, nowMs); break;
    case "electric_body": triggerElectricBody(turretConfig, runtime, nowMs); break;
    // ── Tekken ───────────────────────────────────────────────────────────────
    case "devil_beam": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "wind_god_fist": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "hellsweep": if (target) { target.health -= turretConfig.attackDamage ?? 15; target.controlLockedUntilMs = nowMs + 500; target.controlLockSource = "hellsweep"; } break;
    case "laser_scraper": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "twin_pistols": if (target) { for (let i = 0; i < 2; i++) { target.health -= (turretConfig.attackDamage ?? 8); target.damageReceived += (turretConfig.attackDamage ?? 8); } } break;
    case "rage_drive": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "heat_smash": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "ki_charge_tek": runtime.kiChargeTekChargesStored = (runtime.kiChargeTekChargesStored ?? 0) + 1; break;
    // ── Time-based ───────────────────────────────────────────────────────────
    case "time_stop": runtime.timeStopUntilMs = nowMs + (turretConfig.timeStopDurationMs ?? 1500); break;
    case "time_loop": if (target) { runtime.timeLoopTargetId = target.id; runtime.timeLoopFireMs = nowMs + 2000; runtime.timeLoopDamage = turretConfig.attackDamage ?? 20; } break;
    case "time_acceleration": if (target) { (runtime.timeAccelTargets ?? (runtime.timeAccelTargets = [])).push({ id: target.id, expiresMs: nowMs + 5000 }); } break;
    case "time_warp": if (target) { bridge.applyKnockback(target.id, { x: (target.x - tx) / (Math.abs(target.x - tx) || 1), y: (target.y - ty) / (Math.abs(target.y - ty) || 1) }, -400); } break;
    case "age_drain": if (target) { target.spin -= target.spin * 0.15; } break;
    // ── Deidara ──────────────────────────────────────────────────────────────
    case "clay_spider": if (target) { placeClaySpider(turretConfig, runtime, target.x, target.y); runtime.claySpiderTargetId = target.id; } break;
    case "clay_dragon": if (target) { placeClayDragon(turretConfig, runtime, target, target.x, target.y); } break;
    case "clay_bomb": { const ct = target; placeClayBomb(turretConfig, runtime, ct?.x ?? tx, ct?.y ?? ty); break; }
    case "clay_clones_c4": if (target) { applyClayC4(turretConfig, runtime, target, nowMs); } break;
    case "katsu": applyKatsu(turretConfig, runtime, beyblades, bridge); break;
    // ── Size / Weight ────────────────────────────────────────────────────────
    case "enlarge": if (target) { runtime.enlargeTargetId = target.id; runtime.enlargeUntilMs = nowMs + 5000; target.radius *= 1.5; } break;
    case "shrink": if (target) { runtime.shrinkTargetId = target.id; runtime.shrinkUntilMs = nowMs + 5000; target.radius *= 0.5; } break;
    case "mass_shift": if (target) { runtime.massShiftTargetId = target.id; runtime.massShiftUntilMs = nowMs + 4000; } break;
    case "density_crush": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Full Transformations ─────────────────────────────────────────────────
    case "hollow_transform": if (target) { runtime.hollowTransformTargetId = target.id; runtime.hollowTransformUntilMs = nowMs + 8000; runtime.hollowTransformNextPulseMs = nowMs + 500; } break;
    case "kyuubi_mode": if (target) { runtime.kyuubiModeTargetId = target.id; runtime.kyuubiModeUntilMs = nowMs + 8000; } break;
    case "bijuu_mode": if (target) { runtime.bijuuModeTargetId = target.id; runtime.bijuuModeUntilMs = nowMs + 8000; } break;
    case "tailed_beast_bomb": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "curse_mark_2": if (target) { runtime.curseMark2TargetId = target.id; runtime.curseMark2UntilMs = nowMs + 8000; } break;
    case "six_paths_mode": runtime.sixPathsUntilMs = nowMs + 8000; break;
    case "ten_tails_jinchuriki": runtime.tenTailsUntilMs = nowMs + 8000; break;
    case "berserk_hollow": if (target) { runtime.berserkHollowTargetId = target.id; runtime.berserkHollowUntilMs = nowMs + 8000; runtime.berserkHollowNextHitMs = nowMs + 500; } break;
    // ── Illusion ─────────────────────────────────────────────────────────────
    case "mirror_world": triggerMirrorWorld(turretConfig, runtime, beyblades, nowMs); break;
    case "perfect_mirage": if (target) applyPerfectMirage(turretConfig, runtime, target, nowMs); break;
    case "broken_reality": applyBrokenReality(turretConfig, beyblades, bridge); break;
    case "phantasmal_shift": if (target) applyPhantasmalShift(turretConfig, runtime, target, nowMs); break;
    case "genjutsu_veil": triggerGenjutsuVeil(turretConfig, runtime, beyblades, nowMs); break;
    case "false_flag": triggerFalseFlag(turretConfig, runtime, beyblades, nowMs); break;
    case "mind_fracture": if (target) applyMindFracture(turretConfig, runtime, target, nowMs); break;
    // ── Contra bey powers ────────────────────────────────────────────────────
    case "spread_bey": if (target) applySpreadBey(turretConfig, target); break;
    case "railbey": if (target) applyRailbey(turretConfig, runtime, target, beyblades, bridge, nowMs); break;
    case "minigun_bey": if (target) applyMinigunBey(turretConfig, runtime, target, nowMs); break;
    case "heat_seeker_bey": if (target) applyHeatSeekerBey(turretConfig, runtime, target, beyblades, bridge); break;
    case "bomb_bey": if (target) applyBombBey(turretConfig, runtime, target, nowMs); break;
    case "shield_bey": if (target) applyShieldBey(turretConfig, runtime, target); break;
    case "turbo_bey": if (target) applyTurboBey(turretConfig, runtime, target, bridge, nowMs); break;
    case "cannon_bey": if (target) applyCannonBey(turretConfig, target, beyblades, bridge); break;
    // ── Contra movement powers ───────────────────────────────────────────────
    case "speed_surge": if (target) applySpeedSurge(turretConfig, runtime, target, bridge, nowMs); break;
    case "gravity_flip": if (target) applyGravityFlip(turretConfig, runtime, target, nowMs); break;
    case "magnet_bey": if (target) applyMagnetBey(turretConfig, runtime, target, nowMs); break;
    case "bounce_storm": if (target) applyBounceStorm(turretConfig, runtime, target, nowMs); break;
    case "freeze_step": if (target) applyFreezeStep(turretConfig, runtime, target, bridge, nowMs); break;
    case "ghost_walk": if (target) applyGhostWalk(turretConfig, runtime, target, nowMs); break;
    case "boomerang_path": if (target) applyBoomerangPath(turretConfig, runtime, target, nowMs); break;
    case "teleport_dash": if (target) applyTeleportDash(turretConfig, runtime, target, nowMs); break;
    // ── Summons (generic stubs for unsupported moves) ───────────────────────
    case "summon_toad": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "summon_snake": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "summon_slug": break; // Heals turret only
    case "summon_kirin": if (target) { target.health -= (turretConfig.attackDamage ?? 50); target.damageReceived += (turretConfig.attackDamage ?? 50); } break;
    case "summon_eagle": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "summon_clones": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "summon_ryuchi": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "summon_myoboku": break; // Buff
    case "summon_slugs_army": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "summon_garuda": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "summon_enma": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "summon_gamaken": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "edo_tensei": break; // Revive — not applicable to beyblade context
    // ── More Naruto summons ───────────────────────────────────────────────────
    case "substitution": triggerHarden(turretConfig, runtime, nowMs); break; // Use harden as substitute stand-in
    case "shadow_shuriken": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "kunai_barrage": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "smoke_bomb": if (target) { target.controlLockedUntilMs = nowMs + 1500; target.controlLockSource = "smoke_bomb"; } break;
    case "wire_trap": if (target) { runtime.wireTrapTargetId = target.id; runtime.wireTrapUntilMs = nowMs + 2000; } break;
    case "exploding_tag": runtime.explodingTagX = target?.x ?? tx; runtime.explodingTagY = target?.y ?? ty; runtime.explodingTagActive = true; break;
    // ── Transformations (misc) ───────────────────────────────────────────────
    case "ultra_form": runtime.ultraFormUntilMs = nowMs + 8000; break;
    case "demon_form": runtime.demonFormUntilMs = nowMs + 8000; break;
    case "sage_mode": runtime.sageModeUntilMs = nowMs + 8000; runtime.sageModeNextRegenMs = nowMs + 1000; break;
    case "bankai_release": runtime.bankaiUntilMs = nowMs + 8000; runtime.bankaiNextPulseMs = nowMs + 500; break;
    case "susanoo_full": runtime.susanooFullUntilMs = nowMs + 8000; break;
    case "titan_shift": runtime.titanShiftUntilMs = nowMs + 8000; runtime.titanShiftNextPulseMs = nowMs + 1000; break;
    // ── One Piece ────────────────────────────────────────────────────────────
    case "gear_second": triggerGearSecond(turretConfig, runtime, nowMs); break;
    case "gear_fourth": applyGearFourth(turretConfig, runtime, beyblades, bridge, tx, ty, nowMs); break;
    case "conquerors_haki": applyConquerorsHaki(turretConfig, beyblades, tx, ty, nowMs); break;
    case "three_sword_style": applyThreeSwordStyle(turretConfig, beyblades, bridge, tx, ty); break;
    case "diable_jambe": if (target) applyDiableJambe(turretConfig, runtime, target, bridge, nowMs); break;
    // ── Demon Slayer ─────────────────────────────────────────────────────────
    case "water_breathing": applyWaterBreathing(turretConfig, beyblades, bridge, tx, ty); break;
    case "hinokami_kagura": applyHinokamiKagura(turretConfig, beyblades, bridge, tx, ty); break;
    case "thunder_breathing": if (target) applyThunderBreathing(turretConfig, target, bridge, nowMs); break;
    case "beast_breathing": applyBeastBreathing(turretConfig, beyblades, bridge, tx, ty); break;
    case "flame_breathing": applyFlameBreathing(turretConfig, beyblades, bridge, tx, ty); break;
    // ── Attack on Titan ──────────────────────────────────────────────────────
    case "thunder_spear": applyThunderSpear(turretConfig, beyblades, bridge, tx, ty); break;
    case "omni_directional": applyOmniDirectional(turretConfig, beyblades, bridge, tx, ty); break;
    case "hardening": applyHardening(turretConfig, runtime, beyblades, bridge, tx, ty, nowMs); break;
    case "founding_titan": applyFoundingTitan(turretConfig, runtime, beyblades, tx, ty, nowMs); break;
    // ── Stat-change / self-buff ───────────────────────────────────────────────
    case "swords_dance": runtime.swordsDanceChargesLeft = 3; break;
    case "meditate": runtime.meditatePrimed = true; break;
    case "nasty_plot": runtime.nastyPlotChargesLeft = 5; break;
    case "agility": runtime.agilityChargesLeft = 5; break;
    case "harden": triggerHarden(turretConfig, runtime, nowMs); break;
    case "defense_curl": triggerDefenseCurl(turretConfig, runtime, nowMs); break;
    case "withdraw": triggerWithdraw(turretConfig, runtime, nowMs); break;
    case "barrier": runtime.barrierActive = true; break;
    case "cosmic_power": runtime.cosmicPowerUntilMs = nowMs + 5000; break;
    case "tail_whip":
    case "growl": {
      const range2 = (turretConfig.attackRange ?? 25) * 24;
      for (const b of beyblades) {
        if (!b.isActive || b.isRingOut) continue;
        const dx = b.x - tx, dy = b.y - ty;
        if (dx * dx + dy * dy > range2 * range2) continue;
        b.damageMultiplier = (b.damageMultiplier ?? 1) * (attackType === "tail_whip" ? 1.3 : 1);
        b.spinDecayRate = (b.spinDecayRate ?? 8) * (attackType === "growl" ? 1.5 : 1);
      }
      break;
    }
    // ── Poison ───────────────────────────────────────────────────────────────
    case "poison_jab":
    case "venoshock": {
      const dmgPois = turretConfig.attackDamage ?? 10;
      if (target) { target.health -= dmgPois; target.damageReceived += dmgPois; }
      break;
    }
    // ── Psychic extra ─────────────────────────────────────────────────────────
    case "psyshock": if (target) { target.health -= turretConfig.attackDamage ?? 20; target.damageReceived += turretConfig.attackDamage ?? 20; } break;
    case "future_sight": if (target) {
      const pending = runtime.futureSightPending ?? (runtime.futureSightPending = []);
      pending.push({ targetId: target.id, landMs: nowMs + 3000, damage: turretConfig.attackDamage ?? 25 });
      break;
    }
    // ── Dragon type ──────────────────────────────────────────────────────────
    case "dragon_slash": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "dragon_breath": processDragonBreath(turretConfig, beyblades, tx, ty, 0, nowMs, Math.random); break;
    case "outrage": runtime.outrageRampageUntilMs = nowMs + 3000; break;
    // ── Ghost / Dark ─────────────────────────────────────────────────────────
    case "hex": if (target) { const mult = target.controlLockedUntilMs > nowMs ? 2 : 1; target.health -= (turretConfig.attackDamage ?? 15) * mult; target.damageReceived += (turretConfig.attackDamage ?? 15) * mult; } break;
    case "ghost_strike": if (target) { target.health -= turretConfig.attackDamage ?? 20; target.damageReceived += turretConfig.attackDamage ?? 20; } break;
    case "night_shade": if (target) { const dmgNs = target.health * 0.2; target.health -= dmgNs; target.damageReceived += dmgNs; } break;
    case "shadow_force": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "phantom_force": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Fairy ────────────────────────────────────────────────────────────────
    case "moonblast": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "dazzling_gleam": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Metal / Steel ────────────────────────────────────────────────────────
    case "flash_cannon": if (target) { target.health -= turretConfig.attackDamage ?? 20; target.damageReceived += turretConfig.attackDamage ?? 20; } break;
    case "bullet_punch": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    case "steel_surge": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "steel_ram": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "metal_sound": if (target) { runtime.metalSoundTargets = [...(runtime.metalSoundTargets ?? []), target.id]; } break;
    case "magnet_bomb": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Normal ───────────────────────────────────────────────────────────────
    case "tackle": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "drill_shot": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "hyper_voice": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Weather ──────────────────────────────────────────────────────────────
    case "sunny_day":
    case "rain_dance":
    case "sandstorm":
    case "hail_weather":
    case "misty_terrain":
    case "grassy_terrain":
    case "electric_terrain":
    case "psychic_terrain": {
      const weatherMap: Record<string, string> = {
        sunny_day: "sunny_day", rain_dance: "rain_dance", sandstorm: "sandstorm",
        hail_weather: "hail_weather", misty_terrain: "misty_terrain",
        grassy_terrain: "grassy_terrain", electric_terrain: "electric_terrain",
        psychic_terrain: "psychic_terrain",
      };
      runtime.weatherType = weatherMap[attackType];
      runtime.weatherExpiresMs = nowMs + (turretConfig.weatherDurationMs ?? 8000);
      break;
    }
    // ── Charge / Power ───────────────────────────────────────────────────────
    case "charge": runtime.swordsDanceChargesLeft = 1; break;
    case "charge_beam": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "skull_bash": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "solar_charge":
    case "solar_beam": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "extreme_speed": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "flare_blitz": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "thunder_ram":
    case "thunder_drive": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "power_drive": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    // ── Launcher ─────────────────────────────────────────────────────────────
    case "uppercut":
    case "launch_spike":
    case "sky_uppercut": if (target) { target.beyTiltAngle = Math.min(90, (target.beyTiltAngle ?? 0) + 45); applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    // ── MK ───────────────────────────────────────────────────────────────────
    case "spear_chain":
    case "cryo_lance":
    case "ring_blade":
    case "portal_strike":
    case "dragon_fireball":
    case "inferno_slam": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); break;
    // ── Fighting ─────────────────────────────────────────────────────────────
    case "cross_slash": if (target && target.spin < target.maxSpin * 0.5) { const d = (turretConfig.attackDamage ?? 20) * 1.5; target.health -= d; target.damageReceived += d; } else if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "impact_burst": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "armor_pierce": if (target) { target.health -= turretConfig.attackDamage ?? 20; target.damageReceived += turretConfig.attackDamage ?? 20; } break;
    case "flurry_barrage": if (target) { for (let i = 0; i < 5; i++) { const d = (turretConfig.attackDamage ?? 5) * (1 + i * 0.2); target.health -= d; target.damageReceived += d; } } break;
    case "mach_shot": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "gravity_grip": if (target) { runtime.gravityGripTargetId = target.id; runtime.gravityGripExpiresMs = nowMs + 2000; } break;
    case "ram_charge": if (target) { applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false); } break;
    case "graviton_throw": if (target) { const angle = Math.atan2(ty - target.y, tx - target.x); bridge.applyKnockback(target.id, { x: -Math.cos(angle), y: -Math.sin(angle) }, (turretConfig.attackForce ?? 120)); } break;
    // ── Close-range ──────────────────────────────────────────────────────────
    case "razor_spin": runtime.razorSpinAngleDeg = 0; break;
    case "point_blank": if (target) { const dist = Math.sqrt((target.x - tx) ** 2 + (target.y - ty) ** 2); if (dist < 80) { target.health -= turretConfig.attackDamage ?? 40; target.damageReceived += turretConfig.attackDamage ?? 40; } } break;
    case "static_field": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "acid_spray": if (target) { target.health -= turretConfig.attackDamage ?? 15; target.damageReceived += turretConfig.attackDamage ?? 15; } break;
    case "shockwave": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "spin_slash": runtime.spinSlashAngleDeg = 0; break;
    case "guillotine": if (target && target.spin < target.maxSpin * 0.25) { target.health -= turretConfig.attackDamage ?? 80; target.damageReceived += turretConfig.attackDamage ?? 80; } break;
    // ── Anti-grav ────────────────────────────────────────────────────────────
    case "anti_grav": if (target) { runtime.antiGravTargetId = target.id; runtime.antiGravLandMs = nowMs + 1500; runtime.antiGravOriginX = target.x; runtime.antiGravOriginY = target.y; } break;
    // ── Bug ──────────────────────────────────────────────────────────────────
    case "drain_sting": if (target) { const drainAmt = target.health * 0.15; target.health -= drainAmt; target.damageReceived += drainAmt; } break;
    case "string_shot": if (target) { target.controlLockedUntilMs = nowMs + 2000; target.controlLockSource = "string_shot"; } break;
    case "silver_wind": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Dark ─────────────────────────────────────────────────────────────────
    case "sting_bolt": if (target) { const dmgSb = (Math.random() < 0.3 ? 2 : 1) * (turretConfig.attackDamage ?? 15); target.health -= dmgSb; target.damageReceived += dmgSb; } break;
    case "foul_play": if (target) { const dmgFp = target.damageMultiplier * (turretConfig.attackDamage ?? 10); target.health -= dmgFp; target.damageReceived += dmgFp; } break;
    case "dark_pulse": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    // ── Bug extra ────────────────────────────────────────────────────────────
    case "absorb": if (target) { const absAmt = target.spin * 0.05; target.spin -= absAmt; } break;
    case "petal_dance": applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, true); break;
    case "bloom_doom": runtime.bloomDoomChargeStartMs = nowMs; runtime.bloomDoomAbsorbedSpin = 0; break;
    // ── Light / Solar ────────────────────────────────────────────────────────
    case "flash": for (const b of beyblades) { if (b.isActive) { b.controlLockedUntilMs = Math.max(b.controlLockedUntilMs, nowMs + 500); b.controlLockSource = "flash"; } } break;
    case "solar_flare": for (const b of beyblades) { if (b.isActive) { const d = turretConfig.attackDamage ?? 25; b.health -= d; b.damageReceived += d; b.controlLockedUntilMs = Math.max(b.controlLockedUntilMs, nowMs + 1000); b.controlLockSource = "solar_flare"; } } break;
    case "spark": if (target) { const dmgSp = target.controlLockedUntilMs > nowMs ? (turretConfig.attackDamage ?? 10) * 2 : (turretConfig.attackDamage ?? 10); target.health -= dmgSp; target.damageReceived += dmgSp; } break;
    default:
      // Unknown / unimplemented — apply generic damage
      applyGenericDamageKnockback(turretConfig, target, beyblades, bridge, tx, ty, false);
  }
}

// ── Per-tick dispatch: called every frame for ongoing effects ─────────────────

export function dispatchTurretTick(
  attackType: string,
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
  tx: number,
  ty: number,
  nowMs: number,
  dtMs: number,
): void {
  // Ongoing tick handlers — only active-effect types need cases here
  switch (attackType) {
    case "laser_sweep": processLaserSweep(turretConfig, runtime, beyblades, dtMs / 1000, bridge); break;
    case "tractor_beam": processTractorBeam(turretConfig, beyblades, dtMs / 1000, bridge); break;
    case "fire_spin": processFireSpinTick(turretConfig, { centerX: tx, centerY: ty, expiresMs: Infinity }, beyblades, nowMs, dtMs / 1000, bridge); break;
    case "leech_seed": {
      const lsTarget = beyblades.find(b => b.id === runtime.leechSeedTargetId && b.isActive);
      if (lsTarget && runtime.leechSeedExpiresMs && nowMs < runtime.leechSeedExpiresMs) processLeechSeedTick(turretConfig, lsTarget, dtMs / 1000);
      break;
    }
    case "vine_whip": {
      const vwTarget = beyblades.find(b => b.id === runtime.vineWhipTargetId && b.isActive);
      if (vwTarget && runtime.vineWhipExpiresMs && nowMs < runtime.vineWhipExpiresMs) processVineWhipTick(turretConfig, vwTarget, tx, ty, dtMs / 1000, bridge);
      break;
    }
    case "gravity_field": processGravityFieldTick(turretConfig, beyblades, dtMs / 1000, bridge); break;
    case "sand_tomb": processSandTombTick(turretConfig, { centerX: runtime.sandTombCenterX ?? tx, centerY: runtime.sandTombCenterY ?? ty, expiresMs: runtime.sandTombExpiresMs ?? nowMs }, beyblades, nowMs, dtMs / 1000, bridge); break;
    case "whirlpool": processWhirlpoolTick(turretConfig, { centerX: runtime.whirlpoolCenterX ?? tx, centerY: runtime.whirlpoolCenterY ?? ty, expiresMs: runtime.whirlpoolExpiresMs ?? nowMs }, beyblades, nowMs, dtMs / 1000, bridge); break;
    case "spore": processSporeCloudTick(turretConfig, { x: runtime.sporeCenterX ?? tx, y: runtime.sporeCenterY ?? ty, expiresMs: runtime.sporeExpiresMs ?? nowMs }, beyblades, nowMs, dtMs / 1000); break;
    case "aqua_ring": processAquaRingTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "magma_storm": processMagmaStorm(turretConfig, runtime, beyblades, dtMs / 1000); break;
    case "daiguren_ice": processDaiGurenTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "muken_poison": processMukenPoisonTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "zanka_incinerate": processZankaFieldTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "hihio_construct": processHihioSweepTick(turretConfig, runtime, beyblades, tx, ty, nowMs, dtMs); break;
    case "sand_burial": processSandBurialTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "amaterasu": processAmaterasuTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "susanoo": processSusanooTick(turretConfig, runtime, beyblades, bridge, tx, ty, nowMs); break;
    case "hundred_kicks": processHundredKicksTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "electric_body": processElectricBodyTick(turretConfig, runtime, beyblades, tx, ty, nowMs, dtMs); break;
    case "spirit_bomb": processSpiritBombTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    // Dragon Ball extended ticks
    case "cell_jr_spawn": processCellJrTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "chocolate_beam": processChocolateBeamTick(runtime, beyblades, nowMs); break;
    case "death_ball": processDeathBallTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "gear_second": processGearSecondTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "diable_jambe": processDiableJambeTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "founding_titan": processFoundingTitanTick(turretConfig, runtime, beyblades, tx, ty, nowMs, dtMs); break;
    case "chibaku_tensei": processChibakuTenseiTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "earth_grudge_fear": processEarthGrudgeTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "kamui": processKamuiTick(runtime, beyblades, nowMs); break;
    case "wood_dragon": processWoodDragonTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "spiral_eye": processSpiralEyeTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "phantom_pass": processPhantomPassTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "black_zetsu_bind": processBlackZetsuTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "truth_seeker_orbs": processTruthSeekerOrbsTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "preta_path": processPretaPathTick(beyblades, nowMs); break;
    case "eight_gates_release": processEightGatesTick(turretConfig, runtime, beyblades, nowMs, dtMs); break;
    case "kyoka_suigetsu": processKyokaSuigetsuTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "respira": processRespiraTick(turretConfig, runtime, beyblades, bridge, nowMs, dtMs); break;
    case "mirror_world": processMirrorWorldTick(turretConfig, runtime, beyblades, nowMs); break;
    case "perfect_mirage": processPerfectMirageTick(runtime, beyblades, nowMs); break;
    case "phantasmal_shift": processPhantasmalShiftTick(runtime, beyblades, nowMs); break;
    case "genjutsu_veil": processGenjutsuVeilTick(turretConfig, runtime, beyblades, nowMs); break;
    case "false_flag": processFalseFlagTick(runtime, beyblades, nowMs); break;
    case "mind_fracture": processMindFractureTick(runtime, beyblades, nowMs); break;
    case "clay_spider": processClaySpiderTick(turretConfig, runtime, beyblades, bridge, dtMs); break;
    case "clay_dragon": processClayDragonTick(turretConfig, runtime, beyblades, bridge, dtMs); break;
    case "clay_bomb": processClayBombTick(turretConfig, runtime, beyblades, bridge); break;
    case "clay_clones_c4": processClayC4Tick(beyblades, nowMs, dtMs); break;
    case "berserk_hollow": processBerserkHollowTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "railbey": processRailbeyTick(runtime, beyblades, bridge, nowMs); break;
    case "minigun_bey": processMinigunBeyTick(runtime, beyblades, bridge, nowMs); break;
    case "bomb_bey": processBombBeyTick(runtime, beyblades, bridge, nowMs); break;
    case "turbo_bey": processTurboBeyTick(runtime, beyblades, nowMs); break;
    case "speed_surge": processSpeedSurgeTick(runtime, beyblades, nowMs); break;
    case "gravity_flip": processGravityFlipTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "magnet_bey": processMagnetBeyTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    case "bounce_storm": processBounceStormTick(runtime, beyblades, nowMs); break;
    case "freeze_step": processFreezeStepTick(runtime, beyblades, bridge, nowMs); break;
    case "ghost_walk": processGhostWalkTick(runtime, beyblades, nowMs); break;
    case "boomerang_path": processBoomerangPathTick(turretConfig, runtime, beyblades, bridge, dtMs / 1000, nowMs); break;
    case "teleport_dash": processTeleportDashTick(turretConfig, runtime, beyblades, bridge, nowMs); break;
    // Future-sight: check for pending deferred strikes
    default: break;
  }

  // Universal tick effects (checked regardless of attack type)
  applyActiveBurns(beyblades, nowMs);
  if (runtime.timeStopUntilMs && nowMs < runtime.timeStopUntilMs) {
    for (const b of beyblades) { bridge.setVelocity?.(b.id, 0, 0); }
  }
  if (runtime.futureSightPending) {
    for (let i = runtime.futureSightPending.length - 1; i >= 0; i--) {
      const p = runtime.futureSightPending[i];
      if (nowMs >= p.landMs) {
        const tb = beyblades.find(b => b.id === p.targetId && b.isActive);
        if (tb) { tb.health -= p.damage; tb.damageReceived += p.damage; }
        runtime.futureSightPending.splice(i, 1);
      }
    }
  }
  if (runtime.timeLoopFireMs && runtime.timeLoopTargetId && nowMs >= runtime.timeLoopFireMs) {
    const tlb = beyblades.find(b => b.id === runtime.timeLoopTargetId && b.isActive);
    if (tlb) { tlb.health -= (runtime.timeLoopDamage ?? 0); tlb.damageReceived += (runtime.timeLoopDamage ?? 0); }
    runtime.timeLoopFireMs = undefined;
  }
  if (attackType === "samehada_drain") {
    applySamehadaDrain(turretConfig, beyblades, tx, ty, dtMs);
  }
}

// ── Main turret tick loop (called from BattleRoom) ───────────────────────────

export function tickTurrets(
  turretSchemas: Map<string, { attackType: string; x: number; y: number; cooldown: number; cooldownEndTime: number; lastFireTime: number; isActive: boolean; isDestroyed: boolean; firePattern?: string }>,
  turretConfigs: any[],
  turretRuntimes: Map<string, TurretRuntimeState>,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
  nowMs: number,
  dtMs: number,
): void {
  for (const [turretId, ts] of turretSchemas) {
    if (!ts.isActive || ts.isDestroyed) continue;

    const cfg = turretConfigs.find((c: any) => c.id === turretId) ?? turretConfigs[0];
    if (!cfg) continue;

    if (!turretRuntimes.has(turretId)) turretRuntimes.set(turretId, {});
    const runtime = turretRuntimes.get(turretId)!;

    const tx = ts.x * 24;
    const ty = ts.y * 24;

    // Always run per-tick effects
    dispatchTurretTick(ts.attackType, cfg, runtime, beyblades, bridge, tx, ty, nowMs, dtMs);

    // Check cooldown for next fire
    if (nowMs >= ts.cooldownEndTime) {
      const roundRobinIdx = (runtime as any)._rrIndex ?? 0;
      const target = selectTarget(
        (cfg.firePattern ?? ts.firePattern) as string | undefined,
        beyblades, tx, ty, roundRobinIdx, ts.x,
      );
      (runtime as any)._rrIndex = (roundRobinIdx + 1) % Math.max(1, beyblades.filter(b => b.isActive).length);

      dispatchTurretFire(ts.attackType, cfg, runtime, target, beyblades, bridge, tx, ty, nowMs);

      const cooldownMs = (ts.cooldown ?? 2) * 1000;
      ts.cooldownEndTime = nowMs + cooldownMs;
      ts.lastFireTime = nowMs;
    }
  }
}
