import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { C } from "@/styles/theme";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
  { to: "/admin/beyblades", label: "Beyblades", icon: "🌀" },
  { to: "/admin/arenas", label: "Arenas", icon: "🏟️" },
  { to: "/admin/stadiums", label: "Stadiums", icon: "⚡" },
  { to: "/admin/assets", label: "Assets", icon: "🎨" },
  { to: "/admin/tournaments", label: "Tournaments", icon: "🏆" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/stats", label: "Statistics", icon: "📊" },
  { to: "/admin/arena-test", label: "Arena Test", icon: "🧪" },
  { to: "/admin/settings", label: "Settings", icon: "⚙️" },
];

const partLibraryItems = [
  { to: "/admin/2d/parts/bit-beasts",   label: "Bit Beasts",   icon: "🐉" },
  { to: "/admin/2d/parts/attack-rings", label: "Attack Rings", icon: "⚔️" },
  { to: "/admin/2d/parts/weight-disks", label: "Weight Disks", icon: "🪨" },
  { to: "/admin/2d/parts/sub-parts",    label: "Sub-Parts",    icon: "🔩" },
  { to: "/admin/2d/parts/tips",         label: "Tips",         icon: "🔺" },
  { to: "/admin/2d/parts/cores",        label: "Cores",        icon: "⚙️" },
  { to: "/admin/2d/parts/casings",      label: "Casings",      icon: "🛡️" },
  { to: "/admin/2d/parts/spin-tracks",  label: "Spin Tracks",  icon: "📏" },
];

function NavItem({ to, label, icon, end, indent = false }: { to: string; label: string; icon: string; end?: boolean; indent?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: "flex", alignItems: "center", gap: 10,
        padding: indent ? "6px 12px 6px 28px" : "8px 12px",
        borderRadius: 8, fontSize: indent ? 12 : 13,
        textDecoration: "none", transition: "background 150ms",
        background: isActive ? C.blue + "22" : "transparent",
        color: isActive ? C.text : C.muted,
        border: `1px solid ${isActive ? C.blue + "44" : "transparent"}`,
      })}
    >
      <span style={{ fontSize: indent ? 13 : 15 }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export function AdminLayout() {
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [libExpanded, setLibExpanded] = useState(() => location.pathname.startsWith("/admin/2d"));

  const handleSignOut = async () => {
    await signOutUser();
    toast.success("Signed out");
    navigate("/login");
  };

  const is2dSection = location.pathname.startsWith("/admin/2d");

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg0, color:C.text, overflow:"hidden" }}>
      {/* Sidebar */}
      <aside style={{ width:240, background:C.bg1, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${C.border}` }}>
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
            <span style={{ fontSize:24 }}>🌀</span>
            <div>
              <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>Beyblade Game</div>
              <div style={{ color:C.muted, fontSize:11 }}>Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav style={{ flex:1, padding:12, overflowY:"auto", display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} end={item.end} />
          ))}

          {/* ── 2.5D Section ── */}
          <div style={{ marginTop: 12, marginBottom: 2 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: "0.08em", padding: "4px 12px 2px", textTransform: "uppercase" }}>
              2.5D Part System
            </div>
          </div>

          <NavItem to="/admin/2d/parts" label="Part Search" icon="🔍" />

          {/* Part Libraries — collapsible */}
          <button
            onClick={() => setLibExpanded((e) => !e)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 8, fontSize: 13,
              background: "transparent", border: "none", cursor: "pointer",
              color: is2dSection ? C.text : C.muted, width: "100%", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>📚</span>
            <span style={{ flex: 1 }}>Part Libraries</span>
            <span style={{ fontSize: 10, color: C.faint }}>{libExpanded ? "▾" : "▸"}</span>
          </button>

          {libExpanded && partLibraryItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} indent />
          ))}

          <NavItem to="/admin/2d/beyblade-systems" label="Beyblade Systems" icon="🌀" />
          <NavItem to="/admin/2d/compatibility-tags" label="Compat. Tags" icon="🏷️" />
        </nav>

        <div style={{ padding:12, borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:2 }}>
          <a
            href="http://localhost:2567/colyseus"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, fontSize:13, color:C.muted, textDecoration:"none" }}
          >
            <span>📡</span>
            <span>Server Monitor</span>
          </a>
          <Link
            to="/game"
            style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, fontSize:13, color:C.muted, textDecoration:"none" }}
          >
            <span>🎮</span>
            <span>Play Game</span>
          </Link>
          {currentUser && (
            <div style={{ marginTop:6, padding:"8px 12px", borderRadius:8, background:C.bg2, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, color:C.faint, marginBottom:4 }}>Signed in as</div>
              <div style={{ fontSize:11, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:6 }}>{currentUser.email}</div>
              <button
                onClick={handleSignOut}
                style={{ width:"100%", padding:"4px 0", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.red, cursor:"pointer" }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflowY:"auto" }}>
        <Outlet />
      </main>

    </div>
  );
}
