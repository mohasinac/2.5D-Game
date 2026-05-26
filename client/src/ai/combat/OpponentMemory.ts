interface MoveRecord {
  tick: number;
  bitmask: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MAX_RECORDS = 50;

export class OpponentMemory {
  private records: Map<string, MoveRecord[]> = new Map();

  record(opponentId: string, tick: number, bitmask: number, x: number, y: number, vx: number, vy: number): void {
    if (!this.records.has(opponentId)) {
      this.records.set(opponentId, []);
    }
    const list = this.records.get(opponentId)!;
    list.push({ tick, bitmask, x, y, vx, vy });
    if (list.length > MAX_RECORDS) list.shift();
  }

  getRecords(opponentId: string): MoveRecord[] {
    return this.records.get(opponentId) ?? [];
  }

  predictNextMove(opponentId: string): number | null {
    const records = this.getRecords(opponentId);
    if (records.length < 5) return null;
    const recent = records.slice(-5);
    const bitmaskCounts = new Map<number, number>();
    for (const r of recent) {
      bitmaskCounts.set(r.bitmask, (bitmaskCounts.get(r.bitmask) ?? 0) + 1);
    }
    let maxCount = 0;
    let predicted: number | null = null;
    for (const [mask, count] of bitmaskCounts) {
      if (count > maxCount) {
        maxCount = count;
        predicted = mask;
      }
    }
    return predicted;
  }

  detectPattern(opponentId: string): 'aggressive' | 'defensive' | 'passive' | null {
    const records = this.getRecords(opponentId);
    if (records.length < 10) return null;
    const recent = records.slice(-10);
    let attackCount = 0;
    let defenseCount = 0;
    for (const r of recent) {
      if (r.bitmask & (1 << 4)) attackCount++;  // bit 4 = attack
      if (r.bitmask & (1 << 5)) defenseCount++; // bit 5 = defense
    }
    if (attackCount > 6) return 'aggressive';
    if (defenseCount > 4) return 'defensive';
    return 'passive';
  }

  clear(): void {
    this.records.clear();
  }
}
