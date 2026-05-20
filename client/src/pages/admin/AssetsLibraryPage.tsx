import { Link } from "react-router-dom";
import { C } from "@/styles/theme";

const ASSET_CATEGORIES = [
  { href:"/admin/assets/arena-themes", icon:"🎨", title:"Arena Themes", desc:"Background textures and floor images for each arena theme", accent:C.purple, tag:"arena_theme_assets" },
  { href:"/admin/assets/obstacles", icon:"🪨", title:"Obstacle Sprites", desc:"Rock, pillar, barrier, and wall sprites for arena obstacles", accent:C.muted, tag:"obstacle_assets" },
  { href:"/admin/assets/turrets", icon:"🔫", title:"Turret Sprites", desc:"Turret body and projectile sprites for arena hazards", accent:C.red, tag:"turret_assets" },
  { href:"/admin/assets/water-bodies", icon:"💧", title:"Water Body Textures", desc:"Surface textures for water, lava, sand, and ice bodies", accent:"#06b6d4", tag:"water_body_assets" },
  { href:"/admin/assets/portals", icon:"🌀", title:"Portal Sprites", desc:"Portal ring and teleport effect sprites", accent:C.blue, tag:"portal_assets" },
  { href:"/admin/assets/sounds", icon:"🔊", title:"Sound Effects", desc:"Hit sounds, spin-out effects, special move audio, and ambient", accent:C.yellow, tag:"sound_assets" },
];

export function AssetsLibraryPage() {
  return (
    <div style={{ padding:24, maxWidth:900, margin:"0 auto" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text }}>Asset Library</h1>
        <p style={{ color:C.faint, fontSize:13, marginTop:4 }}>Manage sprites, textures, and sounds for all in-game elements</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {ASSET_CATEGORIES.map(cat => (
          <Link
            key={cat.href} to={cat.href}
            style={{ background:C.bg2, border:`1px solid ${cat.accent}33`, borderRadius:16, padding:20, textDecoration:"none", display:"block" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = cat.accent+"88")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = cat.accent+"33")}
          >
            <div style={{ fontSize:28, marginBottom:12 }}>{cat.icon}</div>
            <h3 style={{ color:C.text, fontWeight:600, marginBottom:4 }}>{cat.title}</h3>
            <p style={{ color:C.faint, fontSize:12, lineHeight:1.5 }}>{cat.desc}</p>
            <div style={{ marginTop:10, fontSize:11, color:C.faint, fontFamily:"monospace" }}>{cat.tag}</div>
            <div style={{ marginTop:10, fontSize:13, color:C.muted }}>Manage →</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop:28, background:C.bg2+"88", border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
        <h3 style={{ fontSize:13, fontWeight:600, color:C.muted, marginBottom:10 }}>How assets work</h3>
        <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:6, fontSize:12, color:C.faint }}>
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
