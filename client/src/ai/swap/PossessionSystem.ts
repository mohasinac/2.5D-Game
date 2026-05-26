export class PossessionSystem {
  private playerAuthorityMap: Map<string, boolean> = new Map();

  grantPlayerControl(beyId: string): void {
    this.playerAuthorityMap.set(beyId, true);
  }

  revokePlayerControl(beyId: string): void {
    this.playerAuthorityMap.set(beyId, false);
  }

  hasPlayerAuthority(beyId: string): boolean {
    return this.playerAuthorityMap.get(beyId) ?? false;
  }

  clear(): void {
    this.playerAuthorityMap.clear();
  }
}
