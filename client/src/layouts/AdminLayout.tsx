import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Swords, Shield, Palette, Trophy, Users, BarChart3, FlaskConical,
  Settings, Search, BookOpen, Tag, Layers, Cpu, Box, Circle, Disc, Wrench,
  Radio, Gamepad2, LogOut, Zap, List, Sparkles, Target, Map, Link2, Film, Sliders, Brain,
  type LucideIcon,
} from "lucide-react";

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  beyblades: "Beyblades",
  "element-types": "Element Types",
  arenas: "Arenas",
  combos: "Combos",
  "special-moves": "Special Moves",
  "turret-attack-types": "Turret Attack Types",
  "arena-feature-configs": "Arena Feature Configs",
  "bey-link-configs": "BeyLink Configs",
  "part-materials": "Part Materials",
  "combo-effects": "Combo Effects",
  "animation-presets": "Animation Presets",
  "round-modifiers": "Round Modifiers",
  "behavior-defs": "Behavior Defs",
  "mechanic-defs": "Mechanic Defs",
  "gimmick-defs": "Gimmick Defs",
  "geometry-defs": "Geometry Defs",
  "stat-defs": "Stat Defs",
  "special-interaction-defs": "Special Interactions",
  "tip-shape-defs": "Tip Shape Defs",
  "core-gimmick-defs": "Core Gimmick Defs",
  "attack-type-defs": "Attack Type Defs",
  "arena-theme-defs": "Arena Theme Defs",
  "arena-shape-defs": "Arena Shape Defs",
  "bowl-profile-defs": "Bowl Profile Defs",
  "trigger-type-defs": "Trigger Type Defs",
  "stat-event-defs": "Stat Event Defs",
  "part-layer-defs": "Part Layer Defs",
  "ai-battles": "AI Battles",
  "arena-systems": "Arena Systems",
  "arena-floor-groups": "Floor Groups",
  assets: "Assets",
  tournaments: "Tournaments",
  users: "Users",
  stats: "Statistics",
  "arena-test": "Arena Test",
  settings: "Settings",
  "2d": "2.5D",
  parts: "Parts",
  "bit-beasts": "Bit Beasts",
  "attack-rings": "Attack Rings",
  "weight-disks": "Weight Disks",
  "sub-parts": "Sub-Parts",
  tips: "Tips",
  cores: "Cores",
  casings: "Casings",
  "spin-tracks": "Spin Tracks",
  "beyblade-systems": "Beyblade Systems",
  "compatibility-tags": "Compat. Tags",
  create: "Create",
  edit: "Edit",
  new: "New",
};

function AdminBreadcrumb() {
  const location = useLocation();
  const segments = location.pathname.replace(/^\//, "").split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += "/" + seg;
    const label = BREADCRUMB_LABELS[seg] ?? seg;
    crumbs.push({ label, path });
  }
  return (
    <span className="flex items-center gap-1">
      {crumbs.map((c, i) => (
        <span key={c.path} className="flex items-center gap-1">
          {i > 0 && <span className="text-theme-faint text-[10px]">›</span>}
          <span className={i === crumbs.length - 1 ? "text-theme-text" : "text-theme-faint"}>{c.label}</span>
        </span>
      ))}
    </span>
  );
}

const navItems = [
  { to: "/admin",                    label: "Dashboard",    Icon: LayoutDashboard, end: true },
  { to: "/admin/beyblades",          label: "Beyblades",    Icon: Swords },
  { to: "/admin/element-types",      label: "Element Types", Icon: Zap },
  { to: "/admin/arenas",             label: "Arenas",       Icon: Shield },
  { to: "/admin/arena-systems",      label: "Arena Systems",Icon: Layers },
  { to: "/admin/arena-floor-groups", label: "Floor Groups", Icon: Box },
  { to: "/admin/assets",             label: "Assets",       Icon: Palette },
  { to: "/admin/tournaments",        label: "Tournaments",  Icon: Trophy },
  { to: "/admin/users",              label: "Users",        Icon: Users },
  { to: "/admin/stats",              label: "Statistics",   Icon: BarChart3 },
  { to: "/admin/arena-test",         label: "Arena Test",   Icon: FlaskConical },
  { to: "/admin/ai-battles",         label: "AI Battles",   Icon: Gamepad2 },
  { to: "/admin/settings",           label: "Settings",     Icon: Settings },
];

const catalogItems = [
  { to: "/admin/combos",                label: "Combos",               Icon: List },
  { to: "/admin/special-moves",         label: "Special Moves",        Icon: Sparkles },
  { to: "/admin/turret-attack-types",   label: "Turret Attack Types",  Icon: Target },
  { to: "/admin/arena-feature-configs", label: "Arena Feature Configs", Icon: Map },
  { to: "/admin/bey-link-configs",      label: "BeyLink Configs",      Icon: Link2 },
  { to: "/admin/part-materials",        label: "Part Materials",       Icon: FlaskConical },
  { to: "/admin/combo-effects",         label: "Combo Effects",        Icon: Zap },
  { to: "/admin/animation-presets",     label: "Animation Presets",    Icon: Film },
  { to: "/admin/round-modifiers",       label: "Round Modifiers",      Icon: Sliders },
  { to: "/admin/behavior-defs",         label: "Behavior Defs",        Icon: Brain },
  { to: "/admin/mechanic-defs",         label: "Mechanic Defs",        Icon: Wrench },
  { to: "/admin/gimmick-defs",          label: "Gimmick Defs",         Icon: Sparkles },
  { to: "/admin/geometry-defs",         label: "Geometry Defs",        Icon: Circle },
  { to: "/admin/stat-defs",             label: "Stat Defs",            Icon: BarChart3 },
];

