import { useParams, Link } from "react-router-dom";
import { C } from "@/styles/theme";

export function BeybladeSystemEditPage() {
  const { id = "" } = useParams<{ id: string }>();

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Link to="/admin/2d/beyblade-systems" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
            Beyblade Systems
          </Link>
          <span style={{ color: C.faint }}>›</span>
          <span style={{ color: C.text, fontSize: 12 }}>Edit</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
          Beyblade System Compositor
        </h1>
        <p style={{ color: C.faint, fontSize: 11, marginTop: 4 }}>ID: {id}</p>
      </div>

      <div
        style={{
          background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: 40, textAlign: "center", color: C.muted,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌀</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          Full Compositor — Sprint 6
        </div>
        <div style={{ fontSize: 13, maxWidth: 520, margin: "0 auto", lineHeight: 1.6, marginBottom: 24 }}>
          The Beyblade System Editor will let you assemble parts from the part library,
          set active configurations per slot, attach sub-parts, and see a live 3-panel
          2.5D preview (Side Profile / Top Down / Isometric) with computed stats.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          {[
            { label: "Slot Tabs", desc: "Bit Beast · AR · WD · Tip · Core · Casing · Sub-Parts" },
            { label: "Part Picker", desc: "Search & filter the part library per slot type" },
            { label: "Config Selector", desc: "Choose active configuration per part (e.g. Sharp / Flat)" },
            { label: "Side Profile View", desc: "Height-stacked cross-section with CP bands" },
            { label: "Top Down View", desc: "CP editing canvas with Fourier/Bezier fill" },
            { label: "Isometric View", desc: "3/4 rotating preview with spin animation" },
          ].map((item) => (
            <div key={item.label} style={{ background: C.bg2, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: C.faint }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
