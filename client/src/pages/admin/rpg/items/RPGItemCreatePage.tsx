import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";

const USE_EFFECT_TYPES = ["heal", "buff", "teleport", "trigger-event", "none"];

export default function RPGItemCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("consumable");
  const [iconAssetId, setIconAssetId] = useState("");
  const [stackable, setStackable] = useState(true);
  const [maxStack, setMaxStack] = useState(99);
  const [usable, setUsable] = useState(false);
  const [useEffectType, setUseEffectType] = useState("none");
  const [useEffectValue, setUseEffectValue] = useState(0);
  const [useEffectEventId, setUseEffectEventId] = useState("");
  const [useEffectMapId, setUseEffectMapId] = useState("");
  const [sellPrice, setSellPrice] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [questRelated, setQuestRelated] = useState(false);

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) { toast.error("ID or name required"); return; }
    setSaving(true);
    try {
      const data: Record<string, unknown> = {
        displayName, description, category, iconAssetId,
        stackable, maxStack, usable, questRelated,
        sellPrice, buyPrice,
      };
      if (usable && useEffectType !== "none") {
        const ue: Record<string, unknown> = { type: useEffectType };
        if (useEffectValue) ue.value = useEffectValue;
        if (useEffectEventId) ue.eventId = useEffectEventId;
        if (useEffectMapId) ue.mapId = useEffectMapId;
        data.useEffect = ue;
      }
      await setDoc(doc(db, COLLECTIONS.RPG_ITEMS, docId), data);
      toast.success("Item created");
      navigate("/admin/rpg/items");
    } catch (e) { console.error(e); toast.error("Failed to create item"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/items" className="text-blue-400 text-sm hover:underline">&larr; Back to Items</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Item</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <div><label className={LBL}>Category</label><input className={INP} value={category} onChange={e => setCategory(e.target.value)} placeholder="consumable, key, beyblade_part, equipment..." /></div>
        <div><label className={LBL}>Icon Asset ID</label><input className={INP} value={iconAssetId} onChange={e => setIconAssetId(e.target.value)} /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={stackable} onChange={e => setStackable(e.target.checked)} className="accent-blue-500" />
            Stackable
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={usable} onChange={e => setUsable(e.target.checked)} className="accent-blue-500" />
            Usable
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={questRelated} onChange={e => setQuestRelated(e.target.checked)} className="accent-blue-500" />
            Quest Related
          </label>
        </div>
        <div><label className={LBL}>Max Stack</label><input type="number" className={INP} value={maxStack} onChange={e => setMaxStack(+e.target.value)} /></div>
        {usable && (
          <div className="p-3 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
            <label className={LBL}>Use Effect</label>
            <div>
              <label className="text-xs text-gray-500">Type</label>
              <select className={INP} value={useEffectType} onChange={e => setUseEffectType(e.target.value)}>
                {USE_EFFECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-gray-500">Value</label><input type="number" className={INP} value={useEffectValue} onChange={e => setUseEffectValue(+e.target.value)} /></div>
            <div><label className="text-xs text-gray-500">Event ID</label><input className={INP} value={useEffectEventId} onChange={e => setUseEffectEventId(e.target.value)} /></div>
            <div><label className="text-xs text-gray-500">Map ID</label><input className={INP} value={useEffectMapId} onChange={e => setUseEffectMapId(e.target.value)} /></div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LBL}>Buy Price</label><input type="number" className={INP} value={buyPrice} onChange={e => setBuyPrice(+e.target.value)} /></div>
          <div><label className={LBL}>Sell Price</label><input type="number" className={INP} value={sellPrice} onChange={e => setSellPrice(+e.target.value)} /></div>
        </div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Item"}</button>
      </div>
    </div>
  );
}
