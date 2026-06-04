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
  PartData, SectorData, GroupData, ViewMode, BeyMaterial,
} from '../types/beybladeTypes';
import { gameConfirm } from '../utils/dialog';

const STORAGE_KEY = 'bey_beyblade_builder';
const SCHEMA_VER  = 1;

export class BeybladeSandbox extends Sandbox {
  private store        = new BeybladeStore();
  private history      = new CommandHistory();
  private beyRenderer!: BeybladeRenderer;
  private animator!:    BeybladeAnimator;
  private tree!:     SceneTree;
  private panel!:    BeybladePropertiesPanel;

  private undoBtn!: HTMLButtonElement;
  private redoBtn!: HTMLButtonElement;
  private playBtn!: HTMLButtonElement;
  private stopBtn!: HTMLButtonElement;
  private tiltInput!: HTMLInputElement;
  private pivotInput!: HTMLInputElement;
  private spinLeftBtn!:  HTMLButtonElement;
  private spinRightBtn!: HTMLButtonElement;
  private viewBtns: Record<ViewMode, HTMLButtonElement> = {} as Record<ViewMode, HTMLButtonElement>;

  constructor(container: HTMLElement, onBack: () => void) {
    const opts: SandboxOptions = {
      title:      'Beyblade Builder',
      accentHex:  0x00e5ff,
      onBack,
      gridSize:   15,
      gridDivs:   15,
      tickEvery:  5,
      tickRange:  7,
      defaultCam: { x: 12, y: 8, z: 14 },
      camFar:     500,
      minZoom:    0.5,
      maxZoom:    50,
    };
    super(container, opts);

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
    if (v) document.addEventListener('keydown', this._onKey);
    else   document.removeEventListener('keydown', this._onKey);
  }

  // ── Scene setup ───────────────────────────────────────────────────────────

  protected override buildCustom(scene: THREE.Scene): void {
    this.beyRenderer = new BeybladeRenderer(scene, this.store);
    this.animator = new BeybladeAnimator(this.beyRenderer);

    // Left panel (scene tree)
    const leftPanel = this.addOverlayPanel('sandbox-left-panel');
    leftPanel.innerHTML = `
      <div class="tree-collapse-wrap">
        <button class="tree-collapse-btn" title="Collapse panel">◀</button>
      </div>
    `;
    const treeContainer = document.createElement('div');
    treeContainer.className = 'scene-tree-container';
    leftPanel.appendChild(treeContainer);
    this.tree = new SceneTree(treeContainer);

    // Add-buttons below the tree header
    const addPartBtn  = document.createElement('button');
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

    // Collapse toggle
    const collapseBtn = leftPanel.querySelector<HTMLButtonElement>('.tree-collapse-btn')!;
    collapseBtn.addEventListener('click', () => {
      leftPanel.classList.toggle('collapsed');
      collapseBtn.textContent = leftPanel.classList.contains('collapsed') ? '▶' : '◀';
    });

    // Right panel (properties)
    const rightPanel = this.addOverlayPanel('sandbox-right-panel');
    this.panel = new BeybladePropertiesPanel(rightPanel);
    this.panel.onClose = () => { this.tree.clearSel(); this.panel.showEmpty(); };

    // Axis node in tree (always present, cannot be deleted)
    this.tree.add('axis', '🔄 Axis', '🔄', null);
    this.tree.setNodeActions('axis', [
      { label: 'Properties', action: () => this._selectAxis() },
    ]);

    // Bottom controls bar
    this._buildBottomBar();

    // Wire tree callbacks
    this._wireTree();

    // Load persisted data
    this._loadFromStorage();
  }

  // ── Per-frame tick ────────────────────────────────────────────────────────

  protected override onTick(dtMs: number): void {
    this.animator.tick(dtMs, this.store.getAxis().spinDir);
  }

  // ── Bottom controls bar ───────────────────────────────────────────────────

