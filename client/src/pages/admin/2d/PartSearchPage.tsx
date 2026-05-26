import { useState } from "react";
import { Link } from "react-router-dom";

const PART_TYPES = [
  { label: "All", value: "all" },
  { label: "AR", value: "attack-rings" },
  { label: "WD", value: "weight-disks" },
  { label: "Tip", value: "tips" },
  { label: "Core", value: "cores" },
  { label: "Casing", value: "casings" },
  { label: "Sub-Part", value: "sub-parts" },
  { label: "Bit Beast", value: "bit-beasts" },
  { label: "Spin Track", value: "spin-tracks" },
  { label: "Gear", value: "gears" },
];

const PART_LINKS = [
  { slug: "bit-beasts",   label: "Bit Beasts",   icon: "🐉", desc: "Special move identity pieces" },
  { slug: "attack-rings", label: "Attack Rings",  icon: "⚔️", desc: "Blade contact geometry" },
  { slug: "weight-disks", label: "Weight Disks",  icon: "🪨", desc: "Spin inertia and mass distribution" },
  { slug: "sub-parts",    label: "Sub-Parts",     icon: "🔩", desc: "Free-spin, ratchet, and switch mechanisms" },
  { slug: "tips",         label: "Tips",          icon: "🔺", desc: "Movement pattern and floor contact" },
  { slug: "cores",        label: "Cores",         icon: "⚙️", desc: "Engine gear and gimmick cores" },
  { slug: "casings",      label: "Casings",       icon: "🛡️", desc: "Body shell and tip-slot housing" },
  { slug: "spin-tracks",  label: "Spin Tracks",   icon: "📏", desc: "Height piece between tip and fusion wheel" },
  { slug: "gears",        label: "Gears",         icon: "⚙️", desc: "Swappable archetype-shifting gear attachments" },
];

export function PartSearchPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const visibleLinks =
    typeFilter === "all"
      ? PART_LINKS
      : PART_LINKS.filter((p) => p.slug === typeFilter);

  return (
    <div className="p-8 max-w-[900px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-theme-text m-0">Part Search</h1>
        <p className="text-theme-muted text-[13px] mt-1">
          Browse and search the modular 2.5D part library.
        </p>
      </div>

      <div className="flex gap-2.5 mb-5 flex-wrap">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search parts by name..."
          className="flex-1 min-w-[200px] px-3 py-2 bg-bg2 border border-border-c rounded-[7px] text-theme-text text-[13px]"
        />
        <div className="flex gap-1">
          {PART_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-[7px] rounded-[7px] text-[12px] cursor-pointer border ${typeFilter === t.value ? "bg-theme-blue text-white border-theme-blue" : "bg-bg2 text-theme-muted border-border-c"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {visibleLinks.map((pt) => (
          <Link
            key={pt.slug}
            to={`/admin/2d/parts/${pt.slug}`}
            className="no-underline"
          >
            <div
              className="bg-bg1 border border-border-c rounded-[10px] px-[18px] py-4 cursor-pointer transition-[border-color] duration-150 hover:border-blue-40"
            >
              <div className="text-[24px] mb-2">{pt.icon}</div>
              <div className="font-semibold text-theme-text text-[14px] mb-1">{pt.label}</div>
              <div className="text-theme-muted text-[12px]">{pt.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {query && (
        <div className="mt-6 text-theme-muted text-[13px]">
          Full-text search across all part collections will be implemented in Sprint 4.
        </div>
      )}
    </div>
  );
}
