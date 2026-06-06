import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { DialogueTree, DialogueNode, DialogueNodeType } from '../../types/rpgTypes.ts';

export class DialogueAdminScreen {
  private el: HTMLElement;
  private selectedTree: DialogueTree | null = null;
  private selectedNode: DialogueNode | null = null;
  private treeEl!: HTMLElement;
  private graphEl!: HTMLElement;  // node graph canvas area
  private propsEl!: HTMLElement;
  private nodeEls = new Map<string, HTMLElement>();
  private svgOverlay!: SVGSVGElement;

  constructor(container: HTMLElement, private opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-tree">
          <div class="admin-tree-header">
            <span>DIALOGUES</span>
            <button class="admin-add-btn" id="add-tree">+ Add</button>
          </div>
          <div class="admin-tree-list" id="dlg-tree"></div>
        </aside>
        <main class="admin-center" style="position:relative;overflow:hidden;background:#060c18;">
          <div id="node-graph" style="position:absolute;inset:0;overflow:hidden;"></div>
          <p id="dlg-hint" class="admin-empty-msg" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
            Select a dialogue tree to edit
          </p>
          <button id="add-node-btn" class="admin-add-btn"
            style="position:absolute;bottom:12px;right:12px;display:none;">+ Add Node</button>
        </main>
        <aside class="admin-props" id="dlg-props">
          <p class="admin-empty-msg">Select a node to edit</p>
        </aside>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.treeEl   = this.el.querySelector('#dlg-tree')!;
    this.graphEl  = this.el.querySelector('#node-graph')!;
    this.propsEl  = this.el.querySelector('#dlg-props')!;

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-tree')!.addEventListener('click', () => this.addTree());
    this.el.querySelector('#add-node-btn')!.addEventListener('click', () => this.addNode());

    this.svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgOverlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    this.graphEl.appendChild(this.svgOverlay);

    this.refresh();
  }

