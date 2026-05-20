import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";

const TOTAL_POINTS = 360;
const MAX_PER_TYPE = 150;

interface FormData {
  displayName: string; spinDirection: "left"|"right"; mass: number; radius: number;
  attack: number; defense: number; stamina: number; imageFile: File|null; imagePreview: string;
}

function DistBar({ label, value, color, remaining, onChange }: { label:string; value:number; color:string; remaining:number; onChange:(v:number)=>void }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
        <span style={{ color }}>{label}</span>
        <span style={{ color:C.text, fontFamily:"monospace" }}>{value} / {MAX_PER_TYPE}</span>
      </div>
      <input type="range" min={0} max={Math.min(MAX_PER_TYPE, value+remaining)} value={value} onChange={e => onChange(+e.target.value)} style={{ accentColor:C.blue }} />
      <div style={{ width:"100%", height:6, background:C.bg3, borderRadius:3, overflow:"hidden", marginTop:4 }}>
        <div style={{ height:"100%", background:color, width:`${(value/MAX_PER_TYPE)*100}%`, borderRadius:3, transition:"width 150ms" }} />
      </div>
    </div>
  );
}

export function BeybladeCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    displayName:"", spinDirection:"right", mass:45, radius:4,
    attack:120, defense:120, stamina:120, imageFile:null, imagePreview:"",
  });

  const set = (key: keyof FormData, value: any) => setForm(f => ({ ...f, [key]:value }));
  const usedPoints = form.attack + form.defense + form.stamina;
  const remaining = TOTAL_POINTS - usedPoints;
  const derivedType = form.attack >= form.defense && form.attack >= form.stamina ? "attack"
    : form.defense >= form.stamina ? "defense" : "stamina";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("imageFile", file);
    const reader = new FileReader();
    reader.onload = ev => set("imagePreview", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.displayName.trim()) { toast.error("Name is required"); return; }
    if (usedPoints !== TOTAL_POINTS) { toast.error(`Points must total ${TOTAL_POINTS} (currently ${usedPoints})`); return; }
    setSaving(true);
    try {
      let imageUrl = "";
      if (form.imageFile) {
        const imageRef = ref(storage, `beyblades/${Date.now()}_${form.imageFile.name}`);
        await uploadBytes(imageRef, form.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      const { attack, defense, stamina } = form;
      const docRef = await addDoc(collection(db, COLLECTIONS.BEYBLADE_STATS), {
        displayName: form.displayName.trim(),
        fileName: form.displayName.toLowerCase().replace(/\s+/g,"_"),
        type: derivedType, spinDirection: form.spinDirection,
        mass: form.mass, radius: form.radius, imageUrl,
        typeDistribution: { attack, defense, stamina, total:TOTAL_POINTS },
        damageMultiplier: 1.0 + attack*0.007, damageReduction: 1 - defense*0.003,
        invulnerabilityChance: defense*0.001, knockbackResistance: 1 - defense*0.002,
        spinDecayRate: 8*(1 - stamina*0.001), maxSpin: 2000*(1 + stamina*0.0008),
        spinStealFactor: stamina*0.002, maxHealth:100,
        pointsOfContact:[{ angle:0, damageMultiplier:1.0+attack*0.005, width:45 }],
        spinStealPoints:[{ angle:180, spinStealMultiplier:1.0+stamina*0.004, width:45 }],
        createdAt: serverTimestamp(),
      });
      toast.success(`Created ${form.displayName}!`);
      navigate(`/admin/beyblades/edit/${docRef.id}`);
    } catch (err) { console.error(err); toast.error("Failed to create beyblade"); }
    finally { setSaving(false); }
  };

  const steps = ["Basic Info","Type Distribution","Image"];

  return (
    <div style={{ padding:24, maxWidth:600, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}>
        <Link to="/admin/beyblades" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Beyblades</Link>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:8 }}>New Beyblade</h1>
      </div>

      {/* Step indicators */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <button
              onClick={() => i <= step && setStep(i)}
              style={{
                width:32, height:32, borderRadius:"50%", fontSize:13, fontWeight:700, cursor:"pointer", border:"none",
                background: i === step ? C.blue : i < step ? C.green : C.bg3,
                color: i <= step ? C.white : C.faint,
              }}
            >{i < step ? "✓" : i+1}</button>
            <span style={{ marginLeft:8, fontSize:13, flex:1, color: i === step ? C.text : C.faint }}>{s}</span>
            {i < steps.length-1 && <div style={{ height:2, flex:1, marginLeft:8, background: i < step ? C.green : C.border }} />}
          </div>
        ))}
      </div>

      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
        {step === 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={S.label}>Display Name *</label>
              <input type="text" value={form.displayName} onChange={e => set("displayName",e.target.value)} placeholder="e.g. Storm Pegasus" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Spin Direction</label>
              <div style={{ display:"flex", gap:8 }}>
                {(["right","left"] as const).map(dir => (
                  <button key={dir} onClick={() => set("spinDirection",dir)} style={{
                    flex:1, padding:"8px", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", textTransform:"capitalize",
                    background: form.spinDirection===dir ? C.blue : "transparent",
                    color: form.spinDirection===dir ? C.white : C.muted,
                    border: `1px solid ${form.spinDirection===dir ? C.blue : C.border}`,
                  }}>{dir}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={S.label}>Mass (grams)</label>
                <input type="number" min={30} max={80} value={form.mass} onChange={e => set("mass",+e.target.value)} style={S.input} />
                <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>Real beyblades: 40–60g</p>
              </div>
              <div>
                <label style={S.label}>Radius (cm)</label>
                <input type="number" min={2} max={7} step={0.5} value={form.radius} onChange={e => set("radius",+e.target.value)} style={S.input} />
                <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>Standard: 3–5cm</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <p style={{ fontSize:13, color:C.muted }}>Distribute {TOTAL_POINTS} points (max {MAX_PER_TYPE} each)</p>
              <span style={{ fontSize:13, fontFamily:"monospace", fontWeight:700, color: remaining===0 ? C.green : remaining<0 ? C.red : C.yellow }}>
                {remaining>0 ? `${remaining} remaining` : remaining<0 ? `${Math.abs(remaining)} over` : "Perfect!"}
              </span>
            </div>
            <DistBar label="Attack" value={form.attack} color={C.red} remaining={remaining} onChange={v => set("attack",v)} />
            <DistBar label="Defense" value={form.defense} color={C.blue} remaining={remaining} onChange={v => set("defense",v)} />
            <DistBar label="Stamina" value={form.stamina} color={C.green} remaining={remaining} onChange={v => set("stamina",v)} />
            <div style={{ background:C.bg3+"88", borderRadius:12, padding:14 }}>
              <p style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Derived type: <strong style={{ color:C.text, textTransform:"capitalize" }}>{derivedType}</strong></p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, fontSize:12, color:C.faint }}>
                <span>Damage mult: <span style={{ color:C.text }}>{(1.0+form.attack*0.007).toFixed(2)}x</span></span>
                <span>Dmg reduction: <span style={{ color:C.text }}>{(1-form.defense*0.003).toFixed(2)}x</span></span>
                <span>Max spin: <span style={{ color:C.text }}>{Math.round(2000*(1+form.stamina*0.0008))}</span></span>
                <span>Spin decay: <span style={{ color:C.text }}>{(8*(1-form.stamina*0.001)).toFixed(1)}/s</span></span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={S.label}>Beyblade Image (PNG, transparent background)</label>
              <div style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:24, textAlign:"center" }}>
                {form.imagePreview ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
                    <img src={form.imagePreview} alt="Preview" style={{ width:96, height:96, objectFit:"contain", background:C.bg1, borderRadius:"50%" }} />
                    <p style={{ fontSize:11, color:C.faint }}>{form.imageFile?.name}</p>
                    <button onClick={() => { set("imageFile",null); set("imagePreview",""); }} style={{ fontSize:12, color:C.red, background:"none", border:"none", cursor:"pointer" }}>Remove</button>
                  </div>
                ) : (
                  <label style={{ cursor:"pointer" }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>🖼️</div>
                    <p style={{ color:C.muted, fontSize:13, marginBottom:4 }}>Click to upload image</p>
                    <p style={{ color:C.faint, fontSize:11 }}>PNG with transparent background, 300×300px recommended</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display:"none" }} />
                  </label>
                )}
              </div>
            </div>
            <div style={{ background:C.bg3+"88", borderRadius:12, padding:14 }}>
              <h4 style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:8 }}>Summary</h4>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, fontSize:12, color:C.faint }}>
                <span>Name: <span style={{ color:C.text }}>{form.displayName||"—"}</span></span>
                <span>Type: <span style={{ color:C.text, textTransform:"capitalize" }}>{derivedType}</span></span>
                <span>Spin: <span style={{ color:C.text, textTransform:"capitalize" }}>{form.spinDirection}</span></span>
                <span>Mass: <span style={{ color:C.text }}>{form.mass}g / {form.radius}cm</span></span>
                <span>Points: <span style={{ color: usedPoints===TOTAL_POINTS ? C.green : C.red }}>{usedPoints}/{TOTAL_POINTS}</span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
        <button onClick={() => step>0 ? setStep(step-1) : navigate("/admin/beyblades")} style={{ padding:"8px 18px", border:`1px solid ${C.border}`, color:C.muted, background:"transparent", borderRadius:8, fontSize:13, cursor:"pointer" }}>
          {step===0 ? "Cancel" : "Back"}
        </button>
        {step < steps.length-1 ? (
          <button onClick={() => setStep(step+1)} disabled={step===0 && !form.displayName.trim()} style={{ padding:"8px 20px", background:C.blue, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: step===0&&!form.displayName.trim() ? 0.5 : 1 }}>
            Continue
          </button>
        ) : (
          <button onClick={handleSave} disabled={saving||usedPoints!==TOTAL_POINTS} style={{ padding:"8px 20px", background:C.green, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: saving||usedPoints!==TOTAL_POINTS ? 0.5 : 1 }}>
            {saving ? "Creating..." : "Create Beyblade"}
          </button>
        )}
      </div>
    </div>
  );
}
