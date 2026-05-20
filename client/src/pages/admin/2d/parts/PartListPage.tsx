import { Link, useParams } from "react-router-dom";
import { C } from "@/styles/theme";

const PART_TYPE_META: Record<string, { label: string; icon: string; desc: string }> = {
  "bit-beasts":    { label: "Bit Beasts",    icon: "🐉", desc: "Special move identity pieces placed on top of the Beyblade." },
  "attack-rings":  { label: "Attack Rings",  icon: "⚔️", desc: "Blade contact geometry — defines attack patterns and CP layout." },
  "weight-disks":  { label: "Weight Disks",  icon: "🪨", desc: "Spin inertia, mass distribution, and stability." },
  "sub-parts":     { label: "Sub-Parts",     icon: "🔩", desc: "Free-spin, partial-slip, ratchet, and fixed attachment rings." },
  "tips":          { label: "Tips",          icon: "🔺", desc: "Movement pattern, floor contact shape, and grip factor." },
  "cores":         { label: "Cores",         icon: "⚙️", desc: "Engine gear, clutch release, and gimmick core mechanisms." },
  "casings":       { label: "Casings",       icon: "🛡️", desc: "Body shell, tip slot, and core slot housing." },
};

export function PartListPage() {
  const { partType = "" } = useParams<{ partType: string }>();
  const meta = PART_TYPE_META[partType];

  if (!meta) {
    return (
      <div style={{ padding: 32, color: C.muted }}>
        Unknown part type: <code>{partType}</code>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Link to="/admin/2d/parts" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
              Part Search
            </Link>
            <span style={{ color: C.faint }}>›</span>
            <span style={{ color: C.text, fontSize: 12 }}>{meta.label}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
            {meta.icon} {meta.label}
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{meta.desc}</p>
        </div>
        <Link
          to={`/admin/2d/parts/${partType}/create`}
          style={{
            padding: "9px 18px", background: C.blue, color: "#fff",
            borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600,
          }}
        >
          + New Part
        </Link>
      </div>

      <div
        style={{
          background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: 32, textAlign: "center", color: C.muted,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>{meta.icon}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          {meta.label} library coming in Sprint 4
        </div>
        <div style={{ fontSize: 13, maxWidth: 400, margin: "0 auto" }}>
          The part CRUD pages will be built after the shared editor primitives
          (shape tracer, Bezier editor, contact-point canvas) are ready.
        </div>
        <Link
          to={`/admin/2d/parts/${partType}/create`}
          style={{
            display: "inline-block", marginTop: 20, padding: "8px 16px",
            background: C.blue + "22", color: C.blue, borderRadius: 7,
            textDecoration: "none", fontSize: 13,
            border: `1px solid ${C.blue}44`,
          }}
        >
          Try placeholder create form →
        </Link>
      </div>
    </div>
  );
}
