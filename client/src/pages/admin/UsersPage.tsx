import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
interface UserDoc {
  id: string;
  email?: string;
  displayName?: string;
  role?: "admin" | "player";
  createdAt?: any;
  lastLoginAt?: any;
}

const ROLE_CLASSES = {
  admin: { bg: "bg-yellow-13", text: "text-theme-yellow", avatarBg: "bg-yellow-13" },
  player: { bg: "bg-blue-13", text: "text-theme-blue", avatarBg: "bg-blue-13" },
};

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
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-text">Users</h1>
          <p className="text-faint text-[13px] mt-1">
            {users.length} registered — manage roles and access
          </p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by email, display name, or UID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[420px] px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm"
        />
      </div>

      <div className="bg-bg2 border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="spin w-7 h-7 border-2 border-blue border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-faint text-[13px]">
            {search ? "No users match your search" : "No users found"}
          </div>
        ) : (
          filtered.map((user, i) => {
            const role = user.role ?? "player";
            const isMe = user.id === currentUser?.uid;
            const isUpdating = updatingId === user.id;
            const roleClasses = ROLE_CLASSES[role as keyof typeof ROLE_CLASSES] ?? ROLE_CLASSES.player;
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < filtered.length - 1 ? "border-b border-border-c" : ""} ${isMe ? "bg-blue-10" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base ${roleClasses.avatarBg}`}
                >
                  {role === "admin" ? "👑" : "🎮"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-text text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      {user.displayName ?? user.email ?? user.id.slice(0, 12) + "…"}
                    </span>
                    {isMe && <span className="text-[10px] text-blue px-1.5 py-px rounded bg-blue-13">you</span>}
                  </div>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[11px] text-faint overflow-hidden text-ellipsis whitespace-nowrap">{user.email ?? "—"}</span>
                    <span className="text-[11px] text-faint">·</span>
                    <span className="text-[10px] font-mono text-faint">{user.id.slice(0, 10)}…</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.05em] ${roleClasses.text} ${roleClasses.bg} py-[3px] px-2 rounded-[6px]`}>
                    {role}
                  </span>
                  <button
                    onClick={() => handleRoleToggle(user)}
                    disabled={isUpdating}
                    title={role === "admin" ? "Demote to player" : "Promote to admin"}
                    className={`px-2.5 py-1 text-[11px] rounded-md bg-transparent text-muted border border-border cursor-pointer ${isUpdating ? "opacity-50" : ""}`}
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
