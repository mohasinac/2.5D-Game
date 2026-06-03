import * as THREE from 'three';
import { Sandbox, SandboxOptions } from './Sandbox';

/* ── Constants ───────────────────────────────────────────────────────────── */
const TWO_PI = Math.PI * 2;
const APOTHEM = 100;

export const OCTAGON_BASE = {
  radius: APOTHEM / Math.cos(Math.PI / 8),
  height: 30, sides: 8, align: Math.PI / 8,
} as const;

/* ── Cut model ───────────────────────────────────────────────────────────── */
type OpeningShape = 'circle' | 'ellipse' | 'rectangle' | 'hexagon' | 'triangle' | 'star';
type WallProfile  = 'parabolic' | 'straight';

const SHAPE_LABEL: Record<OpeningShape, string> = {
  circle: 'Circle', ellipse: 'Ellipse', rectangle: 'Rect',
  hexagon: 'Hexagon', triangle: 'Triangle', star: 'Star',
};
const SHAPE_ICON: Record<OpeningShape, string> = {
  circle: '●', ellipse: '◯', rectangle: '▭',
  hexagon: '⬡', triangle: '△', star: '★',
};

interface CutData {
  name: string;
  openingShape: OpeningShape;
  wallProfile:  WallProfile;
  radiusX:      number;   /* cm — half-width X */
  radiusZ:      number;   /* cm — half-width Z */
  depth:        number;   /* cm — carving depth (max = base height) */
  sides:        number;   /* star: number of spike points */
  starInner:    number;   /* star: inner radius fraction 0..1 */
  posX:         number;
  posZ:         number;
  rotY:         number;   /* radians */
  mesh:         THREE.Mesh;
  edges:        THREE.LineSegments;
}

function defaultCut(name: string): CutData {
  return {
    name, openingShape: 'circle', wallProfile: 'parabolic',
    radiusX: 50, radiusZ: 50, depth: 20,
    sides: 5, starInner: 0.5,
    posX: 0, posZ: 0, rotY: 0,
    mesh:  null as unknown as THREE.Mesh,
    edges: null as unknown as THREE.LineSegments,
  };
}

