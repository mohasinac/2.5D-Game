import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { C } from "@/styles/theme";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
  { to: "/admin/beyblades", label: "Beyblades", icon: "🌀" },
  { to: "/admin/arenas", label: "Arenas", icon: "🏟️" },
  { to: "/admin/stadiums", label: "Stadiums", icon: "⚡" },
  { to: "/admin/assets", label: "Assets", icon: "🎨" },
  { to: "/admin/stats", label: "Statistics", icon: "📊" },
  { to: "/admin/arena-test", label: "Arena Test", icon: "🧪" },
  { to: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function AdminLayout() {
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
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display:"flex", alignItems:"center", gap:10,
                padding:"8px 12px", borderRadius:8, fontSize:13,
                textDecoration:"none", transition:"background 150ms",
                background: isActive ? C.blue+"22" : "transparent",
                color: isActive ? C.text : C.muted,
                border: `1px solid ${isActive ? C.blue+"44" : "transparent"}`,
              })}
            >
              <span style={{ fontSize:15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
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
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflowY:"auto" }}>
        <Outlet />
      </main>

      <Toaster
        position="top-right"
        toastOptions={{ style:{ background:C.bg2, color:C.text, border:`1px solid ${C.border}` } }}
      />
    </div>
  );
}
