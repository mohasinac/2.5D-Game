import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";

const LBL = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5";
const INP = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500";
const TEXTAREA = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500";
const SELECT = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500";
const BTN_PRIMARY = "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors";
const CARD = "bg-gray-900 border border-gray-800 rounded-xl p-5";

interface StatModifiers {
  [key: string]: number;
}

export function BeyAccessoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = !id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isCreate);
  const [docId, setDocId] = useState(id ?? "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconEmoji, setIconEmoji] = useState("📦");
  const [effectType, setEffectType] = useState<"passive_stat" | "on_proc" | "on_burst" | "on_contact">("passive_stat");
  const [statModifiersRaw, setStatModifiersRaw] = useState('{"burstResistance": 25}');
  const [procChance, setProcChance] = useState(0.25);
  const [procEffect, setProcEffect] = useState("");

  useEffect(() => {
    if (isCreate) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEY_ACCESSORIES, id!));
        if (snap.exists()) {
          const d = snap.data();
          setName(d.name ?? "");
          setDescription(d.description ?? "");
          setIconEmoji(d.iconEmoji ?? "📦");
          setEffectType(d.effectType ?? "passive_stat");
          setStatModifiersRaw(d.statModifiers ? JSON.stringify(d.statModifiers, null, 2) : "{}");
          setProcChance(d.procChance ?? 0.25);
          setProcEffect(d.procEffect ?? "");
        }
      } catch (e) { console.error(e); toast.error("Failed to load"); }
      finally { setLoading(false); }
    })();
  }, [id, isCreate]);

  const handleSave = async () => {
    const saveId = docId.trim();
    if (!saveId || !name.trim()) { toast.error("ID and name are required"); return; }

    let statModifiers: StatModifiers = {};
    try {
      statModifiers = JSON.parse(statModifiersRaw);
    } catch {
      toast.error("Stat modifiers must be valid JSON");
      return;
    }

    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        iconEmoji: iconEmoji.trim(),
        effectType,
        statModifiers,
      };
      if (effectType === "on_proc") {
        data.procChance = procChance;
        data.procEffect = procEffect.trim();
      }
      await setDoc(doc(db, COLLECTIONS.BEY_ACCESSORIES, saveId), data, { merge: true });
      toast.success(isCreate ? "Created" : "Saved");
      navigate("/admin/bey-accessories");
    } catch (e) { console.error(e); toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading…</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/bey-accessories" className="text-blue-400 text-sm hover:underline">&larr; Back to Accessories</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">{isCreate ? "New Bey Accessory" : `Edit: ${id}`}</h1>
      </div>

      <div className={CARD + " space-y-4"}>
        {isCreate && (
          <div>
            <label className={LBL}>ID (slug)</label>
            <input className={INP} value={docId} onChange={e => setDocId(e.target.value)} placeholder="spin_sash" />
          </div>
        )}

        <div>
          <label className={LBL}>Name</label>
          <input className={INP} value={name} onChange={e => setName(e.target.value)} placeholder="Spin Sash" />
        </div>

        <div>
          <label className={LBL}>Icon Emoji</label>
          <input className={INP} value={iconEmoji} onChange={e => setIconEmoji(e.target.value)} placeholder="📦" />
        </div>

        <div>
          <label className={LBL}>Effect Type</label>
          <select className={SELECT} value={effectType} onChange={e => setEffectType(e.target.value as typeof effectType)}>
            <option value="passive_stat">Passive Stat — applied at match start</option>
            <option value="on_proc">On Proc — triggers at a random chance moment</option>
            <option value="on_burst">On Burst — triggers when bey bursts</option>
            <option value="on_contact">On Contact — triggers on each collision</option>
          </select>
        </div>

        <div>
          <label className={LBL}>Stat Modifiers (JSON) — field → delta value</label>
          <textarea
            className={TEXTAREA + " font-mono text-xs"}
            value={statModifiersRaw}
            onChange={e => setStatModifiersRaw(e.target.value)}
            rows={5}
            placeholder='{"burstResistance": 25, "damageReduction": 0.05}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Fields: burstResistance, damageReduction, spinDecayRate, maxSpin, attackBuffTimer, invulnerabilityTimer, etc.
          </p>
        </div>

        {effectType === "on_proc" && (
          <>
            <div>
              <label className={LBL}>Proc Chance (0–1)</label>
              <input type="number" min={0} max={1} step={0.01} className={INP} value={procChance} onChange={e => setProcChance(+e.target.value)} />
            </div>
            <div>
              <label className={LBL}>Proc Effect Description</label>
              <input className={INP} value={procEffect} onChange={e => setProcEffect(e.target.value)} placeholder="Survive one lethal spin-out at 10% spin" />
            </div>
          </>
        )}

        <div>
          <label className={LBL}>Description</label>
          <textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="A detailed description of what this accessory does in battle." />
        </div>

        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>
          {saving ? "Saving…" : isCreate ? "Create Accessory" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
