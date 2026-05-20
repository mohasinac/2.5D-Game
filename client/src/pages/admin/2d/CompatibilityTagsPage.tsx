import { C } from "@/styles/theme";

export function CompatibilityTagsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Compatibility Tags</h1>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
          Audit and rename tags used across all part collections.
          Tags control which parts can be assembled together.
        </p>
      </div>

      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 32, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>How Compatibility Works</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { field: "compatibilityTags", color: C.blue, desc: "Tags this part carries (e.g. onlygen2, dual_layer, takara_only)" },
            { field: "requiredCompatibility", color: C.green, desc: "Other parts MUST have at least one of these tags to be paired" },
            { field: "excludedCompatibility", color: C.red, desc: "Other parts with ANY of these tags cannot be paired" },
          ].map((row) => (
            <div key={row.field} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <code style={{ fontSize: 11, color: row.color, background: row.color + "18", padding: "2px 7px", borderRadius: 4, flexShrink: 0, marginTop: 2 }}>
                {row.field}
              </code>
              <div style={{ fontSize: 13, color: C.muted }}>{row.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: 32, textAlign: "center", color: C.muted,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 12 }}>🏷️</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          Tag Audit Page — Sprint 8
        </div>
        <div style={{ fontSize: 13, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
          This page will aggregate all compatibility tags in use across all part collections
          and allow renaming or deleting them without going into the Firestore console.
          Tags are free-form — they emerge from whatever strings admins add to parts.
        </div>
      </div>
    </div>
  );
}
