import Phaser from 'phaser';
import { loadAllRPGAssets } from '../utils/rpgPersistence.ts';
import { SaveSystem } from '../rpg/stores/SaveSystem.ts';
import { applySeasonOneDefaults } from '../rpg/config/season1Data.ts';
import { eventBus } from '../rpg/systems/EventBus.ts';

// Lazy-imported scenes to keep Phaser out of admin code paths
import { BootScene }               from '../rpg/scenes/BootScene.ts';
import { PreloadScene }            from '../rpg/scenes/PreloadScene.ts';
import { WorldScene }              from '../rpg/scenes/WorldScene.ts';
import { DialogueScene }           from '../rpg/scenes/DialogueScene.ts';
import { UIScene }                 from '../rpg/scenes/UIScene.ts';
import { InventoryScene }          from '../rpg/scenes/InventoryScene.ts';
import { ShopScene }               from '../rpg/scenes/ShopScene.ts';
import { BattleTransitionScene }   from '../rpg/scenes/BattleTransitionScene.ts';
import { PipePuzzleScene }         from '../rpg/scenes/PipePuzzleScene.ts';
import { PlatformScene }           from '../rpg/scenes/PlatformScene.ts';

export interface RPGScreenOptions {
  onBack:   () => void;
  onBattle: (npcId: string) => void;
}

export class RPGScreen {
  private el: HTMLElement;
  private gameContainer: HTMLElement;
  private game: Phaser.Game | null = null;
  private opts: RPGScreenOptions;

  constructor(container: HTMLElement, opts: RPGScreenOptions) {
    this.opts = opts;

    this.el = document.createElement('div');
    this.el.className = 'screen rpg-screen hidden';
    this.el.style.cssText = 'position:absolute;inset:0;overflow:hidden;background:#080810;';

    this.gameContainer = document.createElement('div');
    this.gameContainer.style.cssText = 'position:absolute;inset:0;';
    this.el.appendChild(this.gameContainer);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'rpg-back-btn';
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', () => opts.onBack());
    this.el.appendChild(backBtn);

    container.appendChild(this.el);

    eventBus.on('battle:start', (data) => opts.onBattle(data.npcId));
  }

  setVisible(v: boolean): void {
    this.el.classList.toggle('hidden', !v);
    if (v) {
      if (!this.game) this.mountGame();
    } else {
      this.unmountGame();
    }
  }

  private mountGame(): void {
    // Hydrate season 1 defaults on first boot before Phaser loads assets
    loadAllRPGAssets();
    if (!SaveSystem.hasAnySlot()) {
      applySeasonOneDefaults();
    }

    const config: Phaser.Types.Core.GameConfig = {
      type:   Phaser.AUTO,
      parent: this.gameContainer,
      backgroundColor: '#080810',
      scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:      960,
        height:     640,
      },
      physics: {
        default: 'arcade',
        arcade:  { gravity: { y: 0, x: 0 }, debug: false },
      },
      scene: [
        BootScene,
        PreloadScene,
        WorldScene,
        DialogueScene,
        UIScene,
        InventoryScene,
        ShopScene,
        BattleTransitionScene,
        PipePuzzleScene,
        PlatformScene,
      ],
    };

    this.game = new Phaser.Game(config);
    (this.gameContainer.querySelector('canvas') as HTMLCanvasElement | null)
      ?.setAttribute('style', 'touch-action: none');
  }

  private unmountGame(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
