export interface TreeNode {
  id: string; label: string; icon: string;
  parentId: string | null; childIds: string[];
  expanded: boolean;
  rowEl: HTMLElement; childrenEl: HTMLElement; nodeEl: HTMLElement;
}
export type DropPos = 'before' | 'inside' | 'after';
export type CtxItem = { label: string; action: () => void; disabled?: boolean };
export interface AddChildBtn { label: string; title: string; className?: string; onClick: () => void; }
export interface NodeOpts { onAddChild?: () => void; addChildButtons?: AddChildBtn[]; }

export class SceneTree {
  private bodyEl:   HTMLElement;
  private headerEl: HTMLElement;
  private nodes   = new Map<string, TreeNode>();
  private sel     = new Set<string>();
  private dragId:  string | null = null;
  private dropTarget: { id: string; pos: DropPos } | null = null;
  private ctxMenu: HTMLElement;
  private addMenu: HTMLElement;
  private idSeq   = 0;
  private nodeActions = new Map<string, CtxItem[]>();

  private checked = new Set<string>();

  onDelete:           (ids: string[]) => void = () => {};
  onDuplicate:        (id: string) => void = () => {};
  onGroup:            (newGroupId: string, childIds: string[]) => void = () => {};
  onCombine:          (ids: string[]) => void = () => {};
  onReparent:         (nodeId: string, newParentId: string | null, beforeId: string | null) => void = () => {};
  onSelect:           (ids: string[]) => void = () => {};
  onVisibilityToggle: (id: string, visible: boolean) => void = () => {};
  onCheck:            (ids: string[]) => void = () => {};
  onExpand:           (id: string, expanded: boolean) => void = () => {};

  get header(): HTMLElement { return this.headerEl; }

  constructor(private container: HTMLElement) {
    container.innerHTML = `
      <div class="scene-tree-header"><span class="scene-tree-header-title">SCENE</span></div>
      <div class="scene-tree-body"></div>
    `;
    this.headerEl = container.querySelector<HTMLElement>('.scene-tree-header')!;
    this.bodyEl   = container.querySelector<HTMLElement>('.scene-tree-body')!;
    this.ctxMenu  = document.createElement('div');
    this.ctxMenu.className = 'tree-ctx-menu hidden';
    document.body.appendChild(this.ctxMenu);
    this.addMenu  = document.createElement('div');
    this.addMenu.className = 'tree-ctx-menu tree-add-menu hidden';
    document.body.appendChild(this.addMenu);
    document.addEventListener('pointerdown', (e) => {
      if (!this.ctxMenu.contains(e.target as Node)) this.hideCtx();
      if (!this.addMenu.contains(e.target as Node) && !(e.target as HTMLElement).classList.contains('tree-add-btn')) this.hideAddMenu();
    });
  }

