import type { TimeSlot } from "../data/schemas";

export function getTimeSlotFromHour(hour: number): TimeSlot {
  if (hour >= 6 && hour < 12)  return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

export function timeSlotToHourRange(slot: TimeSlot): [number, number] {
  switch (slot) {
    case "morning":   return [6, 12];
    case "afternoon": return [12, 18];
    case "evening":   return [18, 21];
    case "night":     return [21, 6];
    case "tournament": return [0, 24];
    default:          return [0, 24];
  }
}

export function advanceGameClock(currentHour: number, deltaMins: number): number {
  return (currentHour + deltaMins / 60) % 24;
}
