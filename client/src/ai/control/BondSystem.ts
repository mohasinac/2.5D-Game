import type { BondBehavior } from '../types/CharacterTypes';

const BOND_STORAGE_KEY = 'beyblade_bond_levels';

export class BondSystem {
  private bondLevels: Map<string, number> = new Map();

  constructor() {
    this.load();
  }

  private getKey(userId: string, beySystemId: string): string {
    return `${userId}:${beySystemId}`;
  }

  getBond(userId: string, beySystemId: string): number {
    return this.bondLevels.get(this.getKey(userId, beySystemId)) ?? 0;
  }

  increaseBond(userId: string, beySystemId: string, amount: number): void {
    const key = this.getKey(userId, beySystemId);
    const current = this.bondLevels.get(key) ?? 0;
    this.bondLevels.set(key, Math.min(1.0, current + amount));
    this.save();
  }

  decreaseBond(userId: string, beySystemId: string, amount: number): void {
    const key = this.getKey(userId, beySystemId);
    const current = this.bondLevels.get(key) ?? 0;
    this.bondLevels.set(key, Math.max(0, current - amount));
    this.save();
  }

  onWin(userId: string, beySystemId: string): void {
    this.increaseBond(userId, beySystemId, 0.05);
  }

  onLoss(userId: string, beySystemId: string): void {
    this.decreaseBond(userId, beySystemId, 0.02);
  }

  onBurst(userId: string, beySystemId: string): void {
    this.decreaseBond(userId, beySystemId, 0.03);
  }

  onSpecialUsed(userId: string, beySystemId: string): void {
    this.increaseBond(userId, beySystemId, 0.01);
  }

  getActiveBondBehaviors(userId: string, beySystemId: string, behaviors: BondBehavior[]): BondBehavior[] {
    const bond = this.getBond(userId, beySystemId);
    return behaviors.filter(b => bond >= b.minBond);
  }

  private save(): void {
    try {
      const data: Record<string, number> = {};
      for (const [k, v] of this.bondLevels) data[k] = v;
      localStorage.setItem(BOND_STORAGE_KEY, JSON.stringify(data));
    } catch { /* localStorage unavailable */ }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(BOND_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Record<string, number>;
      for (const [k, v] of Object.entries(data)) {
        this.bondLevels.set(k, v);
      }
    } catch { /* corrupted data */ }
  }

  reset(): void {
    this.bondLevels.clear();
    try { localStorage.removeItem(BOND_STORAGE_KEY); } catch { /* */ }
  }
}
