import Phaser from 'phaser';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { SaveSystem } from '../stores/SaveSystem.ts';
import { eventBus } from '../systems/EventBus.ts';
import { MAX_INVENTORY_SLOTS } from '../config/rpgConstants.ts';

export class InventoryScene extends Phaser.Scene {
  private slotRects: Phaser.GameObjects.Rectangle[] = [];
  private slotTexts: Phaser.GameObjects.Text[]      = [];
  private equipTexts: Phaser.GameObjects.Text[]     = [];
  private saveButtons: Phaser.GameObjects.Text[]    = [];
  private closeKey!: Phaser.Input.Keyboard.Key;
  private overlay!: Phaser.GameObjects.Rectangle;

  constructor() { super({ key: 'InventoryScene' }); }

  create(): void {
    const { width, height } = this.scale;

    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000a14, 0.95);

    this.add.text(width / 2, 30, 'INVENTORY', {
      fontFamily: 'Orbitron, monospace', fontSize: '20px', color: '#00e5ff',
    }).setOrigin(0.5);

    const gold = inventoryStore.getGold();
    this.add.text(width / 2, 56, `${gold} G`, {
      fontFamily: 'Orbitron, monospace', fontSize: '14px', color: '#ffcc00',
    }).setOrigin(0.5);

    this.buildGrid(width, height);
    this.buildEquipSlots(width, height);
    this.buildSaveSlots(width, height);

    this.closeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.add.text(width - 20, 20, '✕ [I]', {
      fontFamily: 'Rajdhani, monospace', fontSize: '13px', color: '#556677',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.close());

    eventBus.on('inventory:changed', () => this.refresh());
  }

  private buildGrid(width: number, height: number): void {
    const COLS = 6;
    const cellSize = 52;
    const startX = (width - COLS * cellSize) / 2;
    const startY = 90;
    const items = inventoryStore.getAll();

    for (let i = 0; i < MAX_INVENTORY_SLOTS; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = startX + col * cellSize + cellSize / 2;
      const y = startY + row * cellSize + cellSize / 2;

      const rect = this.add.rectangle(x, y, cellSize - 4, cellSize - 4, 0x0a1428)
        .setStrokeStyle(1, 0x1a3a5a);
      this.slotRects.push(rect);

      const item = items[i];
      const itemDef = item ? svgAssetStore.getAllSprites().find(s => s.id === item.itemId) : null;
      const label = item ? (itemDef?.name ?? item.itemId).substring(0, 6) : '';
      const qty   = item && item.qty > 1 ? `x${item.qty}` : '';

      const txt = this.add.text(x, y, `${label}\n${qty}`, {
        fontFamily: 'Rajdhani, monospace',
        fontSize:   '9px',
        color:      '#aabbcc',
        align:      'center',
      }).setOrigin(0.5);
      this.slotTexts.push(txt);

      if (item) {
        rect.setInteractive({ useHandCursor: true });
        rect.on('pointerover', () => rect.setFillStyle(0x1a2a48));
        rect.on('pointerout',  () => rect.setFillStyle(0x0a1428));
      }
    }
  }

  private buildEquipSlots(width: number, height: number): void {
    const slots: Array<{ key: string; label: string }> = [
      { key: 'bey',    label: 'BEY'    },
      { key: 'ring',   label: 'RING'   },
      { key: 'disk',   label: 'DISK'   },
      { key: 'driver', label: 'DRIVER' },
    ];
    const equip = inventoryStore.getAllEquipment();
    const baseY = height - 130;

    this.add.text(20, baseY - 20, 'EQUIPPED', {
      fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#00e5ff',
    }).setAlpha(0.6);

    slots.forEach((s, i) => {
      const x = 20 + i * 120;
      this.add.rectangle(x + 45, baseY + 30, 90, 50, 0x0a1428)
        .setStrokeStyle(1, 0x00e5ff, 0.4);
      this.add.text(x + 45, baseY + 10, s.label, {
        fontFamily: 'Orbitron, monospace', fontSize: '9px', color: '#00e5ff',
      }).setAlpha(0.5).setOrigin(0.5);
      const val = equip[s.key as keyof typeof equip] ?? '—';
      const txt = this.add.text(x + 45, baseY + 34, val, {
        fontFamily: 'Rajdhani, monospace', fontSize: '11px', color: '#dde8ff',
      }).setOrigin(0.5);
      this.equipTexts.push(txt);
    });
  }

  private buildSaveSlots(width: number, height: number): void {
    const meta = SaveSystem.getSlotsMetadata();
    const baseY = height - 60;

    this.add.text(width - 20, baseY - 20, 'SAVE', {
      fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#ff6b35',
    }).setAlpha(0.7).setOrigin(1, 0);

    for (let i = 0; i < 3; i++) {
      const slot = meta[i];
      const label = slot ? `SLOT ${i + 1}\n${new Date(slot.timestamp).toLocaleDateString()}` : `SLOT ${i + 1}\n—`;
      const x = width - 20 - (2 - i) * 90;
      const btn = this.add.text(x, baseY, label, {
        fontFamily: 'Rajdhani, monospace',
        fontSize:   '10px',
        color:      '#dde8ff',
        align:      'center',
        backgroundColor: 'rgba(10,20,40,0.9)',
        padding:    { x: 8, y: 4 },
      }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setStyle({ color: '#ff6b35' }));
      btn.on('pointerout',  () => btn.setStyle({ color: '#dde8ff' }));
      btn.on('pointerdown', () => {
        SaveSystem.save(i as 0 | 1 | 2, 'Tyson');
        this.refreshSaveSlots();
      });
      this.saveButtons.push(btn);
    }
  }

  private refresh(): void {
    const items = inventoryStore.getAll();
    this.slotTexts.forEach((txt, i) => {
      const item = items[i];
      const label = item ? item.itemId.substring(0, 6) : '';
      const qty   = item && item.qty > 1 ? `x${item.qty}` : '';
      txt.setText(`${label}\n${qty}`);
    });
  }

  private refreshSaveSlots(): void {
    const meta = SaveSystem.getSlotsMetadata();
    this.saveButtons.forEach((btn, i) => {
      const slot = meta[i];
      const label = slot ? `SLOT ${i + 1}\n${new Date(slot.timestamp).toLocaleDateString()}` : `SLOT ${i + 1}\n—`;
      btn.setText(label);
    });
  }

  private close(): void {
    this.scene.stop();
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.closeKey)) {
      this.close();
    }
  }
}
