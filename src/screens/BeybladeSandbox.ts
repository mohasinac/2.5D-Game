import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { Sandbox, SandboxOptions } from './Sandbox';
import { BeybladeStore } from '../stores/BeybladeStore';
import { CommandHistory } from '../commands/ICommand';
import { BeybladeRenderer } from '../renderers/BeybladeRenderer';
import { BeybladeAnimator } from '../animation/BeybladeAnimator';
import { SceneTree } from '../utils/SceneTree';
import { BeybladePropertiesPanel } from '../utils/BeybladePropertiesPanel';
import {
  AddPartCmd, DeletePartCmd, UpdatePartCmd, CutSectorsCmd, UpdateSectorCmd,
  DeleteSectorCmd, AddGroupCmd, DeleteGroupCmd, UpdateGroupCmd,
  BeybladeCommandCtx,
} from '../commands/beybladeCommands';
import {
  PartData, SectorData, GroupData, ViewMode, BeyMaterial, BeybladeBuildConfig,
  defaultPresentConfig, defaultParticleConfig,
} from '../types/beybladeTypes';
import { PresentConfig, ParticleConfig, ParticleSystem } from '../types/sharedTypes';
import { buildParticleSystem } from '../geometry/particleBuilders';
import { gameConfirm } from '../utils/dialog';
import {
  listBeyPresets, saveBeyPreset, newPresetId, generateBeyThumb, remapBeyConfigIds,
} from '../utils/presetStore';
import { inputManager } from '../features/managers/InputManager';
import { createBeybladeConfigStore, type BeybladeConfigStore } from '../stores/beybladeConfigStore';
import { createTreeStateStore, type TreeStateStore } from '../stores/treeStateStore';
import { pendingLoadStore } from '../stores/pendingLoadStore';

export interface BeybladeSandboxOptions {
  onBack: () => void;
  onLibrary?: () => void;
}

export class BeybladeSandbox extends Sandbox {
  private store        = new BeybladeStore();
  private history      = new CommandHistory();
  private beyRenderer!: BeybladeRenderer;
  private animator!:    BeybladeAnimator;
  private tree!:     SceneTree;
  private panel!:    BeybladePropertiesPanel;
  private _partParticleSystems = new Map<string, ParticleSystem>();

  private rightPanelEl!: HTMLDivElement;
  private leftPanelEl!:  HTMLDivElement;

  private undoBtn!: HTMLButtonElement;
  private redoBtn!: HTMLButtonElement;
  private playBtn!: HTMLButtonElement;
  private stopBtn!: HTMLButtonElement;
  private tiltInput!: HTMLInputElement;
  private pivotInput!: HTMLInputElement;
  private spinLeftBtn!:  HTMLButtonElement;
  private spinRightBtn!: HTMLButtonElement;
  private viewBtns: Record<ViewMode, HTMLButtonElement> = {} as Record<ViewMode, HTMLButtonElement>;

  private _subNodesAdded = new Set<string>();
  private _beyOpts: BeybladeSandboxOptions;
  private _beyStore!: BeybladeConfigStore;
  private _treeStore!: TreeStateStore;
  private _keyUnsubs: Array<() => void> = [];

  constructor(container: HTMLElement, opts: BeybladeSandboxOptions) {
    const sandboxOpts: SandboxOptions = {
      title:      'Beyblade Builder',
      accentHex:  0x00e5ff,
      onBack:     opts.onBack,
      gridSize:   15,
      gridDivs:   15,
      tickEvery:  5,
      tickRange:  7,
      defaultCam: { x: 12, y: 8, z: 14 },
      camFar:     500,
      minZoom:    0.5,
      maxZoom:    50,
    };
    super(container, sandboxOpts);
    this._beyOpts = opts;

    this.undoBtn = this.addTopBarButton('↩ Undo', 'Undo (Ctrl+Z)');
    this.redoBtn = this.addTopBarButton('↪ Redo', 'Redo (Ctrl+Y)');
    const resetBtn = this.addTopBarButton('✕ Reset', 'Clear all parts and reset axis to defaults');
    this.undoBtn.addEventListener('click', () => this._undo());
    this.redoBtn.addEventListener('click', () => this._redo());
    resetBtn.addEventListener('click', () => { void this._confirmReset(); });

    this.history.onStackChange = () => this._syncUndoButtons();
    this._syncUndoButtons();
  }

  // ── Visibility — scope keydown to when sandbox is active ─────────────────

