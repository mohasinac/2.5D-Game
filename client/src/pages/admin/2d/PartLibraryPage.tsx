import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import toast from "react-hot-toast";
import { PackageOpen, Plus, Search } from "lucide-react";

const PART_TYPES = [
  { slug: "all",          label: "All Parts",    icon: "🔍", desc: "All part types",                                   collection: null },
  { slug: "bit-beasts",   label: "Bit Beasts",   icon: "🐉", desc: "Special move identity pieces",                    collection: COLLECTIONS.BIT_BEAST_PARTS },
  { slug: "attack-rings", label: "Attack Rings", icon: "⚔️", desc: "Blade contact geometry",                          collection: COLLECTIONS.ATTACK_RING_PARTS },
  { slug: "weight-disks", label: "Weight Disks", icon: "🪨", desc: "Spin inertia and mass distribution",               collection: COLLECTIONS.WEIGHT_DISK_PARTS },
  { slug: "sub-parts",    label: "Sub-Parts",    icon: "🔩", desc: "Free-spin, ratchet, switch mechanisms",            collection: COLLECTIONS.SUB_PARTS },
  { slug: "tips",         label: "Tips",         icon: "🔺", desc: "Movement pattern and floor contact",               collection: COLLECTIONS.TIP_PARTS },
  { slug: "cores",        label: "Cores",        icon: "⚙️", desc: "Engine gear and gimmick cores",                   collection: COLLECTIONS.CORE_PARTS },
  { slug: "casings",      label: "Casings",      icon: "🛡️", desc: "Body shell and tip-slot housing",                 collection: COLLECTIONS.CASING_PARTS },
  { slug: "spin-tracks",  label: "Spin Tracks",  icon: "📏", desc: "Height piece between tip and fusion wheel",       collection: COLLECTIONS.SPIN_TRACK_PARTS },
  { slug: "gears",        label: "Gears",        icon: "⚙️", desc: "Swappable archetype-shifting gear attachments",   collection: COLLECTIONS.GEAR_PARTS },
] as const;

type PartTypeSlug = typeof PART_TYPES[number]["slug"];

const PART_TYPE_MAP = Object.fromEntries(PART_TYPES.map(t => [t.slug, t])) as Record<PartTypeSlug, typeof PART_TYPES[number]>;

interface PartRow {
  id: string;
  displayName: string;
  color?: string;
  description?: string;
  typeSlug: string;
  typeLabel: string;
}

