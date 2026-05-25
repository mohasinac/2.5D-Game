import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { C, alpha } from "@/styles/theme";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {crumbs.map((c, i) => (
        <span key={c.path} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <span style={{ color: C.faint, fontSize: 10 }}>›</span>}
          <span style={{ color: i === crumbs.length - 1 ? C.text : C.faint }}>{c.label}</span>
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
  { to: "/admin/part-layer-defs",           label: "Part Layers",        Icon: Layers },
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
      style={({ isActive }) => ({
        display: "flex", alignItems: "center",
        gap: collapsed ? 0 : 10,
        padding: collapsed ? "8px 0" : indent ? "6px 12px 6px 28px" : "8px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 8, fontSize: indent ? 12 : 13,
        textDecoration: "none", transition: "background 150ms",
        background: isActive ? alpha(C.blue, 0.13) : "transparent",
        color: isActive ? C.text : C.muted,
        border: `1px solid ${isActive ? alpha(C.blue, 0.27) : "transparent"}`,
      })}
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
    <div style={{ display: "flex", height: "100vh", background: C.bg0, color: C.text, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 56 : 240,
        background: C.bg1,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        transition: "width 200ms ease",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 0" : "20px 24px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🌀</span>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>Beyblade Game</div>
                <div style={{ color: C.muted, fontSize: 11 }}>Admin Panel</div>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, padding: collapsed ? "8px 4px" : 12, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} Icon={item.Icon} end={item.end} collapsed={collapsed} />
          ))}

          {/* Catalog Section */}
          {!collapsed && (
            <div style={{ marginTop: 12, marginBottom: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: "0.08em", padding: "4px 12px 2px", textTransform: "uppercase" }}>
                Catalog
              </div>
            </div>
          )}
          {!collapsed ? (
            <>
              <button
                onClick={() => setCatalogExpanded(e => !e)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px", borderRadius: 8, fontSize: 13,
                  background: "transparent", border: "none", cursor: "pointer",
                  color: C.muted, width: "100%", textAlign: "left",
                }}
              >
                <List size={15} />
                <span style={{ flex: 1 }}>Catalog Items</span>
                <span style={{ fontSize: 10, color: C.faint }}>{catalogExpanded ? "▾" : "▸"}</span>
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
            <div style={{ marginTop: 12, marginBottom: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: "0.08em", padding: "4px 12px 2px", textTransform: "uppercase" }}>
                Preset Defs
              </div>
            </div>
          )}
          {!collapsed ? (
            <>
              <button
                onClick={() => setPresetDefsExpanded(e => !e)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px", borderRadius: 8, fontSize: 13,
                  background: "transparent", border: "none", cursor: "pointer",
                  color: C.muted, width: "100%", textAlign: "left",
                }}
              >
                <Sliders size={15} />
                <span style={{ flex: 1 }}>Preset Defs</span>
                <span style={{ fontSize: 10, color: C.faint }}>{presetDefsExpanded ? "▾" : "▸"}</span>
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
            <div style={{ marginTop: 12, marginBottom: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: "0.08em", padding: "4px 12px 2px", textTransform: "uppercase" }}>
                2.5D Part System
              </div>
            </div>
          )}

          <NavItem to="/admin/2d/parts" label="Part Search" Icon={Search} collapsed={collapsed} />

          {/* Part Libraries — collapsible sub-section (hidden when sidebar collapsed) */}
          {!collapsed && (
            <>
              <button
                onClick={() => setLibExpanded((e) => !e)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px", borderRadius: 8, fontSize: 13,
                  background: "transparent", border: "none", cursor: "pointer",
                  color: is2dSection ? C.text : C.muted, width: "100%", textAlign: "left",
                }}
              >
                <BookOpen size={15} />
                <span style={{ flex: 1 }}>Part Libraries</span>
                <span style={{ fontSize: 10, color: C.faint }}>{libExpanded ? "▾" : "▸"}</span>
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
        <div style={{ padding: collapsed ? "8px 4px" : 12, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 2 }}>
          {!collapsed && (
            <>
              <a
                href="http://localhost:2567/colyseus"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, fontSize: 13, color: C.muted, textDecoration: "none" }}
              >
                <Radio size={15} />
                <span>Server Monitor</span>
              </a>
              <Link
                to="/game"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, fontSize: 13, color: C.muted, textDecoration: "none" }}
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
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "8px", borderRadius: 8, fontSize: 14,
              background: "transparent", border: `1px solid ${C.border}`,
              color: C.muted, cursor: "pointer", width: "100%",
              marginTop: collapsed ? 0 : 4,
            }}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top header bar */}
        <header style={{
          height: 48, flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
          background: C.bg1,
          display: "flex", alignItems: "center",
          padding: "0 20px", gap: 12,
        }}>
          {/* Breadcrumb placeholder — filled by page-level context or location */}
          <div style={{ flex: 1, fontSize: 12, color: C.faint }}>
            <AdminBreadcrumb />
          </div>
          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle compact />
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: 12, color: C.text, fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentUser.displayName || currentUser.email?.split("@")[0]}
                  </span>
                  <span style={{ fontSize: 10, color: C.muted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 6, background: "none",
                    border: `1px solid ${C.border}`, borderRadius: 6,
                    color: C.muted, cursor: "pointer",
                  }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 11, color: C.faint }}>Not signed in</span>
            )}
          </div>
        </header>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", minHeight: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
