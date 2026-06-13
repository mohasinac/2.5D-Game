import {
  listBeyPresets, deleteBeyPreset, updateBeyPreset, newPresetId,
  saveBeyPreset, generateBeyThumb, remapBeyConfigIds,
} from '../utils/presetStore';
import type { BeyPreset } from '../types/presetTypes';
import type { BeybladeBuildConfig } from '../types/beybladeTypes';
import type { BeyPartType } from '../types/presetTypes';
import { gameConfirm } from '../utils/dialog';
import { pendingLoadStore } from '../stores/pendingLoadStore';

export interface BeyLibraryOptions {
  onBack: () => void;
  onLoadBuild: () => void;
}

type AssemblySlot = 'layer' | 'disc' | 'driver' | 'frame';
const SLOT_LABELS: Record<AssemblySlot, string> = {
  layer: 'Layer', disc: 'Disc', driver: 'Driver', frame: 'Frame (opt)',
};

export class BeyLibraryScreen {
  private el: HTMLDivElement;
  private bodyEl!: HTMLDivElement;
  private searchInput!: HTMLInputElement;
  private activeTab: 'parts' | 'builds' = 'parts';
  private activePartFilter: BeyPartType | 'all' = 'all';
  private _searchDebounce = 0;

  private assemblySlots: Record<AssemblySlot, BeyPreset | null> = {
    layer: null, disc: null, driver: null, frame: null,
  };
  private assemblySlotBtns: Record<AssemblySlot, HTMLButtonElement> = {} as Record<AssemblySlot, HTMLButtonElement>;
  private openPicker: HTMLElement | null = null;