  add(id: string, label: string, icon: string, parentId: string | null = null, opts?: NodeOpts): void {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'tree-node'; nodeEl.dataset['id'] = id;
    const rowEl = document.createElement('div');
    rowEl.className = 'tree-node-row'; rowEl.draggable = true;
    rowEl.style.setProperty('--depth', String(this.depthOf(parentId)));
    const chkEl  = document.createElement('input'); chkEl.type = 'checkbox'; chkEl.className = 'tree-chk';
    chkEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (chkEl.checked) this.checked.add(id); else this.checked.delete(id);
      this.onCheck(this.getCheckedIds());
    });
    const caret  = document.createElement('span'); caret.className = 'tree-caret';
    const iconEl = document.createElement('span'); iconEl.className = 'tree-node-icon'; iconEl.textContent = icon;
    const labelEl = document.createElement('span'); labelEl.className = 'tree-node-label'; labelEl.textContent = label;
    rowEl.appendChild(chkEl); rowEl.appendChild(caret); rowEl.appendChild(iconEl); rowEl.appendChild(labelEl);
    const buttons: AddChildBtn[] = [];
    if (opts?.onAddChild) buttons.push({ label: '+', title: 'Add child', onClick: opts.onAddChild });
    if (opts?.addChildButtons) buttons.push(...opts.addChildButtons);
    if (buttons.length === 1) {
      const addBtn = document.createElement('button');
      addBtn.className = 'tree-add-btn'; addBtn.textContent = '+'; addBtn.title = buttons[0].title;
      addBtn.addEventListener('click', (e) => { e.stopPropagation(); buttons[0].onClick(); });
      rowEl.appendChild(addBtn);
    } else if (buttons.length > 1) {
      const addBtn = document.createElement('button');
      addBtn.className = 'tree-add-btn'; addBtn.textContent = '+'; addBtn.title = 'Add…';
      addBtn.addEventListener('click', (e) => { e.stopPropagation(); this.showAddMenu(buttons, addBtn); });
      rowEl.appendChild(addBtn);
    }
    const visBtn = document.createElement('button');
    visBtn.className = 'tree-vis-btn'; visBtn.textContent = '👁'; visBtn.title = 'Toggle visibility'; visBtn.tabIndex = -1;
    rowEl.appendChild(visBtn);
    const childrenEl = document.createElement('div'); childrenEl.className = 'tree-children';
    nodeEl.appendChild(rowEl); nodeEl.appendChild(childrenEl);
    const node: TreeNode = { id, label, icon, parentId, childIds: [], expanded: true, rowEl, childrenEl, nodeEl };
    this.nodes.set(id, node);
    if (parentId) {
      const parent = this.nodes.get(parentId);
      if (parent) { parent.childIds.push(id); parent.childrenEl.appendChild(nodeEl); this.refreshCaret(parent); }
    } else { this.bodyEl.appendChild(nodeEl); }
    this.wireRow(node, visBtn);
  }

  remove(id: string): void {
    const node = this.nodes.get(id); if (!node) return;
    [...node.childIds].forEach(cid => this.remove(cid));
    if (node.parentId) { const p = this.nodes.get(node.parentId); if (p) { p.childIds = p.childIds.filter(c=>c!==id); this.refreshCaret(p); } }
    node.nodeEl.remove(); this.nodes.delete(id); this.sel.delete(id); this.checked.delete(id); this.nodeActions.delete(id);
  }

  setLabel(id: string, label: string): void {
    const node = this.nodes.get(id); if (!node) return;
    node.label = label;
    const el = node.rowEl.querySelector<HTMLElement>('.tree-node-label');
    if (el) el.textContent = label;
  }

  setNodeActions(id: string, items: CtxItem[]): void { this.nodeActions.set(id, items); }

  /** Returns current child IDs of a node in their displayed (DOM) order. */
  getChildIds(id: string): string[] {
    const node = this.nodes.get(id);
    return node ? [...node.childIds] : [];
  }

  private select(id: string, multi: boolean): void {
    if (!multi) { this.sel.forEach(s=>this.nodes.get(s)?.rowEl.classList.remove('tree-node--selected')); this.sel.clear(); }
    if (this.sel.has(id) && multi) { this.sel.delete(id); this.nodes.get(id)?.rowEl.classList.remove('tree-node--selected'); }
    else { this.sel.add(id); this.nodes.get(id)?.rowEl.classList.add('tree-node--selected'); }
    this.onSelect([...this.sel]);
  }

  clearSel(): void {
    this.sel.forEach(id=>this.nodes.get(id)?.rowEl.classList.remove('tree-node--selected'));
    this.sel.clear(); this.onSelect([]);
  }

  private showCtx(x: number, y: number, id: string): void {
    if (!this.sel.has(id)) this.select(id, false);
    const ids = [...this.sel];
    const customItems = this.nodeActions.get(id) ?? [];
    const stdItems: CtxItem[] = [
      { label:'Duplicate', action:()=>{ this.onDuplicate(id); this.hideCtx(); } },
      { label:'Delete', action:()=>this.deleteSelected() },
      { label:'Group',  action:()=>this.groupSelected(),   disabled:ids.length < 1 },
      { label:'Combine',action:()=>this.combineSelected(), disabled:ids.length < 2 },
    ];
    this.ctxMenu.innerHTML = '';
    const append = (items: CtxItem[]) => items.forEach(item => {
      const btn = document.createElement('button'); btn.className = 'tree-ctx-item'; btn.textContent = item.label;
      if (item.disabled) btn.disabled = true;
      btn.addEventListener('click', ()=>{ item.action(); this.hideCtx(); });
      this.ctxMenu.appendChild(btn);
    });
    append(customItems);
    if (customItems.length) { const sep = document.createElement('div'); sep.className='tree-ctx-sep'; this.ctxMenu.appendChild(sep); }
    append(stdItems);
    this.ctxMenu.classList.remove('hidden');
    const r = this.ctxMenu.getBoundingClientRect();
    this.ctxMenu.style.left = `${Math.max(4, Math.min(x, window.innerWidth  - r.width  - 8))}px`;
    this.ctxMenu.style.top  = `${Math.max(4, Math.min(y, window.innerHeight - r.height - 8))}px`;
  }

  private hideCtx(): void { this.ctxMenu.classList.add('hidden'); }
  private deleteSelected(): void { const ids=[...this.sel]; if(!ids.length) return; ids.forEach(id=>this.remove(id)); this.onDelete(ids); }
  private groupSelected(): void {
    const ids=[...this.sel]; if(!ids.length) return;
    const groupId=`group-${++this.idSeq}`;
    this.add(groupId,'Group','▣',this.nodes.get(ids[0])!.parentId??null);
    ids.forEach(id=>this.reparentTo(id,groupId));
    this.clearSel(); this.select(groupId,false); this.onGroup(groupId,ids);
  }
  private combineSelected(): void { const ids=[...this.sel]; if(ids.length<2) return; this.onCombine(ids); }
  private refreshCaret(node: TreeNode): void {
    const c=node.rowEl.querySelector<HTMLElement>('.tree-caret');
    if(c) c.textContent=node.childIds.length===0?'':node.expanded?'▾':'▸';
  }
  private toggleExpand(id: string): void {
    const node=this.nodes.get(id); if(!node||!node.childIds.length) return;
    node.expanded=!node.expanded;
    node.childrenEl.classList.toggle('tree-children--collapsed',!node.expanded);
    this.refreshCaret(node);
    this.onExpand(id, node.expanded);
  }

  /** Programmatic expand/collapse — does NOT fire onExpand callback (avoids store→tree→store loop). */
  setExpanded(id: string, expanded: boolean): void {
    const node=this.nodes.get(id); if(!node) return;
    node.expanded=expanded;
    node.childrenEl.classList.toggle('tree-children--collapsed',!expanded);
    this.refreshCaret(node);
  }

  private wireRow(node: TreeNode, visBtn: HTMLButtonElement): void {
    const { rowEl, id } = node;
    rowEl.addEventListener('click', (e) => {
      const t=e.target as HTMLElement;
      if(t.classList.contains('tree-caret')) this.toggleExpand(id);
      else if(!t.classList.contains('tree-vis-btn')&&!t.classList.contains('tree-add-btn')&&!t.classList.contains('tree-chk'))
        this.select(id, e.ctrlKey||e.metaKey);
    });
    let visible = true;
    visBtn.addEventListener('click', (e) => {
      e.stopPropagation(); visible=!visible;
      visBtn.textContent=visible?'👁':'🚫';
      visBtn.classList.toggle('hidden-obj',!visible);
      this.onVisibilityToggle(id, visible);
      this.cascadeVisibility(id, visible);
    });
    rowEl.addEventListener('contextmenu', (e)=>{ e.preventDefault(); this.showCtx(e.clientX,e.clientY,id); });
    rowEl.addEventListener('dragstart', (e)=>{ this.dragId=id; e.dataTransfer!.effectAllowed='move'; rowEl.classList.add('tree-node--dragging'); });
    rowEl.addEventListener('dragend', ()=>{ this.dragId=null; rowEl.classList.remove('tree-node--dragging'); this.clearDrop(); });
    rowEl.addEventListener('dragover', (e)=>{
      if(!this.dragId||this.dragId===id) return;
      e.preventDefault(); e.dataTransfer!.dropEffect='move';
      const rel=(e.clientY-rowEl.getBoundingClientRect().top)/rowEl.getBoundingClientRect().height;
      const pos:DropPos=rel<0.28?'before':rel>0.72?'after':'inside';
      this.clearDrop(); this.dropTarget={id,pos}; rowEl.classList.add(`tree-drop-${pos}`);
    });
    rowEl.addEventListener('dragleave', ()=>this.clearDrop());
    rowEl.addEventListener('drop', (e)=>{
      e.preventDefault();
      if(!this.dragId||!this.dropTarget||this.dropTarget.id!==id) return;
      const src=this.dragId; const {pos}=this.dropTarget; this.clearDrop();
      if(pos==='inside') this.reparentTo(src,id);
      else { const t=this.nodes.get(id)!; this.reparentTo(src,t.parentId,pos==='before'?id:null,pos==='after'?id:null); }
    });

    // Touch long-press drag (500 ms hold)
    let _pressTimer: ReturnType<typeof setTimeout> | null = null;
    rowEl.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      _pressTimer = setTimeout(() => { _pressTimer = null; this._startDragFromTouch(id, rowEl, e); }, 500);
    });
    const _cancelPress = () => { if (_pressTimer) { clearTimeout(_pressTimer); _pressTimer = null; } };
    rowEl.addEventListener('pointermove',   _cancelPress);
    rowEl.addEventListener('pointerup',     _cancelPress);
    rowEl.addEventListener('pointercancel', _cancelPress);
  }

  private _startDragFromTouch(nodeId: string, rowEl: HTMLElement, startEvent: PointerEvent): void {
    this.dragId = nodeId;
    rowEl.classList.add('tree-node--dragging');

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== startEvent.pointerId) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const targetRow = target?.closest<HTMLElement>('.tree-node-row');
      if (!targetRow) { this.clearDrop(); return; }
      const targetId = targetRow.closest<HTMLElement>('.tree-node')?.dataset['id'];
      if (!targetId || targetId === nodeId) { this.clearDrop(); return; }
      const rel = (e.clientY - targetRow.getBoundingClientRect().top) / targetRow.getBoundingClientRect().height;
      const pos: DropPos = rel < 0.28 ? 'before' : rel > 0.72 ? 'after' : 'inside';
      this.clearDrop();
      this.dropTarget = { id: targetId, pos };
      targetRow.classList.add(`tree-drop-${pos}`);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== startEvent.pointerId) return;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
      document.removeEventListener('pointercancel', onUp);
      rowEl.classList.remove('tree-node--dragging');
      if (this.dragId && this.dropTarget) {
        const src = this.dragId; const { id: tgtId, pos } = this.dropTarget; this.clearDrop();
        if (pos === 'inside') this.reparentTo(src, tgtId);
        else { const t = this.nodes.get(tgtId)!; this.reparentTo(src, t.parentId, pos === 'before' ? tgtId : null, pos === 'after' ? tgtId : null); }
      }
      this.dragId = null;
    };
    document.addEventListener('pointermove',   onMove);
    document.addEventListener('pointerup',     onUp);
    document.addEventListener('pointercancel', onUp);
  }

  private cascadeVisibility(id: string, visible: boolean): void {
    const node = this.nodes.get(id); if (!node) return;
    for (const cid of node.childIds) {
      this.onVisibilityToggle(cid, visible);
      this.cascadeVisibility(cid, visible);
    }
  }

  private reparentTo(srcId: string, newParentId: string | null, beforeId: string | null=null, afterId: string | null=null): void {
    const src=this.nodes.get(srcId); if(!src) return;
    if(src.parentId){const old=this.nodes.get(src.parentId);if(old){old.childIds=old.childIds.filter(c=>c!==srcId);this.refreshCaret(old);}}
    src.nodeEl.remove(); src.parentId=newParentId;
    src.rowEl.style.setProperty('--depth',String(this.depthOf(newParentId)));
    const pc=newParentId?this.nodes.get(newParentId)?.childrenEl:this.bodyEl; if(!pc) return;
    if(beforeId) pc.insertBefore(src.nodeEl,this.nodes.get(beforeId)?.nodeEl??null);
    else if(afterId){const ref=this.nodes.get(afterId)?.nodeEl;ref?ref.after(src.nodeEl):pc.appendChild(src.nodeEl);}
    else pc.appendChild(src.nodeEl);
    if(newParentId){const np=this.nodes.get(newParentId)!;np.childIds=[...np.childrenEl.children].map(el=>(el as HTMLElement).dataset['id']??'').filter(Boolean);this.refreshCaret(np);}
    this.onReparent(srcId,newParentId,beforeId??afterId);
  }

  private clearDrop(): void {
    if(!this.dropTarget) return;
    this.nodes.get(this.dropTarget.id)?.rowEl.classList.remove('tree-drop-before','tree-drop-inside','tree-drop-after');
    this.dropTarget=null;
  }
  private depthOf(parentId: string | null): number {
    if(!parentId) return 0;
    const p=this.nodes.get(parentId);
    return p?this.depthOf(p.parentId)+1:0;
  }
  private showAddMenu(buttons: AddChildBtn[], anchor: HTMLElement): void {
    if (!this.addMenu.classList.contains('hidden')) { this.hideAddMenu(); return; }
    this.addMenu.innerHTML = '';
    for (const btn of buttons) {
      const item = document.createElement('button');
      item.className = 'tree-ctx-item';
      item.textContent = btn.label !== '+' ? btn.label : btn.title;
      item.title = btn.title;
      item.addEventListener('click', () => { btn.onClick(); this.hideAddMenu(); });
      this.addMenu.appendChild(item);
    }
    this.addMenu.classList.remove('hidden');
    const ar = anchor.getBoundingClientRect();
    const mr = this.addMenu.getBoundingClientRect();
    const left = Math.max(4, Math.min(ar.left, window.innerWidth  - mr.width  - 8));
    const top  = Math.max(4, Math.min(ar.bottom + 4, window.innerHeight - mr.height - 8));
    this.addMenu.style.left = `${left}px`;
    this.addMenu.style.top  = `${top}px`;
  }
  private hideAddMenu(): void { this.addMenu.classList.add('hidden'); }

  getCheckedIds(): string[] { return [...this.checked]; }
  clearChecks(): void {
    this.checked.clear();
    for (const node of this.nodes.values()) {
      const chk = node.rowEl.querySelector<HTMLInputElement>('.tree-chk');
      if (chk) chk.checked = false;
    }
    this.onCheck([]);
  }

  dispose(): void { this.ctxMenu.remove(); this.addMenu.remove(); }
}
