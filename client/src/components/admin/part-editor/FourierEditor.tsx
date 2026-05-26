/**
 * FourierEditor — two-way Fourier radial profile editor.
 *
 * Features:
 *  • "Generate from image" — ray-cast at 360° → DFT → FourierRadialProfile
 *  • Harmonic order slider (2–32)
 *  • Per-harmonic amplitude bars (interactive)
 *  • Live polar preview canvas
 *  • Exports FourierRadialProfile with synthesized radialCache
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { C, HEX } from "@/styles/theme";
import { synthesizeRadialCache } from "@/types/beybladeSystem";
import type { FourierRadialProfile } from "@/types/beybladeSystem";

// ── Ray-cast radial profile from binary mask ──────────────────────────────────

function raycastProfile(imageUrl: string, samples = 360): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const cx = size / 2, cy = size / 2;
      const radii: number[] = [];

      for (let deg = 0; deg < samples; deg++) {
        const rad = (deg * Math.PI) / 180;
        let r = 0;
        // Cast ray outward until we leave the foreground
        for (let t = 0; t <= cx; t++) {
          const px = Math.round(cx + t * Math.cos(rad));
          const py = Math.round(cy + t * Math.sin(rad));
          if (px < 0 || px >= size || py < 0 || py >= size) break;
          const alpha = data[(py * size + px) * 4 + 3];
          if (alpha >= 32) r = t;
        }
        radii.push(r);
      }
      resolve(radii);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// ── DFT → harmonics ───────────────────────────────────────────────────────────

function computeFourierProfile(radii: number[], numHarmonics: number, mmPerPx: number): FourierRadialProfile {
  const N = radii.length;
  const a0 = (radii.reduce((s, r) => s + r, 0) / N) * mmPerPx;
  const harmonics = [];
  for (let n = 1; n <= numHarmonics; n++) {
    let an = 0, bn = 0;
    for (let k = 0; k < N; k++) {
      const theta = (2 * Math.PI * n * k) / N;
      an += radii[k] * Math.cos(theta);
      bn += radii[k] * Math.sin(theta);
    }
    an = (an / N) * 2 * mmPerPx;
    bn = (bn / N) * 2 * mmPerPx;
    harmonics.push({ n, a: parseFloat(an.toFixed(4)), b: parseFloat(bn.toFixed(4)) });
  }
  const profile: FourierRadialProfile = { a0, harmonics };
  return { ...profile, radialCache: synthesizeRadialCache(profile) };
}

// ── Polar preview canvas ──────────────────────────────────────────────────────

function PolarPreview({ profile, size = 160 }: { profile: FourierRadialProfile; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    const cache = profile.radialCache?.length === 360 ? profile.radialCache : synthesizeRadialCache(profile);
    if (!cache.length) return;
    const maxR = Math.max(...cache);
    if (maxR === 0) return;
    const scale = (size / 2 - 6) / maxR;
    const cx = size / 2, cy = size / 2;

    // Grid circle
    ctx.strokeStyle = HEX.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Shape fill
    ctx.beginPath();
    for (let deg = 0; deg < 360; deg++) {
      const rad = (deg * Math.PI) / 180;
      const r = cache[deg] * scale;
      const x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      deg === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = HEX.blue + "33";
    ctx.fill();
    ctx.strokeStyle = HEX.blue;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [profile, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-[6px] bg-bg3" />;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  value: FourierRadialProfile | undefined;
  onChange: (fp: FourierRadialProfile) => void;
  imageUrl?: string;
  mmPerPx?: number;
}

export function FourierEditor({ value, onChange, imageUrl, mmPerPx = 0.1 }: Props) {
  const [numHarmonics, setNumHarmonics] = useState(8);
  const [generating, setGenerating] = useState(false);
  const [rawRadii, setRawRadii] = useState<number[] | null>(null);

  const generate = useCallback(async (url: string, harmonics: number) => {
    setGenerating(true);
    try {
      const radii = await raycastProfile(url);
      setRawRadii(radii);
      const fp = computeFourierProfile(radii, harmonics, mmPerPx);
      onChange(fp);
    } catch (e) {
      console.error("Fourier generation failed:", e);
    } finally {
      setGenerating(false);
    }
  }, [mmPerPx, onChange]);

  // Re-compute when harmonic order changes and we already have raw radii
  const handleHarmonicsChange = (n: number) => {
    setNumHarmonics(n);
    if (rawRadii) {
      const fp = computeFourierProfile(rawRadii, n, mmPerPx);
      onChange(fp);
    } else if (value) {
      // Truncate/extend existing harmonics
      const existing = value.harmonics.slice(0, n);
      const fp: FourierRadialProfile = { a0: value.a0, harmonics: existing };
      onChange({ ...fp, radialCache: synthesizeRadialCache(fp) });
    }
  };

  const updateHarmonic = (idx: number, field: "a" | "b", val: number) => {
    if (!value) return;
    const harmonics = value.harmonics.map((h, i) => i === idx ? { ...h, [field]: val } : h);
    const fp: FourierRadialProfile = { a0: value.a0, harmonics };
    onChange({ ...fp, radialCache: synthesizeRadialCache(fp) });
  };

  const updateA0 = (a0: number) => {
    if (!value) return;
    const fp: FourierRadialProfile = { a0, harmonics: value.harmonics };
    onChange({ ...fp, radialCache: synthesizeRadialCache(fp) });
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Generate button */}
      {imageUrl && (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => generate(imageUrl, numHarmonics)}
            disabled={generating}
            className="px-3.5 py-[7px] bg-theme-blue text-white border-none rounded-[7px] text-[12px] font-semibold"
            style={{ cursor: generating ? "default" : "pointer", opacity: generating ? 0.6 : 1 }}
          >
            {generating ? "Generating…" : "Generate Fourier Profile from Image"}
          </button>
          <span className="text-[11px] text-theme-faint">ray-cast → DFT</span>
        </div>
      )}

      {value && (
        <div className="flex gap-4 items-start">
          {/* Left: controls */}
          <div className="flex-1 flex flex-col gap-2.5">
            {/* Harmonic order slider */}
            <div>
              <div className="flex justify-between text-[11px] text-theme-muted mb-1">
                <span>Harmonic Order</span>
                <span className="font-mono text-theme-text">{numHarmonics}</span>
              </div>
              <input
                type="range" min={1} max={32} step={1} value={numHarmonics}
                onChange={(e) => handleHarmonicsChange(+e.target.value)}
                className="w-full accent-theme-blue"
              />
              <div className="text-[10px] text-theme-faint">Higher = more detail, fewer = smoother approximation</div>
            </div>

            {/* a0 — base radius */}
            <div>
              <div className="flex justify-between text-[11px] text-theme-muted mb-[3px]">
                <span>Base Radius (a₀, mm)</span>
                <span className="font-mono text-theme-text">{value.a0.toFixed(2)}</span>
              </div>
              <input
                type="range" min={0} max={50} step={0.1} value={value.a0}
                onChange={(e) => updateA0(+e.target.value)}
                className="w-full accent-theme-yellow"
              />
            </div>

            {/* Per-harmonic amplitude bars */}
            <div className="max-h-[180px] overflow-y-auto flex flex-col gap-1.5">
              {value.harmonics.map((h, idx) => {
                const amp = Math.sqrt(h.a * h.a + h.b * h.b);
                return (
                  <div key={idx} className="bg-bg3 rounded-[6px] px-2 py-1.5">
                    <div className="flex justify-between text-[10px] text-theme-muted mb-[3px]">
                      <span>n={h.n}  amp={amp.toFixed(2)}mm</span>
                      <span className="text-theme-faint">a={h.a.toFixed(2)} b={h.b.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="range" min={-30} max={30} step={0.1} value={h.a}
                        onChange={(e) => updateHarmonic(idx, "a", +e.target.value)}
                        className="flex-1 accent-theme-blue"
                        title={`n=${h.n} cosine (a)`}
                      />
                      <input
                        type="range" min={-30} max={30} step={0.1} value={h.b}
                        onChange={(e) => updateHarmonic(idx, "b", +e.target.value)}
                        className="flex-1 accent-theme-green"
                        title={`n=${h.n} sine (b)`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: polar preview */}
          <div className="shrink-0">
            <PolarPreview profile={value} />
            <div className="text-[10px] text-theme-faint text-center mt-1">
              Polar preview
            </div>
          </div>
        </div>
      )}

      {!value && !imageUrl && (
        <div className="text-[12px] text-theme-faint">
          Upload a top-view image to generate, or set dimensions to create a base circle profile.
        </div>
      )}

      {!value && imageUrl && !generating && (
        <div className="text-[12px] text-theme-faint">
          Click "Generate" to extract the radial profile from the uploaded image.
        </div>
      )}
    </div>
  );
}
