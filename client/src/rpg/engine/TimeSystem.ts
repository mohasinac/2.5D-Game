import type { TimeSlot } from "../data/schemas";
import { getTimeSlotFromHour } from "../utils/scheduleUtils";

// 1 real second = GAME_MINUTES_PER_SEC in-game minutes
const GAME_MINUTES_PER_SEC = 2;

export class TimeSystem {
  private gameHour = 9; // start at 9am
  private accumulatedMs = 0;
  private onSlotChange?: (slot: TimeSlot, hour: number) => void;
  private currentSlot: TimeSlot = "morning";

  constructor(initialHour = 9) {
    this.gameHour = initialHour;
    this.currentSlot = getTimeSlotFromHour(initialHour);
  }

  onTimeSlotChange(cb: (slot: TimeSlot, hour: number) => void): void {
    this.onSlotChange = cb;
  }

  update(deltaMS: number): void {
    this.accumulatedMs += deltaMS;
    const msPerGameMinute = 1000 / GAME_MINUTES_PER_SEC;

    while (this.accumulatedMs >= msPerGameMinute) {
      this.accumulatedMs -= msPerGameMinute;
      this.gameHour = (this.gameHour + 1 / 60) % 24;
      const newSlot = getTimeSlotFromHour(Math.floor(this.gameHour));
      if (newSlot !== this.currentSlot) {
        this.currentSlot = newSlot;
        this.onSlotChange?.(newSlot, this.gameHour);
      }
    }
  }

  getHour(): number {
    return this.gameHour;
  }

  getSlot(): TimeSlot {
    return this.currentSlot;
  }

  setHour(h: number): void {
    this.gameHour = h % 24;
    this.currentSlot = getTimeSlotFromHour(Math.floor(this.gameHour));
  }

  // No-op stub — TimeSystem is updated via update() in the PixiJS ticker.
  stop(): void { /* noop: stopped when ticker is removed */ }
}
