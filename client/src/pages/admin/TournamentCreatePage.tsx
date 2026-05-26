import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C } from "@/styles/theme";
import toast from "react-hot-toast";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

interface FormState {
  name: string;
  description: string;
  type: "pvp" | "player-gauntlet" | "mixed" | "ai-exhibition";
  maxParticipants: 2 | 4 | 8;
  minParticipants: number;
  scheduledStartTime: string;
  registrationDeadline: string;
  roundIntervalMinutes: number;
  bestOf: 1 | 3 | 5;
  aiDifficulty: "medium" | "hard" | "hell";
  autoFillWithAI: boolean;
  allowedBeybladeIds: string;
  disabledBeybladeIds: string;
  allowedArenaIds: string;
}

const defaults: FormState = {
  name: "",
  description: "",
  type: "pvp",
  maxParticipants: 8,
  minParticipants: 2,
  scheduledStartTime: "",
  registrationDeadline: "",
  roundIntervalMinutes: 15,
  bestOf: 1,
  aiDifficulty: "medium",
  autoFillWithAI: true,
  allowedBeybladeIds: "",
  disabledBeybladeIds: "",
  allowedArenaIds: "",
};

function splitIds(raw: string): string[] {
  return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

const inputCls = "w-full px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm";

export function TournamentCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.scheduledStartTime) { setError("Scheduled start time is required."); return; }

    setSaving(true);
    setError(null);

    try {
      const startTs = Timestamp.fromDate(new Date(form.scheduledStartTime));
      const regTs = form.registrationDeadline
        ? Timestamp.fromDate(new Date(form.registrationDeadline))
        : startTs;

      const minP = Math.max(2, Math.min(form.maxParticipants, Math.floor(form.minParticipants)));
      const docRef = await addDoc(collection(db, COLLECTIONS.TOURNAMENTS), {
        name: form.name.trim(),
        description: form.description.trim() || null,
        type: form.type,
        status: "draft",
        maxParticipants: form.maxParticipants,
        minParticipants: minP,
        scheduledStartTime: startTs,
        registrationDeadline: regTs,
        roundIntervalMinutes: form.roundIntervalMinutes,
        bestOf: form.bestOf,
        aiDifficulty: form.aiDifficulty,
        autoFillWithAI: form.autoFillWithAI,
        allowedBeybladeIds: splitIds(form.allowedBeybladeIds),
        disabledBeybladeIds: splitIds(form.disabledBeybladeIds),
        allowedArenaIds: splitIds(form.allowedArenaIds),
        createdBy: "admin",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        winnerId: null,
        winnerUsername: null,
      });
      toast.success(`Tournament "${form.name.trim()}" created!`);
      navigate(`/admin/tournaments/${docRef.id}`);
    } catch (err: any) {
      const msg = err?.message ?? "Failed to create tournament.";
      setError(msg);
      toast.error(msg);
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-[700px] mx-auto">
      <div className="mb-6">
        <Link to="/admin/tournaments" className="text-faint text-[13px] no-underline">← Tournaments</Link>
        <h1 className="text-[22px] font-bold text-text mt-2">Create Tournament</h1>
      </div>

      {error && (
        <div className="bg-red/[.09] border border-red/[.27] rounded-xl px-3.5 py-2.5 mb-4 text-red text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Section title="Basic Info">
          <Field label="Name *">
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Summer Championship 2026" />
          </Field>
          <Field label="Description">
            <textarea className={inputCls + " resize-y min-h-[72px]"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional description..." />
          </Field>
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Type">
              <SearchableSelect
                value={form.type}
                options={[{ value: "pvp", label: "PVP" }, { value: "player-gauntlet", label: "Player Gauntlet" }, { value: "mixed", label: "Mixed (AI fill)" }, { value: "ai-exhibition", label: "AI Exhibition" }]}
                onChange={(v) => set("type", v as any)}
                className="w-full"
                data-testid="tournament-type-select"
              />
            </Field>
            <Field label="Max Participants">
              <SearchableSelect
                value={String(form.maxParticipants)}
                options={[{ value: "2", label: "2" }, { value: "4", label: "4" }, { value: "8", label: "8" }]}
                onChange={(v) => set("maxParticipants", Number(v) as any)}
                className="w-full"
              />
            </Field>
          </div>
          <Field label="Minimum Participants (auto-cancels below this at deadline)">
            <input
              className={inputCls + " w-[100px]"}
              type="number"
              min={2}
              max={form.maxParticipants}
              value={form.minParticipants}
              onChange={(e) => set("minParticipants", Number(e.target.value))}
            />
          </Field>
        </Section>

        <Section title="Schedule">
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Start Time *">
              <input className={inputCls} type="datetime-local" value={form.scheduledStartTime} onChange={(e) => set("scheduledStartTime", e.target.value)} />
            </Field>
            <Field label="Registration Deadline">
              <input className={inputCls} type="datetime-local" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} />
            </Field>
          </div>
          <Field label="Minutes Between Rounds">
            <input className={inputCls + " w-[100px]"} type="number" min={5} max={120} value={form.roundIntervalMinutes} onChange={(e) => set("roundIntervalMinutes", Number(e.target.value))} />
          </Field>
        </Section>

        <Section title="Format">
          <div className="grid grid-cols-3 gap-3.5">
            <Field label="Best Of">
              <SearchableSelect
                value={String(form.bestOf)}
                options={[{ value: "1", label: "BO1 (Single)" }, { value: "3", label: "BO3 (First to 2)" }, { value: "5", label: "BO5 (First to 3)" }]}
                onChange={(v) => set("bestOf", Number(v) as any)}
                className="w-full"
              />
            </Field>
            <Field label="AI Difficulty">
              <SearchableSelect
                value={form.aiDifficulty}
                options={[{ value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }, { value: "hell", label: "Hell" }]}
                onChange={(v) => set("aiDifficulty", v as any)}
                className="w-full"
              />
            </Field>
            <Field label="Auto-Fill with AI">
              <div className="flex items-center gap-2 mt-1.5">
                <input type="checkbox" checked={form.autoFillWithAI} onChange={(e) => set("autoFillWithAI", e.target.checked)} className="w-4 h-4" />
                <span className="text-muted text-[13px]">Fill empty slots</span>
              </div>
            </Field>
          </div>
        </Section>

        <Section title="Restrictions (optional)">
          <Field label="Allowed Beyblade IDs (comma/newline — empty = all allowed)">
            <textarea className={inputCls + " resize-y min-h-[60px] font-mono text-xs"} value={form.allowedBeybladeIds} onChange={(e) => set("allowedBeybladeIds", e.target.value)} placeholder="id1, id2, ..." />
          </Field>
          <Field label="Disabled Beyblade IDs">
            <textarea className={inputCls + " resize-y min-h-[60px] font-mono text-xs"} value={form.disabledBeybladeIds} onChange={(e) => set("disabledBeybladeIds", e.target.value)} placeholder="banned_id1, ..." />
          </Field>
          <Field label="Allowed Arena IDs (empty = any arena)">
            <textarea className={inputCls + " resize-y min-h-[40px] font-mono text-xs"} value={form.allowedArenaIds} onChange={(e) => set("allowedArenaIds", e.target.value)} placeholder="arena_id1, ..." />
          </Field>
        </Section>

        <div className="flex gap-3 justify-end">
          <Link to="/admin/tournaments" className="px-4 py-2 bg-bg3 text-text rounded-lg text-sm font-semibold border border-border no-underline inline-block">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-yellow text-bg0 rounded-lg text-sm font-semibold">
            {saving ? "Creating..." : "Create Tournament"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg1 rounded-xl border border-border p-[18px]">
      <p className="text-[11px] font-bold text-muted uppercase tracking-[0.08em] mb-3.5">{title}</p>
      <div className="flex flex-col gap-3">
        {children}
      </div>
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
