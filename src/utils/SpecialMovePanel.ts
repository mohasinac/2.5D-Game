import type { SpecialMoveManager } from '../features/managers/SpecialMoveManager';
import type {
  SpecialMoveDefinition,
  SpecialMovePhase,
} from '../types/specialMoveTypes';
import {
  defaultSpecialMove,
  defaultSpecialMovePhase,
} from '../types/specialMoveTypes';

export class SpecialMovePanel {
  private _smMgr: SpecialMoveManager;
  private _onSave: () => void;
  private _el: HTMLElement;
  private _selectedMoveId: string | null = null;
  private _selectedPhaseId: string | null = null;

  constructor(
    container: HTMLElement,
    smMgr: SpecialMoveManager,
    onSave: () => void,
  ) {
    this._smMgr   = smMgr;
    this._onSave  = onSave;

    container.innerHTML = `
      <div class="sm-panel">
        <div class="sm-panel-header">⚔ SPECIAL MOVES</div>
        <div class="sm-move-list" id="smp-move-list"></div>
        <div class="sm-panel-actions">
          <button class="sm-btn" id="smp-add-move">+ Add Move</button>
          <button class="sm-btn sm-btn--save" id="smp-save">💾 Save</button>
        </div>
        <div class="sm-move-detail hidden" id="smp-move-detail"></div>
        <div class="sm-phase-list-wrap hidden" id="smp-phase-list-wrap">
          <div class="sm-panel-section-title">PHASES</div>
          <div class="sm-phase-list" id="smp-phase-list"></div>
          <div class="sm-panel-actions">
            <button class="sm-btn" id="smp-add-phase">+ Add Phase</button>
            <button class="sm-btn sm-btn--danger" id="smp-del-move">✕ Delete Move</button>
          </div>
        </div>
        <div class="sm-phase-detail hidden" id="smp-phase-detail"></div>
      </div>
    `;
    this._el = container;

    this._el.querySelector('#smp-add-move')!.addEventListener('click', () => this._addMove());
    this._el.querySelector('#smp-save')!.addEventListener('click', () => this._onSave());
    this._el.querySelector('#smp-add-phase')!.addEventListener('click', () => this._addPhase());
    this._el.querySelector('#smp-del-move')!.addEventListener('click', () => this._deleteSelectedMove());

    this._renderMoveList();
  }

  // ── Move list ──────────────────────────────────────────────────────────────

  private _renderMoveList(): void {
    const listEl = this._el.querySelector<HTMLElement>('#smp-move-list')!;
    listEl.innerHTML = '';
    for (const [id, def] of this._smMgr.getAllMoves()) {
      const item = document.createElement('div');
      item.className = 'sm-move-item' + (id === this._selectedMoveId ? ' sm-move-item--active' : '');
      item.innerHTML = `
        <div class="sm-move-item-name">${this._esc(def.name)}</div>
        <div class="sm-move-item-meta">${this._esc(def.moveClass)} · ${def.resonanceCost} res</div>
      `;
      item.addEventListener('click', () => this._selectMove(id));
      listEl.appendChild(item);
    }

    if (this._smMgr.getAllMoves().size === 0) {
      listEl.innerHTML = '<div class="sm-empty">No moves yet</div>';
    }
  }

  private _selectMove(id: string): void {
    this._selectedMoveId  = id;
    this._selectedPhaseId = null;
    this._smMgr.selectMove(id);
    this._renderMoveList();
    this._renderMoveDetail();
    this._renderPhaseList();
    this._clearPhaseDetail();
  }

  private _addMove(): void {
    const def = this._smMgr.addMove();
    this._onSave();
    this._selectMove(def.id);
  }

  private _deleteSelectedMove(): void {
    if (!this._selectedMoveId) return;
    this._smMgr.removeMove(this._selectedMoveId);
    this._selectedMoveId  = null;
    this._selectedPhaseId = null;
    this._smMgr.selectMove(null);
    this._onSave();
    this._renderMoveList();
    this._hideMoveDetail();
    this._clearPhaseDetail();
  }

  // ── Move detail ────────────────────────────────────────────────────────────

