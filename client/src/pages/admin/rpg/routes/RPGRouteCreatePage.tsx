import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify } from "../rpgAdminShared";

export default function RPGRouteCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [protagonistNpcId, setProtagonistNpcId] = useState("");
  const [description, setDescription] = useState("");
  const [startingMapId, setStartingMapId] = useState("");
  const [startingTileX, setStartingTileX] = useState(0);
  const [startingTileY, setStartingTileY] = useState(0);
  const [startingFacing, setStartingFacing] = useState("down");
  const [startingBeybladeId, setStartingBeybladeId] = useState("");
  const [cardImageAssetId, setCardImageAssetId] = useState("");
  const [availableInArcs, setAvailableInArcs] = useState("");

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) { toast.error("ID or name required"); return; }
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_ROUTES, docId), {
        displayName, protagonistNpcId, description,
        startingMapId,
        startingTile: { x: startingTileX, y: startingTileY },
        startingFacing, startingBeybladeId, cardImageAssetId,
        availableInArcs: availableInArcs.split(",").map(s => s.trim()).filter(Boolean),
      });
      toast.success("Route created");
      navigate("/admin/rpg/routes");
    } catch (e) { console.error(e); toast.error("Failed to create route"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/routes" className="text-blue-400 text-sm hover:underline">&larr; Back to Routes</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Route</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Protagonist NPC ID</label><input className={INP} value={protagonistNpcId} onChange={e => setProtagonistNpcId(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <div><label className={LBL}>Starting Map ID</label><input className={INP} value={startingMapId} onChange={e => setStartingMapId(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LBL}>Starting Tile X</label><input type="number" className={INP} value={startingTileX} onChange={e => setStartingTileX(+e.target.value)} /></div>
          <div><label className={LBL}>Starting Tile Y</label><input type="number" className={INP} value={startingTileY} onChange={e => setStartingTileY(+e.target.value)} /></div>
        </div>
        <div>
          <label className={LBL}>Starting Facing</label>
          <select className={INP} value={startingFacing} onChange={e => setStartingFacing(e.target.value)}>
            {["up", "down", "left", "right"].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div><label className={LBL}>Starting Beyblade ID</label><input className={INP} value={startingBeybladeId} onChange={e => setStartingBeybladeId(e.target.value)} /></div>
        <div><label className={LBL}>Card Image Asset ID</label><input className={INP} value={cardImageAssetId} onChange={e => setCardImageAssetId(e.target.value)} /></div>
        <div><label className={LBL}>Available In Arcs (comma separated)</label><input className={INP} value={availableInArcs} onChange={e => setAvailableInArcs(e.target.value)} /></div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Route"}</button>
      </div>
    </div>
  );
}
