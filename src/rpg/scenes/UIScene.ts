import Phaser from 'phaser';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { eventBus } from '../systems/EventBus.ts';

export class UIScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private questText!: Phaser.GameObjects.Text;
  private minimapBg!: Phaser.GameObjects.Rectangle;

  constructor() { super({ key: 'UIScene' }); }

  create(): void {
    this.cameras.main.setScroll(0, 0);

    // Gold counter
    const { width } = this.scale;
    this.minimapBg = this.add.rectangle(width - 70, 70, 120, 120, 0x000011, 0.7)
      .setScrollFactor(0)
      .setStrokeStyle(1, 0x00e5ff, 0.6);

    this.add.text(width - 130, 12, '💰', { fontSize: '14px' }).setScrollFactor(0);
    this.goldText = this.add.text(width - 110, 12, `${inventoryStore.getGold()} G`, {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '13px',
      color:      '#00e5ff',
    }).setScrollFactor(0);

    // Quest ticker
    this.questText = this.add.text(12, 12, '', {
      fontFamily: 'Rajdhani, monospace',
      fontSize:   '12px',
      color:      '#dde8ff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding:    { x: 6, y: 3 },
    }).setScrollFactor(0).setAlpha(0.85);

    this.updateQuestTicker();
    this.updateGold();

    eventBus.on('gold:changed',    () => this.updateGold());
    eventBus.on('inventory:changed', () => this.updateGold());
    eventBus.on('quest:updated',   () => this.updateQuestTicker());

    // Minimap label
    this.add.text(width - 130, 18, 'MAP', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '9px',
      color:      '#00e5ff',
    }).setAlpha(0.4).setScrollFactor(0);
  }

  private updateGold(): void {
    this.goldText?.setText(`${inventoryStore.getGold()} G`);
  }

  private updateQuestTicker(): void {
    const quests = gameStateStore.getAllQuests();
    const active = [...quests.entries()]
      .filter(([, s]) => s === 'active')
      .map(([id]) => id);
    this.questText?.setText(active.length ? `▸ ${active[0]}` : '');
  }
}
