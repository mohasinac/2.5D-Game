import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeStats } from "@/types/beybladeStats";
import { ELEMENT_ICONS, ELEMENT_COLORS } from "@/types/elementTypes";
import type { ElementType } from "@/types/elementTypes";
import toast from "react-hot-toast";
import { C, S } from "@/styles/theme";
import WhatsAppStyleImageEditor from "@/components/admin/WhatsAppStyleImageEditor";
import ImageCropper from "@/components/admin/ImageCropper";
import type { ImageCropperRef } from "@/components/admin/ImageCropper";
import BeybladePreview from "@/components/admin/BeybladePreview";
import Step3ContactPoints from "@/components/admin/Step3ContactPoints";

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
  const [editorMode, setEditorMode] = useState<"whatsapp" | "crop" | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const cropperRef = useRef<ImageCropperRef>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, id));
        if (!snap.exists()) { toast.error("Beyblade not found"); navigate("/admin/beyblades"); return; }
        const data = { id:snap.id, ...snap.data() } as BeybladeStats;
        setBeyblade(data);
        setImagePreview(data.imageUrl ?? "");
        if (data.imagePosition) setImagePosition(data.imagePosition);
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
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setRawImageUrl(url);
      const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
      setEditorMode(isGif ? null : "whatsapp");
      if (isGif) setImagePreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorSave = async () => {
    if (editorMode === "crop" && cropperRef.current) {
      try {
        const blob = await cropperRef.current.getCroppedImage();
        const url = URL.createObjectURL(blob);
        setImagePreview(url);
        const croppedFile = new File([blob], imageFile?.name ?? "cropped.jpg", { type: "image/jpeg" });
        setImageFile(croppedFile);
      } catch {
        toast.error("Failed to crop image");
      }
    } else {
      setImagePreview(rawImageUrl);
    }
    setEditorMode(null);
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
      let damageMultiplier = 1.0 + attack * 0.007;
      let damageTaken = Math.max(0.45, 1 - defense * 0.003);
      const knockbackDistance = 10 * (1 - defense * 0.00167);
      const invulnerabilityChance = 0.1 + defense * 0.000667;
      let maxStamina = Math.ceil(1000 * (1 + stamina * 0.01333));
      const spinStealFactor = 0.1 * (1 + stamina * 0.02667);
      const spinDecayRate = 8 * (1 - stamina * 0.001);
      const maxSpin = Math.ceil(2000 * (1 + stamina * 0.0008));
      const speedBonus = 1.0 + attack * 0.007;
      switch (beyblade.type) {
        case "attack": damageMultiplier *= 1.2; maxStamina = 2500; break;
        case "defense": damageTaken *= 0.8; maxStamina = 2500; break;
        case "balanced": maxStamina = Math.min(maxStamina, 2500); break;
      }
      await updateDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, id), {
        displayName: beyblade.displayName, type: beyblade.type,
        spinDirection: beyblade.spinDirection, mass: beyblade.mass, radius: beyblade.radius,
        imageUrl, imagePosition,
        typeDistribution: beyblade.typeDistribution,
        damageMultiplier, damageTaken, knockbackDistance,
        invulnerabilityChance, spinDecayRate, maxSpin, spinStealFactor,
        maxStamina, speedBonus,
        pointsOfContact: beyblade.pointsOfContact ?? [],
        spinStealPoints: beyblade.spinStealPoints ?? [],
        updatedAt: serverTimestamp(),
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
    <div style={{ padding:24, maxWidth:980, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <Link to="/admin/beyblades" style={{ color:C.faint, fontSize:13, textDecoration:"none" }}>← Beyblades</Link>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, marginTop:6 }}>Edit: {beyblade.displayName}</h1>
        </div>
        <button onClick={handleSave} disabled={saving||usedPoints!==TOTAL_POINTS} style={{ padding:"8px 20px", background:C.blue, color:C.white, borderRadius:8, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", opacity: saving||usedPoints!==TOTAL_POINTS ? 0.5 : 1 }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Two-column: editors left, preview right */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 390px", gap:20, alignItems:"start", marginBottom:20 }}>
        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Basic Info */}
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

          {/* Sprite Image */}
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
                {imageFile && (
                  <div style={{ display:"flex", gap:8, marginTop:8 }}>
                    <button type="button" onClick={() => setEditorMode("whatsapp")} style={{ padding:"4px 12px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.muted, cursor:"pointer" }}>
                      🖼 Reposition
                    </button>
                    <button type="button" onClick={() => setEditorMode("crop")} style={{ padding:"4px 12px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.muted, cursor:"pointer" }}>
                      ✂️ Crop
                    </button>
                  </div>
                )}
                <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>PNG with transparent background, 300×300px</p>
              </div>
            </div>
          </div>

          {/* Type Distribution */}
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
            {/* Derived stats inline */}
            <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 16px", fontSize:11, color:C.faint }}>
              {((): [string,string][] => {
                const dmg = (1.0+attack*0.007)*(beyblade.type==="attack"?1.2:1);
                const taken = Math.max(0.45,1-defense*0.003)*(beyblade.type==="defense"?0.8:1);
                const hp = beyblade.type==="stamina" ? Math.ceil(1000*(1+stamina*0.01333)) : Math.min(Math.ceil(1000*(1+stamina*0.01333)),2500);
                return [
                  ["Damage", `${dmg.toFixed(2)}x`],
                  ["Taken", `${(taken*100).toFixed(0)}%`],
                  ["Max HP", `${hp}`],
                  ["Spin Steal", `${((0.1*(1+stamina*0.02667))*100).toFixed(1)}%`],
                  ["Max Spin", `${Math.ceil(2000*(1+stamina*0.0008))}`],
                  ["Decay", `${(8*(1-stamina*0.001)).toFixed(1)}/s`],
                ];
              })().map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span>{k}:</span>
                  <span style={{ color:C.text, fontFamily:"monospace" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Element Types (Phase AB) */}
          <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:12 }}>Element Types (max 2)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
              {(["fire","water","earth","lightning","wind","ice","shadow","light","metal","nature","thunder","void"] as ElementType[]).map(elem => {
                const selected = (beyblade.elementTypes ?? []).includes(elem);
                const canAdd = !selected && (beyblade.elementTypes?.length ?? 0) < 2;
                return (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => {
                      const cur = beyblade.elementTypes ?? [];
                      if (selected) {
                        set("elementTypes", cur.filter(e => e !== elem));
                      } else if (canAdd) {
                        set("elementTypes", [...cur, elem]);
                      }
                    }}
                    style={{
                      display:"flex", alignItems:"center", gap:4, padding:"4px 10px",
                      borderRadius:20, fontSize:12, cursor: selected || canAdd ? "pointer" : "not-allowed",
                      border:`1px solid ${selected ? ELEMENT_COLORS[elem] : C.border}`,
                      background: selected ? ELEMENT_COLORS[elem] + "33" : "transparent",
                      color: selected ? C.text : C.muted,
                      opacity: !selected && !canAdd ? 0.4 : 1,
                    }}
                  >
                    <span>{ELEMENT_ICONS[elem]}</span>
                    <span style={{ textTransform:"capitalize" }}>{elem}</span>
                  </button>
                );
              })}
            </div>
            {(beyblade.elementTypes?.length ?? 0) >= 2 && (
              <div style={{ fontSize:11, color:C.muted }}>
                Type matchup preview: {beyblade.elementTypes!.map(e => `${ELEMENT_ICONS[e]} ${e}`).join(" + ")}
              </div>
            )}
          </div>
        </div>

        {/* Right column: sticky preview */}
        <div style={{ position:"sticky", top:80 }}>
          <BeybladePreview beyblade={beyblade} />
        </div>
      </div>

      {/* Full-width contact points section */}
      <Step3ContactPoints
        beyblade={beyblade}
        onChange={(updated) => setBeyblade(b => b ? { ...b, ...updated } : b)}
      />

      {/* Image editor modal */}
      {editorMode && rawImageUrl && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:1000, overflowY:"auto", padding:"20px 16px" }}>
          <div style={{ width:"100%", maxWidth: editorMode === "whatsapp" ? "fit-content" : 400 }}>
            {editorMode === "whatsapp" && (
              <WhatsAppStyleImageEditor
                imageUrl={rawImageUrl}
                onPositionChange={(pos) => { setImagePosition(pos); set("imagePosition", pos); }}
                initialPosition={imagePosition}
                circleSize={Math.min(320, window.innerWidth - 80)}
                onSave={handleEditorSave}
                onCancel={() => setEditorMode(null)}
              />
            )}
            {editorMode === "crop" && (
              <div style={{ background:C.bg2, borderRadius:12, padding:16 }}>
                <ImageCropper ref={cropperRef} imageUrl={rawImageUrl} targetWidth={300} targetHeight={300} />
                <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:12 }}>
                  <button onClick={() => setEditorMode(null)} style={{ padding:"6px 16px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:13, cursor:"pointer" }}>Cancel</button>
                  <button onClick={handleEditorSave} style={{ padding:"6px 16px", background:C.blue, border:"none", borderRadius:8, color:C.white, fontSize:13, fontWeight:600, cursor:"pointer" }}>Apply Crop</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
