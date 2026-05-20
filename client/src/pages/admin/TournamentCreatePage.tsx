import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S, btn } from "@/styles/theme";

interface FormState {
  name: string;
  description: string;
  type: "pvp" | "player-gauntlet" | "mixed" | "ai-exhibition";
  maxParticipants: 2 | 4 | 8;
  scheduledStartTime: string; // datetime-local string
  registrationDeadline: string;
  roundIntervalMinutes: number;
  bestOf: 1 | 3 | 5;
  aiDifficulty: "easy" | "medium" | "hard";
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

      const docRef = await addDoc(collection(db, COLLECTIONS.TOURNAMENTS), {
        name: form.name.trim(),
        description: form.description.trim() || null,
        type: form.type,
        status: "draft",
        maxParticipants: form.maxParticipants,
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
      navigate(`/admin/tournaments/${docRef.id}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create tournament.");
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/tournaments" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Tournaments</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 8 }}>Create Tournament</h1>
      </div>

      {error && (
        <div style={{ background: C.red + "18", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: C.red, fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Section title="Basic Info">
          <Field label="Name *">
            <input style={S.input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Summer Championship 2026" />
          </Field>
          <Field label="Description">
            <textarea style={{ ...S.input, resize: "vertical", minHeight: 72 }} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional description..." />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Type">
              <select style={S.input} value={form.type} onChange={(e) => set("type", e.target.value as any)}>
                <option value="pvp">PVP</option>
                <option value="player-gauntlet">Player Gauntlet</option>
                <option value="mixed">Mixed (AI fill)</option>
                <option value="ai-exhibition">AI Exhibition</option>
              </select>
            </Field>
            <Field label="Max Participants">
              <select style={S.input} value={form.maxParticipants} onChange={(e) => set("maxParticipants", Number(e.target.value) as any)}>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Schedule">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Start Time *">
              <input style={S.input} type="datetime-local" value={form.scheduledStartTime} onChange={(e) => set("scheduledStartTime", e.target.value)} />
            </Field>
            <Field label="Registration Deadline">
              <input style={S.input} type="datetime-local" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} />
            </Field>
          </div>
          <Field label="Minutes Between Rounds">
            <input style={{ ...S.input, width: 100 }} type="number" min={5} max={120} value={form.roundIntervalMinutes} onChange={(e) => set("roundIntervalMinutes", Number(e.target.value))} />
          </Field>
        </Section>

        <Section title="Format">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <Field label="Best Of">
              <select style={S.input} value={form.bestOf} onChange={(e) => set("bestOf", Number(e.target.value) as any)}>
                <option value={1}>BO1 (Single)</option>
                <option value={3}>BO3 (First to 2)</option>
                <option value={5}>BO5 (First to 3)</option>
              </select>
            </Field>
            <Field label="AI Difficulty">
              <select style={S.input} value={form.aiDifficulty} onChange={(e) => set("aiDifficulty", e.target.value as any)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </Field>
            <Field label="Auto-Fill with AI">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <input type="checkbox" checked={form.autoFillWithAI} onChange={(e) => set("autoFillWithAI", e.target.checked)} style={{ width: 16, height: 16 }} />
                <span style={{ color: C.muted, fontSize: 13 }}>Fill empty slots</span>
              </div>
            </Field>
          </div>
        </Section>

        <Section title="Restrictions (optional)">
          <Field label="Allowed Beyblade IDs (comma/newline — empty = all allowed)">
            <textarea style={{ ...S.input, resize: "vertical", minHeight: 60, fontFamily: "monospace", fontSize: 12 }} value={form.allowedBeybladeIds} onChange={(e) => set("allowedBeybladeIds", e.target.value)} placeholder="id1, id2, ..." />
          </Field>
          <Field label="Disabled Beyblade IDs">
            <textarea style={{ ...S.input, resize: "vertical", minHeight: 60, fontFamily: "monospace", fontSize: 12 }} value={form.disabledBeybladeIds} onChange={(e) => set("disabledBeybladeIds", e.target.value)} placeholder="banned_id1, ..." />
          </Field>
          <Field label="Allowed Arena IDs (empty = any arena)">
            <textarea style={{ ...S.input, resize: "vertical", minHeight: 40, fontFamily: "monospace", fontSize: 12 }} value={form.allowedArenaIds} onChange={(e) => set("allowedArenaIds", e.target.value)} placeholder="arena_id1, ..." />
          </Field>
        </Section>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link to="/admin/tournaments" style={{ ...btn(C.bg3), textDecoration: "none", display: "inline-block" }}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} style={{ ...btn(C.yellow), color: C.bg0 }}>
            {saving ? "Creating..." : "Create Tournament"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
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
