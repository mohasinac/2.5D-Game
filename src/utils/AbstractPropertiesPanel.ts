import { VISUAL_THEME_PRESETS, VisualTheme } from '../config/arenaConstants';

/** Shared base for all properties panels. Provides the chrome (header + close) and DOM-builder helpers. */
export abstract class AbstractPropertiesPanel {
  protected content: HTMLElement;
  onClose: () => void = () => {};

  constructor(container: HTMLElement) {
    container.innerHTML = `
      <div class="prop-header">PROPERTIES<button class="prop-close-btn" title="Close panel">×</button></div>
      <div class="prop-content"></div>
    `;
    this.content = container.querySelector<HTMLElement>('.prop-content')!;
    container.querySelector<HTMLButtonElement>('.prop-close-btn')!
      .addEventListener('click', () => this.onClose());
    this.showEmpty();
  }

  showEmpty(): void {
    this.content.innerHTML = `<div class="prop-empty">Select an item<br>to inspect</div>`;
  }

  // ── DOM helpers (used by every concrete panel) ─────────────────────────────

  protected section(title: string): void {
    const el = document.createElement('div');
    el.className = 'prop-section-title';
    el.textContent = title;
    this.content.appendChild(el);
  }

  protected readRow(label: string, value: string): void {
    const row = document.createElement('div');
    row.className = 'prop-row';
    row.innerHTML = `<span class="prop-label">${label}</span><span class="prop-value-read">${value}</span>`;
    this.content.appendChild(row);
  }

  numRow(
    label: string, value: number,
    min: number, max: number, step: number,
    onChange: (v: number) => void,
  ): HTMLInputElement {
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = label;
    const inp = document.createElement('input');
    inp.className = 'prop-input';
    inp.type = 'number';
    inp.value = String(parseFloat(value.toFixed(3)));
    inp.min = String(min);
    inp.max = String(max);
    inp.step = String(step);
    inp.addEventListener('input', () => onChange(parseFloat(inp.value) || 0));
    row.appendChild(lbl);
    row.appendChild(inp);
    this.content.appendChild(row);
    return inp;
  }

  colorRow(label: string, value: number, onChange: (v: number) => void): HTMLInputElement {
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = label;
    const inp = document.createElement('input');
    inp.type = 'color';
    inp.className = 'prop-color-input';
    inp.value = '#' + value.toString(16).padStart(6, '0');
    inp.addEventListener('input', () => onChange(parseInt(inp.value.slice(1), 16)));
    row.appendChild(lbl);
    row.appendChild(inp);
    this.content.appendChild(row);
    return inp;
  }

  protected toggleRow(
    label: string, value: boolean,
    onChange: (v: boolean) => void,
  ): HTMLButtonElement {
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = label;
    const btn = document.createElement('button');
    btn.className = 'prop-profile-btn' + (value ? ' active' : '');
    btn.textContent = value ? '✦ On' : '◌ Off';
    btn.addEventListener('click', () => {
      const next = !btn.classList.contains('active');
      btn.classList.toggle('active', next);
      btn.textContent = next ? '✦ On' : '◌ Off';
      onChange(next);
    });
    row.appendChild(lbl);
    row.appendChild(btn);
    this.content.appendChild(row);
    return btn;
  }

  protected textRow(label: string, value: string, onChange: (v: string) => void): HTMLInputElement {
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = label;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'prop-text-input';
    inp.value = value;
    inp.addEventListener('input', () => onChange(inp.value));
    row.appendChild(lbl);
    row.appendChild(inp);
    this.content.appendChild(row);
    return inp;
  }

  protected selectRow(
    label: string,
    options: { value: string; label: string }[],
    current: string,
    onChange: (v: string) => void,
  ): HTMLSelectElement {
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = label;
    const sel = document.createElement('select');
    sel.className = 'prop-select';
    for (const opt of options) {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.label;
      el.selected = opt.value === current;
      sel.appendChild(el);
    }
    sel.addEventListener('change', () => onChange(sel.value));
    row.appendChild(lbl);
    row.appendChild(sel);
    this.content.appendChild(row);
    return sel;
  }

  protected buttonRow(label: string, btnLabel: string, onClick: () => void): HTMLButtonElement {
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = label;
    const btn = document.createElement('button');
    btn.className = 'game-btn prop-action-btn';
    btn.textContent = btnLabel;
    btn.addEventListener('click', onClick);
    row.appendChild(lbl);
    row.appendChild(btn);
    this.content.appendChild(row);
    return btn;
  }

  protected themeRow(onApply: (theme: VisualTheme) => void): void {
    const row = document.createElement('div');
    row.className = 'prop-row prop-theme-row';
    const lbl = document.createElement('span');
    lbl.className = 'prop-label';
    lbl.textContent = 'Theme';
    const grid = document.createElement('div');
    grid.className = 'prop-theme-grid';
    for (const [key, theme] of Object.entries(VISUAL_THEME_PRESETS)) {
      const btn = document.createElement('button');
      btn.className = 'game-btn prop-theme-btn';
      btn.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      btn.title = `Apply ${key} theme`;
      btn.style.borderColor = '#' + theme.color.toString(16).padStart(6, '0');
      btn.addEventListener('click', () => onApply(theme));
      grid.appendChild(btn);
    }
    row.appendChild(lbl);
    row.appendChild(grid);
    this.content.appendChild(row);
  }
}