  private _buildBottomBar(): void {
    const bar = this.addOverlayPanel('beyblade-bottom-bar');
    bar.innerHTML = `
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
        <button class="game-btn" id="bey-play" title="Start spin animation">▶ PLAY</button>
        <button class="game-btn" id="bey-stop" title="Stop spin animation">■ STOP</button>
        <span class="bey-bar-sep"></span>
        <button class="game-btn bey-view-btn active" id="bey-view-hitbox"  title="Hitbox only">HITBOX</button>
        <button class="game-btn bey-view-btn" id="bey-view-both"    title="Hitbox + presentation">BOTH</button>
        <button class="game-btn bey-view-btn" id="bey-view-present" title="Presentation only">PRESENT</button>
      </div>
    `;

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
    const part = this.store.getPart(id);
    this.panel.showPart(
      part,
      (changes) => {
        this.history.execute(new UpdatePartCmd(this._ctx(), id, changes));
      },
      (count) => this._cutPart(id, count),
      () => this._importSTL(id),
    );
  }

  private _selectSector(sectorId: string, partId: string): void {
    const sector = this.store.getSector(sectorId);
    const part   = this.store.getPart(partId);
    this.panel.showSector(sector, part, (changes) => {
      this.history.execute(new UpdateSectorCmd(this._ctx(), partId, sectorId, changes));
    });
  }

  private _selectGroup(id: string): void {
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
      presentationColor: 0xaaaaaa,
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

  private _importSTL(partId: string): void {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.stl';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const loader = new STLLoader();
        const geo = loader.parse(reader.result as ArrayBuffer);
        this.beyRenderer.loadPresentationSTL(partId, geo);
        const b64 = btoa(String.fromCharCode(...new Uint8Array(reader.result as ArrayBuffer)));
        this.store.updatePart(partId, { presentationSTLb64: b64 });
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

  private _onPartAdded(id: string): void {
    const part = this.store.getPart(id);
    this.beyRenderer.rebuildPart(id);
    this.tree.add(id, part.name, part.isHollow ? '◯' : '⬡', null, {
      addChildButtons: [
        { label: 'S+', title: 'Cut into sectors', onClick: () => {
          const n = parseInt(prompt('Number of sectors (2–12):', '3') ?? '3', 10) || 3;
          this._cutPart(id, Math.max(2, Math.min(12, n)));
        }},
      ],
    });
    this.tree.setNodeActions(id, [
      { label: 'Free Spin: ' + (part.freeSpin ? 'ON' : 'OFF'), action: () => {
        this.history.execute(new UpdatePartCmd(this._ctx(), id, { freeSpin: !this.store.getPart(id).freeSpin }));
      }},
    ]);
    this._saveToStorage();
  }

  private _onPartRemoved(id: string): void {
    this.beyRenderer.removePart(id);
    this.tree.remove(id);
    this._saveToStorage();
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
        this.tree.add(id, part.name, part.isHollow ? '◯' : '⬡', null);
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

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
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

  private _onKey = (e: KeyboardEvent): void => {
    const isMac = /mac/i.test(navigator.platform);
    const ctrl  = isMac ? e.metaKey : e.ctrlKey;
    if (!ctrl) return;
    if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); this._undo(); }
    if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); this._redo(); }
  };

  // ── Persistence ───────────────────────────────────────────────────────────

  private _saveToStorage(): void {
    try {
      const cfg = this.store.serialize();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch { /* quota exceeded — ignore */ }
  }

  private _loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const cfg = JSON.parse(raw);
      if (cfg.version !== SCHEMA_VER) return;
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
        if (part.presentationSTLb64) {
          const loader = new STLLoader();
          const binary = Uint8Array.from(atob(part.presentationSTLb64), c => c.charCodeAt(0)).buffer;
          const geo = loader.parse(binary);
          this.beyRenderer.loadPresentationSTL(part.id, geo);
        }
      }
    } catch { /* corrupted */ }
  }
}
