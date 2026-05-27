import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
interface DashboardStats { beyblades: number; arenas: number; matches: number; players: number; }
interface TournamentStats { active: number; upcoming: number; }

const statCards = [
  { label:"Beyblades", icon:"🌀", href:"/admin/beyblades", bgClass:"bg-blue-10", borderClass:"border-blue-30" },
  { label:"Arenas", icon:"⭕", href:"/admin/arenas", bgClass:"bg-purple-10", borderClass:"border-purple-33" },
  { label:"Matches Played", icon:"⚔️", href:"/admin/stats", bgClass:"bg-red-10", borderClass:"border-red-30" },
  { label:"Players", icon:"👥", href:"/admin/stats", bgClass:"bg-green-10", borderClass:"border-green-30" },
] as const;

const quickLinks = [
  { label:"Create Beyblade", href:"/admin/beyblades/create", icon:"➕", desc:"Add a new beyblade to the game" },
  { label:"Create Arena", href:"/admin/arenas/create", icon:"🏟️", desc:"Design a new battle arena" },
  { label:"Asset Library", href:"/admin/assets", icon:"🖼️", desc:"Manage sprites and sounds" },
  { label:"Arena Test", href:"/admin/arena-test", icon:"🧪", desc:"Test arena configurations" },
  { label:"AI vs AI Lab", href:"/admin/ai-vs-ai", icon:"🤖", desc:"Pit two AIs against each other to validate beys & arenas" },
  { label:"AI Battles", href:"/admin/ai-battles", icon:"🤖", desc:"Manage AI battle quick-launch presets" },
  { label:"Game Monitor", href:"http://localhost:2567/colyseus", icon:"📡", desc:"Colyseus server monitor", external:true },
  { label:"Mechanic Defs", href:"/admin/mechanic-defs", icon:"⚙️", desc:"31 atomic mechanic handler definitions" },
  { label:"Gimmick Defs", href:"/admin/gimmick-defs", icon:"🧬", desc:"27 gimmick recipes (behaviorRef bundles)" },
  { label:"Gimmick Synergies", href:"/admin/gimmick-synergies", icon:"⚗️", desc:"Gimmick × part material synergy bonuses" },
  { label:"Bey Accessories",   href:"/admin/bey-accessories",   icon:"💎", desc:"Pokémon held-item style passive accessories" },
  { label:"Boost Pad Defs",    href:"/admin/boost-pad-defs",    icon:"⚡", desc:"F-Zero style directional speed strips" },
  { label:"Status Conditions", href:"/admin/status-condition-defs", icon:"🌡️", desc:"Element-based status effect definitions" },
  { label:"Settings", href:"/admin/settings", icon:"🔧", desc:"Game-wide settings" },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ beyblades:0, arenas:0, matches:0, players:0 });
  const [tournamentStats, setTournamentStats] = useState<TournamentStats>({ active:0, upcoming:0 });
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [beybladeSnap, arenaSnap, matchSnap, playerSnap, activeSnap, upcomingSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
          getDocs(query(collection(db, COLLECTIONS.MATCHES), orderBy("createdAt","desc"), limit(5))),
          getDocs(collection(db, COLLECTIONS.PLAYER_STATS)),
          getDocs(query(collection(db, COLLECTIONS.TOURNAMENTS), where("status","==","in-progress"))),
          getDocs(query(collection(db, COLLECTIONS.TOURNAMENTS), where("status","==","registration"))),
        ]);
        setStats({ beyblades:beybladeSnap.size, arenas:arenaSnap.size, matches:matchSnap.size, players:playerSnap.size });
        setTournamentStats({ active:activeSnap.size, upcoming:upcomingSnap.size });
        setRecentMatches(matchSnap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch (err) { console.error("Dashboard fetch error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  const statValues = [stats.beyblades, stats.arenas, stats.matches, stats.players];

  return (
    <div className="p-6 w-full box-border">
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-text">Dashboard</h1>
        <p className="text-faint text-[13px] mt-1">Game administration overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {statCards.map((card, i) => (
          <Link key={card.label} to={card.href} className={`block ${card.bgClass} border ${card.borderClass} rounded-[14px] p-4 no-underline`}>
            <div className="text-[22px] mb-2">{card.icon}</div>
            {loading ? (
              <div className="h-7 w-12 bg-bg3 rounded-md mb-1 pulse" />
            ) : (
              <div className="text-[24px] font-bold text-text font-mono">{statValues[i]}</div>
            )}
            <div className="text-xs text-muted mt-0.5">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Tournament stats */}
      <div className="bg-yellow-10 border border-yellow-20 rounded-[14px] p-4 mb-7 flex items-center gap-6">
        <span className="text-[28px]">🏆</span>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-text mb-1">Tournaments</div>
          <div className="flex gap-5">
            <div>
              {loading ? <div className="h-5 w-8 bg-bg3 rounded pulse" /> : <span className="text-[20px] font-bold text-yellow font-mono">{tournamentStats.active}</span>}
              <span className="text-xs text-muted ml-1.5">active</span>
            </div>
            <div>
              {loading ? <div className="h-5 w-8 bg-bg3 rounded pulse" /> : <span className="text-[20px] font-bold text-blue font-mono">{tournamentStats.upcoming}</span>}
              <span className="text-xs text-muted ml-1.5">registration open</span>
            </div>
          </div>
        </div>
        <Link to="/admin/tournaments" className="py-2 px-4 bg-yellow-13 border border-yellow-40 rounded-lg text-theme-yellow text-[12px] font-semibold no-underline">
          Manage →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Quick links */}
        <div>
          <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2.5">
            {quickLinks.map((link) => {
              const inner = (
                <div className="bg-bg2 border border-border rounded-xl p-4">
                  <div className="text-[20px] mb-1.5">{link.icon}</div>
                  <div className="text-[13px] font-medium text-text">{link.label}</div>
                  <div className="text-[11px] text-faint mt-0.5">{link.desc}</div>
                </div>
              );
              return link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="no-underline">{inner}</a>
              ) : (
                <Link key={link.label} to={link.href} className="no-underline">{inner}</Link>
              );
            })}
          </div>
        </div>

        {/* Recent matches */}
        <div>
          <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3">Recent Matches</div>
          <div className="bg-bg2 border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="spin w-6 h-6 border-2 border-blue border-t-transparent rounded-full mx-auto" />
              </div>
            ) : recentMatches.length === 0 ? (
              <div className="p-8 text-center text-faint text-[13px]">No matches played yet</div>
            ) : (
              recentMatches.map((match, i) => (
                <div key={match.id} className={`flex justify-between items-center px-4 py-2.5 ${i < recentMatches.length-1 ? "border-b border-border-c" : ""}`}>
                  <div>
                    <div className="text-text font-mono text-[11px]">{match.id.slice(0,12)}...</div>
                    <div className="text-faint text-[11px] capitalize">{match.mode ?? "pvp"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green text-[11px]">Winner: {match.winner ?? "—"}</div>
                    <div className="text-faint text-[11px]">{match.createdAt?.toDate?.()?.toLocaleDateString() ?? "—"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