const presetDefItems = [
  { to: "/admin/tip-shape-defs",      label: "Tip Shapes",       Icon: Circle },
  { to: "/admin/core-gimmick-defs",   label: "Core Gimmicks",    Icon: Cpu },
  { to: "/admin/attack-type-defs",    label: "Attack Types",     Icon: Swords },
  { to: "/admin/arena-theme-defs",    label: "Arena Themes",     Icon: Palette },
  { to: "/admin/arena-shape-defs",    label: "Arena Shapes",     Icon: Box },
  { to: "/admin/bowl-profile-defs",   label: "Bowl Profiles",    Icon: Disc },
  { to: "/admin/trigger-type-defs",   label: "Trigger Types",    Icon: Zap },
  { to: "/admin/stat-event-defs",     label: "Stat Events",      Icon: BarChart3 },
  { to: "/admin/part-layer-defs",     label: "Part Layers",      Icon: Layers },
  { to: "/admin/special-interaction-defs", label: "Special Interactions", Icon: Link2 },
];

const partLibraryItems = [
  { to: "/admin/2d/parts/bit-beasts",   label: "Bit Beasts",   Icon: Layers },
  { to: "/admin/2d/parts/attack-rings", label: "Attack Rings", Icon: Circle },
  { to: "/admin/2d/parts/weight-disks", label: "Weight Disks", Icon: Disc },
  { to: "/admin/2d/parts/sub-parts",    label: "Sub-Parts",    Icon: Wrench },
  { to: "/admin/2d/parts/tips",         label: "Tips",         Icon: Box },
  { to: "/admin/2d/parts/cores",        label: "Cores",        Icon: Cpu },
  { to: "/admin/2d/parts/casings",      label: "Casings",      Icon: Shield },
  { to: "/admin/2d/parts/spin-tracks",  label: "Spin Tracks",  Icon: Disc },
];

function NavItem({
  to, label, Icon, end, indent = false, collapsed = false,
}: {
  to: string; label: string; Icon: LucideIcon; end?: boolean; indent?: boolean; collapsed?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) => cn(
        "flex items-center rounded-lg text-[13px] no-underline transition-colors border",
        collapsed ? "justify-center py-2 px-0 gap-0" : indent ? "py-1.5 px-3 pl-7 gap-2.5 text-[12px]" : "py-2 px-3 gap-2.5",
        isActive
          ? "bg-blue-13 text-theme-text border-blue-27"
          : "bg-transparent text-theme-muted border-transparent hover:bg-bg2",
      )}
    >
      <Icon size={indent ? 13 : 15} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

