import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

interface RPGStats {
  regions: number;
  maps: number;
  npcs: number;
  dialogues: number;
  quests: number;
  storyEvents: number;
  cutscenes: number;
  items: number;
  badges: number;
  arcs: number;
  routes: number;
}

const SECTIONS = [
  { key: "arcs",        label: "Arcs",         col: COLLECTIONS.RPG_ARCS,         href: "/admin/rpg/arcs",         icon: "📖", createHref: "/admin/rpg/arcs/create" },
  { key: "routes",      label: "Routes",       col: COLLECTIONS.RPG_ROUTES,       href: "/admin/rpg/routes",       icon: "🛤️", createHref: "/admin/rpg/routes/create" },
  { key: "regions",     label: "Regions",      col: COLLECTIONS.RPG_REGIONS,      href: "/admin/rpg/regions",      icon: "🗺️", createHref: "/admin/rpg/regions/create" },
  { key: "maps",        label: "Maps",         col: COLLECTIONS.RPG_MAPS,         href: "/admin/rpg/maps",         icon: "🧭", createHref: "/admin/rpg/maps/create" },
  { key: "npcs",        label: "NPCs",         col: COLLECTIONS.RPG_NPCS,         href: "/admin/rpg/npcs",         icon: "🧑", createHref: "/admin/rpg/npcs/create" },
  { key: "dialogues",   label: "Dialogues",    col: COLLECTIONS.RPG_DIALOGUES,    href: "/admin/rpg/dialogues",    icon: "💬", createHref: "/admin/rpg/dialogues/create" },
  { key: "quests",      label: "Quests",       col: COLLECTIONS.RPG_QUESTS,       href: "/admin/rpg/quests",       icon: "📜", createHref: "/admin/rpg/quests/create" },
  { key: "storyEvents", label: "Story Events", col: COLLECTIONS.RPG_STORY_EVENTS, href: "/admin/rpg/story-events", icon: "🎭", createHref: "/admin/rpg/story-events/create" },
  { key: "items",       label: "Items",        col: COLLECTIONS.RPG_ITEMS,        href: "/admin/rpg/items",        icon: "🎒", createHref: "/admin/rpg/items/create" },
  { key: "badges",      label: "Badges",       col: COLLECTIONS.RPG_BADGES,       href: "/admin/rpg/badges",       icon: "🏅", createHref: "/admin/rpg/badges/create" },
  { key: "cutscenes",   label: "Cutscenes",    col: COLLECTIONS.RPG_CUTSCENES,    href: "/admin/rpg/cutscenes",    icon: "🎬", createHref: "/admin/rpg/cutscenes/create" },
] as const;

// Guided creation workflow for new interns / contributors
const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Create an Arc",
    desc: "An Arc is a story season (e.g. Arc 1 = Tyson vs. Blade Sharks). Set the level cap and route.",
    href: "/admin/rpg/arcs/create",
    icon: "📖",
    color: "border-blue-500 bg-blue-500/10",
    textColor: "text-blue-400",
  },
  {
    step: 2,
    title: "Create a Route",
    desc: "A Route is the player's path through the arc (e.g. tyson_route). Links a starting map and beyblade.",
    href: "/admin/rpg/routes/create",
    icon: "🛤️",
    color: "border-purple-500 bg-purple-500/10",
    textColor: "text-purple-400",
  },
  {
    step: 3,
    title: "Create a Region",
    desc: "A Region groups maps together (e.g. Beigoma City). Connect it to your arc.",
    href: "/admin/rpg/regions/create",
    icon: "🗺️",
    color: "border-green-500 bg-green-500/10",
    textColor: "text-green-400",
  },
  {
    step: 4,
    title: "Paint Maps",
    desc: "Create maps with the visual tile painter — click to paint tiles, add NPCs, exits, and event triggers without writing JSON.",
    href: "/admin/rpg/maps/create",
    icon: "🧭",
    color: "border-amber-500 bg-amber-500/10",
    textColor: "text-amber-400",
  },
  {
    step: 5,
    title: "Add NPCs",
    desc: "Create NPCs with schedule builder, structured battle config, and upload their sprite sheets and portraits.",
    href: "/admin/rpg/npcs/create",
    icon: "🧑",
    color: "border-red-500 bg-red-500/10",
    textColor: "text-red-400",
  },
  {
    step: 6,
    title: "Write Dialogue Trees",
    desc: "Add branching dialogue trees for each NPC. Link them to the NPC's defaultDialogueId.",
    href: "/admin/rpg/dialogues/create",
    icon: "💬",
    color: "border-cyan-500 bg-cyan-500/10",
    textColor: "text-cyan-400",
  },
  {
    step: 7,
    title: "Create Quests",
    desc: "Add quests with objectives and XP rewards. Link them to NPCs via questIds.",
    href: "/admin/rpg/quests/create",
    icon: "📜",
    color: "border-orange-500 bg-orange-500/10",
    textColor: "text-orange-400",
  },
  {
    step: 8,
    title: "Add Story Events",
    desc: "Trigger cutscenes, dialogues, or battles when the player walks into a tile area or interacts with objects.",
    href: "/admin/rpg/story-events/create",
    icon: "🎭",
    color: "border-pink-500 bg-pink-500/10",
    textColor: "text-pink-400",
  },
];

