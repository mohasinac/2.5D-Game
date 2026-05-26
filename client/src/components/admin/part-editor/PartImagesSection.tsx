import React, { useRef, useState } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { PartImages } from "@/types/beybladeSystem";

type ViewKey = "topView" | "sideView" | "bottomView";

interface Slot {
  key: ViewKey;
  label: string;
  icon: string;
  desc: string;
}

const SLOTS: Slot[] = [
  { key: "topView",    label: "Top View",    icon: "⬆️", desc: "Plan silhouette — primary shape source" },
  { key: "sideView",   label: "Side View",   icon: "➡️", desc: "Height profile (vase / taper curve)" },
  { key: "bottomView", label: "Bottom View", icon: "⬇️", desc: "Floor-contact surface (tips, bowls)" },
];

function workflowLabel(images: PartImages): { tier: string; color: string; desc: string } {
  const hasTop    = !!images.topView;
  const hasSide   = !!images.sideView;
  const hasBottom = !!images.bottomView;

  if (hasTop && hasSide && hasBottom) {
    return { tier: "Full Geometry", color: "var(--green)", desc: "Top silhouette + side profile spline + bottom contact surface" };
  }
  if (hasTop && hasSide) {
    return { tier: "Revolution Profile", color: "var(--blue)", desc: "Top footprint extruded along a lathe/vase side-profile spline" };
  }
  if (hasTop) {
    return { tier: "Uniform Extrusion", color: "var(--yellow)", desc: "Top silhouette extruded to uniform height" };
  }
  if (hasSide) {
    return { tier: "Profile Only", color: "var(--orange)", desc: "Side-profile spline with circular top plan" };
  }
  return { tier: "Preset Shape", color: "var(--faint)", desc: "No images — uses preset circle/star/ring geometry" };
}

interface Props {
  images: PartImages;
  onChange: (images: PartImages) => void;
  storagePath: string;
}

export function PartImagesSection({ images, onChange, storagePath }: Props) {
  const [uploading, setUploading] = useState<Record<ViewKey, boolean>>({ topView: false, sideView: false, bottomView: false });
  const inputRefs = { topView: useRef<HTMLInputElement>(null), sideView: useRef<HTMLInputElement>(null), bottomView: useRef<HTMLInputElement>(null) };

  const handleFile = async (key: ViewKey, file: File) => {
    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const viewName = key === "topView" ? "top" : key === "sideView" ? "side" : "bottom";
      const path = `${storagePath}/${viewName}.png`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file, { contentType: "image/png" });
      const url = await getDownloadURL(fileRef);
      onChange({ ...images, [key]: url });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  const handleRemove = async (key: ViewKey) => {
    const url = images[key];
    if (!url) return;
    try {
      const viewName = key === "topView" ? "top" : key === "sideView" ? "side" : "bottom";
      const fileRef = storageRef(storage, `${storagePath}/${viewName}.png`);
      await deleteObject(fileRef).catch(() => {});
    } catch {}
    onChange({ ...images, [key]: undefined });
  };

  const wf = workflowLabel(images);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-[12px] text-theme-muted">Part Images (no-background PNG)</div>
        <div
          className="text-[11px] px-[9px] py-[3px] rounded-full font-semibold"
          style={{ "--wc": wf.color, color: wf.color, background: `color-mix(in srgb, ${wf.color} 9%, transparent)`, border: `1px solid color-mix(in srgb, ${wf.color} 27%, transparent)` } as React.CSSProperties}
        >
          {wf.tier}
        </div>
      </div>

      {/* Workflow hint */}
      <div className="text-[11px] text-theme-faint mb-3">{wf.desc}</div>

      <div className="grid grid-cols-3 gap-2.5">
        {SLOTS.map((slot) => {
          const url = images[slot.key];
          const busy = uploading[slot.key];
          return (
            <div key={slot.key}>
              <input
                ref={inputRefs[slot.key]}
                type="file"
                accept="image/png,image/webp,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(slot.key, f);
                  e.target.value = "";
                }}
              />
              <div
                className={`rounded-[9px] overflow-hidden transition-[border-color] duration-150 border ${url ? "border-[rgba(59,130,246,0.33)] bg-bg1" : "border-border-c bg-bg2"}`}
              >
                {/* Slot header */}
                <div className="px-2.5 py-[7px] flex items-center gap-1.5 border-b border-border-c">
                  <span className="text-[13px]">{slot.icon}</span>
                  <span className={`text-[12px] font-semibold ${url ? "text-theme-text" : "text-theme-muted"}`}>{slot.label}</span>
                </div>

                {/* Preview / empty state */}
                {url ? (
                  <div className="relative">
                    <img
                      src={url}
                      alt={slot.label}
                      className="w-full aspect-square object-contain block bg-[#111]"
                    />
                    <button
                      onClick={() => handleRemove(slot.key)}
                      title="Remove image"
                      className="absolute top-1 right-1 rounded-full w-[22px] h-[22px] flex items-center justify-center text-[11px] text-theme-red cursor-pointer bg-[rgba(5,12,24,0.80)] border border-border-c"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className={`aspect-square flex flex-col items-center justify-center gap-1 ${busy ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => !busy && inputRefs[slot.key].current?.click()}
                  >
                    {busy ? (
                      <div className="text-[11px] text-theme-muted">Uploading…</div>
                    ) : (
                      <>
                        <div className="text-[22px] opacity-40">+</div>
                        <div className="text-[10px] text-theme-faint">PNG, no bg</div>
                      </>
                    )}
                  </div>
                )}

                {/* Replace / upload button */}
                <div className="px-2 py-1.5">
                  <button
                    onClick={() => !busy && inputRefs[slot.key].current?.click()}
                    disabled={busy}
                    className={`w-full py-[5px] text-[11px] rounded-[5px] border ${busy ? "cursor-default" : "cursor-pointer"} ${url ? "bg-bg3 text-theme-muted border-border-c" : "bg-blue-13 text-theme-blue border-[rgba(59,130,246,0.27)]"}`}
                  >
                    {busy ? "…" : url ? "Replace" : "Upload"}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-theme-faint mt-1">{slot.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