export function AdminLayout() {
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [libExpanded, setLibExpanded] = useState(() => location.pathname.startsWith("/admin/2d"));
  const [catalogExpanded, setCatalogExpanded] = useState(() => {
    const catalogPaths = ["/admin/combos", "/admin/special-moves", "/admin/turret-attack-types", "/admin/arena-feature-configs", "/admin/bey-link-configs", "/admin/part-materials", "/admin/combo-effects", "/admin/animation-presets", "/admin/round-modifiers", "/admin/behavior-defs"];
    return catalogPaths.some(p => location.pathname.startsWith(p));
  });
  const [presetDefsExpanded, setPresetDefsExpanded] = useState(() => {
    const presetPaths = ["/admin/tip-shape-defs", "/admin/core-gimmick-defs", "/admin/attack-type-defs", "/admin/arena-theme-defs", "/admin/arena-shape-defs", "/admin/bowl-profile-defs", "/admin/trigger-type-defs", "/admin/stat-event-defs", "/admin/part-layer-defs"];
    return presetPaths.some(p => location.pathname.startsWith(p));
  });
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem("admin.sidebar") === "1" || window.innerWidth < 768
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setCollapsed(true);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((c) => {
      if (window.innerWidth >= 768) localStorage.setItem("admin.sidebar", c ? "0" : "1");
      return !c;
    });
  };

  const handleSignOut = async () => {
    await signOutUser();
    toast.success("Signed out");
    navigate("/login");
  };

  const is2dSection = location.pathname.startsWith("/admin/2d");

  return (
    <div className="flex h-screen bg-bg0 text-theme-text overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col shrink-0 bg-bg1 border-r border-border-c overflow-hidden transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
      )}>
        {/* Logo */}
        <div className={cn(
          "border-b border-border-c flex",
          collapsed ? "justify-center py-5 px-0" : "justify-start py-5 px-6",
        )}>
          <Link to="/" className="flex items-center gap-3 no-underline">
            <span className="text-2xl shrink-0">🌀</span>
            {!collapsed && (
              <div>
                <div className="font-bold text-theme-text text-[13px]">Beyblade Game</div>
                <div className="text-theme-muted text-[11px]">Admin Panel</div>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className={cn(
          "flex-1 overflow-y-auto flex flex-col gap-0.5",
          collapsed ? "py-2 px-1" : "p-3",
        )}>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} end={item.end} collapsed={collapsed} />
          ))}

          {/* Catalog Section */}
          {!collapsed && (
            <div className="mt-3 mb-0.5">
              <div className="text-[10px] font-bold text-theme-faint tracking-[0.08em] px-3 pt-1 pb-0.5 uppercase">
                Catalog
              </div>
            </div>
          )}
          {!collapsed ? (
            <>
              <button
                onClick={() => setCatalogExpanded(e => !e)}
                className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] bg-transparent border-none cursor-pointer text-theme-muted w-full text-left hover:bg-bg2 transition-colors"
              >
                <List size={15} />
                <span className="flex-1">Catalog Items</span>
                <span className="text-[10px] text-theme-faint">{catalogExpanded ? "▾" : "▸"}</span>
              </button>
              {catalogExpanded && catalogItems.map(item => (
                <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} indent />
              ))}
            </>
          ) : (
            catalogItems.map(item => (
              <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} collapsed />
            ))
          )}

          {/* Preset Defs Section */}
          {!collapsed && (
            <div className="mt-3 mb-0.5">
              <div className="text-[10px] font-bold text-theme-faint tracking-[0.08em] px-3 pt-1 pb-0.5 uppercase">
                Preset Defs
              </div>
            </div>
          )}
          {!collapsed ? (
            <>
              <button
                onClick={() => setPresetDefsExpanded(e => !e)}
                className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] bg-transparent border-none cursor-pointer text-theme-muted w-full text-left hover:bg-bg2 transition-colors"
              >
                <Sliders size={15} />
                <span className="flex-1">Preset Defs</span>
                <span className="text-[10px] text-theme-faint">{presetDefsExpanded ? "▾" : "▸"}</span>
              </button>
              {presetDefsExpanded && presetDefItems.map(item => (
                <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} indent />
              ))}
            </>
          ) : (
            presetDefItems.map(item => (
              <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} collapsed />
            ))
          )}

          {/* 2.5D Section */}
          {!collapsed && (
            <div className="mt-3 mb-0.5">
              <div className="text-[10px] font-bold text-theme-faint tracking-[0.08em] px-3 pt-1 pb-0.5 uppercase">
                2.5D Part System
              </div>
            </div>
          )}

          <NavItem to="/admin/2d/parts" label="Part Search" Icon={Search} collapsed={collapsed} />

          {/* Part Libraries — collapsible sub-section */}
          {!collapsed && (
            <>
              <button
                onClick={() => setLibExpanded((e) => !e)}
                className={cn(
                  "flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] bg-transparent border-none cursor-pointer w-full text-left hover:bg-bg2 transition-colors",
                  is2dSection ? "text-theme-text" : "text-theme-muted",
                )}
              >
                <BookOpen size={15} />
                <span className="flex-1">Part Libraries</span>
                <span className="text-[10px] text-theme-faint">{libExpanded ? "▾" : "▸"}</span>
              </button>
              {libExpanded && partLibraryItems.map((item) => (
                <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} indent />
              ))}
            </>
          )}

          <NavItem to="/admin/2d/beyblade-systems" label="Beyblade Systems" Icon={Layers} collapsed={collapsed} />
          <NavItem to="/admin/2d/compatibility-tags" label="Compat. Tags" Icon={Tag} collapsed={collapsed} />
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-border-c flex flex-col gap-0.5",
          collapsed ? "py-2 px-1" : "p-3",
        )}>
          {!collapsed && (
            <>
              <a
                href="http://localhost:2567/colyseus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-theme-muted no-underline hover:bg-bg2 transition-colors"
              >
                <Radio size={15} />
                <span>Server Monitor</span>
              </a>
              <Link
                to="/game"
                className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-theme-muted no-underline hover:bg-bg2 transition-colors"
              >
                <Gamepad2 size={15} />
                <span>Play Game</span>
              </Link>
            </>
          )}

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex items-center justify-center p-2 rounded-lg text-sm bg-transparent border border-border-c text-theme-muted cursor-pointer w-full hover:bg-bg2 transition-colors",
              !collapsed && "mt-1",
            )}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="h-12 shrink-0 border-b border-border-c bg-bg1 flex items-center px-5 gap-3 flex-wrap">
          <div className="flex-1 text-xs text-theme-faint">
            <AdminBreadcrumb />
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle compact />
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-theme-text font-medium max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {currentUser.displayName || currentUser.email?.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-theme-muted max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="flex items-center justify-center p-1.5 bg-transparent border border-border-c rounded-md text-theme-muted cursor-pointer hover:text-theme-text hover:bg-bg2 transition-colors"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-theme-faint">Not signed in</span>
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col overflow-y-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
