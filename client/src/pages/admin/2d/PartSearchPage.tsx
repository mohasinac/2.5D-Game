import { useState } from "react";
import { Link } from "react-router-dom";
import { C } from "@/styles/theme";

const PART_TYPES = [
  { label: "All", value: "all" },
  { label: "AR", value: "attack-rings" },
  { label: "WD", value: "weight-disks" },
  { label: "Tip", value: "tips" },
  { label: "Core", value: "cores" },
  { label: "Casing", value: "casings" },
  { label: "Sub-Part", value: "sub-parts" },
  { label: "Bit Beast", value: "bit-beasts" },
];

const PART_LINKS = [
  { slug: "bit-beasts", label: "Bit Beasts", icon: "🐉", desc: "Special move identity pieces" },
  { slug: "attack-rings", label: "Attack Rings", icon: "⚔️", desc: "Blade contact geometry" },
  { slug: "weight-disks", label: "Weight Disks", icon: "🪨", desc: "Spin inertia and mass distribution" },
  { slug: "sub-parts", label: "Sub-Parts", icon: "🔩", desc: "Free-spin, ratchet, and slip ring attachments" },
  { slug: "tips", label: "Tips", icon: "🔺", desc: "Movement pattern and floor contact" },
  { slug: "cores", label: "Cores", icon: "⚙️", desc: "Engine gear and gimmick cores" },
  { slug: "casings", label: "Casings", icon: "🛡️", desc: "Body shell and tip-slot housing" },
];

export function PartSearchPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const visibleLinks =
    typeFilter === "all"
      ? PART_LINKS
      : PART_LINKS.filter((p) => p.slug === typeFilter);

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Part Search</h1>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
          Browse and search the modular 2.5D part library.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search parts by name..."
          style={{
            flex: 1, minWidth: 200, padding: "8px 12px", background: C.bg2,
            border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13,
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {PART_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              style={{
                padding: "7px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer",
                background: typeFilter === t.value ? C.blue : C.bg2,
                color: typeFilter === t.value ? "#fff" : C.muted,
                border: `1px solid ${typeFilter === t.value ? C.blue : C.border}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {visibleLinks.map((pt) => (
          <Link
            key={pt.slug}
            to={`/admin/2d/parts/${pt.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "16px 18px", cursor: "pointer", transition: "border-color 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.blue + "88")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{pt.icon}</div>
              <div style={{ fontWeight: 600, color: C.text, fontSize: 14, marginBottom: 4 }}>{pt.label}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{pt.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {query && (
        <div style={{ marginTop: 24, color: C.muted, fontSize: 13 }}>
          Full-text search across all part collections will be implemented in Sprint 4.
        </div>
      )}
    </div>
  );
}
