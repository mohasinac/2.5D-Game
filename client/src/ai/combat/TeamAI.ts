import type { AIGameSnapshot, AIBeyState, TeamRole, TeamMessage } from '../types/AITypes';
import type { CombatAI } from './CombatAI';

interface TeamMember {
  beyId: string;
  userId: string;
  role: TeamRole;
  combatAI: CombatAI;
}

export class TeamAI {
  private members: TeamMember[] = [];
  private messageQueue: TeamMessage[] = [];

  addMember(beyId: string, userId: string, combatAI: CombatAI): void {
    this.members.push({ beyId, userId, role: 'free', combatAI });
  }

  removeMember(beyId: string): void {
    this.members = this.members.filter(m => m.beyId !== beyId);
  }

  assignRoles(snapshot: AIGameSnapshot): void {
    if (this.members.length === 0) return;

    // Find highest spin → stamina role
    let bestStamina: TeamMember | null = null;
    let bestStaminaRatio = -1;

    for (const member of this.members) {
      const bey = snapshot.beyblades.get(member.beyId);
      if (!bey || !bey.isAlive) continue;
      const ratio = bey.spin / bey.maxSpin;
      if (ratio > bestStaminaRatio) {
        bestStaminaRatio = ratio;
        bestStamina = member;
      }
    }

    for (const member of this.members) {
      const bey = snapshot.beyblades.get(member.beyId);
      if (!bey || !bey.isAlive) {
        member.role = 'free';
        continue;
      }
      if (member === bestStamina && this.members.length > 1) {
        member.role = 'stamina';
      } else {
        member.role = 'attacker';
      }
    }
  }

  broadcastMessage(message: TeamMessage): void {
    this.messageQueue.push(message);
  }

  consumeMessages(forBeyId: string): TeamMessage[] {
    const messages = this.messageQueue.filter(m => m.fromId !== forBeyId);
    return messages;
  }

  clearMessages(): void {
    this.messageQueue = [];
  }

  getRole(beyId: string): TeamRole {
    return this.members.find(m => m.beyId === beyId)?.role ?? 'free';
  }

  update(snapshot: AIGameSnapshot): void {
    this.assignRoles(snapshot);
    this.clearMessages();

    for (const member of this.members) {
      const bey = snapshot.beyblades.get(member.beyId);
      if (!bey || !bey.isAlive) continue;

      if (bey.spin / bey.maxSpin < 0.3) {
        this.broadcastMessage({
          fromId: member.beyId,
          type: 'need_support',
          data: { x: bey.x, y: bey.y },
        });
      }
    }
  }
}
