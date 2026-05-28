import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { TournamentDoc } from "@/types/game";
import toast from "react-hot-toast";

interface FormState {
  name: string;
  description: string;
  type: "pvp" | "player-gauntlet" | "mixed" | "ai-exhibition";
  maxParticipants: number;
  minParticipants: number;
  scheduledStartTime: string;
  registrationDeadline: string;
  roundIntervalMinutes: number;
  bestOf: 1 | 3 | 5;
  aiDifficulty: "medium" | "hard" | "hell";
  autoFillWithAI: boolean;
  allowedBeybladeIds: string[];
  disabledBeybladeIds: string[];
  allowedArenaIds: string[];
}

function tsToDatetimeLocal(ts: any): string {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputCls = "w-full px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm";

export function TournamentEditPage() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<TournamentDoc | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [beyOptions, setBeyOptions] = useState<{ value: string; label: string }[]>([]);
  const [arenaOptions, setArenaOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (!tournamentId) return;
    Promise.all([
      getDoc(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId)),
      getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
      getDocs(collection(db, COLLECTIONS.ARENAS)),
    ]).then(([tSnap, beySnap, arenaSnap]) => {
      if (!tSnap.exists()) { setError("Tournament not found."); setLoading(false); return; }
      const t = { id: tSnap.id, ...tSnap.data() } as TournamentDoc;
      setTournament(t);
      setForm({
        name: t.name,
        description: t.description ?? "",
        type: t.type,
        maxParticipants: t.maxParticipants,
        minParticipants: t.minParticipants ?? 2,
        scheduledStartTime: tsToDatetimeLocal(t.scheduledStartTime),
        registrationDeadline: tsToDatetimeLocal(t.registrationDeadline),
        roundIntervalMinutes: t.roundIntervalMinutes ?? 15,
        bestOf: t.bestOf ?? 1,
        aiDifficulty: t.aiDifficulty ?? "medium",
        autoFillWithAI: t.autoFillWithAI ?? true,
        allowedBeybladeIds: t.allowedBeybladeIds ?? [],
        disabledBeybladeIds: t.disabledBeybladeIds ?? [],
        allowedArenaIds: t.allowedArenaIds ?? [],
      });
      setBeyOptions(beySnap.docs.map(d => ({ value: d.id, label: (d.data().displayName as string) ?? (d.data().name as string) ?? d.id })));
      setArenaOptions(arenaSnap.docs.map(d => ({ value: d.id, label: (d.data().name as string) ?? d.id })));
      setLoading(false);
    }).catch(() => { setError("Failed to load tournament."); setLoading(false); });
  }, [tournamentId]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => f ? { ...f, [k]: v } : f);

  const handleSave = async () => {
    if (!tournamentId || !form) return;
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.scheduledStartTime) { setError("Scheduled start time is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const startTs = Timestamp.fromDate(new Date(form.scheduledStartTime));
      const regTs = form.registrationDeadline
        ? Timestamp.fromDate(new Date(form.registrationDeadline))
        : startTs;
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId), {
        name: form.name.trim(),
        description: form.description.trim() || null,
        type: form.type,
        maxParticipants: form.maxParticipants,
        minParticipants: Math.max(2, Math.min(form.maxParticipants, form.minParticipants)),
        scheduledStartTime: startTs,
        registrationDeadline: regTs,
        roundIntervalMinutes: form.roundIntervalMinutes,
        bestOf: form.bestOf,
        aiDifficulty: form.aiDifficulty,
        autoFillWithAI: form.autoFillWithAI,
        allowedBeybladeIds: form.allowedBeybladeIds,
        disabledBeybladeIds: form.disabledBeybladeIds,
        allowedArenaIds: form.allowedArenaIds,
        updatedAt: serverTimestamp(),
      });
      toast.success("Tournament updated.");
      navigate(`/admin/tournaments/${tournamentId}`);
    } catch (err: any) {
      const msg = err?.message ?? "Save failed.";
      setError(msg);
      toast.error(msg);
    } finally { setSaving(false); }
  };

  const canEdit = tournament && (tournament.status === "draft" || tournament.status === "registration");

  if (loading) return <div className="p-10 text-center text-faint">Loading…</div>;
  if (error && !form) return <div className="p-10 text-center text-red">{error}</div>;
  if (!form || !tournament) return null;

  return (
    <div className="p-6 max-w-[700px] mx-auto">
      <div className="mb-6">
        <Link to={`/admin/tournaments/${tournamentId}`} className="text-faint text-[13px] no-underline">← Tournament</Link>
        <h1 className="text-[22px] font-bold text-text mt-2">Edit Tournament</h1>
        {!canEdit && (
          <div className="mt-2.5 px-3.5 py-2 bg-yellow/[.10] border border-yellow/[.30] rounded-lg text-yellow text-xs">
            Tournament is <strong>{tournament.status}</strong> — only draft and registration tournaments can be edited.
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red/[.09] border border-red/[.27] rounded-xl px-3.5 py-2.5 mb-4 text-red text-[13px]">
          {error}
        </div>
      )}

      <div className={`flex flex-col gap-5 ${canEdit ? "" : "opacity-[0.65] pointer-events-none"}`}>
        <Section title="Basic Info">
          <Field label="Name *">
            <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea className={inputCls + " resize-y min-h-[72px]"} value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Type">
              <SearchableSelect value={form.type} options={[
                { value: "pvp", label: "PVP" },
                { value: "player-gauntlet", label: "Player Gauntlet" },
                { value: "mixed", label: "Mixed (AI fill)" },
                { value: "ai-exhibition", label: "AI Exhibition" },
              ]} onChange={v => set("type", v as any)} className="w-full" />
            </Field>
            <Field label="Max Participants">
              <SearchableSelect value={String(form.maxParticipants)} options={[
                { value: "2", label: "2" }, { value: "4", label: "4" }, { value: "8", label: "8" },
              ]} onChange={v => set("maxParticipants", Number(v))} className="w-full" />
            </Field>
          </div>
          <Field label="Min Participants (auto-cancel below this)">
            <input type="number" min={2} max={form.maxParticipants} value={form.minParticipants}
              onChange={e => set("minParticipants", Number(e.target.value))}
              className={inputCls + " w-[100px]"} />
          </Field>
        </Section>

        <Section title="Schedule">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Start Time *">
              <input type="datetime-local" className={inputCls} value={form.scheduledStartTime} onChange={e => set("scheduledStartTime", e.target.value)} />
            </Field>
            <Field label="Registration Deadline">
              <input type="datetime-local" className={inputCls} value={form.registrationDeadline} onChange={e => set("registrationDeadline", e.target.value)} />
            </Field>
          </div>
          <Field label="Minutes Between Rounds">
            <input type="number" min={5} max={120} value={form.roundIntervalMinutes}
              onChange={e => set("roundIntervalMinutes", Number(e.target.value))}
              className={inputCls + " w-[100px]"} />
          </Field>
        </Section>

        <Section title="Format">
          <div className="grid grid-cols-3 gap-3.5">
            <Field label="Best Of">
              <SearchableSelect value={String(form.bestOf)} options={[
                { value: "1", label: "BO1 (Single)" }, { value: "3", label: "BO3 (First to 2)" }, { value: "5", label: "BO5 (First to 3)" },
              ]} onChange={v => set("bestOf", Number(v) as any)} className="w-full" />
            </Field>
            <Field label="AI Difficulty">
              <SearchableSelect value={form.aiDifficulty} options={[
                { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }, { value: "hell", label: "Hell" },
              ]} onChange={v => set("aiDifficulty", v as any)} className="w-full" />
            </Field>
            <Field label="Auto-Fill with AI">
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                <input type="checkbox" checked={form.autoFillWithAI} onChange={e => set("autoFillWithAI", e.target.checked)} className="w-4 h-4" />
                <span className="text-muted text-[13px]">Fill empty slots</span>
              </label>
            </Field>
          </div>
        </Section>

        <Section title="Beyblade Restrictions">
          <MultiIdSelect
            label="Allowed Beyblades (empty = all allowed)"
            hint="Only these beyblades can be used in this tournament"
            selected={form.allowedBeybladeIds}
            options={beyOptions}
            onChange={ids => set("allowedBeybladeIds", ids)}
          />
          <MultiIdSelect
            label="Banned Beyblades"
            hint="These beyblades are blocked even if in the allowed list"
            selected={form.disabledBeybladeIds}
            options={beyOptions}
            onChange={ids => set("disabledBeybladeIds", ids)}
          />
        </Section>

        <Section title="Arena Restrictions">
          <MultiIdSelect
            label="Allowed Arenas (empty = any arena)"
            hint="Only these arenas can be chosen for matches"
            selected={form.allowedArenaIds}
            options={arenaOptions}
            onChange={ids => set("allowedArenaIds", ids)}
          />
        </Section>

        <div className="flex gap-3 justify-end">
          <Link to={`/admin/tournaments/${tournamentId}`} className="px-4 py-2 bg-bg3 text-text rounded-lg text-sm font-semibold border border-border no-underline inline-block">Cancel</Link>
          {canEdit && (
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-yellow text-bg0 rounded-lg text-sm font-semibold">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MultiIdSelect({
  label, hint, selected, options, onChange,
}: {
  label: string; hint: string;
  selected: string[]; options: { value: string; label: string }[];
  onChange: (ids: string[]) => void;
}) {
  const [addValue, setAddValue] = useState("");

  const add = (id: string) => {
    if (!id || selected.includes(id)) return;
    onChange([...selected, id]);
    setAddValue("");
  };
  const remove = (id: string) => onChange(selected.filter(x => x !== id));

  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <p className="text-[11px] text-faint mb-1.5">{hint}</p>
      <div className="flex gap-1.5 mb-2">
        <SearchableSelect
          value={addValue}
          options={options.filter(o => !selected.includes(o.value))}
          onChange={setAddValue}
          placeholder="Select to add…"
          className="flex-1"
        />
        <button onClick={() => add(addValue)} disabled={!addValue}
          className={`py-2 px-3.5 bg-theme-blue text-white border-none rounded-lg text-[13px] cursor-pointer ${addValue ? "" : "opacity-40"}`}>
          Add
        </button>
      </div>
      {selected.length === 0 ? (
        <p className="text-xs text-faint italic">None selected</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(id => {
            const opt = options.find(o => o.value === id);
            return (
              <span key={id} className="flex items-center gap-1.5 px-2.5 py-0.5 bg-bg3 border border-border rounded-[20px] text-xs text-text">
                {opt?.label ?? id}
                <button onClick={() => remove(id)} className="bg-none border-none text-faint cursor-pointer p-0 text-sm leading-none">×</button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg1 rounded-xl border border-border p-[18px]">
      <p className="text-[11px] font-bold text-muted uppercase tracking-[0.08em] mb-3.5">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}
