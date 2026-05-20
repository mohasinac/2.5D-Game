import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeStats } from "@/types/beybladeStats";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

const TOTAL_POINTS = 360;
const MAX_PER_TYPE = 150;

function StatBar({ label, value, color, remaining, onChange }: { label:string; value:number; color:string; remaining:number; onChange:(v:number)=>void }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
        <span style={{ color }}>{label}</span>
        <span style={{ color:C.text, fontFamily:"monospace" }}>{value} / {MAX_PER_TYPE}</span>
      </div>
      <input type="range" min={0} max={Math.min(MAX_PER_TYPE, value+remaining)} value={value} onChange={e => onChange(+e.target.value)} style={{ accentColor:C.blue }} />
      <div style={{ width:"100%", height:5, background:C.bg3, borderRadius:3, overflow:"hidden", marginTop:4 }}>
        <div style={{ height:"100%", background:color, width:`${(value/MAX_PER_TYPE)*100}%`, borderRadius:3, transition:"width 150ms" }} />
      </div>
    </div>
  );
}

export function BeybladeEditPage() {
  const { id } = useParams<{ id:string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [beyblade, setBeyblade] = useState<BeybladeStats | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, id));
        if (!snap.exists()) { toast.error("Beyblade not found"); navigate("/admin/beyblades"); return; }
        const data = { id:snap.id, ...snap.data() } as BeybladeStats;
        setBeyblade(data);
        setImagePreview(data.imageUrl ?? "");
      } catch { toast.error("Failed to load beyblade"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const set = (key: keyof BeybladeStats, value: any) => setBeyblade(b => b ? { ...b, [key]:value } : b);
  const setDist = (key: "attack"|"defense"|"stamina", value: number) =>
    setBeyblade(b => b ? { ...b, typeDistribution:{ ...b.typeDistribution, [key]:value, total:TOTAL_POINTS } } : b);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!beyblade || !id) return;
    const { attack, defense, stamina } = beyblade.typeDistribution;
    if (attack+defense+stamina !== TOTAL_POINTS) { toast.error(`Points must total ${TOTAL_POINTS}`); return; }
    setSaving(true);
    try {
      let imageUrl = beyblade.imageUrl ?? "";
      if (imageFile) {
        const imageRef = ref(storage, `beyblades/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      await updateDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, id), {
        displayName: beyblade.displayName, type: beyblade.type,
        spinDirection: beyblade.spinDirection, mass: beyblade.mass, radius: beyblade.radius,
        imageUrl, typeDistribution: beyblade.typeDistribution,
        damageMultiplier: 1.0+attack*0.007, damageReduction: 1-defense*0.003,
        invulnerabilityChance: defense*0.001, knockbackResistance: 1-defense*0.002,
        spinDecayRate: 8*(1-stamina*0.001), maxSpin: 2000*(1+stamina*0.0008),
        spinStealFactor: stamina*0.002, updatedAt: serverTimestamp(),
      });
      toast.success("Saved!");
    } catch (err) { console.error(err); toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ padding:24, display:"flex", alignItems:"center", justifyContent:"center", height:200 }}>
      <div className="spin" style={{ width:32, height:32, border:`2px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%" }} />
    </div>
  );
  if (!beyblade) return null;

  const { attack, defense, stamina } = beyblade.typeDistribution;
  const usedPoints = attack+defense+stamina;
  const remaining = TOTAL_POINTS - usedPoints;

  return (
    <div style={{ padding:24, maxWidth:800, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <Link to="/admin/beyblades" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Beyblades</Link>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:6 }}>Edit: {beyblade.displayName}</h1>
        </div>
        <button onClick={handleSave} disabled={saving||usedPoints!==TOTAL_POINTS} style={{ padding:"8px 20px", background:C.blue, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: saving||usedPoints!==TOTAL_POINTS ? 0.5 : 1 }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
            <div style={S.sectionTitle}>Basic Info</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={S.label}>Display Name</label>
                <input type="text" value={beyblade.displayName} onChange={e => set("displayName",e.target.value)} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Spin Direction</label>
                <div style={{ display:"flex", gap:6 }}>
                  {(["right","left"] as const).map(dir => (
                    <button key={dir} onClick={() => set("spinDirection",dir)} style={{
                      flex:1, padding:"6px", borderRadius:6, fontSize:12, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
                      background: beyblade.spinDirection===dir ? C.blue : "transparent",
                      color: beyblade.spinDirection===dir ? C.white : C.muted,
                      border: `1px solid ${beyblade.spinDirection===dir ? C.blue : C.border}`,
                    }}>{dir}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={S.label}>Mass (g)</label>
                  <input type="number" min={30} max={80} value={beyblade.mass} onChange={e => set("mass",+e.target.value)} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Radius (cm)</label>
                  <input type="number" min={2} max={7} step={0.5} value={beyblade.radius} onChange={e => set("radius",+e.target.value)} style={S.input} />
                </div>
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
            <div style={S.sectionTitle}>Sprite Image</div>
            <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:C.bg1, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
                {imagePreview ? <img src={imagePreview} alt="Preview" style={{ width:"100%", height:"100%", objectFit:"contain" }} /> : <span style={{ fontSize:24, color:C.faint }}>🌀</span>}
              </div>
              <div style={{ flex:1 }}>
                <label style={{ cursor:"pointer", display:"inline-block", padding:"6px 16px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.muted }}>
                  {imagePreview ? "Replace Image" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display:"none" }} />
                </label>
                {imageFile && <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>{imageFile.name}</p>}
                <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>PNG with transparent background, 300×300px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={S.sectionTitle}>Type Distribution</div>
              <span style={{ fontSize:12, fontFamily:"monospace", fontWeight:700, color: remaining===0 ? C.green : remaining<0 ? C.red : C.yellow }}>
                {remaining>0 ? `${remaining} left` : remaining<0 ? `${Math.abs(remaining)} over!` : "✓ Balanced"}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <StatBar label="Attack" value={attack} color={C.red} remaining={remaining} onChange={v => setDist("attack",v)} />
              <StatBar label="Defense" value={defense} color={C.blue} remaining={remaining} onChange={v => setDist("defense",v)} />
              <StatBar label="Stamina" value={stamina} color={C.green} remaining={remaining} onChange={v => setDist("stamina",v)} />
            </div>
          </div>

          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
            <div style={S.sectionTitle}>Derived Stats</div>
            {[
              ["Damage Multiplier", `${(1.0+attack*0.007).toFixed(2)}x`],
              ["Damage Reduction", `${((1-defense*0.003)*100).toFixed(0)}%`],
              ["Invuln Chance", `${(defense*0.1).toFixed(1)}%`],
              ["Max Spin", `${Math.round(2000*(1+stamina*0.0008))}`],
              ["Spin Decay", `${(8*(1-stamina*0.001)).toFixed(1)}/s`],
              ["Spin Steal", `${(stamina*0.2).toFixed(1)}%`],
            ].map(([k,v],i,arr) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, padding:"6px 0", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ color:C.muted }}>{k}</span>
                <span style={{ color:C.text, fontFamily:"monospace" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
