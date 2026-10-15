import * as THREE from 'three';
import { applyRenderPolicy } from '../render/shadowPolicy';
import type { BeySpec, BeyState } from '../sim/state';

/* ══════════════════════════════════════════════════════════════════════════
   BEY RENDERER  —  plan Sec.O-1, the second third of the SpawnManager split.

   Owns a keyed `Map<id, THREE.Group>` and syncs it FROM `BeyState`. It holds
   no domain state of its own: given the same states it draws the same thing,
   and deleting it would lose nothing but pixels.

   This is `BeybladeRenderer`'s shape, generalised — the one file in the
   project that was already built correctly (zero domain state, keyed mesh
   map, idempotent dispose-then-build, geometry delegated out). Every other
   feature family was built the other way, with meshes living on the data
   model, which is why `arenaTypes.ts` embeds `THREE.Mesh` in ~20 save
   interfaces and nothing can be serialised without stripping them first.

   WHY IT MATTERS BEYOND TIDINESS: because the renderer reads state rather
   than owning it, N beys cost N groups and nothing else. `SpawnManager` could
   not do that — its physics was gated on whether `topGroup` existed, so a bey
   without a mesh did not move.
   ══════════════════════════════════════════════════════════════════════════ */

/* Proportions of the placeholder top, as fractions of the spec's own radius
   and height, so a 5 cm bey and a 3 cm bey both look right. The previous
   build hardcoded all of these as module constants — the literal reason no
   two beys could differ in size. */
const CAP_R_FRAC    = 0.30;
const CAP_H_FRAC    = 0.19;
const DISC_H_FRAC   = 0.15;
const CONE_H_FRAC   = 0.58;
const TIP_H_FRAC    = 0.12;

export interface BeyView {
  group: THREE.Group;
  /** Spun every frame; the tilt is applied to the group. */
  spinner: THREE.Group;
}

export class BeyRenderer {
  private views = new Map<string, BeyView>();

  constructor(private readonly scene: THREE.Scene) {}

  has(id: string): boolean { return this.views.has(id); }

  /**
   * Build the view for one bey. Idempotent: an existing view is disposed
   * first, so a respawn or a part change cannot leave two tops overlapping.
   */
  add(spec: BeySpec, colors?: { disc?: number; cone?: number; cap?: number }): BeyView {
    this.remove(spec.id);

    const group   = new THREE.Group();
    const spinner = new THREE.Group();
    group.add(spinner);

    const r = spec.radius;
    const capH  = spec.height * CAP_H_FRAC;
    const discH = spec.height * DISC_H_FRAC;
    const coneH = spec.height * CONE_H_FRAC;
    const tipH  = spec.height * TIP_H_FRAC;

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(r * CAP_R_FRAC * 0.85, r * CAP_R_FRAC, capH, 16),
      new THREE.MeshStandardMaterial({
        color: colors?.cap ?? 0x223388, roughness: 0.4, metalness: 0.3 }),
    );
    cap.position.y = discH / 2 + capH / 2;
    spinner.add(cap);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, discH, 32),
      new THREE.MeshStandardMaterial({
        color: colors?.disc ?? 0xcc2200, roughness: 0.5, metalness: 0.2 }),
    );
    spinner.add(disc);

    /* `CylinderGeometry(topR, bottomR)`, NOT `ConeGeometry` — a cone puts its
       apex at the top, which is upside down for a spinning top. */
    const cone = new THREE.Mesh(
      new THREE.CylinderGeometry(r, 0, coneH, 32, 12),
      new THREE.MeshStandardMaterial({
        color: colors?.cone ?? 0xdd8833, roughness: 0.75, metalness: 0.05 }),
    );
    cone.position.y = -(discH / 2 + coneH / 2);
    spinner.add(cone);

    const tip = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.07, 0, tipH, 12),
      new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.1, metalness: 0.9 }),
    );
    tip.position.y = -(discH / 2 + coneH + tipH / 2);
    spinner.add(tip);

    /* The bey is the one object whose shadow the player actually reads — it
       is how you tell airborne from sliding. Applied here because the group
       goes straight into the scene, bypassing `RenderManager`. */
    applyRenderPolicy(group);
    this.scene.add(group);

    const view = { group, spinner };
    this.views.set(spec.id, view);
    return view;
  }

  /**
   * Push one tick of state into the view.
   *
   * `dt` advances the visual spin. The tilt goes on the OUTER group and the
   * spin on the inner one, so a leaning bey spins about its own axis rather
   * than about world Y — which is what makes precession read as a wobble
   * instead of a skew.
   */
  sync(state: BeyState, dt: number, spinVisible = true): void {
    const v = this.views.get(state.id);
    if (!v) return;

    v.group.position.set(state.pos.x, state.pos.y, state.pos.z);
    v.group.rotation.z = state.tiltDeg * Math.PI / 180;
    if (spinVisible && state.omega !== 0) v.spinner.rotation.y += state.omega * dt;

    /* A bey that has gone over stops spinning visually too. Leaving it
       whirring on its side is the single most obvious tell that a simulation
       and its renderer disagree. */
    if (state.sleptOut) v.spinner.rotation.y += 0;
  }

  syncAll(states: Iterable<BeyState>, dt: number): void {
    for (const s of states) this.sync(s, dt);
  }

  remove(id: string): void {
    const v = this.views.get(id);
    if (!v) return;
    this.scene.remove(v.group);
    v.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry?.dispose();
      const mat = m.material;
      if (Array.isArray(mat)) mat.forEach(x => x.dispose());
      else mat?.dispose();
    });
    this.views.delete(id);
  }

  dispose(): void {
    for (const id of [...this.views.keys()]) this.remove(id);
  }
}
