import Phaser from 'phaser';
import { DialoguePlayer } from '../systems/DialoguePlayer.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { DIALOGUE_TYPEWRITER_SPEED } from '../config/rpgConstants.ts';
import type { DialogueLine } from '../systems/DialoguePlayer.ts';

interface DialogueSceneData {
  treeId: string;
  npcId?: string;
}

export class DialogueScene extends Phaser.Scene {
  private player!: DialoguePlayer;
  private box!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private portrait: Phaser.GameObjects.Image | null = null;
  private choiceBtns: Phaser.GameObjects.Text[] = [];
  private advanceKey!: Phaser.Input.Keyboard.Key;
  private currentLine: DialogueLine | null = null;
  private typewriterTimer: Phaser.Time.TimerEvent | null = null;
  private fullText = '';
  private displayedLen = 0;
  private waitingForInput = false;

  constructor() { super({ key: 'DialogueScene' }); }

  create(data?: DialogueSceneData): void {
    if (!data?.treeId) { this.scene.stop(); return; }
    const { width, height } = this.scale;
    const boxH = 140;
    const boxY = height - boxH - 12;

    // Box background
    this.box = this.add.rectangle(width / 2, boxY + boxH / 2, width - 24, boxH, 0x000c1a, 0.92)
      .setStrokeStyle(1.5, 0x00e5ff, 0.8);

    // Portrait slot
    this.portrait = null;

    // Speaker name
    this.nameText = this.add.text(24, boxY + 10, '', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '12px',
      color:      '#00e5ff',
    });

    // Body text
    this.bodyText = this.add.text(24, boxY + 30, '', {
      fontFamily: 'Rajdhani, monospace',
      fontSize:   '14px',
      color:      '#dde8ff',
      wordWrap:   { width: width - 80 },
      lineSpacing: 4,
    });

    this.advanceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.input.on('pointerdown', () => this.advance());

    this.player = new DialoguePlayer();
    this.player.start(data.treeId, (line) => this.onLine(line));
  }

  private onLine(line: DialogueLine | null): void {
    if (!line) {
      this.scene.stop();
      return;
    }
    this.currentLine = line;
    this.clearChoices();

    this.nameText.setText(line.speaker.toUpperCase());
    this.updatePortrait(line.speaker, line.emotion);

    this.startTypewriter(line.text, () => {
      this.waitingForInput = true;
      if (line.choices.length > 0) this.showChoices(line.choices);
      else this.showContinueHint();
    });
  }

  private startTypewriter(text: string, onDone: () => void): void {
    this.fullText = text;
    this.displayedLen = 0;
    this.waitingForInput = false;
    this.bodyText.setText('');

    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
      this.typewriterTimer = null;
    }

    this.typewriterTimer = this.time.addEvent({
      delay: DIALOGUE_TYPEWRITER_SPEED,
      repeat: text.length - 1,
      callback: () => {
        this.displayedLen++;
        this.bodyText.setText(text.substring(0, this.displayedLen));
        if (this.displayedLen >= text.length) {
          this.typewriterTimer = null;
          onDone();
        }
      },
    });
  }

  private skipTypewriter(): void {
    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
      this.typewriterTimer = null;
    }
    this.bodyText.setText(this.fullText);
    this.displayedLen = this.fullText.length;
  }

  private advance(): void {
    if (this.typewriterTimer) {
      this.skipTypewriter();
      if (this.currentLine && this.currentLine.choices.length > 0) {
        this.waitingForInput = true;
        this.showChoices(this.currentLine.choices);
      } else {
        this.waitingForInput = true;
        this.showContinueHint();
      }
      return;
    }
    if (!this.waitingForInput) return;
    if (this.currentLine && this.currentLine.choices.length === 0) {
      this.player.advance();
    }
  }

  private showChoices(choices: { label: string; index: number }[]): void {
    this.clearChoices();
    const { width, height } = this.scale;
    const baseY = height - 150;
    choices.forEach((c, i) => {
      const btn = this.add.text(width / 2, baseY - i * 26, `▸ ${c.label}`, {
        fontFamily: 'Rajdhani, monospace',
        fontSize:   '13px',
        color:      '#dde8ff',
        backgroundColor: 'rgba(0,20,40,0.85)',
        padding:    { x: 10, y: 4 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover',  () => btn.setStyle({ color: '#00e5ff' }));
      btn.on('pointerout',   () => btn.setStyle({ color: '#dde8ff' }));
      btn.on('pointerdown',  () => {
        this.clearChoices();
        this.player.advance(c.index);
      });
      this.choiceBtns.push(btn);
    });
  }

  private showContinueHint(): void {
    // Blinking arrow already visible via name text area
  }

  private clearChoices(): void {
    for (const btn of this.choiceBtns) btn.destroy();
    this.choiceBtns = [];
  }

  private updatePortrait(speakerId: string, emotion: string): void {
    if (this.portrait) { this.portrait.destroy(); this.portrait = null; }
    const sprDef = svgAssetStore.getSprite(speakerId.toLowerCase());
    if (!sprDef) return;
    const frameIndex = sprDef.portraits[emotion] ?? sprDef.portraits['neutral'] ?? 0;
    const { height } = this.scale;
    const boxY = height - 140 - 12;
    const img = this.add.image(this.scale.width - 70, boxY - 20, speakerId.toLowerCase());
    // Crop to portrait frame
    const tileW = sprDef.frameWidth * 2;
    const tileH = sprDef.frameHeight * 2;
    const cols  = sprDef.cols;
    img.setCrop((frameIndex % cols) * tileW, Math.floor(frameIndex / cols) * tileH, tileW, tileH);
    img.setDisplaySize(64, 64);
    this.portrait = img;
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.advanceKey)) {
      this.advance();
    }
  }
}
