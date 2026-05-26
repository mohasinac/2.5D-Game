import type { EmotionState } from '../types/AITypes';

export class EmotionSystem {
  private state: EmotionState = 'calm';
  private frustration: number = 0;
  private excitement: number = 0;
  private excitementDecayTick: number = 0;

  getState(): EmotionState {
    return this.state;
  }

  onDamageTaken(): void {
    this.frustration = Math.min(1.0, this.frustration + 0.15);
    this.updateState();
  }

  onDamageDealt(): void {
    this.excitement = Math.min(1.0, this.excitement + 0.2);
    this.excitementDecayTick = 120; // 2s at 60fps
    this.frustration = Math.max(0, this.frustration - 0.05);
    this.updateState();
  }

  onMiss(): void {
    this.frustration = Math.min(1.0, this.frustration + 0.08);
    this.updateState();
  }

  tick(spinRatio: number): void {
    if (this.excitementDecayTick > 0) {
      this.excitementDecayTick--;
    } else {
      this.excitement = Math.max(0, this.excitement - 0.005);
    }
    this.frustration = Math.max(0, this.frustration - 0.002);

    if (spinRatio < 0.2) {
      this.state = 'desperate';
      return;
    }
    this.updateState();
  }

  private updateState(): void {
    if (this.frustration > 0.7) {
      this.state = 'frustrated';
    } else if (this.excitement > 0.5) {
      this.state = 'excited';
    } else {
      this.state = 'calm';
    }
  }

  getObedienceModifier(): number {
    switch (this.state) {
      case 'frustrated': return 0.7;
      case 'desperate': return 0.5;
      case 'excited': return 1.1;
      case 'calm': default: return 1.0;
    }
  }

  getAggressionModifier(): number {
    switch (this.state) {
      case 'frustrated': return 1.3;
      case 'desperate': return 1.5;
      case 'excited': return 1.2;
      case 'calm': default: return 1.0;
    }
  }

  reset(): void {
    this.state = 'calm';
    this.frustration = 0;
    this.excitement = 0;
    this.excitementDecayTick = 0;
  }
}