  override setVisible(v: boolean): void {
    super.setVisible(v);
    if (v) {
      this._keyUnsubs = [
        inputManager.onPress('KeyZ', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); if (e.shiftKey) this._redo(); else this._undo(); } }),
        inputManager.onPress('KeyY', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); this._redo(); } }),
      ];
      this._checkPendingLoad();
    } else {
      this._keyUnsubs.forEach(fn => fn());
      this._keyUnsubs = [];
      this._drawerMgr?.closeAll();
    }
  }

  private _checkPendingLoad(): void {
    const pending = pendingLoadStore.getState().takeBeyPending();
    if (!pending) return;
    try {
      const batchTag = Date.now().toString(36);
      const remapped = remapBeyConfigIds(pending.config, batchTag);
      if (pending.mode === 'replace') {
        this.store.deserialize(remapped);
      } else {
        this.store.mergeDeserialize(remapped);
      }
      this._applyAxisPose();
      this._rebuildTree();
    } catch { /* malformed pending load — discard */ }
  }

  private _showBeyPresetModal(): void {
    const checkedIds = this.tree.getCheckedIds();
    const isFull = checkedIds.length === 0;

    let config: BeybladeBuildConfig;
    if (isFull) {
      config = this.store.serialize();
    } else {
      const partIds = checkedIds.filter(id => this.store.hasPart(id));
      const sectorIds: string[] = [];
      for (const pid of partIds) {
        const part = this.store.getPart(pid);
        sectorIds.push(...part.sectorIds);
      }
      config = {
        axis: { ...this.store.getAxis() },
        parts: partIds.map(id => {
          const p = this.store.getPart(id);
          return { ...p, sectorIds: [...p.sectorIds] };
        }),
        sectors: sectorIds.map(id => ({ ...this.store.getSector(id) })),
        groups: [],
        rootChildIds: partIds,
        partSeq: this.store.serialize().partSeq,
        sectorSeq: this.store.serialize().sectorSeq,
        groupSeq: this.store.serialize().groupSeq,
      };
    }

    const existingGroups = [...new Set(listBeyPresets().map(p => p.group).filter(Boolean))];

    const overlay = document.createElement('div');
    overlay.className = 'preset-modal';
    overlay.innerHTML = `
      <div class="preset-modal__box">
        <div class="preset-modal__title">💾 Save Bey Preset</div>
        <div class="preset-modal__subtitle">${isFull ? 'Saving full build' : `Saving ${checkedIds.length} selected part(s)`}</div>
        <div class="preset-modal__field">
          <label>Name *</label>
          <input id="bpm-name" type="text" placeholder="e.g. Attack Layer" autocomplete="off"/>
        </div>
        <div class="preset-modal__field">
          <label>Group</label>
          <input id="bpm-group" type="text" placeholder="e.g. Attack Parts" list="bpm-groups-list" autocomplete="off"/>
          <datalist id="bpm-groups-list">${existingGroups.map(g=>`<option value="${g}">`).join('')}</datalist>
        </div>
        <div class="preset-modal__field">
          <label>Part Type</label>
          <select id="bpm-type">
            <option value="full_build">Full Build</option>
            <option value="layer">Layer</option>
            <option value="disc">Disc</option>
            <option value="driver">Driver</option>
            <option value="frame">Frame</option>
            <option value="chip">Chip</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="preset-modal__field">
          <label>Description</label>
          <textarea id="bpm-desc" placeholder="Optional description…"></textarea>
        </div>
        <div class="preset-modal__field">
          <label>Tags (comma-separated)</label>
          <input id="bpm-tags" type="text" placeholder="attack, stamina"/>
        </div>
        <div class="preset-modal__actions">
          <button class="game-btn" id="bpm-cancel">Cancel</button>
          <button class="game-btn" id="bpm-save">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const nameInput  = overlay.querySelector<HTMLInputElement>('#bpm-name')!;
    const groupInput = overlay.querySelector<HTMLInputElement>('#bpm-group')!;
    const typeSelect = overlay.querySelector<HTMLSelectElement>('#bpm-type')!;
    const descInput  = overlay.querySelector<HTMLTextAreaElement>('#bpm-desc')!;
    const tagsInput  = overlay.querySelector<HTMLInputElement>('#bpm-tags')!;
    if (isFull) typeSelect.value = 'full_build';
    nameInput.focus();

    const close = () => overlay.remove();
    overlay.querySelector('#bpm-cancel')!.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    overlay.querySelector('#bpm-save')!.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const thumbnail = generateBeyThumb(config);
      const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
      saveBeyPreset({
        id: newPresetId(),
        name,
        group: groupInput.value.trim() || 'Uncategorized',
        description: descInput.value.trim(),
        partType: typeSelect.value as import('../types/presetTypes').BeyPartType,
        tags,
        thumbnail,
        config,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      close();
      this._showToast('✓ Saved to Library');
      this.tree.clearChecks();
    });
  }

  private _showToast(msg: string, durationMs = 2500): void {
    const t = document.createElement('div');
    t.className = 'preset-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), durationMs);
  }

  // ── Scene setup ───────────────────────────────────────────────────────────

  protected override buildCustom(scene: THREE.Scene): void {
    this.beyRenderer = new BeybladeRenderer(scene, this.store);
    this.animator = new BeybladeAnimator(this.beyRenderer);

    // Left panel (scene tree) — SceneTree owns the container directly, collapse btn goes in header
    const leftPanel = this.addOverlayPanel('sandbox-left-panel');
    this.leftPanelEl = leftPanel;
    this.tree = new SceneTree(leftPanel);

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'tree-collapse-btn';
    collapseBtn.textContent = '◀';
    collapseBtn.title = 'Collapse panel';
    this.tree.header.appendChild(collapseBtn);
    collapseBtn.addEventListener('click', () => {
      const collapsed = leftPanel.classList.toggle('sandbox-left-panel--collapsed');
      collapseBtn.textContent = collapsed ? '▶' : '◀';
      collapseBtn.title = collapsed ? 'Expand panel' : 'Collapse panel';
    });

    // Add-buttons below the tree
    const addPartBtn = document.createElement('button');
    addPartBtn.className = 'game-btn tree-add-root-btn';
    addPartBtn.textContent = '+ Part';
    addPartBtn.title = 'Add a new part to the scene';
    addPartBtn.addEventListener('click', () => this._addPart());

    const addGroupBtn = document.createElement('button');
    addGroupBtn.className = 'game-btn tree-add-root-btn';
    addGroupBtn.textContent = '+ Group';
    addGroupBtn.title = 'Add a new group';
    addGroupBtn.addEventListener('click', () => this._addGroup());

    const addRow = document.createElement('div');
    addRow.className = 'tree-add-root-row';
    addRow.appendChild(addPartBtn);
    addRow.appendChild(addGroupBtn);
    leftPanel.appendChild(addRow);

    // Right panel (properties)
    const rightPanel = this.addOverlayPanel('sandbox-right-panel');
    this.rightPanelEl = rightPanel;
    this.panel = new BeybladePropertiesPanel(rightPanel);
    this._drawerMgr.bind(leftPanel, rightPanel);
    this.panel.onClose = () => {
      this.tree.clearSel();
      this.rightPanelEl.style.display = 'none';
    };

    // Axis node in tree (always present, cannot be deleted)
    this.tree.add('axis', '🔄 Axis', '🔄', null);
    this.tree.setNodeActions('axis', [
      { label: 'Properties', action: () => this._selectAxis() },
    ]);

    // Bottom controls bar
    this._buildBottomBar();

    // Create stores (before _loadFromStorage)
    this._beyStore  = createBeybladeConfigStore('bey_beyblade_builder');
    this._treeStore = createTreeStateStore('bey_beyblade_builder_tree');

    // Wire tree expansion persistence
    this.tree.onExpand = (id, expanded) => this._treeStore.getState().setExpanded(id, expanded);

    // Wire tree callbacks
    this._wireTree();

    // Load persisted data
    this._loadFromStorage();

    // Restore tree expansion state
    for (const id of this._treeStore.getState().expandedIds) {
      this.tree.setExpanded(id, true);
    }
  }

  // ── Per-frame tick ────────────────────────────────────────────────────────

  protected override onTick(dtMs: number): void {
    this.animator.tick(dtMs, this.store.getAxis().spinDir);
    const dt = dtMs / 1000;
    for (const ps of this._partParticleSystems.values()) {
      ps.tick(dt);
    }
  }

  // ── Bottom controls bar ───────────────────────────────────────────────────

  private _buildBottomBar(): void {
    // Total bar heights (header 22mm + border 1mm + content 44mm = 67mm expanded, 23mm collapsed)
    const BEY_BAR_H_EXP = 'calc(67 * var(--mm))';
    const BEY_BAR_H_COL = 'calc(23 * var(--mm))';

    const syncPanels = (collapsed: boolean): void => {
      const h = collapsed ? BEY_BAR_H_COL : BEY_BAR_H_EXP;
      this.rightPanelEl.style.bottom = h;
      this.leftPanelEl.style.bottom  = h;
    };

    const bar = this.addOverlayPanel('beyblade-bottom-bar');
    bar.innerHTML = `
      <div class="bey-bar-header">
        <button class="bey-bar-collapse-btn" id="bey-bar-toggle">
          <span class="bey-bar-collapse-arrow">▼</span>
          <span>ANIMATION</span>
        </button>
      </div>
      <div class="bey-bar-content">
        <div class="bey-bar-row">
          <span class="bey-bar-label">TILT</span>
          <input class="bey-bar-input" id="bey-tilt" type="number" min="0" max="45" step="0.5" value="0">
          <span class="bey-bar-unit">°</span>
          <span class="bey-bar-sep"></span>
          <span class="bey-bar-label">PIVOT</span>
          <input class="bey-bar-input" id="bey-pivot" type="number" min="0" max="20" step="0.1" value="0">
          <span class="bey-bar-unit">cm</span>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-spin-btn" id="bey-spin-left"  title="Spin left">◀ LEFT</button>
          <button class="game-btn bey-spin-btn active" id="bey-spin-right" title="Spin right">RIGHT ▶</button>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-spin-btn" id="bey-play" title="Start spin animation">▶ PLAY</button>
          <button class="game-btn bey-spin-btn" id="bey-stop" title="Stop spin animation">■ STOP</button>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-view-btn active" id="bey-view-hitbox"  title="Hitbox only">HITBOX</button>
          <button class="game-btn bey-view-btn" id="bey-view-both"    title="Hitbox + presentation">BOTH</button>
          <button class="game-btn bey-view-btn" id="bey-view-present" title="Presentation only">PRESENT</button>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-lib-btn" id="bey-save-preset" title="Save checked parts as preset">💾 Preset</button>
          <button class="game-btn bey-lib-btn" id="bey-library" title="Beyblade preset library">📚 Library</button>
        </div>
      </div>
    `;

    const toggleBtn = bar.querySelector<HTMLButtonElement>('#bey-bar-toggle')!;
    const arrow     = bar.querySelector<HTMLElement>('.bey-bar-collapse-arrow')!;
    toggleBtn.addEventListener('click', () => {
      const collapsed = bar.classList.toggle('beyblade-bottom-bar--collapsed');
      arrow.textContent = collapsed ? '▶' : '▼';
      syncPanels(collapsed);
    });

    syncPanels(false);

    this.tiltInput  = bar.querySelector<HTMLInputElement>('#bey-tilt')!;
    this.pivotInput = bar.querySelector<HTMLInputElement>('#bey-pivot')!;
    this.spinLeftBtn  = bar.querySelector<HTMLButtonElement>('#bey-spin-left')!;
    this.spinRightBtn = bar.querySelector<HTMLButtonElement>('#bey-spin-right')!;
    this.playBtn  = bar.querySelector<HTMLButtonElement>('#bey-play')!;
    this.stopBtn  = bar.querySelector<HTMLButtonElement>('#bey-stop')!;
    this.viewBtns.hitbox  = bar.querySelector<HTMLButtonElement>('#bey-view-hitbox')!;
    this.viewBtns.both    = bar.querySelector<HTMLButtonElement>('#bey-view-both')!;
    this.viewBtns.present = bar.querySelector<HTMLButtonElement>('#bey-view-present')!;

    this.tiltInput.addEventListener('input', () => this._applyAxisPose());
    this.pivotInput.addEventListener('input', () => this._applyAxisPose());

    this.spinLeftBtn.addEventListener('click', () => {
      this.store.setAxis({ spinDir: 'left' });
      this.spinLeftBtn.classList.add('active');
      this.spinRightBtn.classList.remove('active');
    });
    this.spinRightBtn.addEventListener('click', () => {
      this.store.setAxis({ spinDir: 'right' });
      this.spinRightBtn.classList.add('active');
      this.spinLeftBtn.classList.remove('active');
    });

    this.playBtn.addEventListener('click', () => {
      this.animator.startSpin();
      this.playBtn.classList.add('active');
      this.stopBtn.classList.remove('active');
    });
    this.stopBtn.addEventListener('click', () => {
      this.animator.stopSpin();
      this.animator.resetAngle();
      this.stopBtn.classList.add('active');
      this.playBtn.classList.remove('active');
    });

    (Object.entries(this.viewBtns) as [ViewMode, HTMLButtonElement][]).forEach(([mode, btn]) => {
      btn.addEventListener('click', () => this._setViewMode(mode));
    });

    bar.querySelector('#bey-save-preset')!.addEventListener('click', () => this._showBeyPresetModal());
    bar.querySelector('#bey-library')!.addEventListener('click', () => this._beyOpts.onLibrary?.());
  }

  private _applyAxisPose(): void {
    const tilt  = parseFloat(this.tiltInput.value)  || 0;
    const pivot = parseFloat(this.pivotInput.value) || 0;
    this.store.setAxis({ tiltAngle: tilt, pivotOffset: pivot });
    this.animator.setTiltAngle(tilt, pivot);
  }

  private _setViewMode(mode: ViewMode): void {
    this.beyRenderer.setViewMode(mode);
    (Object.entries(this.viewBtns) as [ViewMode, HTMLButtonElement][]).forEach(([m, btn]) => {
      btn.classList.toggle('active', m === mode);
    });
  }

  // ── Tree wiring ───────────────────────────────────────────────────────────

  private _wireTree(): void {
    this.tree.onSelect = (ids) => {
      if (ids.length === 0) { this.panel.showEmpty(); return; }
      const id = ids[0];
      if (id === 'axis') { this._selectAxis(); return; }
      if (id.startsWith('present-'))  { this._selectPresentNode(id.slice(8));  return; }
      if (id.startsWith('particle-')) { this._selectParticleNode(id.slice(9)); return; }
      if (this.store.hasPart(id)) {
        this._selectPart(id);
      } else if (this.store.hasSector(id)) {
        const parentId = this.store.findPartOfSector(id);
        if (parentId) this._selectSector(id, parentId);
      } else if (this.store.hasGroup(id)) {
        this._selectGroup(id);
      }
    };

    this.tree.onDelete = (ids) => {
      for (const id of ids) {
        if (id === 'axis') continue;
        if (id.startsWith('present-') || id.startsWith('particle-')) {
          this._subNodesAdded.delete(id);
          continue;
        }
        if (this.store.hasPart(id)) {
          this.history.execute(new DeletePartCmd(this._ctx(), id));
        } else if (this.store.hasSector(id)) {
          const parentId = this.store.findPartOfSector(id);
          if (parentId) this.history.execute(new DeleteSectorCmd(this._ctx(), parentId, id));
        } else if (this.store.hasGroup(id)) {
          this.history.execute(new DeleteGroupCmd(this._ctx(), id));
        }
      }
      this.panel.showEmpty();
    };

    this.tree.onDuplicate = (id) => this._duplicateNode(id);

    this.tree.onVisibilityToggle = (id, visible) => {
      if (this.store.hasPart(id)) this.beyRenderer.setPartVisible(id, visible);
    };

    this.tree.onGroup = (_newGroupId, childIds) => {
      // SceneTree already created the DOM group node; sync store
      const gid = this.store.nextGroupId();
      const data: GroupData = { id: gid, name: 'Group', childIds };
      this.history.execute(new AddGroupCmd(this._ctx(), data));
    };
  }

  // ── Selection handlers ────────────────────────────────────────────────────

  private _selectAxis(): void {
    this.rightPanelEl.style.display = '';
    const axis = this.store.getAxis();
    this.panel.showAxis(axis, (changes) => {
      this.store.setAxis(changes);
      this.tiltInput.value  = String(this.store.getAxis().tiltAngle);
      this.pivotInput.value = String(this.store.getAxis().pivotOffset);
      this._applyAxisPose();
      this._saveToStorage();
    });
  }

  private _selectPart(id: string): void {
    this.rightPanelEl.style.display = '';
    const part = this.store.getPart(id);
    this.panel.showPart(
      part,
      (changes) => {
        this.history.execute(new UpdatePartCmd(this._ctx(), id, changes));
      },
      (count) => this._cutPart(id, count),
    );
  }

  private _selectPresentNode(partId: string): void {
    if (!this.store.hasPart(partId)) return;
    this.rightPanelEl.style.display = '';
    const cfg = { ...this.store.getPart(partId).present };
    const show = () => this.panel.showPresentation(
      cfg,
      () => {
        this.store.updatePart(partId, { present: { ...cfg } });
        this.beyRenderer.applyPresentTransform(partId);
        this._saveToStorage();
      },
      (cb) => this._importSTL(partId, (b64) => { cb(b64); show(); }),
      () => {
        this.beyRenderer.clearPresentMesh(partId);
        this.store.updatePart(partId, { present: { ...this.store.getPart(partId).present, stlb64: null } });
        this._saveToStorage();
        show();
      },
    );
    show();
  }

  private _selectParticleNode(partId: string): void {
    if (!this.store.hasPart(partId)) return;
    this.rightPanelEl.style.display = '';
    const cfg = { ...this.store.getPart(partId).particleConfig };
    this.panel.showParticle(
      cfg,
      () => {
        this.store.updatePart(partId, { particleConfig: { ...cfg } });
        this._rebuildPartParticles(partId, cfg);
        this._saveToStorage();
      },
    );
  }

  private _rebuildPartParticles(partId: string, cfg: ParticleConfig): void {
    const scene = this.getScene();
    const old = this._partParticleSystems.get(partId);
    if (old) { scene?.remove(old.points); old.dispose(); this._partParticleSystems.delete(partId); }
    if (cfg.preset === 'none' || !scene) return;
    const part = this.store.getPart(partId);
    const ps = buildParticleSystem(cfg, 0, 0, Math.max(part.topRadiusX, part.topRadiusZ, part.bottomRadiusX, part.bottomRadiusZ), part.axisOffsetY + part.height, part.height);
    scene.add(ps.points);
    this._partParticleSystems.set(partId, ps);
  }

  private _selectSector(sectorId: string, partId: string): void {
    this.rightPanelEl.style.display = '';
    const sector = this.store.getSector(sectorId);
    const part   = this.store.getPart(partId);
    this.panel.showSector(sector, part, (changes) => {
      this.history.execute(new UpdateSectorCmd(this._ctx(), partId, sectorId, changes));
    });
  }

  private _selectGroup(id: string): void {
    this.rightPanelEl.style.display = '';
    const group = this.store.getGroup(id);
    this.panel.showGroup(group, (name) => {
      this.history.execute(new UpdateGroupCmd(this._ctx(), id, { name }));
      this.tree.setLabel(id, name);
    });
  }

  // ── Add / cut operations ──────────────────────────────────────────────────

  private _addPart(): void {
    const id = this.store.nextPartId();
    const data: PartData = {
      id, name: `Part ${id.split('-')[1]}`,
      isHollow: false, freeSpin: false,
      axisOffsetY: 0,
      height: 1, topRadiusX: 2, topRadiusZ: 2, bottomRadiusX: 2, bottomRadiusZ: 2,
      innerTopRadiusX: 0, innerTopRadiusZ: 0, innerBottomRadiusX: 0, innerBottomRadiusZ: 0,
      sectorIds: [], material: 'plastic' as BeyMaterial, weight: 1, color: 0x00e5ff,
      present: defaultPresentConfig(),
      particleConfig: defaultParticleConfig(),
    };
    this.history.execute(new AddPartCmd(this._ctx(), data));
  }

  private _addGroup(): void {
    const id = this.store.nextGroupId();
    const data: GroupData = { id, name: `Group ${id.split('-')[1]}`, childIds: [] };
    this.history.execute(new AddGroupCmd(this._ctx(), data));
  }

  private _cutPart(partId: string, count: number): void {
    const part = this.store.getPart(partId);
    const arc  = 360 / count;
    const weightEach = part.weight / count;
    const sectors: SectorData[] = [];
    for (let i = 0; i < count; i++) {
      const sid = this.store.nextSectorId();
      sectors.push({
        id: sid,
        name: `Sector ${i + 1}`,
        startAngle: arc * i,
        endAngle:   arc * (i + 1),
        height: part.height,
        topRadiusX: part.topRadiusX, topRadiusZ: part.topRadiusZ,
        bottomRadiusX: part.bottomRadiusX, bottomRadiusZ: part.bottomRadiusZ,
        isHollow: part.isHollow,
        innerTopRadiusX: part.innerTopRadiusX, innerTopRadiusZ: part.innerTopRadiusZ,
        innerBottomRadiusX: part.innerBottomRadiusX, innerBottomRadiusZ: part.innerBottomRadiusZ,
        material: part.material,
        weight: parseFloat(weightEach.toFixed(3)),
        color: part.color,
      });
    }
    this.history.execute(new CutSectorsCmd(this._ctx(), partId, sectors));
  }

  private _importSTL(partId: string, onLoaded: (b64: string) => void): void {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.stl';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const loader = new STLLoader();
        const geo = loader.parse(reader.result as ArrayBuffer);
        const b64 = btoa(String.fromCharCode(...new Uint8Array(reader.result as ArrayBuffer)));
        onLoaded(b64);
        this.beyRenderer.loadPresentationSTL(partId, geo);
        this._saveToStorage();
      };
      reader.readAsArrayBuffer(file);
    });
    input.click();
  }

  // ── Command context ───────────────────────────────────────────────────────

  private _ctx(): BeybladeCommandCtx {
    return {
      store: this.store,
      onPartAdded:    (id) => { this._onPartAdded(id); },
      onPartRemoved:  (id) => { this._onPartRemoved(id); },
      onPartUpdated:  (id) => { this._onPartUpdated(id); },
      onSectorAdded:  (pid, sid) => { this._onSectorAdded(pid, sid); },
      onSectorRemoved: (pid, sid) => { this._onSectorRemoved(pid, sid); },
      onSectorUpdated: (sid) => { this._onSectorUpdated(sid); },
      onGroupAdded:   (id) => { this._onGroupAdded(id); },
      onGroupRemoved: (id) => { this._onGroupRemoved(id); },
      onGroupUpdated: (id) => { this._onGroupUpdated(id); },
      onRootOrderChanged: () => { this._rebuildTree(); },
      onAxisUpdated:  () => { this.beyRenderer.rebuildAxis(); this._saveToStorage(); },
      onTreeRebuild:  () => { this._rebuildTree(); },
    };
  }

  // ── Command event handlers ────────────────────────────────────────────────

  private _addPartToTree(id: string): void {
    const part = this.store.getPart(id);
    this.tree.add(id, part.name, part.isHollow ? '◯' : '⬡', null, {
      addChildButtons: [
        { label: 'Cut into sectors', title: 'Cut into sectors', onClick: () => {
          const n = parseInt(prompt('Number of sectors (2–12):', '3') ?? '3', 10) || 3;
          this._cutPart(id, Math.max(2, Math.min(12, n)));
        }},
        { label: 'Add Presentation', title: 'Add Presentation', onClick: () => this._addSubNodePresent(id) },
        { label: 'Add Particle Effect', title: 'Add Particle Effect', onClick: () => this._addSubNodeParticle(id) },
      ],
    });
    this.tree.setNodeActions(id, [
      { label: 'Free Spin: ' + (part.freeSpin ? 'ON' : 'OFF'), action: () => {
        this.history.execute(new UpdatePartCmd(this._ctx(), id, { freeSpin: !this.store.getPart(id).freeSpin }));
      }},
    ]);
  }

  private _onPartAdded(id: string): void {
    this.beyRenderer.rebuildPart(id);
    this._addPartToTree(id);
    this._saveToStorage();
  }

  private _onPartRemoved(id: string): void {
    this._subNodesAdded.delete(`present-${id}`);
    this._subNodesAdded.delete(`particle-${id}`);
    this.beyRenderer.removePart(id);
    this.tree.remove(id);
    this._saveToStorage();
  }

  private _duplicateNode(id: string): void {
    if (id === 'axis') return;
    if (id.startsWith('present-') || id.startsWith('particle-')) return;
    if (this.store.hasPart(id)) this._duplicatePart(id);
    else if (this.store.hasGroup(id)) {
      const src = this.store.getGroup(id);
      const newId = this.store.nextGroupId();
      const data: GroupData = { id: newId, name: src.name + ' copy', childIds: [] };
      this.history.execute(new AddGroupCmd(this._ctx(), data));
    }
  }

  private _duplicatePart(srcId: string): void {
    const src = this.store.getPart(srcId);
    const newPartId = this.store.nextPartId();
    const newSectors: SectorData[] = src.sectorIds.map(sid => ({
      ...this.store.getSector(sid),
      id: this.store.nextSectorId(),
    }));
    const newPart: PartData = {
      ...src, id: newPartId, name: src.name + ' copy',
      sectorIds: newSectors.map(s => s.id),
      present: { ...src.present, stlb64: null },
      particleConfig: { ...src.particleConfig },
    };
    this.store.addPart(newPart);
    this.store.addToRoot(newPartId);
    for (const s of newSectors) this.store.addSector(s);
    this.beyRenderer.rebuildPart(newPartId);
    this._addPartToTree(newPartId);
    for (const s of newSectors) this.tree.add(s.id, s.name, '◔', newPartId);
    this._saveToStorage();
  }

  private _addSubNodePresent(partId: string): void {
    const subId = `present-${partId}`;
    if (this._subNodesAdded.has(subId)) return;
    this._subNodesAdded.add(subId);
    this.tree.add(subId, '✦ Presentation', '✦', partId);
  }

  private _addSubNodeParticle(partId: string): void {
    const subId = `particle-${partId}`;
    if (this._subNodesAdded.has(subId)) return;
    this._subNodesAdded.add(subId);
    this.tree.add(subId, '✧ Particle Effect', '✧', partId);
  }

  private _onPartUpdated(id: string): void {
    if (!this.store.hasPart(id)) return;
    const part = this.store.getPart(id);
    this.beyRenderer.rebuildPart(id);
    this.beyRenderer.updateSpinGroups();
    this.tree.setLabel(id, part.name);
    // Rebuild sector nodes under this part
    this._rebuildSectorNodes(id);
    this._saveToStorage();
  }

  private _onSectorAdded(partId: string, sectorId: string): void {
    const sector = this.store.getSector(sectorId);
    this.tree.add(sectorId, sector.name, '◔', partId);
    this.beyRenderer.rebuildPart(partId);
    this._saveToStorage();
  }

  private _onSectorRemoved(partId: string, sectorId: string): void {
    this.tree.remove(sectorId);
    this.beyRenderer.rebuildPart(partId);
    this._saveToStorage();
  }

  private _onSectorUpdated(sectorId: string): void {
    const partId = this.store.findPartOfSector(sectorId);
    if (partId) this.beyRenderer.rebuildPart(partId);
    this._saveToStorage();
  }

  private _onGroupAdded(id: string): void {
    const group = this.store.getGroup(id);
    this.tree.add(id, group.name, '📦', null);
    this._saveToStorage();
  }

  private _onGroupRemoved(id: string): void {
    this.tree.remove(id);
    this._saveToStorage();
  }

  private _onGroupUpdated(id: string): void {
    if (!this.store.hasGroup(id)) return;
    this.tree.setLabel(id, this.store.getGroup(id).name);
    this._saveToStorage();
  }

  // ── Tree helpers ──────────────────────────────────────────────────────────

  private _rebuildSectorNodes(partId: string): void {
    const part = this.store.getPart(partId);
    // Remove stale sector nodes
    const existingChildren = (this.tree as unknown as { nodes: Map<string, unknown> })['nodes'];
    for (const [nid] of existingChildren) {
      if (this.store.hasSector(nid) && !part.sectorIds.includes(nid)) {
        this.tree.remove(nid);
      }
    }
    // Add missing ones
    for (const sid of part.sectorIds) {
      const sector = this.store.getSector(sid);
      const nodeMap = (this.tree as unknown as { nodes: Map<string, unknown> })['nodes'];
      if (!nodeMap.has(sid)) {
        this.tree.add(sid, sector.name, '◔', partId);
      }
    }
  }

  private _rebuildTree(): void {
    // Full tree rebuild from store (used after undo/redo)
    // Remove all non-axis nodes
    this._subNodesAdded.clear();
    const nodeMap = (this.tree as unknown as { nodes: Map<string, { id: string }> })['nodes'];
    for (const [id] of nodeMap) {
      if (id !== 'axis') this.tree.remove(id);
    }
    // Re-add groups
    for (const g of this.store.getAllGroups()) {
      this.tree.add(g.id, g.name, '📦', null);
    }
    // Re-add parts and their sectors
    for (const id of this.store.getRootChildIds()) {
      if (this.store.hasPart(id)) {
        const part = this.store.getPart(id);
        this._addPartToTree(id);
        for (const sid of part.sectorIds) {
          const sector = this.store.getSector(sid);
          this.tree.add(sid, sector.name, '◔', id);
        }
      }
    }
    // Rebuild all renderers
    for (const part of this.store.getAllParts()) {
      this.beyRenderer.rebuildPart(part.id);
    }
    this.panel.showEmpty();
    this._saveToStorage();
  }

  // ── Undo / Redo ───────────────────────────────────────────────────────────

  // ── Reset builder ─────────────────────────────────────────────────────────

  private async _confirmReset(): Promise<void> {
    const ok = await gameConfirm(
      'Reset the beyblade builder?\nAll parts, sectors and groups will be cleared.',
      'Reset', 'Cancel',
    );
    if (ok) this._resetBuilder();
  }

  private _resetBuilder(): void {
    // Stop any ongoing animation
    this.animator.stopSpin();
    this.animator.resetAngle();
    this.playBtn.classList.remove('active');
    this.stopBtn.classList.remove('active');

    // Dispose all part particle systems
    const scene = this.getScene();
    for (const [, ps] of this._partParticleSystems) {
      scene?.remove(ps.points);
      ps.dispose();
    }
    this._partParticleSystems.clear();

    // Dispose all part meshes
    for (const part of this.store.getAllParts()) {
      this.beyRenderer.removePart(part.id);
    }

    // Clear data store and command history
    this.store.reset();
    this.history.clear();

    // Reset bottom bar UI to defaults
    this.tiltInput.value  = '0';
    this.pivotInput.value = '0';
    this.spinLeftBtn.classList.remove('active');
    this.spinRightBtn.classList.add('active');
    this._applyAxisPose();

    // Reset view mode to hitbox
    this._setViewMode('hitbox');

    // Rebuild tree (empty — only axis node)
    const nodeMap = (this.tree as unknown as { nodes: Map<string, { id: string }> })['nodes'];
    for (const [id] of nodeMap) {
      if (id !== 'axis') this.tree.remove(id);
    }

    this.panel.showEmpty();
    this._syncUndoButtons();

    // Clear persisted config
    this._beyStore.getState().discard();
  }

  private _undo(): void {
    if (!this.history.canUndo) return;
    this.history.undo();
    this._rebuildTree();
  }

  private _redo(): void {
    if (!this.history.canRedo) return;
    this.history.redo();
    this._rebuildTree();
  }

  private _syncUndoButtons(): void {
    this.undoBtn.style.opacity = this.history.canUndo ? '1' : '0.4';
    this.redoBtn.style.opacity = this.history.canRedo ? '1' : '0.4';
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  private _saveToStorage(): void {
    this._beyStore.getState().save(this.store.serialize());
  }

  private _loadFromStorage(): void {
    try {
      const cfg = this._beyStore.getState().load();
      if (!cfg) return;
      this.store.deserialize(cfg);
      // Restore axis pose
      const axis = this.store.getAxis();
      this.tiltInput.value  = String(axis.tiltAngle);
      this.pivotInput.value = String(axis.pivotOffset);
      if (axis.spinDir === 'left') {
        this.spinLeftBtn.classList.add('active');
        this.spinRightBtn.classList.remove('active');
      }
      this._applyAxisPose();
      // Rebuild all part meshes and tree
      this._rebuildTree();
      // Restore STL blobs
      for (const part of this.store.getAllParts()) {
        if (part.present?.stlb64) {
          const loader = new STLLoader();
          const binary = Uint8Array.from(atob(part.present.stlb64), c => c.charCodeAt(0)).buffer;
          const geo = loader.parse(binary);
          this.beyRenderer.loadPresentationSTL(part.id, geo);
        }
      }
    } catch { /* corrupted */ }
  }
}
