// Tests for Minimap: auto-hides for small arenas, draws bey dots, renders
// viewport rect when provided. See Phase 14.

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Minimap } from "@/components/game/Minimap";
import type { ServerBeyblade, ServerGameState } from "@/types/game";

function makeArena(width: number, height: number): NonNullable<ServerGameState["arena"]> {
  return {
    id: "a", name: "Test", width, height, shape: "circle", theme: "metrocity",
  } as any;
}

function makeBey(id: string, x: number, y: number, isActive = true, isAI = false): ServerBeyblade {
  return {
    id, userId: id, username: id,
    x, y, rotation: 0,
    velocityX: 0, velocityY: 0, angularVelocity: 0,
    health: 100, maxHealth: 100, stamina: 100, maxStamina: 100,
    spin: 0, maxSpin: 100, isActive, isAI,
    type: "attack", radius: 2.5, actualSize: 60,
    isInvulnerable: false, damageDealt: 0, damageReceived: 0, collisions: 0,
    spinDirection: "right", power: 0, isAirborne: false, airborneTimer: 0,
    isDefending: false, attackBuffTimer: 0, dodgeBuffTimer: 0,
    stunTimer: 0, comboExecuting: false,
  } as any;
}

describe("Minimap", () => {
  it("returns null when arena is null", () => {
    const { container } = render(<Minimap gameState={null} beyblades={new Map()} />);
    expect(container.firstChild).toBeNull();
  });

  it("auto-hides for arenas smaller than 80cm short axis", () => {
    // 1080 / 24 = 45cm — far below threshold.
    const gs = { arena: makeArena(1080, 1080), beyblades: new Map() } as any;
    const { container } = render(<Minimap gameState={gs} beyblades={new Map()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders for arenas larger than 80cm short axis", () => {
    // 100cm × 100cm.
    const gs = { arena: makeArena(2400, 2400), beyblades: new Map() } as any;
    const beys = new Map<string, ServerBeyblade>([
      ["p", makeBey("p", 19200, 19200)],
      ["a", makeBey("a", 19200, 19200, true, true)],
    ]);
    const { container } = render(
      <Minimap gameState={gs} beyblades={beys} selfId="p" />
    );
    expect(container.querySelector("svg")).not.toBeNull();
    // 1 outline + 2 bey dots = 3 shapes minimum
    expect(container.querySelectorAll("circle, rect").length).toBeGreaterThanOrEqual(3);
  });

  it("renders the viewport rect when viewportCm is provided", () => {
    const gs = { arena: makeArena(2400, 2400), beyblades: new Map() } as any;
    const { container } = render(
      <Minimap
        gameState={gs}
        beyblades={new Map()}
        viewportCm={{ x: -10, y: -10, w: 40, h: 30 }}
      />
    );
    const rects = container.querySelectorAll("rect");
    // At least the viewport rect (circle arena has no shape rect).
    expect(rects.length).toBeGreaterThanOrEqual(1);
    const viewportRect = Array.from(rects).find((r) => r.getAttribute("stroke") === "#ffcc44");
    expect(viewportRect).toBeTruthy();
  });
});
