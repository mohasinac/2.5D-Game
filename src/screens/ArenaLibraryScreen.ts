import {
  listArenaPresets, deleteArenaPreset, updateArenaPreset,
} from '../utils/presetStore';
import type { ArenaPreset } from '../types/presetTypes';
import { gameConfirm } from '../utils/dialog';
import { pendingLoadStore } from '../stores/pendingLoadStore';

export interface ArenaLibraryOptions {
  onBack: () => void;
  onLoadArena: () => void;
  onEditPreset: () => void;
}

export class ArenaLibraryScreen {
  private el: HTMLDivElement;
  private bodyEl!: HTMLDivElement;
  private searchInput!: HTMLInputElement;
  private activeGroupFilter = 'all';
  private _searchDebounce = 0;

  constructor(container: HTMLElement, private opts: ArenaLibraryOptions) {
    this.el = document.createElement('div');
    this.el.className = 'screen library-screen hidden';
    this.el.innerHTML = `
      <div class="library-header">
        <button class="game-btn library-back-btn" id="alib-back">← Back</button>
        <span class="library-header__title">ARENA LIBRARY</span>
        <input class="library-search" id="alib-search" type="text" placeholder="🔍 Search presets…"/>
      </div>
      <div class="library-filter-bar" id="alib-filters"></div>
      <div class="library-body" id="alib-body"></div>
    `;
    container.appendChild(this.el);

    this.bodyEl      = this.el.querySelector<HTMLDivElement>('#alib-body')!;
    this.searchInput = this.el.querySelector<HTMLInputElement>('#alib-search')!;

    this.el.querySelector('#alib-back')!.addEventListener('click', opts.onBack);
    this.searchInput.addEventListener('input', () => {
      clearTimeout(this._searchDebounce);
      this._searchDebounce = window.setTimeout(() => this._render(), 150);
    });
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) this._render();
  }

  private _render(): void {
    const presets = listArenaPresets();
    const query   = this.searchInput.value.trim().toLowerCase();

    // Rebuild filter chips
    const filterBar = this.el.querySelector<HTMLElement>('#alib-filters')!;
    filterBar.innerHTML = '';
    const groups = ['all', ...new Set(presets.map(p => p.group).filter(Boolean))];
    for (const g of groups) {
      const chip = document.createElement('button');
      chip.className = 'game-btn library-chip' + (g === this.activeGroupFilter ? ' active' : '');
      chip.textContent = g === 'all' ? 'All' : g;
      chip.addEventListener('click', () => { this.activeGroupFilter = g; this._render(); });
      filterBar.appendChild(chip);
    }

    // Filter
    const filtered = presets.filter(p => {
      if (this.activeGroupFilter !== 'all' && p.group !== this.activeGroupFilter) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.group.toLowerCase().includes(query)
      );
    });

    this.bodyEl.innerHTML = '';

    if (presets.length === 0) {
      this.bodyEl.innerHTML = '<div class="library-empty">No presets saved yet. Go to Arena Sandbox, check nodes in the scene tree, then click 💾 Preset.</div>';
      return;
    }

    // Group presets
    const byGroup = new Map<string, ArenaPreset[]>();
    for (const p of filtered) {
      const g = p.group || 'Uncategorized';
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g)!.push(p);
    }

    if (byGroup.size === 0) {
      this.bodyEl.innerHTML = '<div class="library-empty">No presets match your search.</div>';
      return;
    }

    for (const [group, items] of byGroup) {
      const header = document.createElement('div');
      header.className = 'library-group-header open';
      header.textContent = group;
      this.bodyEl.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'library-grid';
      this.bodyEl.appendChild(grid);

      header.addEventListener('click', () => {
        const open = header.classList.toggle('open');
        grid.style.display = open ? '' : 'none';
      });

      for (const preset of items) {
        grid.appendChild(this._makeCard(preset));
      }
    }
  }

  private _makeCard(preset: ArenaPreset): HTMLElement {
    const card = document.createElement('div');
    card.className = 'preset-card';

    const body = document.createElement('div');
    body.className = 'preset-card__body';

    const nameEl = document.createElement('div');
    nameEl.className = 'preset-card__name';
    nameEl.textContent = preset.name;
    nameEl.title = 'Double-click to rename';
    nameEl.addEventListener('dblclick', () => {
      nameEl.contentEditable = 'true';
      nameEl.focus();
      const range = document.createRange();
      range.selectNodeContents(nameEl);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    });
    const finishRename = () => {
      nameEl.contentEditable = 'false';
      const newName = nameEl.textContent?.trim() || preset.name;
      if (newName !== preset.name) {
        updateArenaPreset(preset.id, { name: newName, updatedAt: Date.now() });
        nameEl.textContent = newName;
      }
    };
    nameEl.addEventListener('blur', finishRename);
    nameEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); finishRename(); } });

    const groupEl = document.createElement('div');
    groupEl.className = 'preset-card__group';
    groupEl.textContent = preset.group;

    const tagsEl = document.createElement('div');
    tagsEl.className = 'preset-card__tags';
    tagsEl.textContent = preset.tags.join(', ');

    body.appendChild(nameEl);
    body.appendChild(groupEl);
    if (preset.tags.length) body.appendChild(tagsEl);

    const actions = document.createElement('div');
    actions.className = 'preset-card__actions';

    const loadBtn = document.createElement('button');
    loadBtn.className = 'game-btn preset-card__btn';
    loadBtn.textContent = '▶ Load';
    loadBtn.addEventListener('click', () => this._showLoadDialog(preset));

    const editBtn = document.createElement('button');
    editBtn.className = 'game-btn preset-card__btn';
    editBtn.textContent = '✏ Edit';
    editBtn.addEventListener('click', () => {
      pendingLoadStore.getState().setArenaPending({ config: preset.config, mode: 'replace' });
      this.opts.onEditPreset();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'game-btn preset-card__btn preset-card__btn--danger';
    deleteBtn.textContent = '🗑';
    deleteBtn.title = 'Delete preset';
    deleteBtn.addEventListener('click', async () => {
      const ok = await gameConfirm(`Delete preset "${preset.name}"?`, 'Delete', 'Cancel');
      if (!ok) return;
      deleteArenaPreset(preset.id);
      this._render();
    });

    actions.appendChild(loadBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    body.appendChild(actions);

    // Build card: thumbnail first, then body
    card.innerHTML = '';
    if (preset.thumbnail) {
      const img = document.createElement('img');
      img.className = 'preset-card__thumb';
      img.src = preset.thumbnail;
      img.alt = preset.name;
      card.appendChild(img);
    } else {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'preset-card__thumb preset-card__thumb--placeholder';
      thumbDiv.textContent = '◎';
      card.appendChild(thumbDiv);
    }
    card.appendChild(body);
    return card;
  }

  private _showLoadDialog(preset: ArenaPreset): void {
    const overlay = document.createElement('div');
    overlay.className = 'preset-modal';
    overlay.innerHTML = `
      <div class="preset-modal__box">
        <div class="preset-modal__title">Load "${preset.name}"</div>
        <div class="preset-modal__subtitle">How would you like to load this preset?</div>
        <div class="preset-modal__actions" style="flex-direction:column; gap:calc(0.8*var(--cm));">
          <button class="game-btn" id="load-replace" style="width:100%">Replace current scene</button>
          <button class="game-btn" id="load-merge"   style="width:100%">Merge into current scene</button>
          <button class="game-btn" id="load-cancel"  style="width:100%;opacity:0.6">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#load-cancel')!.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    overlay.querySelector('#load-replace')!.addEventListener('click', () => {
      close();
      pendingLoadStore.getState().setArenaPending({ config: preset.config, mode: 'replace' });
      this.opts.onLoadArena();
    });
    overlay.querySelector('#load-merge')!.addEventListener('click', () => {
      close();
      pendingLoadStore.getState().setArenaPending({ config: preset.config, mode: 'merge' });
      this.opts.onLoadArena();
    });
  }
}