/* ── 2-D opening shape points (x = worldX, y = worldZ) ──────────────────── */
function shapePoints(data: CutData): THREE.Vector2[] {
  const { radiusX: rx, radiusZ: rz, openingShape, sides, starInner } = data;
  const pts: THREE.Vector2[] = [];

  switch (openingShape) {
    case 'circle':
    case 'ellipse': {
      const N = 64;
      for (let i = 0; i < N; i++) {
        const θ = (i / N) * TWO_PI;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    }
    case 'rectangle':
      pts.push(
        new THREE.Vector2( rx,  rz), new THREE.Vector2(-rx,  rz),
        new THREE.Vector2(-rx, -rz), new THREE.Vector2( rx, -rz),
      );
      break;
    case 'hexagon':
      for (let i = 0; i < 6; i++) {
        const θ = (i / 6) * TWO_PI + Math.PI / 6;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    case 'triangle':
      for (let i = 0; i < 3; i++) {
        const θ = (i / 3) * TWO_PI - Math.PI / 2;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    case 'star': {
      const n = Math.max(3, Math.min(12, Math.round(sides)));
      const inner = Math.max(0.1, Math.min(0.95, starInner));
      for (let i = 0; i < n * 2; i++) {
        const θ = (i / (n * 2)) * TWO_PI - Math.PI / 2;
        const r = i % 2 === 0 ? 1 : inner;
        pts.push(new THREE.Vector2(rx * r * Math.cos(θ), rz * r * Math.sin(θ)));
      }
      break;
    }
  }
  return pts;
}

/* ── Parabolic bowl mesh (opening at y=H, bottom at y=H-depth) ───────────── */
function buildParabolicBowl(pts: THREE.Vector2[], depth: number): THREE.BufferGeometry {
  const H = OCTAGON_BASE.height;
  const N = pts.length;
  const RINGS = 24;
  const pos: number[] = [];
  const idx: number[] = [];

  pos.push(0, H - depth, 0); /* vertex 0 = deepest centre */

  for (let r = 1; r <= RINGS; r++) {
    const t = r / RINGS;
    const y = H - depth * (1 - t * t); /* parabolic: H-depth → H */
    for (let i = 0; i < N; i++) pos.push(pts[i].x * t, y, pts[i].y * t);
  }

  for (let i = 0; i < N; i++) /* centre → ring 1 */
    idx.push(0, 1 + (i + 1) % N, 1 + i);

  for (let r = 1; r < RINGS; r++) { /* ring r → ring r+1 */
    const b0 = 1 + (r - 1) * N, b1 = 1 + r * N;
    for (let i = 0; i < N; i++) {
      const a0 = b0 + i, c0 = b0 + (i + 1) % N;
      const a1 = b1 + i, c1 = b1 + (i + 1) % N;
      idx.push(a0, c0, a1, c0, c1, a1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/* ── Straight-wall cut mesh ──────────────────────────────────────────────── */
function buildStraightCut(pts: THREE.Vector2[], depth: number): THREE.BufferGeometry {
  const H = OCTAGON_BASE.height;
  const N = pts.length;
  const pos: number[] = [];
  const idx: number[] = [];

  for (const p of pts) pos.push(p.x, H, p.y);           /* top:    0..N-1  */
  for (const p of pts) pos.push(p.x, H - depth, p.y);   /* bottom: N..2N-1 */
  pos.push(0, H - depth, 0);                             /* cap centre: 2N  */

  for (let i = 0; i < N; i++) { /* side walls */
    const t0 = i, t1 = (i + 1) % N, b0 = N + i, b1 = N + (i + 1) % N;
    idx.push(t0, t1, b0, t1, b1, b0);
  }
  for (let i = 0; i < N; i++) /* bottom cap fan */
    idx.push(2 * N, N + (i + 1) % N, N + i);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/* ── Wireframe edge lines ────────────────────────────────────────────────── */
function buildEdgeLines(pts: THREE.Vector2[], depth: number, profile: WallProfile): THREE.BufferGeometry {
  const H = OCTAGON_BASE.height;
  const N = pts.length;
  const v: number[] = [];

  /* Opening rim */
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    v.push(a.x, H, a.y, b.x, H, b.y);
  }

  if (profile === 'parabolic') {
    const step = Math.max(1, Math.floor(N / 8));
    const SEG = 12;
    for (let i = 0; i < N; i += step) {
      for (let s = 0; s < SEG; s++) {
        const t0 = s / SEG, t1 = (s + 1) / SEG;
        const y0 = H - depth * (1 - t0 * t0), y1 = H - depth * (1 - t1 * t1);
        v.push(pts[i].x * t0, y0, pts[i].y * t0, pts[i].x * t1, y1, pts[i].y * t1);
      }
    }
  } else {
    /* Bottom rim */
    for (let i = 0; i < N; i++) {
      const a = pts[i], b = pts[(i + 1) % N];
      v.push(a.x, H - depth, a.y, b.x, H - depth, b.y);
    }
    /* Vertical edges */
    const step = Math.max(1, Math.floor(N / 8));
    for (let i = 0; i < N; i += step)
      v.push(pts[i].x, H, pts[i].y, pts[i].x, H - depth, pts[i].y);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return geo;
}

/* ── Build fresh Three.js objects for a cut ──────────────────────────────── */
function buildCutObjects(data: CutData): [THREE.Mesh, THREE.LineSegments] {
  const pts = shapePoints(data);
  const meshGeo = data.wallProfile === 'parabolic'
    ? buildParabolicBowl(pts, data.depth)
    : buildStraightCut(pts, data.depth);

  const mat  = new THREE.MeshStandardMaterial({
    color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.38, roughness: 0.35, metalness: 0.45,
  });
  const mesh = new THREE.Mesh(meshGeo, mat);
  mesh.position.set(data.posX, 0, data.posZ);
  mesh.rotation.y = data.rotY;

  const edgeGeo = buildEdgeLines(pts, data.depth, data.wallProfile);
  const edges   = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x00e5ff }));
  edges.position.set(data.posX, 0, data.posZ);
  edges.rotation.y = data.rotY;

  return [mesh, edges];
}

/* ── Apply mutated params to existing objects ────────────────────────────── */
function applyCut(data: CutData): void {
  const pts = shapePoints(data);

  const newMG = data.wallProfile === 'parabolic'
    ? buildParabolicBowl(pts, data.depth)
    : buildStraightCut(pts, data.depth);
  data.mesh.geometry.dispose();
  data.mesh.geometry = newMG;

  const newEG = buildEdgeLines(pts, data.depth, data.wallProfile);
  data.edges.geometry.dispose();
  data.edges.geometry = newEG;

  data.mesh.position.set(data.posX, 0, data.posZ);
  data.edges.position.set(data.posX, 0, data.posZ);
  data.mesh.rotation.y  = data.rotY;
  data.edges.rotation.y = data.rotY;
}

/* ══════════════════════════════════════════════════════════════════════════
   SceneTree
   ══════════════════════════════════════════════════════════════════════════ */
interface TreeNode {
  id: string; label: string; icon: string;
  parentId: string | null; childIds: string[];
  expanded: boolean;
  rowEl: HTMLElement; childrenEl: HTMLElement; nodeEl: HTMLElement;
}
type DropPos = 'before' | 'inside' | 'after';
type CtxItem = { label: string; action: () => void; disabled?: boolean };
interface NodeOpts { onAddChild?: () => void; }

export class SceneTree {
  private bodyEl:    HTMLElement;
  private headerEl:  HTMLElement;
  private nodes    = new Map<string, TreeNode>();
  private sel      = new Set<string>();
  private dragId:   string | null = null;
  private dropTarget: { id: string; pos: DropPos } | null = null;
  private ctxMenu:  HTMLElement;
  private idSeq    = 0;
  private nodeActions = new Map<string, CtxItem[]>();

  onDelete:           (ids: string[]) => void = () => {};
  onGroup:            (newGroupId: string, childIds: string[]) => void = () => {};
  onCombine:          (ids: string[]) => void = () => {};
  onReparent:         (nodeId: string, newParentId: string | null, beforeId: string | null) => void = () => {};
  onSelect:           (ids: string[]) => void = () => {};
  onVisibilityToggle: (id: string, visible: boolean) => void = () => {};

  get header(): HTMLElement { return this.headerEl; }

  constructor(private container: HTMLElement) {
    container.innerHTML = `
      <div class="scene-tree-header">
        <span class="scene-tree-header-title">SCENE</span>
      </div>
      <div class="scene-tree-body"></div>
    `;
    this.headerEl = container.querySelector<HTMLElement>('.scene-tree-header')!;
    this.bodyEl   = container.querySelector<HTMLElement>('.scene-tree-body')!;

    this.ctxMenu = document.createElement('div');
    this.ctxMenu.className = 'tree-ctx-menu hidden';
    document.body.appendChild(this.ctxMenu);

    document.addEventListener('pointerdown', (e) => {
      if (!this.ctxMenu.contains(e.target as Node)) this.hideCtx();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') this.deleteSelected();
      if (e.key === 'Escape') this.clearSel();
    });
  }

  add(id: string, label: string, icon: string, parentId: string | null = null, opts?: NodeOpts): void {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'tree-node';
    nodeEl.dataset['id'] = id;

    const rowEl = document.createElement('div');
    rowEl.className = 'tree-node-row';
    rowEl.draggable = true;
    rowEl.style.setProperty('--depth', String(this.depthOf(parentId)));

    const caret   = document.createElement('span'); caret.className = 'tree-caret';
    const iconEl  = document.createElement('span'); iconEl.className = 'tree-node-icon'; iconEl.textContent = icon;
    const labelEl = document.createElement('span'); labelEl.className = 'tree-node-label'; labelEl.textContent = label;
    rowEl.appendChild(caret); rowEl.appendChild(iconEl); rowEl.appendChild(labelEl);

    if (opts?.onAddChild) {
      const addBtn = document.createElement('button');
      addBtn.className = 'tree-add-btn'; addBtn.textContent = '+'; addBtn.title = 'Add carving';
      addBtn.addEventListener('click', (e) => { e.stopPropagation(); opts.onAddChild!(); });
      rowEl.appendChild(addBtn);
    }

    const visBtn = document.createElement('button');
    visBtn.className = 'tree-vis-btn'; visBtn.textContent = '👁'; visBtn.title = 'Toggle visibility'; visBtn.tabIndex = -1;
    rowEl.appendChild(visBtn);

    const childrenEl = document.createElement('div');
    childrenEl.className = 'tree-children';
    nodeEl.appendChild(rowEl); nodeEl.appendChild(childrenEl);

    const node: TreeNode = { id, label, icon, parentId, childIds: [], expanded: true, rowEl, childrenEl, nodeEl };
    this.nodes.set(id, node);

    if (parentId) {
      const parent = this.nodes.get(parentId);
      if (parent) { parent.childIds.push(id); parent.childrenEl.appendChild(nodeEl); this.refreshCaret(parent); }
    } else {
      this.bodyEl.appendChild(nodeEl);
    }
    this.wireRow(node, visBtn);
  }

  remove(id: string): void {
    const node = this.nodes.get(id); if (!node) return;
    [...node.childIds].forEach(cid => this.remove(cid));
    if (node.parentId) {
      const p = this.nodes.get(node.parentId);
      if (p) { p.childIds = p.childIds.filter(c => c !== id); this.refreshCaret(p); }
    }
    node.nodeEl.remove(); this.nodes.delete(id); this.sel.delete(id); this.nodeActions.delete(id);
  }

  setLabel(id: string, label: string): void {
    const node = this.nodes.get(id); if (!node) return;
    node.label = label;
    const el = node.rowEl.querySelector<HTMLElement>('.tree-node-label');
    if (el) el.textContent = label;
  }

  setNodeActions(id: string, items: CtxItem[]): void { this.nodeActions.set(id, items); }

  private select(id: string, multi: boolean): void {
    if (!multi) { this.sel.forEach(s => this.nodes.get(s)?.rowEl.classList.remove('tree-node--selected')); this.sel.clear(); }
    if (this.sel.has(id) && multi) { this.sel.delete(id); this.nodes.get(id)?.rowEl.classList.remove('tree-node--selected'); }
    else { this.sel.add(id); this.nodes.get(id)?.rowEl.classList.add('tree-node--selected'); }
    this.onSelect([...this.sel]);
  }

  clearSel(): void {
    this.sel.forEach(id => this.nodes.get(id)?.rowEl.classList.remove('tree-node--selected'));
    this.sel.clear(); this.onSelect([]);
  }

  private showCtx(x: number, y: number, id: string): void {
    if (!this.sel.has(id)) this.select(id, false);
    const ids = [...this.sel];
    const customItems = this.nodeActions.get(id) ?? [];
    const stdItems: CtxItem[] = [
      { label: 'Delete',  action: () => this.deleteSelected() },
      { label: 'Group',   action: () => this.groupSelected(),   disabled: ids.length < 1 },
      { label: 'Combine', action: () => this.combineSelected(), disabled: ids.length < 2 },
    ];
    this.ctxMenu.innerHTML = '';
    const append = (items: CtxItem[]) => items.forEach(item => {
      const btn = document.createElement('button'); btn.className = 'tree-ctx-item'; btn.textContent = item.label;
      if (item.disabled) btn.disabled = true;
      btn.addEventListener('click', () => { item.action(); this.hideCtx(); });
      this.ctxMenu.appendChild(btn);
    });
    append(customItems);
    if (customItems.length) { const sep = document.createElement('div'); sep.className = 'tree-ctx-sep'; this.ctxMenu.appendChild(sep); }
    append(stdItems);
    this.ctxMenu.classList.remove('hidden');
    const r = this.ctxMenu.getBoundingClientRect();
    this.ctxMenu.style.left = `${Math.min(x, window.innerWidth  - r.width  - 8)}px`;
    this.ctxMenu.style.top  = `${Math.min(y, window.innerHeight - r.height - 8)}px`;
  }

  private hideCtx(): void { this.ctxMenu.classList.add('hidden'); }

  private deleteSelected(): void {
    const ids = [...this.sel]; if (!ids.length) return;
    ids.forEach(id => this.remove(id)); this.onDelete(ids);
  }

  private groupSelected(): void {
    const ids = [...this.sel]; if (!ids.length) return;
    const groupId = `group-${++this.idSeq}`;
    this.add(groupId, 'Group', '▣', this.nodes.get(ids[0])!.parentId ?? null);
    ids.forEach(id => this.reparentTo(id, groupId));
    this.clearSel(); this.select(groupId, false); this.onGroup(groupId, ids);
  }

  private combineSelected(): void {
    const ids = [...this.sel]; if (ids.length < 2) return; this.onCombine(ids);
  }

  private refreshCaret(node: TreeNode): void {
    const c = node.rowEl.querySelector<HTMLElement>('.tree-caret');
    if (c) c.textContent = node.childIds.length === 0 ? '' : node.expanded ? '▾' : '▸';
  }

  private toggleExpand(id: string): void {
    const node = this.nodes.get(id); if (!node || !node.childIds.length) return;
    node.expanded = !node.expanded;
    node.childrenEl.classList.toggle('tree-children--collapsed', !node.expanded);
    this.refreshCaret(node);
  }

  private wireRow(node: TreeNode, visBtn: HTMLButtonElement): void {
    const { rowEl, id } = node;
    rowEl.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.classList.contains('tree-caret'))     this.toggleExpand(id);
      else if (!t.classList.contains('tree-vis-btn') && !t.classList.contains('tree-add-btn'))
        this.select(id, e.ctrlKey || e.metaKey);
    });

    let visible = true;
    visBtn.addEventListener('click', (e) => {
      e.stopPropagation(); visible = !visible;
      visBtn.textContent = visible ? '👁' : '🚫';
      visBtn.classList.toggle('hidden-obj', !visible);
      this.onVisibilityToggle(id, visible);
    });

    rowEl.addEventListener('contextmenu', (e) => { e.preventDefault(); this.showCtx(e.clientX, e.clientY, id); });
    rowEl.addEventListener('dragstart', (e) => { this.dragId = id; e.dataTransfer!.effectAllowed = 'move'; rowEl.classList.add('tree-node--dragging'); });
    rowEl.addEventListener('dragend',   () =>  { this.dragId = null; rowEl.classList.remove('tree-node--dragging'); this.clearDrop(); });
    rowEl.addEventListener('dragover', (e) => {
      if (!this.dragId || this.dragId === id) return;
      e.preventDefault(); e.dataTransfer!.dropEffect = 'move';
      const rel = (e.clientY - rowEl.getBoundingClientRect().top) / rowEl.getBoundingClientRect().height;
      const pos: DropPos = rel < 0.28 ? 'before' : rel > 0.72 ? 'after' : 'inside';
      this.clearDrop(); this.dropTarget = { id, pos }; rowEl.classList.add(`tree-drop-${pos}`);
    });
    rowEl.addEventListener('dragleave', () => this.clearDrop());
    rowEl.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!this.dragId || !this.dropTarget || this.dropTarget.id !== id) return;
      const src = this.dragId; const { pos } = this.dropTarget; this.clearDrop();
      if (pos === 'inside') this.reparentTo(src, id);
      else { const t = this.nodes.get(id)!; this.reparentTo(src, t.parentId, pos === 'before' ? id : null, pos === 'after' ? id : null); }
    });
  }

  private reparentTo(srcId: string, newParentId: string | null, beforeId: string | null = null, afterId: string | null = null): void {
    const src = this.nodes.get(srcId); if (!src) return;
    if (src.parentId) { const old = this.nodes.get(src.parentId); if (old) { old.childIds = old.childIds.filter(c => c !== srcId); this.refreshCaret(old); } }
    src.nodeEl.remove(); src.parentId = newParentId;
    src.rowEl.style.setProperty('--depth', String(this.depthOf(newParentId)));
    const pc = newParentId ? this.nodes.get(newParentId)?.childrenEl : this.bodyEl; if (!pc) return;
    if (beforeId)     pc.insertBefore(src.nodeEl, this.nodes.get(beforeId)?.nodeEl ?? null);
    else if (afterId) { const ref = this.nodes.get(afterId)?.nodeEl; ref ? ref.after(src.nodeEl) : pc.appendChild(src.nodeEl); }
    else              pc.appendChild(src.nodeEl);
    if (newParentId) { const np = this.nodes.get(newParentId)!; np.childIds = [...np.childrenEl.children].map(el => (el as HTMLElement).dataset['id'] ?? '').filter(Boolean); this.refreshCaret(np); }
    this.onReparent(srcId, newParentId, beforeId ?? afterId);
  }

  private clearDrop(): void {
    if (!this.dropTarget) return;
    this.nodes.get(this.dropTarget.id)?.rowEl.classList.remove('tree-drop-before', 'tree-drop-inside', 'tree-drop-after');
    this.dropTarget = null;
  }

  private depthOf(parentId: string | null): number {
    if (!parentId) return 0;
    const p = this.nodes.get(parentId);
    return p ? this.depthOf(p.parentId) + 1 : 0;
  }

  dispose(): void { this.ctxMenu.remove(); }
}

