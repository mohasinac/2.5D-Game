import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S, btn, alpha } from "@/styles/theme";
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
      setBeyOptions(beySnap.docs.map(d => ({ value: d.id, label: (d.data().name as string) ?? d.id })));
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

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: C.faint }}>Loading…</div>;
  if (error && !form) return <div style={{ padding: 40, textAlign: "center", color: C.red }}>{error}</div>;
  if (!form || !tournament) return null;

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link to={`/admin/tournaments/${tournamentId}`} style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Tournament</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 8 }}>Edit Tournament</h1>
        {!canEdit && (
          <div style={{ marginTop: 10, padding: "8px 14px", background: alpha(C.yellow, 0.1), border: `1px solid ${alpha(C.yellow, 0.3)}`, borderRadius: 8, color: C.yellow, fontSize: 12 }}>
            Tournament is <strong>{tournament.status}</strong> — only draft and registration tournaments can be edited.
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: alpha(C.red, 0.09), border: `1px solid ${alpha(C.red, 0.27)}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: C.red, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20, opacity: canEdit ? 1 : 0.65, pointerEvents: canEdit ? "auto" : "none" }}>
        <Section title="Basic Info">
          <Field label="Name *">
            <input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea style={{ ...S.input, resize: "vertical", minHeight: 72 }} value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Type">
              <SearchableSelect value={form.type} options={[
                { value: "pvp", label: "PVP" },
                { value: "player-gauntlet", label: "Player Gauntlet" },
                { value: "mixed", label: "Mixed (AI fill)" },
                { value: "ai-exhibition", label: "AI Exhibition" },
              ]} onChange={v => set("type", v as any)} style={S.input} />
            </Field>
            <Field label="Max Participants">
              <SearchableSelect value={String(form.maxParticipants)} options={[
                { value: "2", label: "2" }, { value: "4", label: "4" }, { value: "8", label: "8" },
              ]} onChange={v => set("maxParticipants", Number(v))} style={S.input} />
            </Field>
          </div>
          <Field label="Min Participants (auto-cancel below this)">
            <input type="number" min={2} max={form.maxParticipants} value={form.minParticipants}
              onChange={e => set("minParticipants", Number(e.target.value))}
              style={{ ...S.input, width: 100 }} />
          </Field>
        </Section>

        <Section title="Schedule">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Start Time *">
              <input type="datetime-local" style={S.input} value={form.scheduledStartTime} onChange={e => set("scheduledStartTime", e.target.value)} />
            </Field>
            <Field label="Registration Deadline">
              <input type="datetime-local" style={S.input} value={form.registrationDeadline} onChange={e => set("registrationDeadline", e.target.value)} />
            </Field>
          </div>
          <Field label="Minutes Between Rounds">
            <input type="number" min={5} max={120} value={form.roundIntervalMinutes}
              onChange={e => set("roundIntervalMinutes", Number(e.target.value))}
              style={{ ...S.input, width: 100 }} />
          </Field>
        </Section>

        <Section title="Format">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <Field label="Best Of">
              <SearchableSelect value={String(form.bestOf)} options={[
                { value: "1", label: "BO1 (Single)" }, { value: "3", label: "BO3 (First to 2)" }, { value: "5", label: "BO5 (First to 3)" },
              ]} onChange={v => set("bestOf", Number(v) as any)} style={S.input} />
            </Field>
            <Field label="AI Difficulty">
              <SearchableSelect value={form.aiDifficulty} options={[
                { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }, { value: "hell", label: "Hell" },
              ]} onChange={v => set("aiDifficulty", v as any)} style={S.input} />
            </Field>
            <Field label="Auto-Fill with AI">
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={form.autoFillWithAI} onChange={e => set("autoFillWithAI", e.target.checked)} style={{ width: 16, height: 16 }} />
                <span style={{ color: C.muted, fontSize: 13 }}>Fill empty slots</span>
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

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link to={`/admin/tournaments/${tournamentId}`} style={{ ...btn(C.bg3), textDecoration: "none", display: "inline-block" }}>Cancel</Link>
          {canEdit && (
            <button onClick={handleSave} disabled={saving} style={{ ...btn(C.yellow), color: C.bg0 }}>
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
      <label style={S.label}>{label}</label>
      <p style={{ fontSize: 11, color: C.faint, marginBottom: 6 }}>{hint}</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <SearchableSelect
          value={addValue}
          options={options.filter(o => !selected.includes(o.value))}
          onChange={setAddValue}
          placeholder="Select to add…"
          style={{ ...S.input, flex: 1 }}
        />
        <button onClick={() => add(addValue)} disabled={!addValue}
          style={{ padding: "8px 14px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", opacity: addValue ? 1 : 0.4 }}>
          Add
        </button>
      </div>
      {selected.length === 0 ? (
        <p style={{ fontSize: 12, color: C.faint, fontStyle: "italic" }}>None selected</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selected.map(id => {
            const opt = options.find(o => o.value === id);
            return (
              <span key={id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 12, color: C.text }}>
                {opt?.label ?? id}
                <button onClick={() => remove(id)} style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
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
    <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}
