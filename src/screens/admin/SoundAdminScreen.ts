import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { AudioAssetData, AudioCategory } from '../../types/rpgTypes.ts';

export class SoundAdminScreen {
  private el: HTMLElement;
  private selected: AudioAssetData | null = null;
  private treeEl!: HTMLElement;
  private propsEl!: HTMLElement;
  private audioEl: HTMLAudioElement | null = null;

  constructor(container: HTMLElement, private opts: { onBack: () => void }) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-tree">
          <div class="admin-tree-header">
            <span>AUDIO</span>
            <button class="admin-add-btn" id="add-audio">+ Add</button>
          </div>
          <div class="admin-tree-list" id="audio-tree"></div>
        </aside>
        <main class="admin-center" style="align-items:center;justify-content:center;flex-direction:column;gap:16px;">
          <div class="admin-audio-player" id="audio-player" style="display:none;">
            <button id="play-audio" class="admin-btn">▶ Play</button>
            <button id="stop-audio" class="admin-btn">■ Stop</button>
            <span id="audio-name" style="color:#dde8ff;font-family:Rajdhani,monospace;font-size:13px;"></span>
          </div>
          <p class="admin-empty-msg">Select an audio asset to preview and configure</p>
        </main>
        <aside class="admin-props" id="audio-props">
          <p class="admin-empty-msg">Select an audio asset</p>
        </aside>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.treeEl = this.el.querySelector('#audio-tree')!;
    this.propsEl = this.el.querySelector('#audio-props')!;

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-audio')!.addEventListener('click', () => this.addAudio());
    this.el.querySelector('#play-audio')!.addEventListener('click', () => this.playAudio());
    this.el.querySelector('#stop-audio')!.addEventListener('click', () => this.stopAudio());

    this.refresh();
  }

  private refresh(): void {
    this.treeEl.innerHTML = '';
    const cats: AudioCategory[] = ['bgm', 'sfx', 'ambient', 'ui'];
    cats.forEach(cat => {
      const items = svgAssetStore.getAllAudio().filter(a => a.category === cat);
      if (items.length === 0) return;
      const hdr = document.createElement('div');
      hdr.className = 'admin-tree-header'; hdr.style.cssText = 'font-size:10px;padding:4px 8px;';
      hdr.textContent = cat.toUpperCase();
      this.treeEl.appendChild(hdr);
      items.forEach(a => {
        const item = document.createElement('div');
        item.className = 'admin-tree-item' + (this.selected?.id === a.id ? ' active' : '');
        item.textContent = a.name || a.id;
        item.addEventListener('click', () => { this.selected = a; this.refresh(); this.showProps(a); });
        const del = document.createElement('button');
        del.className = 'admin-tree-del'; del.textContent = '✕';
        del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removeAudio(a.id); saveAllRPGAssets(); this.selected = null; this.refresh(); });
        item.appendChild(del);
        this.treeEl.appendChild(item);
      });
    });
  }

  private showProps(a: AudioAssetData): void {
    this.propsEl.innerHTML = `<div class="admin-section-header">${a.name}</div>`;
    const playerEl = this.el.querySelector('#audio-player') as HTMLElement;
    playerEl.style.display = a.fileBase64 ? 'flex' : 'none';
    (this.el.querySelector('#audio-name') as HTMLElement).textContent = a.name;

    const addRow = (label: string, el: HTMLElement) => {
      const wrap = document.createElement('div'); wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label'); lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };
    const textInp = (val: string, cb: (v: string) => void) => {
      const i = document.createElement('input'); i.type = 'text'; i.className = 'admin-input'; i.value = val;
      i.addEventListener('change', () => cb(i.value)); return i;
    };
    const numInp = (val: number, cb: (v: number) => void, min = 0, max = 1, step = 0.05) => {
      const i = document.createElement('input'); i.type = 'range'; i.className = 'admin-input'; i.value = String(val); i.min = String(min); i.max = String(max); i.step = String(step);
      i.addEventListener('input', () => cb(Number(i.value))); return i;
    };
    const chk = (val: boolean, cb: (v: boolean) => void): HTMLInputElement => {
      const i = document.createElement('input'); i.type = 'checkbox'; i.checked = val;
      i.addEventListener('change', () => cb(i.checked)); return i;
    };
    const sel = (opts: string[], val: string, cb: (v: string) => void): HTMLSelectElement => {
      const s = document.createElement('select'); s.className = 'admin-input';
      opts.forEach(o => { const op = document.createElement('option'); op.value = op.textContent = o; if (o === val) op.selected = true; s.appendChild(op); });
      s.addEventListener('change', () => cb(s.value)); return s;
    };

    addRow('Name',     textInp(a.name, v => { a.name = v; saveAllRPGAssets(); this.refresh(); }));
    addRow('Category', sel(['bgm','sfx','ambient','ui'] as AudioCategory[], a.category, v => { a.category = v as AudioCategory; saveAllRPGAssets(); this.refresh(); }));
    addRow('Volume',   numInp(a.volume, v => { a.volume = v; saveAllRPGAssets(); }));
    addRow('Loop',     chk(a.loop, v => { a.loop = v; saveAllRPGAssets(); }));
    addRow('Spatial',  chk(a.spatial, v => { a.spatial = v; saveAllRPGAssets(); }));
    addRow('Events',   textInp(a.eventBindings.join(','), v => { a.eventBindings = v.split(',').map(s => s.trim()).filter(Boolean); saveAllRPGAssets(); }));

    const upBtn = document.createElement('button'); upBtn.className = 'admin-btn'; upBtn.textContent = '📁 Upload Audio';
    upBtn.addEventListener('click', () => {
      const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'audio/*';
      fi.addEventListener('change', () => {
        const f = fi.files?.[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          a.fileBase64 = dataUrl.split(',')[1] ?? '';
          a.fileMime = f.type || 'audio/mpeg';
          saveAllRPGAssets(); playerEl.style.display = 'flex';
        };
        reader.readAsDataURL(f);
      }); fi.click();
    });
    addRow('File', upBtn);
  }

  private playAudio(): void {
    if (!this.selected?.fileBase64) return;
    this.stopAudio();
    // Detect MIME type from the stored base64 prefix or fall back to generic audio
    const mime = this.selected.fileMime || 'audio/mpeg';
    this.audioEl = new Audio(`data:${mime};base64,${this.selected.fileBase64}`);
    this.audioEl.volume = this.selected.volume;
    this.audioEl.loop   = this.selected.loop;
    void this.audioEl.play().catch(() => {});
  }

  private stopAudio(): void {
    if (this.audioEl) { this.audioEl.pause(); this.audioEl = null; }
  }

  private addAudio(): void {
    const id = `audio_${Date.now()}`;
    svgAssetStore.addAudio({ id, name: 'New Audio', category: 'sfx', fileBase64: '', volume: 0.8, loop: false, spatial: false, eventBindings: [] });
    saveAllRPGAssets();
    this.selected = svgAssetStore.getAudio(id) ?? null;
    this.refresh();
    if (this.selected) this.showProps(this.selected);
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (!v) this.stopAudio();
    else this.refresh();
  }
}
