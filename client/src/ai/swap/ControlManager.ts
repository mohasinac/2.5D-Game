export type ControlOwner = 'player' | 'ai';

export class ControlManager {
  private ownership: Map<string, ControlOwner> = new Map();
  private playerBeyId: string | null = null;
  private onSwapCallbacks: Array<(oldBeyId: string | null, newBeyId: string) => void> = [];

  setPlayerBey(beyId: string): void {
    this.playerBeyId = beyId;
    this.ownership.set(beyId, 'player');
  }

  getPlayerBeyId(): string | null {
    return this.playerBeyId;
  }

  getOwner(beyId: string): ControlOwner {
    return this.ownership.get(beyId) ?? 'ai';
  }

  isPlayerControlled(beyId: string): boolean {
    return this.ownership.get(beyId) === 'player';
  }

  registerBey(beyId: string, owner: ControlOwner): void {
    this.ownership.set(beyId, owner);
  }

  swapTo(newBeyId: string): void {
    const oldBeyId = this.playerBeyId;
    if (oldBeyId) {
      this.ownership.set(oldBeyId, 'ai');
    }
    this.playerBeyId = newBeyId;
    this.ownership.set(newBeyId, 'player');
    for (const cb of this.onSwapCallbacks) {
      cb(oldBeyId, newBeyId);
    }
  }

  onSwap(callback: (oldBeyId: string | null, newBeyId: string) => void): void {
    this.onSwapCallbacks.push(callback);
  }

  getAlliedBeyIds(userId: string, allBeys: Map<string, { userId: string }>): string[] {
    const allies: string[] = [];
    for (const [beyId, bey] of allBeys) {
      if (bey.userId === userId) allies.push(beyId);
    }
    return allies;
  }

  cycleToNext(userId: string, allBeys: Map<string, { userId: string; isAlive: boolean }>): void {
    const allies = this.getAlliedBeyIds(userId, allBeys).filter(id => allBeys.get(id)?.isAlive);
    if (allies.length <= 1) return;
    const currentIndex = allies.indexOf(this.playerBeyId ?? '');
    const nextIndex = (currentIndex + 1) % allies.length;
    this.swapTo(allies[nextIndex]);
  }

  destroy(): void {
    this.ownership.clear();
    this.playerBeyId = null;
    this.onSwapCallbacks = [];
  }
}