  private refresh(): void {
    this.treeEl.innerHTML = '';
    svgAssetStore.getAllDialogues().forEach(tree => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selectedTree?.id === tree.id ? ' active' : '');
      item.textContent = tree.name || tree.id;
      item.addEventListener('click', () => { this.selectedTree = tree; this.selectedNode = null; this.refresh(); this.buildGraph(tree); });
      const del = document.createElement('button');
      del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removeDialogue(tree.id); saveAllRPGAssets(); this.selectedTree = null; this.clearGraph(); this.refresh(); });
      item.appendChild(del);
      this.treeEl.appendChild(item);
    });

    if (this.selectedTree) {
      (this.el.querySelector('#add-node-btn') as HTMLElement).style.display = 'block';
      (this.el.querySelector('#dlg-hint') as HTMLElement).style.display = 'none';
    } else {
      (this.el.querySelector('#add-node-btn') as HTMLElement).style.display = 'none';
      (this.el.querySelector('#dlg-hint') as HTMLElement).style.display = 'block';
    }
  }

  private clearGraph(): void {
    this.nodeEls.clear();
    this.graphEl.querySelectorAll('.dlg-node').forEach(n => n.remove());
    this.redrawConnections();
  }

  private buildGraph(tree: DialogueTree): void {
    this.clearGraph();
    tree.nodes.forEach((node, i) => {
      const pos = tree.positions.find(p => p.id === node.id) ?? { id: node.id, x: 40 + (i % 3) * 200, y: 40 + Math.floor(i / 3) * 120 };
      this.createNodeEl(node, pos.x, pos.y, tree);
    });
    this.redrawConnections();
  }

  private createNodeEl(node: DialogueNode, x: number, y: number, tree: DialogueTree): void {
    const el = document.createElement('div');
    el.className = 'dlg-node';
    el.dataset.id = node.id;
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;min-width:140px;padding:8px;background:#0a1428;border:1px solid #1a3a6a;border-radius:4px;cursor:move;user-select:none;`;

    const typeColors: Record<string, string> = { START: '#22aa44', END: '#cc2222', TEXT: '#1a6aaa', CHOICE: '#aa6622', CONDITION: '#8844aa', EVENT: '#226688' };
    el.style.borderColor = typeColors[node.type] ?? '#1a3a6a';

    el.innerHTML = `
      <div style="font-family:Orbitron,monospace;font-size:9px;color:${typeColors[node.type] ?? '#00e5ff'};margin-bottom:4px;">${node.type}</div>
      <div style="font-family:Rajdhani,monospace;font-size:12px;color:#dde8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;">${node.speaker ? `[${node.speaker}] ` : ''}${node.text.substring(0, 30) || '...'}</div>
    `;

    el.addEventListener('click', () => { this.selectedNode = node; this.showNodeProps(node, tree); this.nodeEls.forEach((e, id) => e.style.outline = id === node.id ? '2px solid #00e5ff' : ''); el.style.outline = '2px solid #00e5ff'; });

    // Drag
    let ox = 0, oy = 0, dragging = false;
    el.addEventListener('mousedown', (e) => { dragging = true; ox = e.clientX - x; oy = e.clientY - y; e.preventDefault(); });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      x = e.clientX - ox; y = e.clientY - oy;
      el.style.left = x + 'px'; el.style.top = y + 'px';
      let pos = tree.positions.find(p => p.id === node.id);
      if (!pos) { pos = { id: node.id, x, y }; tree.positions.push(pos); } else { pos.x = x; pos.y = y; }
      this.redrawConnections();
    });
    document.addEventListener('mouseup', () => { if (dragging) { dragging = false; saveAllRPGAssets(); } });

    this.graphEl.appendChild(el);
    this.nodeEls.set(node.id, el);
  }

  private redrawConnections(): void {
    this.svgOverlay.innerHTML = '';
    const tree = this.selectedTree; if (!tree) return;
    const { width, height } = this.graphEl.getBoundingClientRect();
    this.svgOverlay.setAttribute('width', String(width));
    this.svgOverlay.setAttribute('height', String(height));

    const getCenter = (id: string): { x: number; y: number } => {
      const el = this.nodeEls.get(id);
      if (!el) return { x: 0, y: 0 };
      return { x: parseInt(el.style.left) + 70, y: parseInt(el.style.top) + 30 };
    };

    const drawCurve = (fromId: string, toId: string, color = '#1a6aaa') => {
      if (!this.nodeEls.has(fromId) || !this.nodeEls.has(toId)) return;
      const f = getCenter(fromId); const t = getCenter(toId);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const cx = (f.x + t.x) / 2;
      path.setAttribute('d', `M ${f.x} ${f.y} C ${cx} ${f.y}, ${cx} ${t.y}, ${t.x} ${t.y}`);
      path.setAttribute('stroke', color); path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none'); path.setAttribute('opacity', '0.6');
      this.svgOverlay.appendChild(path);
    };

    tree.nodes.forEach(node => {
      if (node.nextId) drawCurve(node.id, node.nextId);
      node.choices.forEach(c => drawCurve(node.id, c.nextId, '#aa6622'));
      if (node.trueBranch)  drawCurve(node.id, node.trueBranch, '#22aa44');
      if (node.falseBranch) drawCurve(node.id, node.falseBranch, '#cc2222');
    });
  }

  private showNodeProps(node: DialogueNode, tree: DialogueTree): void {
    this.propsEl.innerHTML = `<div class="admin-section-header">NODE: ${node.type}</div>`;
    const addRow = (label: string, el: HTMLElement) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };
    const textInp = (val: string, cb: (v: string) => void) => {
      const i = document.createElement('input'); i.type = 'text'; i.className = 'admin-input'; i.value = val;
      i.addEventListener('change', () => { cb(i.value); saveAllRPGAssets(); this.buildGraph(tree); }); return i;
    };
    const sel = (opts: string[], val: string, cb: (v: string) => void): HTMLSelectElement => {
      const s = document.createElement('select'); s.className = 'admin-input';
      opts.forEach(o => { const op = document.createElement('option'); op.value = op.textContent = o; if (o === val) op.selected = true; s.appendChild(op); });
      s.addEventListener('change', () => { cb(s.value); saveAllRPGAssets(); this.buildGraph(tree); }); return s;
    };
    addRow('Type',    sel(['START','TEXT','CHOICE','CONDITION','EVENT','END'] as DialogueNodeType[], node.type, v => { node.type = v as DialogueNodeType; }));
    addRow('Speaker', textInp(node.speaker, v => { node.speaker = v; }));
    addRow('Emotion', textInp(node.emotion, v => { node.emotion = v; }));
    const ta = document.createElement('textarea'); ta.className = 'admin-input'; ta.rows = 3; ta.style.width = '100%'; ta.value = node.text;
    ta.addEventListener('change', () => { node.text = ta.value; saveAllRPGAssets(); this.buildGraph(tree); });
    addRow('Text', ta);
    addRow('Next ID',  textInp(node.nextId ?? '', v => { node.nextId = v || null; }));
    addRow('Flag Key', textInp(node.flagKey ?? '', v => { node.flagKey = v || null; }));

    const delBtn = document.createElement('button'); delBtn.className = 'admin-btn'; delBtn.style.color = '#cc2222'; delBtn.textContent = '✕ Delete Node';
    delBtn.addEventListener('click', () => {
      const idx = tree.nodes.findIndex(n => n.id === node.id);
      if (idx >= 0) { tree.nodes.splice(idx, 1); tree.positions = tree.positions.filter(p => p.id !== node.id); }
      saveAllRPGAssets(); this.selectedNode = null; this.buildGraph(tree);
      this.propsEl.innerHTML = '<p class="admin-empty-msg">Select a node to edit</p>';
    });
    this.propsEl.appendChild(delBtn);
  }

  private addNode(): void {
    const tree = this.selectedTree; if (!tree) return;
    const id = `node_${Date.now()}`;
    const node: DialogueNode = { id, type: 'TEXT', speaker: '', emotion: 'neutral', text: 'New text', nextId: null, choices: [], flagKey: null, trueBranch: null, falseBranch: null, eventType: null, eventArg: null };
    tree.nodes.push(node);
    tree.positions.push({ id, x: 40, y: 40 + (tree.nodes.length - 1) * 120 });
    saveAllRPGAssets(); this.buildGraph(tree);
  }

  private addTree(): void {
    const id = `dlg_${Date.now()}`;
    const startId = `node_start_${Date.now()}`;
    svgAssetStore.addDialogue({
      id, name: 'New Dialogue', npcId: null, startId,
      nodes: [{ id: startId, type: 'START', speaker: '', emotion: 'neutral', text: '', nextId: null, choices: [], flagKey: null, trueBranch: null, falseBranch: null, eventType: null, eventArg: null }],
      positions: [{ id: startId, x: 40, y: 40 }],
    });
    saveAllRPGAssets();
    this.selectedTree = svgAssetStore.getDialogue(id) ?? null;
    this.refresh();
    if (this.selectedTree) this.buildGraph(this.selectedTree);
  }

  setVisible(v: boolean): void { this.el.classList.toggle('hidden', !v); if (v) this.refresh(); }
}
