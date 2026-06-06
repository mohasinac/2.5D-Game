import { svgAssetStore } from '../../rpg/stores/SVGAssetStore.ts';
import { saveAllRPGAssets } from '../../utils/rpgPersistence.ts';
import type { SVGSpriteData, AnimationDef } from '../../types/rpgTypes.ts';

export interface AdminScreenOptions { onBack: () => void; }

export class SpriteAdminScreen {
  private el: HTMLElement;
  private selected: SVGSpriteData | null = null;
  private listEl!: HTMLElement;
  private previewImg!: HTMLImageElement;
  private propsEl!: HTMLElement;
  private animListEl!: HTMLElement;
  private playTimer: ReturnType<typeof setInterval> | null = null;
  private currentFrame = 0;

  constructor(container: HTMLElement, private opts: AdminScreenOptions) {
    this.el = document.createElement('div');
    this.el.className = 'screen admin-screen hidden';
    this.el.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-tree">
          <div class="admin-tree-header">
            <span>SPRITES</span>
            <button class="admin-add-btn" id="add-sprite">+ Add</button>
          </div>
          <div class="admin-tree-list" id="sprite-list"></div>
        </aside>
        <main class="admin-center">
          <div class="admin-preview">
            <img id="sprite-preview" alt="sprite preview" style="max-width:100%;max-height:240px;image-rendering:pixelated;" />
          </div>
          <div class="admin-anim-controls">
            <button id="anim-play">▶ Play</button>
            <button id="anim-stop">■ Stop</button>
            <span id="anim-frame-info" class="admin-label"></span>
          </div>
        </main>
        <aside class="admin-props" id="sprite-props">
          <p class="admin-empty-msg">Select a sprite to edit</p>
        </aside>
      </div>
      <button class="admin-back-btn" id="back-btn">← Hub</button>
    `;
    container.appendChild(this.el);

    this.listEl    = this.el.querySelector('#sprite-list')!;
    this.previewImg = this.el.querySelector('#sprite-preview')!;
    this.propsEl   = this.el.querySelector('#sprite-props')!;
    this.animListEl = document.createElement('div');

    this.el.querySelector('#back-btn')!.addEventListener('click', opts.onBack);
    this.el.querySelector('#add-sprite')!.addEventListener('click', () => this.addSprite());
    this.el.querySelector('#anim-play')!.addEventListener('click', () => this.playAnim());
    this.el.querySelector('#anim-stop')!.addEventListener('click', () => this.stopAnim());

    this.refresh();
  }

  private refresh(): void {
    this.listEl.innerHTML = '';
    svgAssetStore.getAllSprites().forEach(s => {
      const item = document.createElement('div');
      item.className = 'admin-tree-item' + (this.selected?.id === s.id ? ' active' : '');
      item.textContent = s.name || s.id;
      item.addEventListener('click', () => { this.selected = s; this.refresh(); this.showProps(); });
      const del = document.createElement('button');
      del.className = 'admin-tree-del'; del.textContent = '✕';
      del.addEventListener('click', (e) => { e.stopPropagation(); svgAssetStore.removeSprite(s.id); saveAllRPGAssets(); this.selected = null; this.refresh(); });
      item.appendChild(del);
      this.listEl.appendChild(item);
    });
    if (this.selected) this.showPreview(this.selected);
  }

  private showPreview(s: SVGSpriteData): void {
    if (s.svgBase64) {
      this.previewImg.src = `data:image/svg+xml;base64,${s.svgBase64}`;
    } else {
      this.previewImg.src = '';
    }
    this.el.querySelector('#anim-frame-info')!.textContent = `${s.frameWidth}×${s.frameHeight} | ${s.cols}×${s.rows} cols/rows`;
  }

  private showProps(): void {
    const s = this.selected;
    if (!s) return;
    this.propsEl.innerHTML = '';

    const row = (label: string, el: HTMLElement): void => {
      const wrap = document.createElement('div');
      wrap.className = 'admin-prop-row';
      const lbl = document.createElement('label');
      lbl.className = 'admin-label'; lbl.textContent = label;
      wrap.append(lbl, el); this.propsEl.appendChild(wrap);
    };

    const numInput = (val: number, cb: (v: number) => void): HTMLInputElement => {
      const inp = document.createElement('input');
      inp.type = 'number'; inp.value = String(val); inp.className = 'admin-input';
      inp.addEventListener('change', () => cb(Number(inp.value)));
      return inp;
    };

    const txtInput = (val: string, cb: (v: string) => void): HTMLInputElement => {
      const inp = document.createElement('input');
      inp.type = 'text'; inp.value = val; inp.className = 'admin-input';
      inp.addEventListener('change', () => cb(inp.value));
      return inp;
    };

    row('Name', txtInput(s.name, v => { s.name = v; saveAllRPGAssets(); this.refresh(); }));
    row('Frame W', numInput(s.frameWidth, v => { s.frameWidth = v; saveAllRPGAssets(); }));
    row('Frame H', numInput(s.frameHeight, v => { s.frameHeight = v; saveAllRPGAssets(); }));
    row('Cols', numInput(s.cols, v => { s.cols = v; saveAllRPGAssets(); }));
    row('Rows', numInput(s.rows, v => { s.rows = v; saveAllRPGAssets(); }));

    // SVG upload
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'admin-btn'; uploadBtn.textContent = '📁 Upload SVG';
    uploadBtn.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.svg';
      inp.addEventListener('change', () => {
        const file = inp.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          s.svgBase64 = btoa(reader.result as string);
          saveAllRPGAssets(); this.showPreview(s);
        };
        reader.readAsBinaryString(file);
      });
      inp.click();
    });
    row('SVG', uploadBtn);

    // Hitbox
    const hdr = document.createElement('div');
    hdr.className = 'admin-section-header'; hdr.textContent = 'HITBOX';
    this.propsEl.appendChild(hdr);
    row('Offset X', numInput(s.hitbox.offsetX, v => { s.hitbox.offsetX = v; saveAllRPGAssets(); }));
    row('Offset Y', numInput(s.hitbox.offsetY, v => { s.hitbox.offsetY = v; saveAllRPGAssets(); }));
    row('Width',    numInput(s.hitbox.width,   v => { s.hitbox.width   = v; saveAllRPGAssets(); }));
    row('Height',   numInput(s.hitbox.height,  v => { s.hitbox.height  = v; saveAllRPGAssets(); }));

    // Animations
    const ahdr = document.createElement('div');
    ahdr.className = 'admin-section-header';
    ahdr.innerHTML = 'ANIMATIONS <button class="admin-add-btn" id="add-anim">+ Add</button>';
    this.propsEl.appendChild(ahdr);
    ahdr.querySelector('#add-anim')!.addEventListener('click', () => {
      s.animations.push({ name: 'new_anim', fps: 8, loop: true, frames: [0] });
      saveAllRPGAssets(); this.showProps();
    });

    s.animations.forEach((anim, ai) => this.buildAnimRow(anim, ai, s));
  }

  private buildAnimRow(anim: AnimationDef, ai: number, s: SVGSpriteData): void {
    const wrap = document.createElement('div');
    wrap.className = 'admin-anim-row';
    wrap.innerHTML = `
      <input class="admin-input" style="width:100px" value="${anim.name}" placeholder="name" />
      <input class="admin-input" type="number" style="width:50px" value="${anim.fps}" placeholder="fps" />
      <label><input type="checkbox" ${anim.loop ? 'checked' : ''}> Loop</label>
      <input class="admin-input" style="width:130px" value="${anim.frames.join(',')}" placeholder="0,1,2..." />
      <button class="admin-tree-del">✕</button>
    `;
    const [nameInp, fpsInp, , framesInp] = wrap.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    const loopChk = wrap.querySelector('input[type=checkbox]') as HTMLInputElement;
    nameInp.addEventListener('change',   () => { anim.name   = nameInp.value; saveAllRPGAssets(); });
    fpsInp.addEventListener('change',    () => { anim.fps    = Number(fpsInp.value); saveAllRPGAssets(); });
    loopChk.addEventListener('change',   () => { anim.loop   = loopChk.checked; saveAllRPGAssets(); });
    framesInp.addEventListener('change', () => { anim.frames = framesInp.value.split(',').map(Number); saveAllRPGAssets(); });
    wrap.querySelector('button')!.addEventListener('click', () => {
      s.animations.splice(ai, 1); saveAllRPGAssets(); this.showProps();
    });
    this.propsEl.appendChild(wrap);
  }

  private addSprite(): void {
    const id = `sprite_${Date.now()}`;
    svgAssetStore.addSprite({
      id, name: 'New Sprite', svgBase64: '',
      frameWidth: 32, frameHeight: 32, cols: 4, rows: 4, padding: 0,
      animations: [], hitbox: { offsetX: 0, offsetY: 0, width: 32, height: 32 }, portraits: {},
    });
    saveAllRPGAssets();
    this.selected = svgAssetStore.getSprite(id) ?? null;
    this.refresh();
    this.showProps();
  }

  private playAnim(): void {
    if (!this.selected || !this.previewImg.src) return;
    this.stopAnim();
    const s = this.selected;
    const firstAnim = s.animations[0];
    if (!firstAnim) return;
    this.currentFrame = 0;
    this.playTimer = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % firstAnim.frames.length;
      const fi = firstAnim.frames[this.currentFrame];
      const fw = s.frameWidth; const fh = s.frameHeight;
      const col = fi % s.cols; const row = Math.floor(fi / s.cols);
      this.previewImg.style.objectFit = 'none';
      this.previewImg.style.objectPosition = `-${col * fw}px -${row * fh}px`;
    }, 1000 / firstAnim.fps);
  }

  private stopAnim(): void {
    if (this.playTimer) { clearInterval(this.playTimer); this.playTimer = null; }
    this.previewImg.style.objectFit = '';
    this.previewImg.style.objectPosition = '';
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (!v) this.stopAnim();
    else this.refresh();
  }
}
