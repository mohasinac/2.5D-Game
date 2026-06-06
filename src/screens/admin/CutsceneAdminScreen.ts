import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { CutsceneScript, CutsceneStep, CutsceneStepType } from '../../types/rpgTypes.ts';

const STEP_COLORS: Record<string, string> = {
  camera_pan: '#1a6aaa', dialogue: '#1a8aaa', npc_move: '#226688',
  sfx: '#22aa44', fade: '#555566', wait: '#444455', flag_set: '#8844aa',
};

export class CutsceneAdminScreen {
  private el: HTMLElement;
  private selectedScript: CutsceneScript | null = null;
  private selectedStep: CutsceneStep | null = null;
  private treeEl!: HTMLElement;
  private timelineEl!: HTMLElement;
  private propsEl!: HTMLElement;

  constructor(container: HTMLElement, private opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-tree">
          <div class="admin-tree-header">
            <span>CUTSCENES</span>
            <button class="admin-add-btn" id="add-cs">+ Add</button>
          </div>
          <div class="admin-tree-list" id="cs-tree"></div>
        </aside>
        <main class="admin-center" style="flex-direction:column;align-items:stretch;gap:0;">
          <div class="admin-toolbar" style="padding:8px;gap:6px;flex-wrap:wrap;">
            ${['camera_pan','dialogue','npc_move','sfx','fade','wait','flag_set'].map(t =>
              `<button class="admin-add-btn" data-step="${t}" style="background:${STEP_COLORS[t]};border-color:${STEP_COLORS[t]};display:none;">+ ${t}</button>`
            ).join('')}
          </div>
          <div id="cs-timeline" style="flex:1;overflow-x:auto;overflow-y:hidden;background:#060c18;display:flex;align-items:center;gap:4px;padding:12px;min-height:120px;">
            <p class="admin-empty-msg">Select a cutscene to edit</p>
          </div>
        </main>
        <aside class="admin-props" id="cs-props">
          <p class="admin-empty-msg">Select a step to edit</p>
        </aside>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.treeEl     = this.el.querySelector('#cs-tree')!;
    this.timelineEl = this.el.querySelector('#cs-timeline')!;
    this.propsEl    = this.el.querySelector('#cs-props')!;

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-cs')!.addEventListener('click', () => this.addScript());
    this.el.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => this.addStep((btn as HTMLElement).dataset.step as CutsceneStepType));
    });

    this.refresh();
  }

  private refresh(): void {
    this.treeEl.innerHTML = '';
    svgAssetStore.getAllCutscenes().forEach(script => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selectedScript?.id === script.id ? ' active' : '');
      item.textContent = script.name || script.id;
      item.addEventListener('click', () => { this.selectedScript = script; this.selectedStep = null; this.refresh(); this.buildTimeline(script); });
      const del = document.createElement('button');
      del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removeCutscene(script.id); saveAllRPGAssets(); this.selectedScript = null; this.clearTimeline(); this.refresh(); });
      item.appendChild(del);
      this.treeEl.appendChild(item);
    });

    const hasScript = this.selectedScript !== null;
    this.el.querySelectorAll('[data-step]').forEach(btn => {
      (btn as HTMLElement).style.display = hasScript ? 'block' : 'none';
    });
  }

  private buildTimeline(script: CutsceneScript): void {
    this.timelineEl.innerHTML = '';
    if (script.steps.length === 0) {
      this.timelineEl.innerHTML = '<p class="admin-empty-msg">No steps yet. Add steps from the toolbar.</p>';
      return;
    }
    script.steps.forEach((step, i) => {
      const block = document.createElement('div');
      const w = Math.max(60, step.duration / 20);
      block.style.cssText = `min-width:${w}px;height:80px;background:${STEP_COLORS[step.type] ?? '#333344'};border-radius:4px;cursor:pointer;padding:6px;flex-shrink:0;position:relative;border:1px solid rgba(255,255,255,0.1);`;
      block.innerHTML = `
        <div style="font-family:Orbitron,monospace;font-size:8px;color:#fff;opacity:0.9;">${step.type}</div>
        <div style="font-family:Rajdhani,monospace;font-size:10px;color:#dde8ff;margin-top:2px;">${step.duration}ms</div>
        <button style="position:absolute;top:2px;right:4px;background:none;border:none;color:#fff;cursor:pointer;font-size:10px;">✕</button>
      `;
      block.addEventListener('click', () => { this.selectedStep = step; this.showStepProps(step, script); block.style.outline = '2px solid #00e5ff'; });
      block.querySelector('button')!.addEventListener('click', (e) => {
        e.stopPropagation();
        script.steps.splice(i, 1); saveAllRPGAssets(); this.buildTimeline(script);
        this.propsEl.innerHTML = '<p class="admin-empty-msg">Select a step to edit</p>';
      });
      this.timelineEl.appendChild(block);
    });
  }

  private clearTimeline(): void {
    this.timelineEl.innerHTML = '<p class="admin-empty-msg">Select a cutscene to edit</p>';
  }

  private showStepProps(step: CutsceneStep, script: CutsceneScript): void {
    this.propsEl.innerHTML = `<div class="admin-section-header">STEP: ${step.type}</div>`;
    const addRow = (label: string, el: HTMLElement) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };
    const numInp = (val: number, cb: (v: number) => void) => {
      const i = document.createElement('input'); i.type = 'number'; i.className = 'admin-input'; i.value = String(val);
      i.addEventListener('change', () => { cb(Number(i.value)); saveAllRPGAssets(); this.buildTimeline(script); }); return i;
    };
    const textInp = (val: string, cb: (v: string) => void) => {
      const i = document.createElement('input'); i.type = 'text'; i.className = 'admin-input'; i.value = val;
      i.addEventListener('change', () => { cb(i.value); saveAllRPGAssets(); }); return i;
    };
    addRow('Duration (ms)', numInp(step.duration, v => { step.duration = v; }));
    if (step.type === 'camera_pan') {
      addRow('Target X', numInp(step.targetX, v => { step.targetX = v; }));
      addRow('Target Y', numInp(step.targetY, v => { step.targetY = v; }));
    }
    if (step.type === 'dialogue') addRow('Dialogue ID', textInp(step.dialogueId ?? '', v => { step.dialogueId = v || null; }));
    if (step.type === 'npc_move') {
      addRow('NPC ID',   textInp(step.npcId ?? '', v => { step.npcId = v || null; }));
      addRow('Dest X',  numInp(step.destTileX, v => { step.destTileX = v; }));
      addRow('Dest Y',  numInp(step.destTileY, v => { step.destTileY = v; }));
    }
    if (step.type === 'sfx') addRow('Sound ID', textInp(step.soundId ?? '', v => { step.soundId = v || null; }));
    if (step.type === 'fade') {
      const sel = document.createElement('select'); sel.className = 'admin-input';
      ['in','out'].forEach(d => { const op = document.createElement('option'); op.value = op.textContent = d; if (d === step.fadeDir) op.selected = true; sel.appendChild(op); });
      sel.addEventListener('change', () => { step.fadeDir = sel.value as 'in' | 'out'; saveAllRPGAssets(); });
      addRow('Fade Dir', sel);
    }
    if (step.type === 'flag_set') {
      addRow('Flag Key',  textInp(step.flagKey ?? '', v => { step.flagKey = v || null; }));
      const chk = document.createElement('input'); chk.type = 'checkbox'; chk.checked = step.flagValue;
      chk.addEventListener('change', () => { step.flagValue = chk.checked; saveAllRPGAssets(); });
      addRow('Flag Value', chk);
    }
  }

  private addStep(type: CutsceneStepType): void {
    const script = this.selectedScript; if (!script) return;
    const step: CutsceneStep = { id: `step_${Date.now()}`, type, duration: 1000, targetX: 0, targetY: 0, dialogueId: null, npcId: null, destTileX: 0, destTileY: 0, soundId: null, fadeDir: 'out', flagKey: null, flagValue: false };
    script.steps.push(step); saveAllRPGAssets(); this.buildTimeline(script);
  }

  private addScript(): void {
    const id = `cs_${Date.now()}`;
    svgAssetStore.addCutscene({ id, name: 'New Cutscene', steps: [] });
    saveAllRPGAssets();
    this.selectedScript = svgAssetStore.getCutscene(id) ?? null;
    this.refresh();
    if (this.selectedScript) this.buildTimeline(this.selectedScript);
  }

  setVisible(v: boolean): void { this.el.classList.toggle('hidden', !v); if (v) this.refresh(); }
}