export function PartLibraryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = (searchParams.get("type") ?? "all") as PartTypeSlug;
  const [search, setSearch] = useState("");
  const [parts, setParts] = useState<PartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const setTypeFilter = (slug: PartTypeSlug) => {
    setSearchParams(slug === "all" ? {} : { type: slug });
  };

  const loadParts = useCallback(async () => {
    setLoading(true);
    try {
      if (typeFilter === "all") {
        const fetches = PART_TYPES.filter(t => t.slug !== "all" && t.collection).map(async t => {
          const snap = await getDocs(query(collection(db, t.collection!), orderBy("displayName")));
          return snap.docs.map(d => ({
            id: d.id, typeSlug: t.slug, typeLabel: t.label, ...d.data(),
          } as PartRow));
        });
        const results = await Promise.all(fetches);
        const merged = results.flat().sort((a, b) => a.displayName.localeCompare(b.displayName));
        setParts(merged);
      } else {
        const meta = PART_TYPE_MAP[typeFilter];
        if (!meta?.collection) return;
        const snap = await getDocs(query(collection(db, meta.collection), orderBy("displayName")));
        setParts(snap.docs.map(d => ({ id: d.id, typeSlug: typeFilter, typeLabel: meta.label, ...d.data() } as PartRow)));
      }
    } catch {
      toast.error("Failed to load parts");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { loadParts(); }, [loadParts]);

  const filtered = parts.filter(p =>
    !search || p.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (part: PartRow) => {
    if (!confirm(`Delete "${part.displayName}"? This cannot be undone.`)) return;
    const meta = PART_TYPE_MAP[part.typeSlug as PartTypeSlug];
    if (!meta?.collection) return;
    setDeleting(part.id);
    try {
      await deleteDoc(doc(db, meta.collection, part.id));
      setParts(prev => prev.filter(p => p.id !== part.id));
      toast.success(`Deleted "${part.displayName}"`);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const activeMeta = PART_TYPE_MAP[typeFilter];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left filter panel */}
      <aside className="w-48 shrink-0 border-r border-border bg-bg1 flex flex-col overflow-y-auto">
        <div className="px-3 py-4 border-b border-border">
          <p className="text-xs font-bold text-faint uppercase tracking-widest mb-1">Part Type</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {PART_TYPES.map(t => (
            <button
              key={t.slug}
              onClick={() => setTypeFilter(t.slug)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors w-full",
                typeFilter === t.slug
                  ? "bg-blue/[.13] text-text border border-blue/[.27]"
                  : "text-muted hover:text-text hover:bg-bg2 border border-transparent",
              )}
            >
              <span className="text-base leading-none">{t.icon}</span>
              <span className="truncate">{t.slug === "all" ? "All Parts" : t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="shrink-0 flex items-center gap-3 px-6 py-3 border-b border-border bg-bg1">
          <Search size={15} className="text-faint shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search parts by name…"
            className="flex-1 bg-transparent text-base text-text placeholder:text-faint focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-faint hover:text-muted transition-colors">
              Clear
            </button>
          )}
          {typeFilter !== "all" && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={() => navigate(`/admin/2d/parts/${typeFilter}/create`)}
            >
              New {activeMeta?.label.replace(/s$/, "") ?? "Part"}
            </Button>
          )}
        </div>

        {/* Results header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeMeta?.icon ?? "🔍"}</span>
            <span className="text-md font-semibold text-text">
              {typeFilter === "all" ? "All Parts" : activeMeta?.label}
            </span>
            {!loading && (
              <span className="text-xs text-faint">
                {filtered.length} {filtered.length !== parts.length && `of ${parts.length} `}part{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Parts list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex flex-col gap-2 mt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-bg2 rounded-lg pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon={<PackageOpen size={40} />}
                title={search ? `No results for "${search}"` : `No ${activeMeta?.label.toLowerCase() ?? "parts"} yet`}
                description={search ? undefined : typeFilter !== "all" ? `Create the first ${activeMeta?.label.replace(/s$/, "").toLowerCase()}.` : undefined}
                action={
                  search ? (
                    <Button variant="ghost" size="sm" onClick={() => setSearch("")}>Clear search</Button>
                  ) : typeFilter !== "all" ? (
                    <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => navigate(`/admin/2d/parts/${typeFilter}/create`)}>
                      Create first {activeMeta?.label.replace(/s$/, "").toLowerCase()}
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {filtered.map(part => (
                <div
                  key={`${part.typeSlug}-${part.id}`}
                  className="flex items-center gap-3 bg-bg1 border border-border rounded-lg px-4 py-3 hover:border-border-light transition-colors"
                >
                  {/* Color swatch */}
                  <div
                    className="w-7 h-7 rounded shrink-0 border border-border"
                    style={{ background: part.color ?? "#1a1a1a" }}
                  />
                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-md font-semibold text-text">{part.displayName}</span>
                      {typeFilter === "all" && (
                        <Badge color="muted" className="text-xs">{part.typeLabel}</Badge>
                      )}
                    </div>
                    {part.description && (
                      <p className="text-sm text-muted truncate">{part.description}</p>
                    )}
                    <p className="text-xs text-faint font-mono mt-0.5">{part.id}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/2d/parts/${part.typeSlug}/edit/${part.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deleting === part.id}
                      onClick={() => handleDelete(part)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
