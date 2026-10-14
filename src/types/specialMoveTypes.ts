import type * as THREE from 'three';

export interface SpecialMoveProjectileCmd {
  radius:      number;   // cm
  speed:       number;   // cm/s
  lifetime:    number;   // seconds
  color:       number;
}

export interface SpecialMoveHitEffect {
  hitRadius:    number;  // cm from caster to target that counts as "hit"
  damageAmount: number;  // HP reduction
  knockback:    'away' | 'down' | 'radial' | 'none';
  impulseMag:   number;  // cm/s
}

export interface SpecialMoveVfx {
  particlePreset: string | null;
  auraColor:      number | null;
}

export interface SpecialMovePhase {
  id:           string;
  label:        string;
  durationSec:  number;
  velocityBoost: { x: number; y: number; z: number } | null;
  projectile:   SpecialMoveProjectileCmd | null;
  hitEffect:    SpecialMoveHitEffect | null;
  vfx:          SpecialMoveVfx;
  nextPhaseId:  string | null;
  loopCount:    number;   // 0 = no loop, N = repeat N times before transitioning
  // runtime only
  _loopAccum:   number;
}

export interface SpecialMoveDefinition {
  id:            string;
  name:          string;
  casterName:    string;
  moveClass:     string;  // user-defined label: "Offensive", "Finisher", etc.
  description:   string;
  resonanceCost: number;  // 0–100
  cooldownSec:   number;
  entryPhaseId:  string;
  phases:        Map<string, SpecialMovePhase>;
  // runtime only
  _lastUsedAt:   number;  // performance.now() timestamp
}

export interface SpecialMoveSave {
  id:            string;
  name:          string;
  casterName:    string;
  moveClass:     string;
  description:   string;
  resonanceCost: number;
  cooldownSec:   number;
  entryPhaseId:  string;
  phases:        SpecialMovePhaseSave[];
}

export interface SpecialMovePhaseSave {
  id:           string;
  label:        string;
  durationSec:  number;
  velocityBoost: { x: number; y: number; z: number } | null;
  projectile:   SpecialMoveProjectileCmd | null;
  hitEffect:    SpecialMoveHitEffect | null;
  vfx:          SpecialMoveVfx;
  nextPhaseId:  string | null;
  loopCount:    number;
}

export function defaultSpecialMovePhase(id: string): SpecialMovePhase {
  return {
    id,
    label:         'Phase 1',
    durationSec:   0.8,
    velocityBoost: { x: 0, y: 5, z: 0 },
    projectile:    null,
    hitEffect:     null,
    vfx:           { particlePreset: null, auraColor: null },
    nextPhaseId:   null,
    loopCount:     0,
    _loopAccum:    0,
  };
}

export function defaultSpecialMove(id: string): SpecialMoveDefinition {
  const phaseId = `${id}-ph-1`;
  return {
    id,
    name:          'New Move',
    casterName:    '',
    moveClass:     'Offensive',
    description:   '',
    resonanceCost: 40,
    cooldownSec:   5,
    entryPhaseId:  phaseId,
    phases:        new Map([[phaseId, defaultSpecialMovePhase(phaseId)]]),
    _lastUsedAt:   0,
  };
}

export function specialMoveToSave(def: SpecialMoveDefinition): SpecialMoveSave {
  return {
    id:            def.id,
    name:          def.name,
    casterName:    def.casterName,
    moveClass:     def.moveClass,
    description:   def.description,
    resonanceCost: def.resonanceCost,
    cooldownSec:   def.cooldownSec,
    entryPhaseId:  def.entryPhaseId,
    phases:        [...def.phases.values()].map(ph => ({
      id:           ph.id,
      label:        ph.label,
      durationSec:  ph.durationSec,
      velocityBoost: ph.velocityBoost,
      projectile:   ph.projectile,
      hitEffect:    ph.hitEffect,
      vfx:          ph.vfx,
      nextPhaseId:  ph.nextPhaseId,
      loopCount:    ph.loopCount,
    })),
  };
}

export function specialMoveFromSave(s: SpecialMoveSave): SpecialMoveDefinition {
  const phases = new Map<string, SpecialMovePhase>();
  for (const ph of s.phases) {
    phases.set(ph.id, { ...ph, _loopAccum: 0 });
  }
  return {
    id:            s.id,
    name:          s.name,
    casterName:    s.casterName,
    moveClass:     s.moveClass,
    description:   s.description,
    resonanceCost: s.resonanceCost,
    cooldownSec:   s.cooldownSec,
    entryPhaseId:  s.entryPhaseId,
    phases,
    _lastUsedAt:   0,
  };
}

// target-dummy state
export interface TargetDummyState {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  hp:  number;
}
