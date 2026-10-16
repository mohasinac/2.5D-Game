import { assemble, isLegal, type AssemblyPart, type AssemblySlot } from './assembler';
import type { LivePart } from '../sim/step/partMutation';
import { makeBeySpec } from '../sim/state';
import type { BeySpec } from '../sim/state';
import type { BeybladeBuildConfig, PartData } from '../types/beybladeTypes';
import type { BeyTipType } from '../config/arenaConstants';

/* ══════════════════════════════════════════════════════════════════════════
   THE BRIDGE THE PROJECT NEVER HAD: a built bey becomes a physics body.

   "The bey you build in /beyblade NEVER becomes a physics body — it stays in
   the editor." That was true from the beginning: `SpawnManager`'s mass, size
   and inertia were module constants, so the builder could not have fed them
   even if someone had tried.

   Now that `BeySpec` carries mass, inertia and centre of mass, and the
   assembler composes all three from a part stack, this is the short function
   that joins them.

   PART TYPE IS INFERRED, and that is a stopgap worth naming. `PartData` has
   NO type field — `BeyPartType` exists only on presets — so there is nothing
   authoritative to read. The heuristic below uses vertical order and
   geometry, which is right for a conventional stack and wrong for anything
   unusual. The real fix is `partType` on `PartData` (plan Sec.E4); until
   then an inferred slot is better than no physics at all, as long as nobody
   mistakes it for authored data.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Guess a slot from where a part sits and how wide it is.
 *
 * Bottom-most becomes the blade base because something has to carry the tip;
 * the widest becomes the attack ring because reach is what an AR is for; the
 * densest-looking middle part becomes the weight disk. Crude, and labelled.
 */
export function inferSlot(part: PartData, index: number, total: number): AssemblySlot {
  if (index === 0) return 'blade_base';
  if (index === total - 1 && total > 2) return 'bit_chip';
  if (index === 1) return 'spin_gear';
  return index === 2 ? 'weight_disk' : 'attack_ring';
}

/** Outer radius of a part, from its sectors or its own extent. */
function outerRadiusOf(part: PartData): number {
  const r = Math.max(part.topRadiusX ?? 0, part.topRadiusZ ?? 0,
                     part.bottomRadiusX ?? 0, part.bottomRadiusZ ?? 0);
  return r > 0 ? r : 2.5;
}

function innerRadiusOf(part: PartData): number {
  return part.isHollow ? outerRadiusOf(part) * 0.55 : 0;
}

/** Map the builder's tip description onto a physics tip archetype. */
export function inferTipType(config: BeybladeBuildConfig): BeyTipType {
  const base = config.parts[0];
  const shape = (base as unknown as { tipShape?: string })?.tipShape ?? '';
  const s = shape.toLowerCase();
  if (s.includes('rubber')) return 'rubber_flat';
  if (s.includes('metal'))  return 'metal_flat';
  if (s.includes('sharp') || s.includes('spike')) return 'sharp';
  if (s.includes('ball'))   return 'ball';
  if (s.includes('wide'))   return 'wide_flat';
  if (s.includes('bearing') || s.includes('eternal')) return 'bearing';
  return 'hard_flat';
}

export interface BuildToSpecResult {
  spec: BeySpec;
  /** Problems the assembler found — a bad weight invariant, a missing base. */
  issues: ReturnType<typeof assemble>['issues'];
  legal: boolean;
  /**
   * The part stack as the simulation carries it, gimmicks included.
   *
   * Hand this to `BeySystem.add`'s fourth argument and the bey arrives with
   * its gimmicks live. Omitting it leaves `parts: []`, which is the state
   * that made every runtime mutation unreachable (defect 11).
   */
  parts: LivePart[];
}

/**
 * Turn a builder config into a simulation spec.
 *
 * Mass, inertia and centre of mass all come from the stack rather than from
 * defaults, so two differently-built beys genuinely differ in play — which
 * is the entire point of the part library existing.
 */
export function specFromBuild(id: string, config: BeybladeBuildConfig): BuildToSpecResult {
  const total = config.parts.length;
  const parts: AssemblyPart[] = config.parts.map((p, i) => ({
    id: p.id,
    name: p.name ?? p.id,
    slot: inferSlot(p, i, total),
    weight: Math.max(0.01, p.weight ?? 1),
    innerRadius: innerRadiusOf(p),
    outerRadius: outerRadiusOf(p),
    height: Math.max(0.1, p.height ?? 1),
    tipType: i === 0 ? inferTipType(config) : undefined,
    /* AUTHORED, not inferred — unlike `slot` above. `gimmickType` and
       `gimmickStrength` are real fields on `PartData` that the builder's
       panel already writes; they have simply never been read by anything,
       which is defect 10. This is the read. */
    gimmick: p.gimmickType,
    gimmickStrength: p.gimmickStrength,
  }));

  const built = assemble(parts);

  /* A zero-mass or zero-inertia assembly would make the heavy-top model
     divide by zero, so the defaults stand in rather than propagating. */
  const spec = makeBeySpec(id, {
    mass:        built.mass > 0 ? built.mass : undefined,
    inertiaSpin: built.inertiaSpin > 0 ? built.inertiaSpin : undefined,
    comY:        built.comY > 0 ? built.comY : undefined,
    radius:      built.radius > 0 ? built.radius : undefined,
    height:      built.height > 0 ? built.height : undefined,
    tipType:     built.tipType ?? undefined,
  });

  return { spec, issues: built.issues, legal: isLegal(built), parts: built.live };
}
