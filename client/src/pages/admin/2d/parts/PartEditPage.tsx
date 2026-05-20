import { useParams, Link } from "react-router-dom";
import { C } from "@/styles/theme";

const PART_TYPE_LABEL: Record<string, string> = {
  "bit-beasts":   "Bit Beast",
  "attack-rings": "Attack Ring",
  "weight-disks": "Weight Disk",
  "sub-parts":    "Sub-Part",
  "tips":         "Tip",
  "cores":        "Core",
  "casings":      "Casing",
};

export function PartEditPage() {
  const { partType = "", id = "" } = useParams<{ partType: string; id: string }>();
  const label = PART_TYPE_LABEL[partType] ?? partType;

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Link to="/admin/2d/parts" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>Part Search</Link>
          <span style={{ color: C.faint }}>›</span>
          <Link to={`/admin/2d/parts/${partType}`} style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
            {label}s
          </Link>
          <span style={{ color: C.faint }}>›</span>
          <span style={{ color: C.text, fontSize: 12 }}>Edit</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
          Edit {label}
        </h1>
        <p style={{ color: C.faint, fontSize: 11, marginTop: 4 }}>ID: {id}</p>
      </div>

      <div
        style={{
          background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: 40, textAlign: "center", color: C.muted,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          Full Part Editor — Sprint 4
        </div>
        <div style={{ fontSize: 13, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
          The complete part editor (shape tracing from images, Bezier/Fourier profile editors,
          contact point canvas, configurations, pockets, and 2.5D preview panels) will be
          implemented in Sprints 3–5 after the shared editor primitives are built.
        </div>
        <div style={{ marginTop: 20, padding: "12px 16px", background: C.bg2, borderRadius: 8, display: "inline-block", textAlign: "left" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Coming sections:</div>
          {["Shape (Preset / Trace from image)", "Dimensions & Material", "Contact Points", "Configurations", "Pockets", "2.5D Preview (Side / Top / Isometric)"].map((s) => (
            <div key={s} style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>· {s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