// Tips for interns
const INTERN_TIPS = [
  { icon: "🎨", title: "No JSON needed", desc: "Map tiles, NPC placements, exits, and battle configs all have visual editors." },
  { icon: "♻️", title: "Clone to reuse", desc: "Any map or NPC can be cloned with the Clone button — change only what's different for the new arc." },
  { icon: "👾", title: "Procedural sprites", desc: "No sprite? The NPC preview generates a pixel-art character automatically based on type and state." },
  { icon: "🎬", title: "Preview instantly", desc: "Map tile painter shows a live mini-preview as you paint. NPC state changes animate in the sidebar." },
  { icon: "🔗", title: "IDs link everything", desc: "Use consistent snake_case IDs (e.g. dlg_kai_intro). Copy them between dialogues, quests, and events." },
  { icon: "🌱", title: "Start small", desc: "One arc = one room + one NPC + one dialogue is a working episode. Expand incrementally." },
];

const EXTRA_LINKS = [
  { label: "Leveling Config",   href: "/admin/rpg/leveling",                         icon: "📈", desc: "XP curve, level caps, stat scaling" },
  { label: "Map Types",         href: "/admin/rpg/definitions/rpg_map_type_defs",    icon: "🏷️", desc: "city, route, school, park, arena…" },
  { label: "NPC Types",         href: "/admin/rpg/definitions/rpg_npc_type_defs",    icon: "🏷️", desc: "blader, rival, shopkeeper, elder…" },
  { label: "Badge Categories",  href: "/admin/rpg/definitions/rpg_badge_category_defs", icon: "🏷️", desc: "street, tournament, arc, story…" },
  { label: "Item Categories",   href: "/admin/rpg/definitions/rpg_item_category_defs",  icon: "🏷️", desc: "consumable, equipment, key-item…" },
  { label: "Quest Categories",  href: "/admin/rpg/definitions/rpg_quest_category_defs", icon: "🏷️", desc: "main, side, rival, tutorial…" },
  { label: "Event Categories",  href: "/admin/rpg/definitions/rpg_event_category_defs", icon: "🏷️", desc: "shared, perspective, rival, env…" },
  { label: "Travel Modes",      href: "/admin/rpg/definitions/rpg_travel_mode_defs",    icon: "🏷️", desc: "walk, transport, fly, boat" },
  { label: "Trigger Modes",     href: "/admin/rpg/definitions/rpg_trigger_mode_defs",   icon: "🏷️", desc: "enter, interact, step" },
  { label: "Facing Directions", href: "/admin/rpg/definitions/rpg_facing_defs",         icon: "🏷️", desc: "up, down, left, right" },
];

