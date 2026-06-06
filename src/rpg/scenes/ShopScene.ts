import Phaser from 'phaser';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { eventBus } from '../systems/EventBus.ts';
import type { ShopItem } from '../../types/rpgTypes.ts';

interface ShopSceneData { shopId: string }

export class ShopScene extends Phaser.Scene {
  private items: ShopItem[] = [];
  private listContainer!: Phaser.GameObjects.Container;
  private goldText!: Phaser.GameObjects.Text;
  private msgText!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'ShopScene' }); }

  create(data: ShopSceneData): void {
    const { width, height } = this.scale;
    const shop = svgAssetStore.getShop(data.shopId);
    this.items = shop?.items ?? [];

    this.add.rectangle(width / 2, height / 2, width, height, 0x00050d, 0.95);
    this.add.text(width / 2, 28, shop?.name ?? 'SHOP', {
      fontFamily: 'Orbitron, monospace', fontSize: '20px', color: '#ff6b35',
    }).setOrigin(0.5);

    this.goldText = this.add.text(width / 2, 54, `${inventoryStore.getGold()} G`, {
      fontFamily: 'Orbitron, monospace', fontSize: '14px', color: '#ffcc00',
    }).setOrigin(0.5);

    this.msgText = this.add.text(width / 2, height - 30, '', {
      fontFamily: 'Rajdhani, monospace', fontSize: '13px', color: '#ff6b35',
    }).setOrigin(0.5);

    this.listContainer = this.add.container(0, 0);
    this.buildList(width, height);

    this.add.text(width - 20, 20, '✕ [ESC]', {
      fontFamily: 'Rajdhani, monospace', fontSize: '13px', color: '#556677',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.close());

    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on('down', () => this.close());
  }

  private buildList(width: number, height: number): void {
    this.listContainer.removeAll(true);
    const baseY = 90;
    const rowH  = 52;

    this.items.forEach((item, i) => {
      const y = baseY + i * rowH;
      const itemDef = svgAssetStore.getAllSprites().find(s => s.id === item.itemId);
      const name = itemDef?.name ?? item.itemId;
      const canBuy = inventoryStore.getGold() >= item.sellPrice;

      const bg = this.add.rectangle(width / 2, y + rowH / 2, width - 48, rowH - 6,
        0x0a1428).setStrokeStyle(1, 0x1a3a5a);

      const nameTxt = this.add.text(40, y + 10, name, {
        fontFamily: 'Rajdhani, monospace', fontSize: '14px',
        color: canBuy ? '#dde8ff' : '#445566',
      });

      const priceTxt = this.add.text(width - 130, y + 10, `${item.sellPrice} G`, {
        fontFamily: 'Orbitron, monospace', fontSize: '13px',
        color: canBuy ? '#ffcc00' : '#445566',
      });

      const owned = inventoryStore.getCount(item.itemId);
      const ownedTxt = this.add.text(width - 130, y + 28, `owned: ${owned}`, {
        fontFamily: 'Rajdhani, monospace', fontSize: '10px', color: '#556677',
      });

      if (canBuy) {
        const buyBtn = this.add.text(width - 60, y + 16, 'BUY', {
          fontFamily: 'Orbitron, monospace', fontSize: '12px', color: '#00e5ff',
          backgroundColor: 'rgba(0,50,80,0.8)', padding: { x: 8, y: 4 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        buyBtn.on('pointerover', () => buyBtn.setStyle({ color: '#ff6b35' }));
        buyBtn.on('pointerout',  () => buyBtn.setStyle({ color: '#00e5ff' }));
        buyBtn.on('pointerdown', () => this.buyItem(item));
        this.listContainer.add(buyBtn);
      }

      this.listContainer.add([bg, nameTxt, priceTxt, ownedTxt]);
    });
  }

  private buyItem(item: ShopItem): void {
    if (!inventoryStore.spendGold(item.sellPrice)) {
      this.flashMsg('Not enough G!');
      return;
    }
    inventoryStore.add(item.itemId, 1);
    eventBus.emit('inventory:changed');
    eventBus.emit('gold:changed', { amount: -item.sellPrice });
    this.goldText.setText(`${inventoryStore.getGold()} G`);
    this.flashMsg(`Bought ${item.itemId}!`);
    this.buildList(this.scale.width, this.scale.height);
  }

  private flashMsg(msg: string): void {
    this.msgText.setText(msg).setAlpha(1);
    this.tweens.add({
      targets: this.msgText, alpha: 0, delay: 1200, duration: 400,
    });
  }

  private close(): void {
    this.scene.stop();
  }
}