  private _renderMoveDetail(): void {
    const id  = this._selectedMoveId;
    if (!id) { this._hideMoveDetail(); return; }
    const def = this._smMgr.getMove(id);
    if (!def) { this._hideMoveDetail(); return; }

    const detailEl = this._el.querySelector<HTMLElement>('#smp-move-detail')!;
    detailEl.classList.remove('hidden');

    detailEl.innerHTML = `
      <div class="sm-panel-section-title">MOVE PROPERTIES</div>
      <div class="sm-field-row">
        <label class="sm-field-label">Name</label>
        <input class="sm-field-input" id="smf-name" type="text" value="${this._esc(def.name)}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Caster</label>
        <input class="sm-field-input" id="smf-caster" type="text" value="${this._esc(def.casterName)}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Class</label>
        <input class="sm-field-input" id="smf-class" type="text" value="${this._esc(def.moveClass)}" placeholder="Offensive" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Description</label>
        <input class="sm-field-input" id="smf-desc" type="text" value="${this._esc(def.description)}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Resonance cost</label>
        <input class="sm-field-input sm-field-input--num" id="smf-cost" type="number" min="0" max="100" step="1" value="${def.resonanceCost}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Cooldown (s)</label>
        <input class="sm-field-input sm-field-input--num" id="smf-cooldown" type="number" min="0" max="60" step="0.5" value="${def.cooldownSec}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Entry phase</label>
        <select class="sm-field-select" id="smf-entry">
          ${[...def.phases.values()].map(ph => `<option value="${ph.id}" ${ph.id === def.entryPhaseId ? 'selected' : ''}>${this._esc(ph.label)}</option>`).join('')}
        </select>
      </div>
    `;

    const commit = () => {
      def.name          = (detailEl.querySelector<HTMLInputElement>('#smf-name')?.value   ?? '').trim() || 'New Move';
      def.casterName    = detailEl.querySelector<HTMLInputElement>('#smf-caster')?.value   ?? '';
      def.moveClass     = (detailEl.querySelector<HTMLInputElement>('#smf-class')?.value   ?? '').trim() || 'Offensive';
      def.description   = detailEl.querySelector<HTMLInputElement>('#smf-desc')?.value    ?? '';
      def.resonanceCost = Math.max(0, Math.min(100, parseFloat(detailEl.querySelector<HTMLInputElement>('#smf-cost')?.value     ?? '40') || 40));
      def.cooldownSec   = Math.max(0, parseFloat(detailEl.querySelector<HTMLInputElement>('#smf-cooldown')?.value ?? '5')    || 0);
      def.entryPhaseId  = detailEl.querySelector<HTMLSelectElement>('#smf-entry')?.value  ?? def.entryPhaseId;
      this._smMgr.updateMove(def);
      this._onSave();
      this._renderMoveList();
    };

    for (const inp of detailEl.querySelectorAll('input,select')) {
      inp.addEventListener('change', commit);
    }

    // Show phase section
    this._el.querySelector<HTMLElement>('#smp-phase-list-wrap')!.classList.remove('hidden');
  }

  private _hideMoveDetail(): void {
    this._el.querySelector<HTMLElement>('#smp-move-detail')!.classList.add('hidden');
    this._el.querySelector<HTMLElement>('#smp-phase-list-wrap')!.classList.add('hidden');
  }

  // ── Phase list ─────────────────────────────────────────────────────────────

  private _renderPhaseList(): void {
    const id  = this._selectedMoveId;
    const def = id ? this._smMgr.getMove(id) : null;
    const listEl = this._el.querySelector<HTMLElement>('#smp-phase-list')!;
    listEl.innerHTML = '';

    if (!def) return;

    for (const [pid, phase] of def.phases) {
      const item = document.createElement('div');
      item.className = 'sm-phase-item' + (pid === this._selectedPhaseId ? ' sm-phase-item--active' : '');
      item.innerHTML = `
        <div class="sm-phase-item-name">${this._esc(phase.label)}</div>
        <div class="sm-phase-item-meta">${phase.durationSec.toFixed(2)}s${phase.velocityBoost ? ' + boost' : ''}${phase.projectile ? ' + proj' : ''}${phase.hitEffect ? ' + hit' : ''}</div>
      `;
      item.addEventListener('click', () => this._selectPhase(pid));
      listEl.appendChild(item);
    }

    if (def.phases.size === 0) {
      listEl.innerHTML = '<div class="sm-empty">No phases</div>';
    }
  }

  private _selectPhase(pid: string): void {
    this._selectedPhaseId = pid;
    this._renderPhaseList();
    this._renderPhaseDetail();
  }

  private _addPhase(): void {
    const id  = this._selectedMoveId;
    const def = id ? this._smMgr.getMove(id) : null;
    if (!def) return;

    const phaseSeq = def.phases.size + 1;
    const phaseId  = `${def.id}-ph-${phaseSeq}`;
    const phase    = defaultSpecialMovePhase(phaseId);
    phase.label    = `Phase ${phaseSeq}`;
    def.phases.set(phaseId, phase);

    this._smMgr.updateMove(def);
    this._onSave();
    this._selectPhase(phaseId);
    this._renderMoveDetail(); // refresh entry phase selector
    this._renderPhaseList();
  }

  // ── Phase detail ───────────────────────────────────────────────────────────

