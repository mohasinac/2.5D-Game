import { describe, it, expect } from "vitest";
import { isCompatible } from "@/components/admin/beyblade-system/partCompatibility";

describe("isCompatible", () => {
  it("always returns ok when isAdmin is true", () => {
    const part = {
      excludedCompatibility: ["burst"],
      requiredCompatibility: ["metal-fight"],
    };
    const result = isCompatible(part, ["burst"], true);
    expect(result.ok).toBe(true);
    expect(result.reason).toBe("");
  });

  it("returns ok when part has no restrictions", () => {
    const result = isCompatible({}, ["burst", "metal-fight"], false);
    expect(result.ok).toBe(true);
  });

  it("excludes part when existingTags contains an excludedCompatibility tag", () => {
    const part = { excludedCompatibility: ["burst"] };
    const result = isCompatible(part, ["burst"], false);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('"burst"');
  });

  it("excludes on first matching excluded tag and stops", () => {
    const part = { excludedCompatibility: ["burst", "x-gen"] };
    const result = isCompatible(part, ["x-gen"], false);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('"x-gen"');
  });

  it("does not exclude when excluded tags do not overlap with existing tags", () => {
    const part = { excludedCompatibility: ["burst"] };
    const result = isCompatible(part, ["metal-fight"], false);
    expect(result.ok).toBe(true);
  });

  it("requires at least one tag from requiredCompatibility", () => {
    const part = { requiredCompatibility: ["metal-fight", "mfb"] };
    const result = isCompatible(part, ["burst"], false);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("metal-fight");
    expect(result.reason).toContain("mfb");
  });

  it("passes when one of the required tags is present", () => {
    const part = { requiredCompatibility: ["metal-fight", "mfb"] };
    const result = isCompatible(part, ["metal-fight"], false);
    expect(result.ok).toBe(true);
  });

  it("passes with empty requiredCompatibility (no restriction)", () => {
    const part = { requiredCompatibility: [] };
    const result = isCompatible(part, [], false);
    expect(result.ok).toBe(true);
  });

  it("exclusion takes priority over required check", () => {
    const part = {
      excludedCompatibility: ["burst"],
      requiredCompatibility: ["burst"], // contradictory — exclude wins
    };
    const result = isCompatible(part, ["burst"], false);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("Excluded");
  });

  it("returns ok with empty existing tags and no restrictions", () => {
    const result = isCompatible({}, [], false);
    expect(result.ok).toBe(true);
  });
});
