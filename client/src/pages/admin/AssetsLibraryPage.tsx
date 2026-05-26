import React from "react";
import { Link } from "react-router-dom";
import { C } from "@/styles/theme";

const ASSET_CATEGORIES = [
  { href:"/admin/assets/arena-themes", icon:"🎨", title:"Arena Themes", desc:"Background textures and floor images for each arena theme", accent:C.purple, tag:"arena_theme_assets" },
  { href:"/admin/assets/obstacles", icon:"🪨", title:"Obstacle Sprites", desc:"Rock, pillar, barrier, and wall sprites for arena obstacles", accent:C.muted, tag:"obstacle_assets" },
  { href:"/admin/assets/turrets", icon:"🔫", title:"Turret Sprites", desc:"Turret body and projectile sprites for arena hazards", accent:C.red, tag:"turret_assets" },
  { href:"/admin/assets/water-bodies", icon:"💧", title:"Water Body Textures", desc:"Surface textures for water, lava, sand, and ice bodies", accent:"#06b6d4", tag:"water_body_assets" },
  { href:"/admin/assets/portals", icon:"🌀", title:"Portal Sprites", desc:"Portal ring and teleport effect sprites", accent:C.blue, tag:"portal_assets" },
  { href:"/admin/assets/sounds", icon:"🔊", title:"Sound Effects", desc:"Hit sounds, spin-out effects, special move audio, and ambient", accent:C.yellow, tag:"sound_assets" },
  { href:"/admin/assets/particle-presets", icon:"✨", title:"Particle Presets", desc:"PixiJS emitter configs for combo visual effects — referenced by particlePresetId", accent:C.orange, tag:"particle_presets" },
];

export function AssetsLibraryPage() {
  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-text">Asset Library</h1>
        <p className="text-faint text-xs mt-1">Manage sprites, textures, and sounds for all in-game elements</p>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        {ASSET_CATEGORIES.map(cat => (
          <Link
            key={cat.href} to={cat.href}
            className="bg-bg2 rounded-2xl p-5 no-underline block transition-colors border [border-color:color-mix(in_srgb,var(--accent-color)_20%,transparent)]"
            style={{ "--accent-color": cat.accent } as React.CSSProperties}
            onMouseEnter={e => (e.currentTarget.style.borderColor = cat.accent + "88")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "")}
          >
            <div className="text-3xl mb-3">{cat.icon}</div>
            <h3 className="text-text font-semibold mb-1">{cat.title}</h3>
            <p className="text-faint text-xs leading-relaxed">{cat.desc}</p>
            <div className="mt-2.5 text-xs text-faint font-mono">{cat.tag}</div>
            <div className="mt-2.5 text-sm text-muted">Manage →</div>
          </Link>
        ))}
      </div>

      <div className="mt-7 bg-bg2/[.53] border border-border rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-muted mb-2.5">How assets work</h3>
        <ul className="list-none p-0 flex flex-col gap-1.5 text-xs text-faint">
          <li>• Upload PNG or JPG images; audio as MP3 or OGG.</li>
          <li>• Tag each asset to map it to a specific arena theme, obstacle type, or effect.</li>
          <li>• The PixiJS renderer loads assets by tag at runtime — no code changes needed.</li>
          <li>• Delete removes from Firebase Storage and Firestore simultaneously.</li>
          <li>• Recommended sizes: obstacles 128×128px, arena themes 1080×1080px, portals 64×64px.</li>
        </ul>
      </div>
    </div>
  );
}
