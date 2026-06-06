import Phaser from 'phaser';
import { eventBus } from '../systems/EventBus.ts';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import type { PipePuzzleLevel, PipeTile } from '../../types/rpgTypes.ts';

// Pipe connection map: rotation-relative open ends
// A pipe tile has 4 possible connection directions: N=0, E=1, S=2, W=3
const PIPE_CONNECTIONS: Record<string, number[]> = {
  empty:    [],
  straight: [0, 2],   // N-S
  elbow:    [0, 1],   // N-E
  tee:      [0, 1, 2],
  cross:    [0, 1, 2, 3],
  source:   [0, 1, 2, 3],
  sink:     [0, 1, 2, 3],
};

function rotateConnections(conns: number[], rotDeg: number): Set<number> {
  const steps = (rotDeg / 90) % 4;
  return new Set(conns.map(c => (c + steps) % 4));
}

function solveFlow(grid: PipeTile[][], rows: number, cols: number): boolean {
  let srcRow = -1, srcCol = -1;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c].type === 'source') { srcRow = r; srcCol = c; }

  if (srcRow < 0) return false;

  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const queue: [number, number, number][] = [[srcRow, srcCol, -1]]; // row, col, from-direction
  const DR = [-1, 0, 1, 0];
  const DC = [0, 1, 0, -1];
  const OPPOSITE = [2, 3, 0, 1];

  while (queue.length) {
    const [r, c, from] = queue.shift()!;
    if (visited[r][c]) continue;
    visited[r][c] = true;
    const tile = grid[r][c];
    if (tile.type === 'empty') continue;
    const conns = rotateConnections(PIPE_CONNECTIONS[tile.type] ?? [], tile.rotation);
    if (from >= 0 && !conns.has(OPPOSITE[from])) continue;

    if (tile.type === 'sink') return true;

    for (let dir = 0; dir < 4; dir++) {
      if (!conns.has(dir)) continue;
      const nr = r + DR[dir]; const nc = c + DC[dir];
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (!visited[nr][nc]) queue.push([nr, nc, dir]);
    }
  }
  return false;
}

const PIPE_COLORS: Record<string, number> = {
  empty: 0x222233, straight: 0x1a6aaa, elbow: 0x1a8aaa,
  tee: 0x2288cc, cross: 0x22aacc, source: 0x00e5ff, sink: 0xff6b35,
};

const PIPE_SYMBOLS: Record<string, string> = {
  empty: '', straight: '━', elbow: '┗', tee: '┣', cross: '╋', source: '●', sink: '◎',
};

interface PipeSceneData {
  level: PipePuzzleLevel;
  triggerId: string;
}

export class PipePuzzleScene extends Phaser.Scene {
  private level!: PipePuzzleLevel;
  private triggerId!: string;
  private grid: PipeTile[][] = [];
  private cellSize = 64;
  private cells: Phaser.GameObjects.Container[][] = [];
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft = 0;
  private solved = false;
  private timerEvent!: Phaser.Time.TimerEvent;
  private flowOverlay: Phaser.GameObjects.Graphics[] = [];

  constructor() { super({ key: 'PipePuzzleScene' }); }

  create(data: PipeSceneData): void {
    this.level    = data.level;
    this.triggerId = data.triggerId;
    this.timeLeft  = data.level.timeLimitSec;
    this.solved    = false;
    this.grid      = data.level.grid.map(row => row.map(cell => ({ ...cell })));

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x080810);

    // Title
    this.add.text(width / 2, 20, 'PIPE PUZZLE', {
      fontFamily: 'Orbitron, monospace', fontSize: '20px', color: '#00e5ff',
    }).setOrigin(0.5);

    // Timer
    this.timerText = this.add.text(width - 20, 20, `${this.timeLeft}s`, {
      fontFamily: 'Orbitron, monospace', fontSize: '16px', color: '#ff6b35',
    }).setOrigin(1, 0);

    this.buildGrid();