/* ══════════════════════════════════════════════════════════════════════════
   PropertiesPanel
   ══════════════════════════════════════════════════════════════════════════ */
class PropertiesPanel {
  private content: HTMLElement;

  constructor(container: HTMLElement) {
    container.innerHTML = `<div class="prop-header">PROPERTIES</div><div class="prop-content"></div>`;
    this.content = container.querySelector<HTMLElement>('.prop-content')!;
    this.showEmpty();
  }

  showEmpty(): void {
    this.content.innerHTML = `<div class="prop-empty">Select a carving<br>to inspect</div>`;
  }

  showBase(): void {
    this.content.innerHTML = '';
    this.section('OCTAGON BASE');
    this.readRow('Flat-to-flat', '200 cm');
    this.readRow('Height', `${OCTAGON_BASE.height} cm`);
    this.readRow('Sides', String(OCTAGON_BASE.sides));
    const hint = document.createElement('div');
    hint.className = 'prop-hint';
    hint.textContent = 'Click [+] on the base node to add a carving';
    this.content.appendChild(hint);
  }

  /**
   * onGeomChange  — mutates data + rebuilds geometry, no panel re-render.
   * onFullChange  — mutates data + rebuilds geometry + re-renders panel.
   * onRename      — updates the tree label.
   */
  showCut(
    data: CutData,
    onGeomChange: () => void,
    onFullChange: () => void,
    onRename: (name: string) => void,
  ): void {
    this.content.innerHTML = '';

    /* Name */
    this.section('NAME');
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'prop-text-input'; nameInp.value = data.name;
    nameInp.addEventListener('input', () => { data.name = nameInp.value; onRename(data.name); });
    this.content.appendChild(nameInp);

    /* Opening shape grid */
    this.section('OPENING SHAPE');
    const shapeGrid = document.createElement('div');
    shapeGrid.className = 'prop-shape-grid';
    (['circle', 'ellipse', 'rectangle', 'hexagon', 'triangle', 'star'] as OpeningShape[]).forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'prop-shape-btn' + (data.openingShape === s ? ' active' : '');
      btn.innerHTML = `<span class="prop-shape-icon">${SHAPE_ICON[s]}</span><span>${SHAPE_LABEL[s]}</span>`;
      btn.addEventListener('click', () => { data.openingShape = s; onFullChange(); });
      shapeGrid.appendChild(btn);
    });
    this.content.appendChild(shapeGrid);

    if (data.openingShape === 'star') {
      this.numRow('Points',     data.sides,     3, 12,   1,    v => { data.sides     = Math.round(v); onFullChange(); });
      this.numRow('Inner frac', data.starInner, 0.1, 0.95, 0.05, v => { data.starInner = v; onGeomChange(); });
    }

    /* Wall profile */
    this.section('WALL PROFILE');
    const profRow = document.createElement('div');
    profRow.className = 'prop-profile-row';
    (['parabolic', 'straight'] as WallProfile[]).forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'prop-profile-btn' + (data.wallProfile === p ? ' active' : '');
      btn.textContent = p === 'parabolic' ? '⌣ Bowl' : '▮ Straight';
      btn.addEventListener('click', () => { data.wallProfile = p; onFullChange(); });
      profRow.appendChild(btn);
    });
    this.content.appendChild(profRow);

    /* Dimensions */
    this.section('DIMENSIONS');
    this.numRow('Radius X', data.radiusX, 5, APOTHEM, 1, v => { data.radiusX = v; onGeomChange(); });
    this.numRow('Radius Z', data.radiusZ, 5, APOTHEM, 1, v => { data.radiusZ = v; onGeomChange(); });
    this.numRow('Depth',    data.depth,   1, OCTAGON_BASE.height, 0.5, v => { data.depth = v; onGeomChange(); });

    /* Position */
    this.section('POSITION');
    this.numRow('X',      data.posX,  -APOTHEM, APOTHEM, 1, v => { data.posX = v; onGeomChange(); });
    this.numRow('Z',      data.posZ,  -APOTHEM, APOTHEM, 1, v => { data.posZ = v; onGeomChange(); });
    this.numRow('Rot Y °', THREE.MathUtils.radToDeg(data.rotY), -180, 180, 1,
      v => { data.rotY = THREE.MathUtils.degToRad(v); onGeomChange(); });
  }

  /* ── DOM helpers ─────────────────────────────────────────────── */
  private section(title: string): void {
    const el = document.createElement('div'); el.className = 'prop-section-title'; el.textContent = title;
    this.content.appendChild(el);
  }
  private readRow(label: string, value: string): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    row.innerHTML = `<span class="prop-label">${label}</span><span class="prop-value-read">${value}</span>`;
    this.content.appendChild(row);
  }
  private numRow(label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void): void {
    const row = document.createElement('div'); row.className = 'prop-row';
    const lbl = document.createElement('span'); lbl.className = 'prop-label'; lbl.textContent = label;
    const inp = document.createElement('input'); inp.className = 'prop-input'; inp.type = 'number';
    inp.value = String(parseFloat(value.toFixed(2))); inp.min = String(min); inp.max = String(max); inp.step = String(step);
    inp.addEventListener('input', () => onChange(parseFloat(inp.value) || 0));
    row.appendChild(lbl); row.appendChild(inp); this.content.appendChild(row);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   ArenaSandbox
   ══════════════════════════════════════════════════════════════════════════ */
export class ArenaSandbox extends Sandbox {
  private baseMesh:  THREE.Mesh | null = null;
  private baseEdges: THREE.LineSegments | null = null;
  private solidMode = true;
  private modeBtn:  HTMLButtonElement;

  protected sceneTree: SceneTree;
  private sceneObjects = new Map<string, THREE.Object3D[]>();
  private cuts         = new Map<string, CutData>();
  private cutSeq       = 0;
  private props:       PropertiesPanel;
  private selectedId:  string | null = null;

  constructor(container: HTMLElement, opts: SandboxOptions) {
    super(container, opts);

    this.modeBtn = this.addTopBarButton('● Solid', 'Toggle solid / mesh view');
    this.modeBtn.addEventListener('click', () => this.toggleMode());

    /* ── Left panel ── */
    const leftPanel = this.addOverlayPanel('sandbox-left-panel');
    this.sceneTree  = new SceneTree(leftPanel);

    /* Collapse button in header */
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'tree-collapse-btn'; collapseBtn.textContent = '◀'; collapseBtn.title = 'Collapse panel';
    this.sceneTree.header.appendChild(collapseBtn);
    collapseBtn.addEventListener('click', () => {
      const collapsed = leftPanel.classList.toggle('sandbox-left-panel--collapsed');
      collapseBtn.textContent = collapsed ? '▶' : '◀';
      collapseBtn.title       = collapsed ? 'Expand panel' : 'Collapse panel';
    });

    /* Octagon Base node with [+] button */
    this.sceneTree.add('octagon-base', 'Octagon Base', '⬡', null, {
      onAddChild: () => this.addCut(),
    });

    /* ── Right panel ── */
    const rightPanel = this.addOverlayPanel('sandbox-right-panel');
    this.props = new PropertiesPanel(rightPanel);

    /* ── Tree callbacks ── */
    this.sceneTree.onSelect = (ids) => {
      this.selectedId = ids.length === 1 ? ids[0] : null;
      this.renderProps();
    };

    this.sceneTree.onVisibilityToggle = (id, visible) => {
      (this.sceneObjects.get(id) ?? []).forEach(o => { o.visible = visible; });
    };

    this.sceneTree.onDelete = (ids) => {
      ids.forEach(id => {
        const objs = this.sceneObjects.get(id);
        if (objs) { this.removeFromScene(...objs); this.sceneObjects.delete(id); }
        const cut = this.cuts.get(id);
        if (cut) {
          cut.mesh.geometry.dispose();
          (cut.mesh.material as THREE.Material).dispose();
          cut.edges.geometry.dispose();
          (cut.edges.material as THREE.Material).dispose();
          this.cuts.delete(id);
        }
      });
      if (ids.includes(this.selectedId ?? '')) { this.selectedId = null; this.props.showEmpty(); }
    };
  }

  protected override buildCustom(scene: THREE.Scene): void {
    const { radius: R, height: H, sides, align } = OCTAGON_BASE;
    const accent = 0xff6b35;
    const geo    = new THREE.CylinderGeometry(R, R, H, sides, 1, false);

    this.baseMesh = new THREE.Mesh(geo,
      new THREE.MeshStandardMaterial({ color: accent, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.25 }));
    this.baseMesh.rotation.y = align;
    this.baseMesh.position.y = H / 2;
    scene.add(this.baseMesh);

    this.baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: accent }));
    this.baseEdges.rotation.y = align;
    this.baseEdges.position.y = H / 2;
    scene.add(this.baseEdges);

    this.sceneObjects.set('octagon-base', [this.baseMesh, this.baseEdges]);
  }

  private renderProps(): void {
    const id = this.selectedId;
    if (!id) { this.props.showEmpty(); return; }
    if (id === 'octagon-base') { this.props.showBase(); return; }
    const data = this.cuts.get(id);
    if (!data) { this.props.showEmpty(); return; }

    this.props.showCut(
      data,
      /* onGeomChange */  () => applyCut(data),
      /* onFullChange */  () => { applyCut(data); this.renderProps(); },
      /* onRename */      (name) => this.sceneTree.setLabel(id, name),
    );
  }

  private toggleMode(): void {
    this.solidMode = !this.solidMode;
    this.modeBtn.textContent = this.solidMode ? '● Solid' : '○ Mesh';
    if (this.baseMesh) this.baseMesh.visible = this.solidMode;
  }

  private addCut(): void {
    const id   = `cut-${++this.cutSeq}`;
    const data = defaultCut(`Cut ${this.cutSeq}`);
    const [mesh, edges] = buildCutObjects(data);
    data.mesh  = mesh;
    data.edges = edges;

    this.addToScene(mesh, edges);
    this.sceneObjects.set(id, [mesh, edges]);
    this.cuts.set(id, data);
    this.sceneTree.add(id, data.name, '✂', 'octagon-base');
  }
}