  private _renderPhaseDetail(): void {
    const mid = this._selectedMoveId;
    const pid = this._selectedPhaseId;
    if (!mid || !pid) { this._clearPhaseDetail(); return; }
    const def   = this._smMgr.getMove(mid);
    const phase = def?.phases.get(pid);
    if (!def || !phase) { this._clearPhaseDetail(); return; }

    const detailEl = this._el.querySelector<HTMLElement>('#smp-phase-detail')!;
    detailEl.classList.remove('hidden');

    const vb = phase.velocityBoost ?? { x: 0, y: 0, z: 0 };
    const pr = phase.projectile;
    const he = phase.hitEffect;

    // Build nextPhase options (all phases except this one)
    const phaseOpts = [...def.phases.values()]
      .filter(p => p.id !== pid)
      .map(p => `<option value="${p.id}" ${p.id === phase.nextPhaseId ? 'selected' : ''}>${this._esc(p.label)}</option>`)
      .join('');

    detailEl.innerHTML = `
      <div class="sm-panel-section-title">
        PHASE: ${this._esc(phase.label)}
        <button class="sm-btn sm-btn--danger sm-btn--sm" id="smp-del-phase">✕</button>
      </div>

      <div class="sm-field-row">
        <label class="sm-field-label">Label</label>
        <input class="sm-field-input" id="smph-label" type="text" value="${this._esc(phase.label)}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Duration (s)</label>
        <input class="sm-field-input sm-field-input--num" id="smph-dur" type="number" min="0.05" max="10" step="0.05" value="${phase.durationSec}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Loop count</label>
        <input class="sm-field-input sm-field-input--num" id="smph-loop" type="number" min="0" max="10" step="1" value="${phase.loopCount}" />
      </div>
      <div class="sm-field-row">
        <label class="sm-field-label">Next phase</label>
        <select class="sm-field-select" id="smph-next">
          <option value="" ${!phase.nextPhaseId ? 'selected' : ''}>(end move)</option>
          ${phaseOpts}
        </select>
      </div>

      <div class="sm-panel-section-title">VELOCITY BOOST</div>
      <div class="sm-field-row">
        <label class="sm-field-label">Enable</label>
        <input type="checkbox" id="smph-vb-en" ${phase.velocityBoost ? 'checked' : ''} />
      </div>
      <div class="sm-vb-fields" style="display:${phase.velocityBoost ? '' : 'none'}">
        <div class="sm-field-row">
          <label class="sm-field-label">X (cm/s)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-vbx" type="number" step="1" value="${vb.x}" />
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Y (cm/s)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-vby" type="number" step="1" value="${vb.y}" />
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Z (cm/s)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-vbz" type="number" step="1" value="${vb.z}" />
        </div>
      </div>

      <div class="sm-panel-section-title">PROJECTILE</div>
      <div class="sm-field-row">
        <label class="sm-field-label">Enable</label>
        <input type="checkbox" id="smph-pr-en" ${pr ? 'checked' : ''} />
      </div>
      <div class="sm-pr-fields" style="display:${pr ? '' : 'none'}">
        <div class="sm-field-row">
          <label class="sm-field-label">Radius (cm)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-pr-r" type="number" min="0.5" max="20" step="0.5" value="${pr?.radius ?? 3}" />
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Speed (cm/s)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-pr-spd" type="number" min="1" max="500" step="1" value="${pr?.speed ?? 80}" />
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Lifetime (s)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-pr-lt" type="number" min="0.1" max="10" step="0.1" value="${pr?.lifetime ?? 2}" />
        </div>
      </div>

      <div class="sm-panel-section-title">HIT EFFECT</div>
      <div class="sm-field-row">
        <label class="sm-field-label">Enable</label>
        <input type="checkbox" id="smph-he-en" ${he ? 'checked' : ''} />
      </div>
      <div class="sm-he-fields" style="display:${he ? '' : 'none'}">
        <div class="sm-field-row">
          <label class="sm-field-label">Hit radius (cm)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-he-r" type="number" min="1" max="50" step="1" value="${he?.hitRadius ?? 15}" />
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Damage</label>
          <input class="sm-field-input sm-field-input--num" id="smph-he-dmg" type="number" min="0" max="100" step="1" value="${he?.damageAmount ?? 20}" />
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Knockback</label>
          <select class="sm-field-select" id="smph-he-kb">
            ${(['away','down','radial','none'] as const).map(v => `<option value="${v}" ${v === (he?.knockback ?? 'away') ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
        </div>
        <div class="sm-field-row">
          <label class="sm-field-label">Impulse (cm/s)</label>
          <input class="sm-field-input sm-field-input--num" id="smph-he-imp" type="number" min="0" max="500" step="5" value="${he?.impulseMag ?? 50}" />
        </div>
      </div>
    `;

    // Toggle handlers
    detailEl.querySelector('#smph-vb-en')!.addEventListener('change', (e) => {
      const on = (e.target as HTMLInputElement).checked;
      (detailEl.querySelector<HTMLElement>('.sm-vb-fields')!).style.display = on ? '' : 'none';
      phase.velocityBoost = on ? { x: 0, y: 5, z: 0 } : null;
      this._commit(def, phase);
      this._renderPhaseList();
    });

    detailEl.querySelector('#smph-pr-en')!.addEventListener('change', (e) => {
      const on = (e.target as HTMLInputElement).checked;
      (detailEl.querySelector<HTMLElement>('.sm-pr-fields')!).style.display = on ? '' : 'none';
      phase.projectile = on ? { radius: 3, speed: 80, lifetime: 2, color: 0xff6600 } : null;
      this._commit(def, phase);
      this._renderPhaseList();
    });

    detailEl.querySelector('#smph-he-en')!.addEventListener('change', (e) => {
      const on = (e.target as HTMLInputElement).checked;
      (detailEl.querySelector<HTMLElement>('.sm-he-fields')!).style.display = on ? '' : 'none';
      phase.hitEffect = on ? { hitRadius: 15, damageAmount: 20, knockback: 'away', impulseMag: 50 } : null;
      this._commit(def, phase);
      this._renderPhaseList();
    });

    // Delete phase
    detailEl.querySelector('#smp-del-phase')!.addEventListener('click', () => {
      def.phases.delete(pid);
      if (def.entryPhaseId === pid) {
        def.entryPhaseId = def.phases.keys().next().value ?? pid;
      }
      for (const p of def.phases.values()) {
        if (p.nextPhaseId === pid) p.nextPhaseId = null;
      }
      this._smMgr.updateMove(def);
      this._onSave();
      this._selectedPhaseId = null;
      this._renderMoveDetail();
      this._renderPhaseList();
      this._clearPhaseDetail();
    });

    // Commit on any field change
    const commitAll = () => {
      phase.label    = (detailEl.querySelector<HTMLInputElement>('#smph-label')?.value ?? '').trim() || phase.label;
      phase.durationSec = Math.max(0.05, parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-dur')?.value ?? '0.8') || 0.05);
      phase.loopCount   = Math.max(0, parseInt(detailEl.querySelector<HTMLInputElement>('#smph-loop')?.value ?? '0', 10) || 0);
      phase.nextPhaseId = detailEl.querySelector<HTMLSelectElement>('#smph-next')?.value || null;

      if (phase.velocityBoost) {
        phase.velocityBoost.x = parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-vbx')?.value ?? '0') || 0;
        phase.velocityBoost.y = parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-vby')?.value ?? '0') || 0;
        phase.velocityBoost.z = parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-vbz')?.value ?? '0') || 0;
      }
      if (phase.projectile) {
        phase.projectile.radius   = Math.max(0.5, parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-pr-r')?.value   ?? '3')  || 3);
        phase.projectile.speed    = Math.max(1,   parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-pr-spd')?.value ?? '80') || 80);
        phase.projectile.lifetime = Math.max(0.1, parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-pr-lt')?.value  ?? '2')  || 2);
      }
      if (phase.hitEffect) {
        phase.hitEffect.hitRadius    = Math.max(1,   parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-he-r')?.value   ?? '15') || 15);
        phase.hitEffect.damageAmount = Math.max(0,   parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-he-dmg')?.value ?? '20') || 0);
        phase.hitEffect.knockback    = (detailEl.querySelector<HTMLSelectElement>('#smph-he-kb')?.value ?? 'away') as 'away'|'down'|'radial'|'none';
        phase.hitEffect.impulseMag   = Math.max(0,   parseFloat(detailEl.querySelector<HTMLInputElement>('#smph-he-imp')?.value ?? '50') || 0);
      }

      this._commit(def, phase);
      this._renderPhaseList();
      // Refresh label in section title
      const title = detailEl.querySelector<HTMLElement>('.sm-panel-section-title');
      if (title) title.textContent = `PHASE: ${phase.label}`;
    };

    for (const inp of detailEl.querySelectorAll('input[type="text"],input[type="number"],select')) {
      inp.addEventListener('change', commitAll);
    }
  }

  private _commit(def: SpecialMoveDefinition, phase: SpecialMovePhase): void {
    def.phases.set(phase.id, phase);
    this._smMgr.updateMove(def);
    this._onSave();
  }

  private _clearPhaseDetail(): void {
    const el = this._el.querySelector<HTMLElement>('#smp-phase-detail')!;
    el.classList.add('hidden');
    el.innerHTML = '';
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  private _esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
