// Node.js is single-threaded — no race conditions on this counter.
let maxActiveRooms = 20;
let activeRooms = 0;

export function setMaxActiveRooms(n: number): void {
  maxActiveRooms = Math.max(1, n);
}

export function tryReserveRoom(): boolean {
  if (activeRooms >= maxActiveRooms) return false;
  activeRooms++;
  return true;
}

export function releaseRoom(): void {
  activeRooms = Math.max(0, activeRooms - 1);
}

export function getActiveRoomCount(): number {
  return activeRooms;
}
