// Unit tests for SpatialGrid (Phase 14).

import { describe, it, expect } from "vitest";
import { SpatialGrid } from "../../utils/spatialGrid";

describe("SpatialGrid", () => {
  it("inserts and queries by rect", () => {
    const g = new SpatialGrid(4);
    g.insertOrUpdate({ id: "a", x_cm: 1, y_cm: 1, radiusCm: 1 });
    g.insertOrUpdate({ id: "b", x_cm: 10, y_cm: 0, radiusCm: 1 });
    const r = g.queryRect({ x: -2, y: -2, w: 5, h: 5 });
    expect(r.map((e) => e.id).sort()).toEqual(["a"]);
  });

  it("updates move entity to new cell and removes from old", () => {
    const g = new SpatialGrid(4);
    g.insertOrUpdate({ id: "a", x_cm: 1, y_cm: 1, radiusCm: 1 });
    g.insertOrUpdate({ id: "a", x_cm: 20, y_cm: 20, radiusCm: 1 });
    expect(g.queryRect({ x: -2, y: -2, w: 5, h: 5 })).toHaveLength(0);
    expect(g.queryRect({ x: 18, y: 18, w: 5, h: 5 })).toHaveLength(1);
  });

  it("remove takes entity out of the index", () => {
    const g = new SpatialGrid(4);
    g.insertOrUpdate({ id: "a", x_cm: 1, y_cm: 1, radiusCm: 1 });
    g.remove("a");
    expect(g.size()).toBe(0);
    expect(g.queryRect({ x: -10, y: -10, w: 20, h: 20 })).toHaveLength(0);
  });

  it("queryCircle filters by distance", () => {
    const g = new SpatialGrid(4);
    g.insertOrUpdate({ id: "a", x_cm: 0, y_cm: 0, radiusCm: 1 });
    g.insertOrUpdate({ id: "b", x_cm: 4, y_cm: 0, radiusCm: 1 });   // dist 4
    g.insertOrUpdate({ id: "c", x_cm: 10, y_cm: 0, radiusCm: 1 });  // dist 10
    const r = g.queryCircle(0, 0, 5).map((e) => e.id).sort();
    expect(r).toEqual(["a", "b"]);
  });

  it("queryRectByAabb finds entities whose AABB intersects rect", () => {
    const g = new SpatialGrid(4);
    g.insertOrUpdate({ id: "big", x_cm: 10, y_cm: 10, radiusCm: 5 });
    const r = g.queryRectByAabb({ x: -2, y: -2, w: 8, h: 8 });
    expect(r.map((e) => e.id)).toEqual(["big"]);
  });
});
