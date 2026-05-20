// Node.js is single-threaded — no race conditions on this counter.
const MAX_ROOMS = 20;
let activeRooms = 0;

export function tryReserveRoom(): boolean {
  if (activeRooms >= MAX_ROOMS) return false;
  activeRooms++;
  return true;
}

export function releaseRoom(): void {
  activeRooms = Math.max(0, activeRooms - 1);
}

export function getActiveRoomCount(): number {
  return activeRooms;
}
