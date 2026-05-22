import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";
import WhatsAppStyleImageEditor from "@/components/admin/WhatsAppStyleImageEditor";
import ImageCropper from "@/components/admin/ImageCropper";
import type { ImageCropperRef } from "@/components/admin/ImageCropper";
import Step3ContactPoints from "@/components/admin/Step3ContactPoints";
import type { BeybladeStats, PointOfContact } from "@/types/beybladeStats";

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
  const [rawImageUrl, setRawImageUrl] = useState("");
  const [imageEditorMode, setImageEditorMode] = useState<"whatsapp" | "crop" | null>(null);
  const [imagePosition, setImagePosition] = useState({ x:0, y:0, scale:1, rotation:0 });
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>([]);
  const cropperRef = useRef<ImageCropperRef>(null);

  const set = (key: keyof FormData, value: any) => setForm(f => ({ ...f, [key]:value }));
  const usedPoints = form.attack + form.defense + form.stamina;
  const remaining = TOTAL_POINTS - usedPoints;
  const derivedType = form.attack >= form.defense && form.attack >= form.stamina ? "attack"
    : form.defense >= form.stamina ? "defense" : "stamina";

  const previewBeyblade: BeybladeStats = {
    id: "",
    displayName: form.displayName || "Preview",
    fileName: "",
    type: derivedType,
    spinDirection: form.spinDirection,
    mass: form.mass,
    radius: form.radius,
    imageUrl: form.imagePreview || undefined,
    imagePosition,
    typeDistribution: { attack: form.attack, defense: form.defense, stamina: form.stamina, total: TOTAL_POINTS },
    damageMultiplier: (1.0 + form.attack * 0.007) * (derivedType === "attack" ? 1.2 : 1),
    damageTaken: Math.max(0.45, (1 - form.defense * 0.003) * (derivedType === "defense" ? 0.8 : 1)),
    knockbackDistance: 10 * (1 - form.defense * 0.00167),
    invulnerabilityChance: 0.1 + form.defense * 0.000667,
    spinDecayRate: 8 * (1 - form.stamina * 0.001),
    maxSpin: Math.ceil(2000 * (1 + form.stamina * 0.0008)),
    spinStealFactor: 0.1 * (1 + form.stamina * 0.02667),
    maxStamina: derivedType === "stamina"
      ? Math.ceil(1000 * (1 + form.stamina * 0.01333))
      : Math.min(Math.ceil(1000 * (1 + form.stamina * 0.01333)), 2500),
    pointsOfContact,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("imageFile", file);
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setRawImageUrl(url);
      const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
      setImageEditorMode(isGif ? null : "whatsapp");
      if (isGif) set("imagePreview", url);
    };
    reader.readAsDataURL(file);
  };

  const handleImageEditorSave = async () => {
    if (imageEditorMode === "crop" && cropperRef.current) {
      try {
        const blob = await cropperRef.current.getCroppedImage();
        const url = URL.createObjectURL(blob);
        set("imagePreview", url);
        const croppedFile = new File([blob], form.imageFile?.name ?? "cropped.jpg", { type:"image/jpeg" });
        set("imageFile", croppedFile);
      } catch { toast.error("Failed to crop image"); }
    } else {
      set("imagePreview", rawImageUrl);
    }
    setImageEditorMode(null);
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
      let damageMultiplier = 1.0 + attack * 0.007;
      let damageTaken = Math.max(0.45, 1 - defense * 0.003);
      const knockbackDistance = 10 * (1 - defense * 0.00167);
      const invulnerabilityChance = 0.1 + defense * 0.000667;
      let maxStamina = Math.ceil(1000 * (1 + stamina * 0.01333));
      const spinStealFactor = 0.1 * (1 + stamina * 0.02667);
      const spinDecayRate = 8 * (1 - stamina * 0.001);
      const maxSpin = Math.ceil(2000 * (1 + stamina * 0.0008));
      const speedBonus = 1.0 + attack * 0.007;
      if (derivedType === "attack") { damageMultiplier *= 1.2; maxStamina = 2500; }
      else if (derivedType === "defense") { damageTaken *= 0.8; maxStamina = 2500; }
      const docRef = await addDoc(collection(db, COLLECTIONS.BEYBLADE_STATS), {
        displayName: form.displayName.trim(),
        fileName: form.displayName.toLowerCase().replace(/\s+/g,"_"),
        type: derivedType, spinDirection: form.spinDirection,
        mass: form.mass, radius: form.radius, imageUrl, imagePosition,
        typeDistribution: { attack, defense, stamina, total:TOTAL_POINTS },
        damageMultiplier, damageTaken, knockbackDistance,
        invulnerabilityChance, spinDecayRate, maxSpin, spinStealFactor,
        maxStamina, speedBonus,
        pointsOfContact,
        createdAt: serverTimestamp(),
      });
      toast.success(`Created ${form.displayName}!`);
      navigate(`/admin/beyblades/edit/${docRef.id}`);
    } catch (err) { console.error(err); toast.error("Failed to create beyblade"); }
    finally { setSaving(false); }
  };

  const steps = ["Basic Info", "Type Distribution", "Image", "Contact Points"];

  return (
    <div style={{ padding:24, maxWidth: step === 3 ? 960 : 600, margin:"0 auto", transition:"max-width 200ms" }}>
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
            <span style={{ marginLeft:8, fontSize:12, color: i === step ? C.text : C.faint, whiteSpace:"nowrap" }}>{s}</span>
            {i < steps.length-1 && <div style={{ height:2, flex:1, marginLeft:8, background: i < step ? C.green : C.border }} />}
          </div>
        ))}
      </div>

      {step < 3 && (
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
                  <span>Damage mult: <span style={{ color:C.text }}>{((1.0+form.attack*0.007)*(derivedType==="attack"?1.2:1)).toFixed(2)}x</span></span>
                  <span>Dmg taken: <span style={{ color:C.text }}>{(Math.max(0.45,1-form.defense*0.003)*(derivedType==="defense"?0.8:1)).toFixed(2)}x</span></span>
                  <span>Max stamina: <span style={{ color:C.text }}>{derivedType==="stamina"?Math.ceil(1000*(1+form.stamina*0.01333)):Math.min(Math.ceil(1000*(1+form.stamina*0.01333)),2500)}</span></span>
                  <span>Spin steal: <span style={{ color:C.text }}>{((0.1*(1+form.stamina*0.02667))*100).toFixed(1)}%</span></span>
                  <span>Max spin: <span style={{ color:C.text }}>{Math.ceil(2000*(1+form.stamina*0.0008))}</span></span>
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
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => setImageEditorMode("whatsapp")} style={{ fontSize:12, color:C.blue, background:"none", border:"none", cursor:"pointer" }}>🖼 Reposition</button>
                        <button onClick={() => setImageEditorMode("crop")} style={{ fontSize:12, color:C.muted, background:"none", border:"none", cursor:"pointer" }}>✂️ Crop</button>
                        <button onClick={() => { set("imageFile",null); set("imagePreview",""); setRawImageUrl(""); }} style={{ fontSize:12, color:C.red, background:"none", border:"none", cursor:"pointer" }}>Remove</button>
                      </div>
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

              {imageEditorMode && rawImageUrl && (
                <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:1000, overflowY:"auto", padding:"20px 16px" }}>
                  <div style={{ width:"100%", maxWidth: imageEditorMode === "whatsapp" ? "fit-content" : 420 }}>
                    {imageEditorMode === "whatsapp" && (
                      <WhatsAppStyleImageEditor
                        imageUrl={rawImageUrl}
                        onPositionChange={setImagePosition}
                        initialPosition={imagePosition}
                        circleSize={Math.min(320, window.innerWidth - 80)}
                        onSave={handleImageEditorSave}
                        onCancel={() => setImageEditorMode(null)}
                      />
                    )}
                    {imageEditorMode === "crop" && (
                      <div style={{ background:C.bg2, borderRadius:12, padding:16 }}>
                        <ImageCropper ref={cropperRef} imageUrl={rawImageUrl} targetWidth={300} targetHeight={300} />
                        <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:12 }}>
                          <button onClick={() => setImageEditorMode(null)} style={{ padding:"6px 16px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:13, cursor:"pointer" }}>Cancel</button>
                          <button onClick={handleImageEditorSave} style={{ padding:"6px 16px", background:C.blue, border:"none", borderRadius:8, color:C.white, fontSize:13, fontWeight:600, cursor:"pointer" }}>Apply Crop</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
      )}

      {step === 3 && (
        <Step3ContactPoints
          beyblade={previewBeyblade}
          onChange={(updated) => {
            if (updated.pointsOfContact !== undefined) setPointsOfContact(updated.pointsOfContact);
          }}
        />
      )}

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
