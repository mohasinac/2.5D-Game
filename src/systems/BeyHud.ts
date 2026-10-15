import type { BeyEntity } from './BeySystem';
import type { Gauges } from './BattleGauges';
import { ACTIVE_MAX, XTREME_MAX } from './BattleGauges';
import { omegaToRpm } from '../sim/step/spin';
import type { RoundResult } from './MatchSystem';

/* ══════════════════════════════════════════════════════════════════════════
   BEY HUD  —  plan Sec.O-1, the last third of the SpawnManager split, and
   Sec.L's battle HUD.

   WHAT IT REPLACES. `SpawnManager` had a `hudEl` injected into the
   constructor of a PHYSICS class, and the markup was numeric telemetry —
   Vx/Vy/Vz and spawn inputs — which is a developer tool and reads like one.

   THE GAUGE TAXONOMY IS XONE'S, because it is the genre's own solved answer
   and it resolves a real contradiction rather than being a style choice:
   Survivor (spin), Burst, Active (fills with time, pays combos) and Xtreme
   (earned through attacks, pays specials).

   LAYOUT RULES, from fighting-game practice: bars at the top draining toward
   the CENTRE so both are comparable without scanning opposite screen edges;
   each meter adjacent to its own lifebar, never in the opposite corner; no
   curved meters, because segment boundaries become unreadable and a special
   costs an exact amount; and round pips that show HOW each round was won,
   not merely how many. The guiding principle is that less scanning is
   better.

   Writes DOM only. No physics, no state of its own — given the same entities
   it renders the same markup.
   ══════════════════════════════════════════════════════════════════════════ */

export interface HudEntityView {
  entity: BeyEntity;
  gauges: Gauges;
  /** Burst progress 0..1. */
  burst: number;
  label: string;
}

/** Symbols for the round pips, so a glance says how the round ended. */
const FINISH_ICON: Record<string, string> = {
  burst: '✸', ring_out: '⤴', sleep_out: '◠', health: '✚',
  timeout: '⏱', draw: '=',
};

const pct = (v: number, max: number): number =>
  max > 0 ? Math.max(0, Math.min(100, (v / max) * 100)) : 0;

export class BeyHud {
  private el: HTMLElement;

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'battle-hud';
    this.el.style.display = 'none';
    parent.appendChild(this.el);
  }

  setVisible(visible: boolean): void {
    this.el.style.display = visible ? 'flex' : 'none';
  }

  /**
   * Render one frame.
   *
   * Rebuilds the markup wholesale rather than diffing. The HUD is a handful
   * of bars at 60 Hz; a diffing layer here would be more code than it saves
   * and would be one more place for the display to drift from the state it
   * claims to show.
   */
  render(views: readonly HudEntityView[], rounds: readonly RoundResult[]): void {
    const pips = rounds
      .map(r => `<span class="hud-pip" title="${r.kind}">${FINISH_ICON[r.kind] ?? '•'}</span>`)
      .join('');

    this.el.innerHTML = `
      <div class="hud-row">
        ${views.map((v, i) => this.side(v, i === 0)).join('')}
      </div>
      <div class="hud-pips">${pips}</div>
    `;
  }

  /**
   * One player's stack. `mirrored` flips the fill direction so both bars
   * drain toward the centre of the screen.
   */
  private side(v: HudEntityView, mirrored: boolean): string {
    const s = v.entity.state;
    const rpm = Math.round(omegaToRpm(Math.abs(s.omega)));
    const dir = s.spinDir === 'left' ? '↺' : '↻';

    /* Survivor is spin against the spin this bey LAUNCHED with, not against
       a global maximum — otherwise a light stamina bey always reads as
       nearly empty and the bar says nothing useful. */
    const survivor = pct(Math.abs(s.omega), Math.max(1, v.entity.spec.inertiaSpin > 0 ? 600 : 1));

    return `
      <div class="hud-side ${mirrored ? 'hud-mirror' : ''}">
        <div class="hud-name">${v.label} <span class="hud-dir">${dir}</span></div>
        <div class="hud-bar hud-survivor"><i style="width:${survivor}%"></i></div>
        <div class="hud-bar hud-burst"><i style="width:${pct(v.burst, 1)}%"></i></div>
        <div class="hud-meters">
          <div class="hud-bar hud-active"><i style="width:${pct(v.gauges.active, ACTIVE_MAX)}%"></i></div>
          <div class="hud-bar hud-xtreme"><i style="width:${pct(v.gauges.xtreme, XTREME_MAX)}%"></i></div>
        </div>
        <div class="hud-rpm">${rpm} rpm${s.sleptOut ? ' · OUT' : ''}</div>
      </div>
    `;
  }

  /** A full-width banner — the win call, or a forceState compulsion. */
  banner(text: string, kind: 'win' | 'force' | 'qte' = 'win'): void {
    const b = document.createElement('div');
    b.className = `hud-banner hud-banner-${kind}`;
    b.textContent = text;
    this.el.appendChild(b);
  }

  clearBanners(): void {
    this.el.querySelectorAll('.hud-banner').forEach(n => n.remove());
  }

  dispose(): void { this.el.remove(); }
}