  constructor(container: HTMLElement, private opts: BeyLibraryOptions) {
    this.el = document.createElement('div');
    this.el.className = 'screen library-screen hidden';
    this.el.innerHTML = `
      <div class="library-header">
        <button class="game-btn library-back-btn" id="blib-back">← Back</button>
        <span class="library-header__title">BEY LIBRARY</span>
        <input class="library-search" id="blib-search" type="text" placeholder="🔍 Search presets…"/>
      </div>
      <div class="library-tab-bar">
        <button class="library-tab active" id="blib-tab-parts">⬡ Parts</button>
        <button class="library-tab" id="blib-tab-builds">◈ Builds</button>
      </div>
      <div id="blib-body" style="flex:1;overflow:hidden;display:flex;flex-direction:column;"></div>
    `;
    container.appendChild(this.el);

    this.bodyEl      = this.el.querySelector<HTMLDivElement>('#blib-body')!;
    this.searchInput = this.el.querySelector<HTMLInputElement>('#blib-search')!;

    this.el.querySelector('#blib-back')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#blib-tab-parts')!.addEventListener('click', () => {
      this.activeTab = 'parts';
      this.el.querySelector('#blib-tab-parts')!.classList.add('active');
      this.el.querySelector('#blib-tab-builds')!.classList.remove('active');
      this._render();
    });
    this.el.querySelector('#blib-tab-builds')!.addEventListener('click', () => {
      this.activeTab = 'builds';
      this.el.querySelector('#blib-tab-builds')!.classList.add('active');
      this.el.querySelector('#blib-tab-parts')!.classList.remove('active');
      this._render();
    });
    this.searchInput.addEventListener('input', () => {
      clearTimeout(this._searchDebounce);
      this._searchDebounce = window.setTimeout(() => this._render(), 150);
    });

    document.addEventListener('pointerdown', (e) => {
      if (this.openPicker && !this.openPicker.contains(e.target as Node)) {
        this.openPicker.remove();
        this.openPicker = null;
      }
    });
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) this._render();
  }

  private _render(): void {
    this.bodyEl.innerHTML = '';
    if (this.activeTab === 'parts') this._renderParts();
    else this._renderBuilds();
  }

  // ── Parts tab ──────────────────────────────────────────────────────────────

  private _renderParts(): void {
    const filterBar = document.createElement('div');
    filterBar.className = 'library-filter-bar';
    const types: Array<BeyPartType | 'all'> = ['all', 'layer', 'disc', 'driver', 'frame', 'chip', 'custom'];
    for (const t of types) {
      const chip = document.createElement('button');
      chip.className = 'game-btn library-chip' + (t === this.activePartFilter ? ' active' : '');
      chip.textContent = t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1);
      chip.addEventListener('click', () => { this.activePartFilter = t; this._render(); });
      filterBar.appendChild(chip);
    }
    this.bodyEl.appendChild(filterBar);

    const scroll = document.createElement('div');
    scroll.className = 'library-body';
    this.bodyEl.appendChild(scroll);

    const presets = listBeyPresets().filter(p => p.partType !== 'full_build');
    const query = this.searchInput.value.trim().toLowerCase();
    const filtered = presets.filter(p => {
      if (this.activePartFilter !== 'all' && p.partType !== this.activePartFilter) return false;
      if (!query) return true;
      return p.name.toLowerCase().includes(query) || p.tags.some(t => t.toLowerCase().includes(query));
    });

    if (presets.length === 0) {
      scroll.innerHTML = '<div class="library-empty">No part presets yet. Save individual parts from the Bey Sandbox.</div>';
      return;
    }
    if (filtered.length === 0) {
      scroll.innerHTML = '<div class="library-empty">No parts match your search.</div>';
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'library-grid';
    for (const p of filtered) grid.appendChild(this._makeCard(p, 'parts'));
    scroll.appendChild(grid);
  }

  // ── Builds tab ─────────────────────────────────────────────────────────────

  private _renderBuilds(): void {
    const layout = document.createElement('div');
    layout.className = 'bey-builds-layout';
    this.bodyEl.appendChild(layout);

    // Left: grid of full_build presets
    const gridWrap = document.createElement('div');
    gridWrap.className = 'bey-builds-grid';
    layout.appendChild(gridWrap);

    const presets = listBeyPresets().filter(p => p.partType === 'full_build');
    const query = this.searchInput.value.trim().toLowerCase();
    const filtered = presets.filter(p => {
      if (!query) return true;
      return p.name.toLowerCase().includes(query) || p.tags.some(t => t.toLowerCase().includes(query));
    });

    if (filtered.length === 0) {
      gridWrap.innerHTML = '<div class="library-empty">No full build presets yet. Save full builds from the Bey Sandbox.</div>';
    } else {
      const grid = document.createElement('div');
      grid.className = 'library-grid';
      for (const p of filtered) grid.appendChild(this._makeCard(p, 'builds'));
      gridWrap.appendChild(grid);
    }

    // Right: assembly panel
    layout.appendChild(this._buildAssemblyPanel());
  }

  private _buildAssemblyPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'assembly-panel';
    panel.innerHTML = `<div class="assembly-panel__title">ASSEMBLY LINE</div>`;

    const slots: AssemblySlot[] = ['layer', 'disc', 'driver', 'frame'];
    for (const slot of slots) {
      const row = document.createElement('div');
      row.className = 'assembly-slot';

      const label = document.createElement('div');
      label.className = 'assembly-slot__label';
      label.textContent = SLOT_LABELS[slot];

      const btn = document.createElement('button');
      btn.className = 'game-btn assembly-slot__pick' + (this.assemblySlots[slot] ? ' filled' : '');
      btn.textContent = this.assemblySlots[slot]?.name ?? 'pick…';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._openPicker(slot, btn);
      });
      this.assemblySlotBtns[slot] = btn;

      const clearBtn = document.createElement('button');
      clearBtn.className = 'game-btn';
      clearBtn.textContent = '✕';
      clearBtn.title = 'Clear slot';
      clearBtn.style.cssText = 'padding:0 calc(0.5*var(--cm));opacity:0.5;';
      clearBtn.addEventListener('click', () => {
        this.assemblySlots[slot] = null;
        btn.textContent = 'pick…';
        btn.classList.remove('filled');
      });

      row.appendChild(label); row.appendChild(btn); row.appendChild(clearBtn);
      panel.appendChild(row);
    }

    const sep = document.createElement('div');
    sep.style.cssText = 'border-top:1px solid rgba(0,229,255,0.15);margin:calc(0.5*var(--cm)) 0;';
    panel.appendChild(sep);

    const buildBtn = document.createElement('button');
    buildBtn.className = 'game-btn';
    buildBtn.style.cssText = 'width:100%;';
    buildBtn.textContent = '▶ Build & Load';
    buildBtn.addEventListener('click', () => this._buildAndLoad());
    panel.appendChild(buildBtn);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'game-btn';
    saveBtn.style.cssText = 'width:100%;margin-top:calc(0.5*var(--cm));opacity:0.7;';
    saveBtn.textContent = '💾 Save Assembly';
    saveBtn.addEventListener('click', () => this._saveAssembly());
    panel.appendChild(saveBtn);

    return panel;
  }

  private _openPicker(slot: AssemblySlot, anchor: HTMLButtonElement): void {
    if (this.openPicker) { this.openPicker.remove(); this.openPicker = null; }

    const partType = slot === 'layer' ? 'layer'
      : slot === 'disc' ? 'disc'
      : slot === 'driver' ? 'driver'
      : 'frame';

    const presets = listBeyPresets().filter(p => p.partType === partType);

    const picker = document.createElement('div');
    picker.className = 'assembly-picker';

    if (presets.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'assembly-picker__item';
      empty.textContent = `No ${partType} presets saved yet.`;
      empty.style.opacity = '0.5';
      picker.appendChild(empty);
    } else {
      for (const p of presets) {
        const item = document.createElement('div');
        item.className = 'assembly-picker__item';
        item.innerHTML = `<span style="font-family:Orbitron;font-size:0.75em;">${p.name}</span><span style="font-size:0.65em;opacity:0.5;">${p.group}</span>`;
        item.addEventListener('click', () => {
          this.assemblySlots[slot] = p;
          anchor.textContent = p.name;
          anchor.classList.add('filled');
          picker.remove();
          this.openPicker = null;
        });
        picker.appendChild(item);
      }
    }

    document.body.appendChild(picker);
    this.openPicker = picker;

    const ar = anchor.getBoundingClientRect();
    const pr = picker.getBoundingClientRect();
    picker.style.left = `${Math.max(4, Math.min(ar.left, window.innerWidth  - pr.width  - 8))}px`;
    picker.style.top  = `${Math.max(4, Math.min(ar.bottom + 4, window.innerHeight - pr.height - 8))}px`;
  }

  private _mergeConfigs(presets: Array<BeyPreset | null>): BeybladeBuildConfig | null {
    const valid = presets.filter((p): p is BeyPreset => p !== null);
    if (!valid.length) return null;

    const batchTag = Date.now().toString(36);
    const remapped = valid.map(p => remapBeyConfigIds(p.config, batchTag));

    let axisOffsetY = 0;
    const merged: BeybladeBuildConfig = {
      axis: { ...remapped[0].axis },
      parts: [],
      sectors: [],
      groups: [],
      rootChildIds: [],
      partSeq: 0,
      sectorSeq: 0,
      groupSeq: 0,
    };

    for (const cfg of remapped) {
      // Stack parts vertically
      for (const p of cfg.parts) {
        const height = p.height ?? 2;
        merged.parts.push({ ...p, axisOffsetY: axisOffsetY });
        axisOffsetY += height;
      }
      merged.sectors.push(...cfg.sectors);
      merged.groups.push(...cfg.groups);
      for (const id of cfg.rootChildIds) merged.rootChildIds.push(id);
      merged.partSeq   = Math.max(merged.partSeq,   cfg.partSeq);
      merged.sectorSeq = Math.max(merged.sectorSeq, cfg.sectorSeq);
      merged.groupSeq  = Math.max(merged.groupSeq,  cfg.groupSeq);
    }

    return merged;
  }

  private _buildAndLoad(): void {
    const filled = [this.assemblySlots.layer, this.assemblySlots.disc,
                    this.assemblySlots.driver, this.assemblySlots.frame];
    const config = this._mergeConfigs(filled);
    if (!config) {
      alert('Pick at least one part slot before building.');
      return;
    }
    pendingLoadStore.getState().setBeyPending({ config, mode: 'replace' });
    this.opts.onLoadBuild();
  }

  private _saveAssembly(): void {
    const filled = [this.assemblySlots.layer, this.assemblySlots.disc,
                    this.assemblySlots.driver, this.assemblySlots.frame];
    const config = this._mergeConfigs(filled);
    if (!config) { alert('Pick at least one part slot before saving.'); return; }

    const overlay = document.createElement('div');
    overlay.className = 'preset-modal';
    overlay.innerHTML = `
      <div class="preset-modal__box">
        <div class="preset-modal__title">💾 Save Assembly</div>
        <div class="preset-modal__field">
          <label>Name *</label>
          <input id="asm-name" type="text" placeholder="e.g. Lightning Attack Build" autocomplete="off"/>
        </div>
        <div class="preset-modal__field">
          <label>Group</label>
          <input id="asm-group" type="text" placeholder="e.g. Tournament Builds" autocomplete="off"/>
        </div>
        <div class="preset-modal__field">
          <label>Tags (comma-separated)</label>
          <input id="asm-tags" type="text"/>
        </div>
        <div class="preset-modal__actions">
          <button class="game-btn" id="asm-cancel">Cancel</button>
          <button class="game-btn" id="asm-save">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const nameInput  = overlay.querySelector<HTMLInputElement>('#asm-name')!;
    const groupInput = overlay.querySelector<HTMLInputElement>('#asm-group')!;
    const tagsInput  = overlay.querySelector<HTMLInputElement>('#asm-tags')!;
    nameInput.focus();

    const close = () => overlay.remove();
    overlay.querySelector('#asm-cancel')!.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('#asm-save')!.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      saveBeyPreset({
        id: newPresetId(),
        name,
        group: groupInput.value.trim() || 'Builds',
        description: '',
        partType: 'full_build',
        tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean),
        thumbnail: generateBeyThumb(config!),
        config: config!,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      close();
      this._render();
    });
  }

  private _makeCard(preset: BeyPreset, context: 'parts' | 'builds'): HTMLElement {
    const card = document.createElement('div');
    card.className = 'preset-card';

    if (preset.thumbnail) {
      const img = document.createElement('img');
      img.className = 'preset-card__thumb';
      img.src = preset.thumbnail;
      img.alt = preset.name;
      card.appendChild(img);
    } else {
      const t = document.createElement('div');
      t.className = 'preset-card__thumb preset-card__thumb--placeholder';
      t.textContent = '⬡';
      card.appendChild(t);
    }

    const body = document.createElement('div');
    body.className = 'preset-card__body';

    const nameEl = document.createElement('div');
    nameEl.className = 'preset-card__name';
    nameEl.textContent = preset.name;
    nameEl.title = 'Double-click to rename';
    nameEl.addEventListener('dblclick', () => {
      nameEl.contentEditable = 'true';
      nameEl.focus();
    });
    const finishRename = () => {
      nameEl.contentEditable = 'false';
      const newName = nameEl.textContent?.trim() || preset.name;
      if (newName !== preset.name) {
        updateBeyPreset(preset.id, { name: newName, updatedAt: Date.now() });
        nameEl.textContent = newName;
      }
    };
    nameEl.addEventListener('blur', finishRename);
    nameEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); finishRename(); } });

    const meta = document.createElement('div');
    meta.className = 'preset-card__group';
    meta.textContent = `${preset.group} · ${preset.partType}`;

    body.appendChild(nameEl);
    body.appendChild(meta);
    if (preset.tags.length) {
      const tags = document.createElement('div');
      tags.className = 'preset-card__tags';
      tags.textContent = preset.tags.join(', ');
      body.appendChild(tags);
    }

    const actions = document.createElement('div');
    actions.className = 'preset-card__actions';

    const loadBtn = document.createElement('button');
    loadBtn.className = 'game-btn preset-card__btn';
    loadBtn.textContent = '▶ Load';
    loadBtn.addEventListener('click', () => {
      pendingLoadStore.getState().setBeyPending({ config: preset.config, mode: 'merge' });
      this.opts.onLoadBuild();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'game-btn preset-card__btn preset-card__btn--danger';
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', async () => {
      const ok = await gameConfirm(`Delete "${preset.name}"?`, 'Delete', 'Cancel');
      if (!ok) return;
      deleteBeyPreset(preset.id);
      this._render();
    });

    actions.appendChild(loadBtn);
    actions.appendChild(deleteBtn);
    body.appendChild(actions);
    card.appendChild(body);
    return card;
  }
}