    this.timerEvent = this.time.addEvent({
      delay: 1000, repeat: this.timeLeft - 1,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`${this.timeLeft}s`);
        if (this.timeLeft <= 0) this.endGame(false);
      },
    });

    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => this.endGame(false));
  }

  private buildGrid(): void {
    const { width, height } = this.scale;
    const { rows, cols } = this.level;
    const gridW = cols * this.cellSize;
    const gridH = rows * this.cellSize;
    const offX = (width - gridW) / 2;
    const offY = (height - gridH) / 2;

    this.cells = [];
    for (let r = 0; r < rows; r++) {
      this.cells[r] = [];
      for (let c = 0; c < cols; c++) {
        const tile = this.grid[r][c];
        const cx = offX + c * this.cellSize + this.cellSize / 2;
        const cy = offY + r * this.cellSize + this.cellSize / 2;

        const bg = this.add.rectangle(0, 0, this.cellSize - 2, this.cellSize - 2,
          PIPE_COLORS[tile.type] ?? 0x222233).setStrokeStyle(1, 0x334455);

        const lbl = this.add.text(0, 0, PIPE_SYMBOLS[tile.type] ?? '', {
          fontFamily: 'monospace', fontSize: '28px', color: '#dde8ff',
        }).setOrigin(0.5);

        const rotLbl = this.add.text(this.cellSize / 2 - 10, -this.cellSize / 2 + 10,
          tile.rotation ? `${tile.rotation}°` : '', {
          fontFamily: 'monospace', fontSize: '8px', color: '#778899',
        }).setOrigin(1, 0);

        const container = this.add.container(cx, cy, [bg, lbl, rotLbl]);
        this.cells[r][c] = container;

        if (!tile.locked && tile.type !== 'empty') {
          bg.setInteractive({ useHandCursor: true });
          bg.on('pointerdown', () => this.rotateCell(r, c));
          bg.on('pointerover', () => bg.setFillStyle(0x2a2a5a));
          bg.on('pointerout', () => bg.setFillStyle(PIPE_COLORS[tile.type] ?? 0x222233));
        }
      }
    }
  }

  private rotateCell(row: number, col: number): void {
    if (this.solved) return;
    const tile = this.grid[row][col];
    tile.rotation = ((tile.rotation + 90) % 360) as 0 | 90 | 180 | 270;

    const container = this.cells[row][col];
    const lbl = container.getAt(1) as Phaser.GameObjects.Text;
    const rotLbl = container.getAt(2) as Phaser.GameObjects.Text;

    this.tweens.add({
      targets: container,
      angle: container.angle + 90,
      duration: 150,
      ease: 'Sine.easeOut',
      onComplete: () => { container.angle = 0; lbl.setAngle(0); rotLbl.setAngle(0); },
    });

    rotLbl.setText(tile.rotation ? `${tile.rotation}°` : '');

    if (solveFlow(this.grid, this.level.rows, this.level.cols)) {
      this.endGame(true);
    }
  }

  private endGame(win: boolean): void {
    if (this.solved) return;
    this.solved = true;
    this.timerEvent.remove();

    const { width, height } = this.scale;
    const msg = win ? 'SOLVED!' : 'TIME UP!';
    const col = win ? '#00e5ff' : '#ff6b35';

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    this.add.text(width / 2, height / 2 - 20, msg, {
      fontFamily: 'Orbitron, monospace', fontSize: '36px', color: col,
    }).setOrigin(0.5);

    if (win) {
      if (this.level.rewardItemId) {
        inventoryStore.add(this.level.rewardItemId, 1);
        eventBus.emit('inventory:changed');
        this.add.text(width / 2, height / 2 + 30, `+ ${this.level.rewardItemId}`, {
          fontFamily: 'Rajdhani, monospace', fontSize: '18px', color: '#dde8ff',
        }).setOrigin(0.5);
      }
      if (this.level.rewardGold > 0) {
        inventoryStore.addGold(this.level.rewardGold);
        eventBus.emit('gold:changed', { amount: this.level.rewardGold });
      }
      if (this.level.winFlagKey) {
        gameStateStore.setFlag(this.level.winFlagKey, true);
      }
    }

    eventBus.emit('minigame:result', {
      levelId: this.triggerId, win,
      rewardItemId: win ? (this.level.rewardItemId ?? null) : null,
      rewardGold:   win ? this.level.rewardGold : 0,
      winFlagKey:   win ? (this.level.winFlagKey ?? null) : null,
    });

    this.time.delayedCall(2000, () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
    });
  }
}