export default function RPGAdminDashboardPage() {
  const [stats, setStats] = useState<RPGStats>({
    regions: 0, maps: 0, npcs: 0, dialogues: 0, quests: 0,
    storyEvents: 0, cutscenes: 0, items: 0, badges: 0, arcs: 0, routes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snaps = await Promise.all(SECTIONS.map(s => getDocs(collection(db, s.col))));
        const next: Record<string, number> = {};
        SECTIONS.forEach((s, i) => { next[s.key] = snaps[i].size; });
        setStats(next as unknown as RPGStats);
        // Auto-show guide when content is sparse
        const total = Object.values(next).reduce((a, b) => a + b, 0);
        if (total < 10) setShowGuide(true);
      } catch (err) {
        console.error("RPG dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalContent = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 w-full box-border">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Admin</h1>
          <p className="text-gray-400 text-[13px] mt-1">
            Beyblade RPG story mode — {loading ? "loading…" : `${totalContent} items across ${SECTIONS.length} collections`}
          </p>
        </div>
        <button
          onClick={() => setShowGuide(g => !g)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showGuide ? "Hide Guide" : "📚 Getting Started Guide"}
        </button>
      </div>

      {/* Getting-started guide */}
      {showGuide && (
        <div className="mb-7 bg-gray-900 border border-blue-500/30 rounded-xl p-5">
          <h2 className="text-base font-bold text-blue-300 mb-1">🎮 How to Build an Episode (8 steps)</h2>
          <p className="text-gray-400 text-xs mb-4">Follow these steps in order. Each step links to a pre-filled creation page with visual editors — no JSON required.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {WORKFLOW_STEPS.map(step => (
              <Link
                key={step.step}
                to={step.href}
                className={`flex items-start gap-3 p-3 rounded-lg border ${step.color} no-underline hover:opacity-90 transition-opacity`}
              >
                <div className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border ${step.color} ${step.textColor} shrink-0 mt-0.5`}>
                  {step.step}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${step.textColor}`}>{step.icon} {step.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{step.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Intern tips */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">💡 Tips for Contributors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {INTERN_TIPS.map(tip => (
                <div key={tip.title} className="bg-gray-800 rounded-lg p-3">
                  <div className="text-sm font-medium text-white mb-1">{tip.icon} {tip.title}</div>
                  <div className="text-xs text-gray-400">{tip.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-7">
        {SECTIONS.map(s => {
          const count = (stats as unknown as Record<string, number>)[s.key];
          return (
            <div key={s.key} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <span className="text-[18px]">{s.icon}</span>
                <Link
                  to={s.createHref}
                  className="text-[10px] text-blue-400 hover:text-blue-300 no-underline font-medium"
                  title={`Create new ${s.label}`}
                >
                  + New
                </Link>
              </div>
              {loading ? (
                <div className="h-7 w-10 bg-gray-800 rounded-md my-1.5 animate-pulse" />
              ) : (
                <Link to={s.href} className="block text-[24px] font-bold text-white font-mono no-underline hover:text-blue-300 transition-colors">
                  {count}
                </Link>
              )}
              <Link to={s.href} className="text-xs text-gray-400 no-underline hover:text-gray-200">{s.label}</Link>
            </div>
          );
        })}
      </div>

      {/* Quick actions row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <Link to="/admin/rpg/maps/create" className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 rounded-xl p-3 no-underline transition-colors">
          <span className="text-xl">🗺️</span>
          <div>
            <div className="text-sm font-semibold text-amber-300">New Map</div>
            <div className="text-[10px] text-gray-500">Paint tiles visually</div>
          </div>
        </Link>
        <Link to="/admin/rpg/npcs/create" className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 hover:border-red-500 rounded-xl p-3 no-underline transition-colors">
          <span className="text-xl">🧑</span>
          <div>
            <div className="text-sm font-semibold text-red-300">New NPC</div>
            <div className="text-[10px] text-gray-500">With battle config</div>
          </div>
        </Link>
        <Link to="/admin/rpg/dialogues/create" className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500 rounded-xl p-3 no-underline transition-colors">
          <span className="text-xl">💬</span>
          <div>
            <div className="text-sm font-semibold text-cyan-300">New Dialogue</div>
            <div className="text-[10px] text-gray-500">Branching tree</div>
          </div>
        </Link>
        <Link to="/admin/rpg/quests/create" className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 hover:border-orange-500 rounded-xl p-3 no-underline transition-colors">
          <span className="text-xl">📜</span>
          <div>
            <div className="text-sm font-semibold text-orange-300">New Quest</div>
            <div className="text-[10px] text-gray-500">With objectives</div>
          </div>
        </Link>
      </div>

      {/* Definitions / config */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">⚙️ Definitions & Configuration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {EXTRA_LINKS.map(l => (
          <Link
            key={l.href}
            to={l.href}
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3 no-underline hover:border-gray-600 transition-colors"
          >
            <span className="text-lg">{l.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{l.label}</div>
              <div className="text-[10px] text-gray-500 truncate">{l.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
