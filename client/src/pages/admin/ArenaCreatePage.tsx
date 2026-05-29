import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DEFAULT_ARENA_CONFIG, initializeWallConfig } from "@/types/arenaConfigNew";
import type { ArenaShape, ArenaTheme } from "@/types/arenaConfigNew";
import { PX_PER_CM_BASE } from "@/constants/units";
import { useArenaShapeDefs } from "@/hooks/useArenaShapeDefs";
import { useArenaThemeDefs } from "@/hooks/useArenaThemeDefs";

// Fallback in case Firestore defs aren't loaded yet
const FALLBACK_THEMES = [
  "metrocity","forest","mountains","grasslands","desert","sea",
  "futuristic","prehistoric","safari","riverbank","volcano","ice",
  "space","neon","underwater","jungle",
];

const SHAPE_ICONS: Record<string, string> = {
  circle:"⭕", square:"⬛", triangle:"🔺", pentagon:"⬠", hexagon:"⬡",
  heptagon:"⬠", octagon:"🔷", star3:"✦", star4:"✦", star5:"⭐",
  star6:"✡", star7:"✦", star8:"✦", rectangle:"▬", stadium:"🏟",
};

const FALLBACK_SHAPES: { value: string; label: string }[] = [
  { value: "circle",    label: "Circle" },
  { value: "square",    label: "Square" },
  { value: "triangle",  label: "Triangle" },
  { value: "pentagon",  label: "Pentagon" },
  { value: "hexagon",   label: "Hexagon" },
  { value: "heptagon",  label: "Heptagon" },
  { value: "octagon",   label: "Octagon" },
  { value: "star3",     label: "Star 3" },
  { value: "star4",     label: "Star 4" },
  { value: "star5",     label: "Star 5" },
  { value: "star6",     label: "Star 6" },
  { value: "star7",     label: "Star 7" },
  { value: "star8",     label: "Star 8" },
  { value: "rectangle", label: "Rectangle" },
  { value: "stadium",   label: "Stadium" },
];

export function ArenaCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:"", shape:"circle" as ArenaShape, theme:"default", widthCm:45, heightCm:45 });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]:v }));

  const { items: shapeDefs } = useArenaShapeDefs();
  const { items: themeDefs } = useArenaThemeDefs();

  const shapes = shapeDefs.length > 0
    ? shapeDefs.map(s => ({ value: s.id, label: s.label }))
    : FALLBACK_SHAPES;
  const themes = themeDefs.length > 0
    ? themeDefs.map(t => t.id)
    : FALLBACK_THEMES;

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      const widthPx  = Math.round(form.widthCm  * PX_PER_CM_BASE);
      const heightPx = Math.round(form.heightCm * PX_PER_CM_BASE);
      // Scale zone radii proportionally to the chosen arena size (Classic Stadium = 1080px wide).
      const zoneScale = widthPx / 1080;
      const docRef = await addDoc(collection(db, COLLECTIONS.ARENAS), {
        ...DEFAULT_ARENA_CONFIG,
        name: form.name.trim(),
        shape: form.shape as ArenaShape,
        theme: form.theme as ArenaTheme,
        wall: initializeWallConfig(form.shape as ArenaShape),
        width: widthPx, height: heightPx,
        arenaPixelRadius: Math.round(486 * zoneScale),
        pinkWallRadius:   Math.round(432 * zoneScale),
        ridgeRadius:      Math.round(360 * zoneScale),
        flatZoneRadius:   Math.round(216 * zoneScale),
        obstacles: [], waterBodies: [], speedPaths: [], turrets: [], portals: [], pits: [],
        createdAt: serverTimestamp(),
      });
      toast.success(`Created ${form.name}`);
      navigate(`/admin/arenas/edit/${docRef.id}`);
    } catch (err) { console.error(err); toast.error("Failed to create arena"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-[560px] mx-auto">
      <div className="mb-5">
        <Link to="/admin/arenas" className="text-faint text-xs no-underline">← Arenas</Link>
        <h1 className="text-xl font-bold text-text mt-2">New Arena</h1>
      </div>

      <div className="bg-bg2 border border-border rounded-2xl p-6 flex flex-col gap-4">
        <Input
          label="Arena Name *"
          type="text"
          value={form.name}
          onChange={e => set("name", e.target.value)}
          placeholder="e.g. Crystal Colosseum"
        />

        <div>
          <label className="block text-xs text-muted mb-1.5">Shape</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
            {shapes.map(s => (
              <button key={s.value} onClick={() => set("shape", s.value as ArenaShape)}
                className={[
                  "px-1 py-2 rounded-lg text-xs font-medium cursor-pointer flex flex-col items-center gap-0.5",
                  form.shape === s.value
                    ? "border text-text"
                    : "bg-transparent border border-border text-muted",
                ].join(" ")}
                style={form.shape === s.value ? { background: "color-mix(in srgb, var(--purple) 13%, transparent)", borderColor: "var(--purple)" } : {}}
              >
                <span className="text-base">{SHAPE_ICONS[s.value] ?? "⬡"}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {themes.map(theme => (
              <button key={theme} onClick={() => set("theme", theme)}
                className={[
                  "px-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer capitalize",
                  form.theme === theme
                    ? "border text-text"
                    : "bg-transparent border border-border text-faint",
                ].join(" ")}
                style={form.theme === theme ? { background: "color-mix(in srgb, var(--purple) 13%, transparent)", borderColor: "var(--purple)" } : {}}
              >{theme}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">Size (cm) — Width × Height</label>
          <div className="grid gap-2 items-center grid-cols-[1fr_auto_1fr]">
            <input type="number" min={10} max={100} step={1} value={form.widthCm}
              onChange={e => set("widthCm", Math.max(10, +e.target.value))}
              className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-sm text-text text-right" />
            <span className="text-faint text-xs">×</span>
            <input type="number" min={10} max={100} step={1} value={form.heightCm}
              onChange={e => set("heightCm", Math.max(10, +e.target.value))}
              className="w-full bg-bg3 border border-border rounded-md px-3 py-2 text-sm text-text text-right" />
          </div>
          <p className="text-xs text-faint mt-1">
            Stored as {Math.round(form.widthCm * PX_PER_CM_BASE)} × {Math.round(form.heightCm * PX_PER_CM_BASE)} px internally
          </p>
        </div>

        <p className="text-xs text-faint">Arena will be created with empty feature configuration. You can add obstacles, water bodies, speed paths, and more in the editor.</p>
      </div>

      <div className="flex justify-between mt-5">
        <Link to="/admin/arenas" className="px-4 py-2 border border-border text-muted rounded-lg text-xs no-underline">Cancel</Link>
        <Button variant="primary" onClick={handleSave} disabled={saving || !form.name.trim()} size="sm">
          {saving ? "Creating..." : "Create Arena"}
        </Button>
      </div>
    </div>
  );
}
