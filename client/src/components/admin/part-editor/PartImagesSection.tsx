import { useRef, useState } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { C } from "@/styles/theme";
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
    return { tier: "Full Geometry", color: C.green, desc: "Top silhouette + side profile spline + bottom contact surface" };
  }
  if (hasTop && hasSide) {
    return { tier: "Revolution Profile", color: C.blue, desc: "Top footprint extruded along a lathe/vase side-profile spline" };
  }
  if (hasTop) {
    return { tier: "Uniform Extrusion", color: C.yellow, desc: "Top silhouette extruded to uniform height" };
  }
  if (hasSide) {
    return { tier: "Profile Only", color: C.orange, desc: "Side-profile spline with circular top plan" };
  }
  return { tier: "Preset Shape", color: C.faint, desc: "No images — uses preset circle/star/ring geometry" };
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: C.muted }}>Part Images (no-background PNG)</div>
        <div
          style={{
            fontSize: 11, padding: "3px 9px", borderRadius: 99, fontWeight: 600,
            background: wf.color + "18", color: wf.color, border: `1px solid ${wf.color}44`,
          }}
        >
          {wf.tier}
        </div>
      </div>

      {/* Workflow hint */}
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 12 }}>{wf.desc}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {SLOTS.map((slot) => {
          const url = images[slot.key];
          const busy = uploading[slot.key];
          return (
            <div key={slot.key}>
              <input
                ref={inputRefs[slot.key]}
                type="file"
                accept="image/png,image/webp,image/jpeg"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(slot.key, f);
                  e.target.value = "";
                }}
              />
              <div
                style={{
                  border: `1px solid ${url ? C.blue + "55" : C.border}`,
                  borderRadius: 9, overflow: "hidden",
                  background: url ? C.bg1 : C.bg2,
                  transition: "border-color 150ms",
                }}
              >
                {/* Slot header */}
                <div style={{ padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13 }}>{slot.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: url ? C.text : C.muted }}>{slot.label}</span>
                </div>

                {/* Preview / empty state */}
                {url ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={slot.label}
                      style={{
                        width: "100%", aspectRatio: "1", objectFit: "contain",
                        display: "block", background: "#111",
                      }}
                    />
                    <button
                      onClick={() => handleRemove(slot.key)}
                      title="Remove image"
                      style={{
                        position: "absolute", top: 4, right: 4,
                        background: C.bg0 + "cc", border: `1px solid ${C.border}`,
                        borderRadius: "50%", width: 22, height: 22,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: C.red, cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      aspectRatio: "1", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 4,
                      cursor: busy ? "default" : "pointer",
                    }}
                    onClick={() => !busy && inputRefs[slot.key].current?.click()}
                  >
                    {busy ? (
                      <div style={{ fontSize: 11, color: C.muted }}>Uploading…</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 22, opacity: 0.4 }}>+</div>
                        <div style={{ fontSize: 10, color: C.faint }}>PNG, no bg</div>
                      </>
                    )}
                  </div>
                )}

                {/* Replace / upload button */}
                <div style={{ padding: "6px 8px" }}>
                  <button
                    onClick={() => !busy && inputRefs[slot.key].current?.click()}
                    disabled={busy}
                    style={{
                      width: "100%", padding: "5px 0", fontSize: 11,
                      background: url ? C.bg3 : C.blue + "22",
                      color: url ? C.muted : C.blue,
                      border: `1px solid ${url ? C.border : C.blue + "44"}`,
                      borderRadius: 5, cursor: busy ? "default" : "pointer",
                    }}
                  >
                    {busy ? "…" : url ? "Replace" : "Upload"}
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 10, color: C.faint, marginTop: 4 }}>{slot.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
