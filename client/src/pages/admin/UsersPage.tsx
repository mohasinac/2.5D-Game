import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { C, S, alpha } from "@/styles/theme";

interface UserDoc {
  id: string;
  email?: string;
  displayName?: string;
  role?: "admin" | "player";
  createdAt?: any;
  lastLoginAt?: any;
}

const ROLE_COLORS = { admin: C.yellow, player: C.blue };

export function UsersPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")))
      .then((snap) => setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserDoc))))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (user: UserDoc) => {
    const newRole = user.role === "admin" ? "player" : "admin";
    if (user.id === currentUser?.uid && newRole !== "admin") {
      toast.error("You cannot demote yourself");
      return;
    }
    setUpdatingId(user.id);
    try {
      await updateDoc(doc(db, "users", user.id), { role: newRole });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      toast.success(`${user.displayName ?? user.email ?? user.id} is now ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = search
    ? users.filter((u) =>
        (u.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (u.displayName ?? "").toLowerCase().includes(search.toLowerCase()) ||
        u.id.includes(search)
      )
    : users;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Users</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            {users.length} registered — manage roles and access
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search by email, display name, or UID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...S.input, width: "100%", maxWidth: 420 }}
        />
      </div>

      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
            <div className="spin" style={{ width: 28, height: 28, border: `2px solid ${C.blue}`, borderTopColor: "transparent", borderRadius: "50%" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: C.faint, fontSize: 13 }}>
            {search ? "No users match your search" : "No users found"}
          </div>
        ) : (
          filtered.map((user, i) => {
            const role = user.role ?? "player";
            const isMe = user.id === currentUser?.uid;
            const isUpdating = updatingId === user.id;
            return (
              <div
                key={user.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                  background: isMe ? alpha(C.blue, 0.05) : "transparent",
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: alpha(ROLE_COLORS[role as keyof typeof ROLE_COLORS] ?? C.muted, 0.13),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {role === "admin" ? "👑" : "🎮"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.text, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.displayName ?? user.email ?? user.id.slice(0, 12) + "…"}
                    </span>
                    {isMe && <span style={{ fontSize: 10, color: C.blue, background: alpha(C.blue, 0.13), padding: "1px 6px", borderRadius: 4 }}>you</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: C.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email ?? "—"}</span>
                    <span style={{ fontSize: 11, color: C.faint }}>·</span>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: C.faint }}>{user.id.slice(0, 10)}…</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                    color: ROLE_COLORS[role as keyof typeof ROLE_COLORS] ?? C.muted,
                    background: alpha(ROLE_COLORS[role as keyof typeof ROLE_COLORS] ?? C.muted, 0.13),
                    padding: "3px 8px", borderRadius: 6,
                  }}>
                    {role}
                  </span>
                  <button
                    onClick={() => handleRoleToggle(user)}
                    disabled={isUpdating}
                    title={role === "admin" ? "Demote to player" : "Promote to admin"}
                    style={{
                      padding: "4px 10px", fontSize: 11, borderRadius: 6,
                      background: "transparent", color: C.muted,
                      border: `1px solid ${C.border}`,
                      cursor: "pointer", opacity: isUpdating ? 0.5 : 1,
                    }}
                  >
                    {isUpdating ? "…" : role === "admin" ? "Demote" : "Promote"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
