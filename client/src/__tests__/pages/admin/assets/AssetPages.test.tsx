/**
 * Unit tests for all 6 admin asset pages.
 *
 * Each page is a thin wrapper around AssetCrudPage, so we verify:
 *  - Correct title / icon / description passed through
 *  - Correct Firestore collection queried
 *  - Expected tag values rendered
 *  - Audio-only pages use audio accept type
 *  - Image pages open image editor on file selection
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as firestore from "firebase/firestore";

import { ArenaThemeAssetsPage } from "@/pages/admin/assets/ArenaThemeAssetsPage";
import { ObstacleAssetsPage } from "@/pages/admin/assets/ObstacleAssetsPage";
import { TurretAssetsPage } from "@/pages/admin/assets/TurretAssetsPage";
import { WaterBodyAssetsPage } from "@/pages/admin/assets/WaterBodyAssetsPage";
import { PortalAssetsPage } from "@/pages/admin/assets/PortalAssetsPage";
import { SoundAssetsPage } from "@/pages/admin/assets/SoundAssetsPage";

// ─── Canvas mock (needed by AssetCrudPage's editor children) ─────────────────

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(), drawImage: vi.fn(), fillRect: vi.fn(),
    beginPath: vi.fn(), arc: vi.fn(), clip: vi.fn(),
    save: vi.fn(), restore: vi.fn(), translate: vi.fn(),
    rotate: vi.fn(), stroke: vi.fn(), closePath: vi.fn(),
    fillStyle: "", strokeStyle: "", lineWidth: 0,
  })) as any;
  HTMLCanvasElement.prototype.toBlob = vi.fn((cb: any) => cb(new Blob([], { type: "image/jpeg" })));
  vi.mocked(firestore.getDocs).mockResolvedValue({ docs: [] } as any);
});

// ─── ArenaThemeAssetsPage ─────────────────────────────────────────────────────

describe("ArenaThemeAssetsPage", () => {
  it("renders the correct title", async () => {
    render(<ArenaThemeAssetsPage />);
    expect(screen.getByText("Arena Theme Textures")).toBeInTheDocument();
  });

  it("renders the description mentioning PNG or JPG", () => {
    render(<ArenaThemeAssetsPage />);
    expect(screen.getByText(/PNG or JPG/)).toBeInTheDocument();
  });

  it("queries the arena_theme_assets Firestore collection", async () => {
    render(<ArenaThemeAssetsPage />);
    await waitFor(() => {
      const collectionCalls = vi.mocked(firestore.collection).mock.calls;
      expect(collectionCalls.some(([, name]) => name === "arena_theme_assets")).toBe(true);
    });
  });

  it("renders all theme tag buttons", async () => {
    render(<ArenaThemeAssetsPage />);
    await waitFor(() => expect(screen.getByText(/All/)).toBeInTheDocument());
    for (const tag of ["metrocity", "forest", "mountains", "desert", "sea", "futuristic"]) {
      const matches = screen.getAllByText(new RegExp(`^${tag}`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("shows empty state with theme textures context", async () => {
    render(<ArenaThemeAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No assets yet/)).toBeInTheDocument();
    });
  });

  it("accepts image files and opens editor", async () => {
    render(<ArenaThemeAssetsPage />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(fileInput.accept).toBe("image/*");

    const file = new File(["img"], "theme.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Drag the image to adjust")).toBeInTheDocument();
    });
  });
});

// ─── ObstacleAssetsPage ───────────────────────────────────────────────────────

describe("ObstacleAssetsPage", () => {
  it("renders the correct title", async () => {
    render(<ObstacleAssetsPage />);
    expect(screen.getByText("Obstacle Sprites")).toBeInTheDocument();
  });

  it("mentions transparent background in description", () => {
    render(<ObstacleAssetsPage />);
    expect(screen.getByText(/transparent background/)).toBeInTheDocument();
  });

  it("queries the obstacle_assets collection", async () => {
    render(<ObstacleAssetsPage />);
    await waitFor(() => {
      const calls = vi.mocked(firestore.collection).mock.calls;
      expect(calls.some(([, name]) => name === "obstacle_assets")).toBe(true);
    });
  });

  it("renders obstacle type tags", async () => {
    render(<ObstacleAssetsPage />);
    await waitFor(() => expect(screen.getByText(/All/)).toBeInTheDocument());
    for (const tag of ["rock", "pillar", "barrier", "wall", "crystal", "box", "tire"]) {
      const matches = screen.getAllByText(new RegExp(`^${tag}`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("shows empty state", async () => {
    render(<ObstacleAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No assets yet/)).toBeInTheDocument();
    });
  });
});

// ─── TurretAssetsPage ─────────────────────────────────────────────────────────

describe("TurretAssetsPage", () => {
  it("renders the correct title", async () => {
    render(<TurretAssetsPage />);
    expect(screen.getByText("Turret Sprites")).toBeInTheDocument();
  });

  it("queries the turret_assets collection", async () => {
    render(<TurretAssetsPage />);
    await waitFor(() => {
      const calls = vi.mocked(firestore.collection).mock.calls;
      expect(calls.some(([, name]) => name === "turret_assets")).toBe(true);
    });
  });

  it("renders turret and projectile tags", async () => {
    render(<TurretAssetsPage />);
    await waitFor(() => expect(screen.getByText(/All/)).toBeInTheDocument());
    for (const tag of ["turret-bullet", "turret-laser", "projectile-bullet", "projectile-laser"]) {
      const matches = screen.getAllByText(new RegExp(`^${tag}`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("shows empty state", async () => {
    render(<TurretAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No assets yet/)).toBeInTheDocument();
    });
  });
});

// ─── WaterBodyAssetsPage ──────────────────────────────────────────────────────

describe("WaterBodyAssetsPage", () => {
  it("renders the correct title", async () => {
    render(<WaterBodyAssetsPage />);
    expect(screen.getByText("Water Body Textures")).toBeInTheDocument();
  });

  it("queries the water_body_assets collection", async () => {
    render(<WaterBodyAssetsPage />);
    await waitFor(() => {
      const calls = vi.mocked(firestore.collection).mock.calls;
      expect(calls.some(([, name]) => name === "water_body_assets")).toBe(true);
    });
  });

  it("renders water type tags", async () => {
    render(<WaterBodyAssetsPage />);
    await waitFor(() => expect(screen.getByText(/All/)).toBeInTheDocument());
    for (const tag of ["water", "lava", "sand", "ice", "acid", "mud", "oil"]) {
      const matches = screen.getAllByText(new RegExp(`^${tag}`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("shows empty state", async () => {
    render(<WaterBodyAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No assets yet/)).toBeInTheDocument();
    });
  });
});

// ─── PortalAssetsPage ─────────────────────────────────────────────────────────

describe("PortalAssetsPage", () => {
  it("renders the correct title", async () => {
    render(<PortalAssetsPage />);
    expect(screen.getByText("Portal Sprites")).toBeInTheDocument();
  });

  it("queries the portal_assets collection", async () => {
    render(<PortalAssetsPage />);
    await waitFor(() => {
      const calls = vi.mocked(firestore.collection).mock.calls;
      expect(calls.some(([, name]) => name === "portal_assets")).toBe(true);
    });
  });

  it("renders portal element tags", async () => {
    render(<PortalAssetsPage />);
    await waitFor(() => expect(screen.getByText(/All/)).toBeInTheDocument());
    for (const tag of ["portal-ring", "portal-entrance", "portal-exit", "teleport-effect"]) {
      const matches = screen.getAllByText(new RegExp(`^${tag}`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("shows empty state", async () => {
    render(<PortalAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No assets yet/)).toBeInTheDocument();
    });
  });
});

// ─── SoundAssetsPage ──────────────────────────────────────────────────────────

describe("SoundAssetsPage", () => {
  it("renders the correct title", async () => {
    render(<SoundAssetsPage />);
    expect(screen.getByText("Sound Effects")).toBeInTheDocument();
  });

  it("mentions MP3 or OGG in description", () => {
    render(<SoundAssetsPage />);
    expect(screen.getByText(/MP3 or OGG/)).toBeInTheDocument();
  });

  it("queries the sound_assets collection", async () => {
    render(<SoundAssetsPage />);
    await waitFor(() => {
      const calls = vi.mocked(firestore.collection).mock.calls;
      expect(calls.some(([, name]) => name === "sound_assets")).toBe(true);
    });
  });

  it("accepts audio files only", () => {
    render(<SoundAssetsPage />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(fileInput.accept).toBe("audio/*");
  });

  it("does NOT open image editor on audio file selection", async () => {
    render(<SoundAssetsPage />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["audio"], "track.mp3", { type: "audio/mp3" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.queryByText("Drag the image to adjust")).not.toBeInTheDocument();
    });
  });

  it("renders sound category tags", async () => {
    render(<SoundAssetsPage />);
    await waitFor(() => expect(screen.getByText(/All/)).toBeInTheDocument());
    for (const tag of ["hit-light", "hit-heavy", "spin-out", "victory", "defeat"]) {
      const matches = screen.getAllByText(new RegExp(`^${tag}`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("renders audio player for uploaded sound assets", async () => {
    const soundDocs = [
      { id: "s1", data: () => ({ name: "Hit Light", url: "https://example.com/hit.mp3", storagePath: "sounds/hit.mp3", tag: "hit-light" }) },
    ];
    vi.mocked(firestore.getDocs).mockResolvedValue({ docs: soundDocs } as any);

    render(<SoundAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText("Hit Light")).toBeInTheDocument();
      expect(document.querySelector("audio")).toBeInTheDocument();
    });
  });

  it("shows empty state", async () => {
    render(<SoundAssetsPage />);
    await waitFor(() => {
      expect(screen.getByText(/No assets yet/)).toBeInTheDocument();
    });
  });
});
