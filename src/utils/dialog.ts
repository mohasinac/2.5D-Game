export function gameConfirm(
  message:      string,
  confirmLabel  = 'Leave',
  cancelLabel   = 'Stay',
): Promise<boolean> {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'confirm-overlay';
    el.innerHTML = `
      <div class="confirm-dialog" role="dialog" aria-modal="true">
        <p class="confirm-msg">${message}</p>
        <div class="confirm-actions">
          <button class="game-btn btn-danger" id="c-ok">${confirmLabel}</button>
          <button class="game-btn" id="c-cancel">${cancelLabel}</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    const done = (v: boolean) => {
      el.remove();
      window.removeEventListener('keydown', onKey);
      resolve(v);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter')  done(true);
      if (e.key === 'Escape') done(false);
    };

    el.querySelector('#c-ok')!.addEventListener('click',     () => done(true));
    el.querySelector('#c-cancel')!.addEventListener('click', () => done(false));
    el.addEventListener('click', (e) => { if (e.target === el) done(false); });
    window.addEventListener('keydown', onKey);
  });
}
