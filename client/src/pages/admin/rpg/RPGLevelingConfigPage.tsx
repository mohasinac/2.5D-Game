import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, BTN_PRIMARY, CARD } from "./rpgAdminShared";

export default function RPGLevelingConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maxPlayerLevel, setMaxPlayerLevel] = useState(50);
  const [maxBeybladeLevel, setMaxBeybladeLevel] = useState(20);
  const [xpCurve, setXpCurve] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_CONFIG, "leveling"));
        if (snap.exists()) {
          const d = snap.data();
          setMaxPlayerLevel(d.maxPlayerLevel ?? 50);
          setMaxBeybladeLevel(d.maxBeybladeLevel ?? 20);
          setXpCurve(d.xpCurve ?? []);
        } else {
          // Generate default curve
          const curve: number[] = [];
          for (let i = 0; i < 50; i++) {
            curve.push(Math.round(100 * Math.pow(1.15, i)));
          }
          setXpCurve(curve);
        }
      } catch (e) { console.error(e); toast.error("Failed to load leveling config"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_CONFIG, "leveling"), {
        maxPlayerLevel,
        maxBeybladeLevel,
        xpCurve,
      });
      toast.success("Leveling config saved");
    } catch (e) { console.error(e); toast.error("Failed to save leveling config"); }
    finally { setSaving(false); }
  };

  const updateXp = (index: number, value: number) => {
    const next = [...xpCurve];
    next[index] = value;
    setXpCurve(next);
  };

  const addLevel = () => {
    const last = xpCurve[xpCurve.length - 1] ?? 100;
    setXpCurve([...xpCurve, Math.round(last * 1.15)]);
  };

  const removeLastLevel = () => {
    if (xpCurve.length > 1) setXpCurve(xpCurve.slice(0, -1));
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg" className="text-blue-400 text-sm hover:underline">&larr; Back to RPG Admin</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Leveling Config</h1>
        <p className="text-gray-400 text-[13px] mt-1">Reads/writes rpg_config/leveling</p>
      </div>

      <div className={CARD + " space-y-4"}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LBL}>Max Player Level</label>
            <input type="number" className={INP} value={maxPlayerLevel} onChange={e => setMaxPlayerLevel(+e.target.value)} />
          </div>
          <div>
            <label className={LBL}>Max Beyblade Level</label>
            <input type="number" className={INP} value={maxBeybladeLevel} onChange={e => setMaxBeybladeLevel(+e.target.value)} />
          </div>
        </div>

        <div>
          <label className={LBL}>XP Curve (XP required per level)</label>
          <div className="max-h-[400px] overflow-y-auto border border-gray-700 rounded-lg">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-900">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 w-20">Level</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400">XP Required</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 w-24">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {xpCurve.map((xp, i) => {
                  const cumulative = xpCurve.slice(0, i + 1).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={i} className="border-t border-gray-800/50">
                      <td className="px-3 py-1 text-sm text-gray-400 font-mono">{i + 1}</td>
                      <td className="px-3 py-1">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white w-32"
                          value={xp}
                          onChange={e => updateXp(i, +e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-1 text-sm text-gray-500 font-mono">{cumulative.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={addLevel} className="text-xs text-blue-400 hover:text-blue-300">+ Add Level</button>
            <button onClick={removeLastLevel} className="text-xs text-red-400 hover:text-red-300">- Remove Last</button>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Leveling Config"}</button>
      </div>
    </div>
  );
}
