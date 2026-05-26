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
  { key: "regions",     label: "Regions",      col: COLLECTIONS.RPG_REGIONS,      href: "/admin/rpg/regions",      icon: "🗺️" },
  { key: "maps",        label: "Maps",         col: COLLECTIONS.RPG_MAPS,         href: "/admin/rpg/maps",         icon: "🧭" },
  { key: "npcs",        label: "NPCs",         col: COLLECTIONS.RPG_NPCS,         href: "/admin/rpg/npcs",         icon: "🧑" },
  { key: "dialogues",   label: "Dialogues",    col: COLLECTIONS.RPG_DIALOGUES,    href: "/admin/rpg/dialogues",    icon: "💬" },
  { key: "quests",      label: "Quests",       col: COLLECTIONS.RPG_QUESTS,       href: "/admin/rpg/quests",       icon: "📜" },
  { key: "storyEvents", label: "Story Events", col: COLLECTIONS.RPG_STORY_EVENTS, href: "/admin/rpg/story-events", icon: "🎭" },
  { key: "cutscenes",   label: "Cutscenes",    col: COLLECTIONS.RPG_CUTSCENES,    href: "/admin/rpg/cutscenes",    icon: "🎬" },
  { key: "items",       label: "Items",        col: COLLECTIONS.RPG_ITEMS,        href: "/admin/rpg/items",        icon: "🎒" },
  { key: "badges",      label: "Badges",       col: COLLECTIONS.RPG_BADGES,       href: "/admin/rpg/badges",       icon: "🏅" },
  { key: "arcs",        label: "Arcs",         col: COLLECTIONS.RPG_ARCS,         href: "/admin/rpg/arcs",         icon: "📖" },
  { key: "routes",      label: "Routes",       col: COLLECTIONS.RPG_ROUTES,       href: "/admin/rpg/routes",       icon: "🛤️" },
] as const;

const EXTRA_LINKS = [
  { label: "Scenario Generator", href: "/admin/rpg/scenario-generator", icon: "✨", desc: "Generate RPG content from JSON scripts" },
  { label: "Leveling Config", href: "/admin/rpg/leveling", icon: "📈", desc: "XP curve and level caps" },
  { label: "Map Types",         href: "/admin/rpg/definitions/map-types",         icon: "🏷️", desc: "city, route, school, park, etc." },
  { label: "NPC Types",         href: "/admin/rpg/definitions/npc-types",         icon: "🏷️", desc: "blader, rival, shopkeeper, etc." },
  { label: "Badge Categories",  href: "/admin/rpg/definitions/badge-categories",  icon: "🏷️", desc: "street, tournament, arc, etc." },
  { label: "Item Categories",   href: "/admin/rpg/definitions/item-categories",   icon: "🏷️", desc: "consumable, key-item, etc." },
  { label: "Quest Categories",  href: "/admin/rpg/definitions/quest-categories",  icon: "🏷️", desc: "main, side, rival, etc." },
  { label: "Event Categories",  href: "/admin/rpg/definitions/event-categories",  icon: "🏷️", desc: "shared, perspective, rival, etc." },
  { label: "Travel Modes",      href: "/admin/rpg/definitions/travel-modes",      icon: "🏷️", desc: "walk, transport, fly, boat" },
];

export default function RPGAdminDashboardPage() {
  const [stats, setStats] = useState<RPGStats>({
    regions: 0, maps: 0, npcs: 0, dialogues: 0, quests: 0,
    storyEvents: 0, cutscenes: 0, items: 0, badges: 0, arcs: 0, routes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snaps = await Promise.all(SECTIONS.map(s => getDocs(collection(db, s.col))));
        const next: Record<string, number> = {};
        SECTIONS.forEach((s, i) => { next[s.key] = snaps[i].size; });
        setStats(next as unknown as RPGStats);
      } catch (err) {
        console.error("RPG dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 w-full box-border">
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-white">RPG Admin</h1>
        <p className="text-gray-400 text-[13px] mt-1">Beyblade RPG content management</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-7">
        {SECTIONS.map(s => (
          <Link
            key={s.key}
            to={s.href}
            className="block bg-gray-900 border border-gray-800 rounded-xl p-4 no-underline hover:border-gray-600 transition-colors"
          >
            <div className="text-[22px] mb-2">{s.icon}</div>
            {loading ? (
              <div className="h-7 w-12 bg-gray-800 rounded-md mb-1 animate-pulse" />
            ) : (
              <div className="text-[24px] font-bold text-white font-mono">
                {(stats as unknown as Record<string, number>)[s.key]}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-gray-300 mb-3">Configuration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXTRA_LINKS.map(l => (
          <Link
            key={l.href}
            to={l.href}
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 no-underline hover:border-gray-600 transition-colors"
          >
            <span className="text-xl">{l.icon}</span>
            <div>
              <div className="text-sm font-medium text-white">{l.label}</div>
              <div className="text-xs text-gray-500">{l.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
