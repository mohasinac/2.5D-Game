import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import WhatsAppStyleImageEditor from "@/components/admin/WhatsAppStyleImageEditor";
import ImageCropper from "@/components/admin/ImageCropper";
import type { ImageCropperRef } from "@/components/admin/ImageCropper";
import Step3ContactPoints from "@/components/admin/Step3ContactPoints";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { BeybladeStats, PointOfContact } from "@/types/beybladeStats";

const TOTAL_POINTS = 360;
const MAX_PER_TYPE = 150;

const inputCls = "w-full bg-bg1 border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-faint focus:outline-none focus:border-blue";

interface FormData {
  displayName: string; spinDirection: "left"|"right"; mass: number; radius: number;
  attack: number; defense: number; stamina: number; imageFile: File|null; imagePreview: string;
}

function DistBar({ label, value, colorCls, remaining, onChange }: { label:string; value:number; colorCls:string; remaining:number; onChange:(v:number)=>void }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className={colorCls}>{label}</span>
        <span className="text-text font-mono">{value} / {MAX_PER_TYPE}</span>
      </div>
      <input type="range" min={0} max={Math.min(MAX_PER_TYPE, value+remaining)} value={value} onChange={e => onChange(+e.target.value)} className="w-full accent-blue" />
      <div className="w-full h-1.5 bg-bg3 rounded-full overflow-hidden mt-1">
        <div className={`h-full rounded-full transition-[width] duration-150 w-pct ${colorCls.replace("text-", "bg-")}`} style={{ "--pct": `${(value/MAX_PER_TYPE)*100}%` } as React.CSSProperties} />
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

  // Step 4 ability fields
  const [elementTypes, setElementTypes] = useState<string[]>([]);
  const [specialMoveId, setSpecialMoveId] = useState("");
  const [comboIds, setComboIds] = useState<string[]>([]);
  const [bitBeastId, setBitBeastId] = useState("");
  const [jumpForce, setJumpForce] = useState(0);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [burstResistance, setBurstResistance] = useState(50);
  const [specialMoveOptions, setSpecialMoveOptions] = useState<{ value: string; label: string }[]>([]);
  const [comboOptions, setComboOptions] = useState<{ value: string; label: string }[]>([]);
  const [bitBeastOptions, setBitBeastOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.SPECIAL_MOVES))
      .then(snap => setSpecialMoveOptions(snap.docs.map(d => ({ value: d.id, label: (d.data().name ?? d.id) as string }))))
      .catch(() => {});
    getDocs(collection(db, COLLECTIONS.COMBOS))
      .then(snap => setComboOptions(snap.docs.map(d => ({ value: d.id, label: (d.data().name ?? d.id) as string }))))
      .catch(() => {});
    getDocs(collection(db, COLLECTIONS.BITBEAST_ASSETS))
      .then(snap => setBitBeastOptions(snap.docs.map(d => ({ value: d.id, label: ((d.data().displayName ?? d.data().name) as string | undefined) ?? d.id }))))
      .catch(() => {});
  }, []);

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
        ...(elementTypes.length > 0 ? { elementTypes } : {}),
        ...(specialMoveId ? { specialMoveId } : {}),
        ...(comboIds.length > 0 ? { comboIds } : {}),
        ...(bitBeastId ? { bitBeastId } : {}),
        ...(jumpForce > 0 ? { jumpForce } : {}),
        ...(jumpHeight > 0 ? { jumpHeight } : {}),
        burstResistance,
        createdAt: serverTimestamp(),
      });
      toast.success(`Created ${form.displayName}!`);
      navigate(`/admin/beyblades/edit/${docRef.id}`);
    } catch (err) { console.error(err); toast.error("Failed to create beyblade"); }
    finally { setSaving(false); }
  };

  const steps = ["Basic Info", "Type Distribution", "Image", "Contact Points", "Abilities"];

  return (
    <div className={`py-5 px-6 w-full box-border transition-[max-width] duration-200 ${step === 3 ? "max-w-full" : "max-w-[680px]"}`}>
      <div className="mb-5">
        <Link to="/admin/beyblades" className="text-faint text-xs no-underline hover:text-muted">← Beyblades</Link>
        <h1 className="text-2xl font-bold text-text mt-2">New Beyblade</h1>
      </div>

      {/* Step indicators */}
      <div className="flex items-center mb-7">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <button
              onClick={() => i <= step && setStep(i)}
              className={`w-8 h-8 rounded-full text-sm font-bold cursor-pointer border-none flex-shrink-0 ${
                i === step ? "bg-blue text-white" : i < step ? "bg-green text-white" : "bg-bg3 text-faint"
              }`}
            >{i < step ? "✓" : i+1}</button>
            <span className={`ml-2 text-xs whitespace-nowrap ${i === step ? "text-text" : "text-faint"}`}>{s}</span>
            {i < steps.length-1 && <div className={`h-0.5 flex-1 ml-2 ${i < step ? "bg-green" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step < 3 && (
        <div className="bg-bg2 border border-border rounded-2xl p-6">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <Label>Display Name *</Label>
                <input type="text" value={form.displayName} onChange={e => set("displayName",e.target.value)} placeholder="e.g. Storm Pegasus" className={inputCls} />
              </div>
              <div>
                <Label>Spin Direction</Label>
                <div className="flex gap-2">
                  {(["right","left"] as const).map(dir => (
                    <button key={dir} onClick={() => set("spinDirection",dir)} className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer capitalize border transition-colors ${
                      form.spinDirection===dir ? "bg-blue text-white border-blue" : "bg-transparent text-muted border-border hover:border-muted"
                    }`}>{dir}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Mass (grams)</Label>
                  <input type="number" min={30} max={80} value={form.mass} onChange={e => set("mass",+e.target.value)} className={inputCls} />
                  <p className="text-[11px] text-faint mt-1">Real beyblades: 40–60g</p>
                </div>
                <div>
                  <Label>Radius (cm)</Label>
                  <input type="number" min={2} max={7} step={0.5} value={form.radius} onChange={e => set("radius",+e.target.value)} className={inputCls} />
                  <p className="text-[11px] text-faint mt-1">Standard: 3–5cm</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted">Distribute {TOTAL_POINTS} points (max {MAX_PER_TYPE} each)</p>
                <span className={`text-sm font-mono font-bold ${remaining===0 ? "text-green" : remaining<0 ? "text-red" : "text-yellow"}`}>
                  {remaining>0 ? `${remaining} remaining` : remaining<0 ? `${Math.abs(remaining)} over` : "Perfect!"}
                </span>
              </div>
              <DistBar label="Attack" value={form.attack} colorCls="text-red" remaining={remaining} onChange={v => set("attack",v)} />
              <DistBar label="Defense" value={form.defense} colorCls="text-blue" remaining={remaining} onChange={v => set("defense",v)} />
              <DistBar label="Stamina" value={form.stamina} colorCls="text-green" remaining={remaining} onChange={v => set("stamina",v)} />
              <div className="bg-bg3/50 rounded-xl p-3.5">
                <p className="text-xs text-muted mb-2">Derived type: <strong className="text-text capitalize">{derivedType}</strong></p>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-faint">
                  <span>Damage mult: <span className="text-text">{((1.0+form.attack*0.007)*(derivedType==="attack"?1.2:1)).toFixed(2)}x</span></span>
                  <span>Dmg taken: <span className="text-text">{(Math.max(0.45,1-form.defense*0.003)*(derivedType==="defense"?0.8:1)).toFixed(2)}x</span></span>
                  <span>Max stamina: <span className="text-text">{derivedType==="stamina"?Math.ceil(1000*(1+form.stamina*0.01333)):Math.min(Math.ceil(1000*(1+form.stamina*0.01333)),2500)}</span></span>
                  <span>Spin steal: <span className="text-text">{((0.1*(1+form.stamina*0.02667))*100).toFixed(1)}%</span></span>
                  <span>Max spin: <span className="text-text">{Math.ceil(2000*(1+form.stamina*0.0008))}</span></span>
                  <span>Spin decay: <span className="text-text">{(8*(1-form.stamina*0.001)).toFixed(1)}/s</span></span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <Label>Beyblade Image (PNG, transparent background)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  {form.imagePreview ? (
                    <div className="flex flex-col gap-2 items-center">
                      <img src={form.imagePreview} alt="Preview" className="w-24 h-24 object-contain bg-bg1 rounded-full" />
                      <p className="text-[11px] text-faint">{form.imageFile?.name}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setImageEditorMode("whatsapp")} className="text-xs text-blue bg-none border-none cursor-pointer">🖼 Reposition</button>
                        <button onClick={() => setImageEditorMode("crop")} className="text-xs text-muted bg-none border-none cursor-pointer">✂️ Crop</button>
                        <button onClick={() => { set("imageFile",null); set("imagePreview",""); setRawImageUrl(""); }} className="text-xs text-red bg-none border-none cursor-pointer">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-muted text-sm mb-1">Click to upload image</p>
                      <p className="text-faint text-[11px]">PNG with transparent background, 300×300px recommended</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {imageEditorMode && rawImageUrl && (
                <div className="fixed inset-0 bg-black/85 flex items-start justify-center z-[1000] overflow-y-auto py-5 px-4">
                  <div className={`w-full ${imageEditorMode === "whatsapp" ? "max-w-fit" : "max-w-[420px]"}`}>
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
                      <div className="bg-bg2 rounded-xl p-4">
                        <ImageCropper ref={cropperRef} imageUrl={rawImageUrl} targetWidth={300} targetHeight={300} />
                        <div className="flex justify-end gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => setImageEditorMode(null)}>Cancel</Button>
                          <Button variant="primary" size="sm" onClick={handleImageEditorSave}>Apply Crop</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-bg3/50 rounded-xl p-3.5">
                <h4 className="text-sm font-medium text-text mb-2">Summary</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-faint">
                  <span>Name: <span className="text-text">{form.displayName||"—"}</span></span>
                  <span>Type: <span className="text-text capitalize">{derivedType}</span></span>
                  <span>Spin: <span className="text-text capitalize">{form.spinDirection}</span></span>
                  <span>Mass: <span className="text-text">{form.mass}g / {form.radius}cm</span></span>
                  <span>Points: <span className={usedPoints===TOTAL_POINTS ? "text-green" : "text-red"}>{usedPoints}/{TOTAL_POINTS}</span></span>
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

      {step === 4 && (
        <div className="bg-bg2 border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <p className="text-sm text-muted mb-4">
              Optional — these can also be set later from the edit page.
            </p>

            {/* Element Types */}
            <div className="mb-5">
              <label className="block text-xs text-muted font-semibold mb-1.5">Element Types (max 2)</label>
              <div className="flex flex-wrap gap-1.5">
                {["fire","water","wind","earth","lightning","ice","dark","light","metal","nature","psychic","void"].map(elem => {
                  const active = elementTypes.includes(elem);
                  return (
                    <button key={elem} onClick={() => {
                      if (active) setElementTypes(elementTypes.filter(e => e !== elem));
                      else if (elementTypes.length < 2) setElementTypes([...elementTypes, elem]);
                    }} className={`px-3 py-1 text-[11px] rounded-full cursor-pointer border transition-colors ${
                      active ? "bg-blue/[.13] text-blue border-blue/[.33]" : "bg-bg3 text-muted border-border"
                    }`}>{elem}</button>
                  );
                })}
              </div>
              {elementTypes.length > 0 && <div className="text-[11px] text-faint mt-1.5">Selected: {elementTypes.join(", ")}</div>}
            </div>

            {/* Special Move */}
            <div className="mb-5">
              <label className="block text-xs text-muted font-semibold mb-1.5">Special Move</label>
              <SearchableSelect
                value={specialMoveId}
                onChange={setSpecialMoveId}
                options={[{ value:"", label:"(none)" }, ...specialMoveOptions]}
                placeholder="Select special move…"
              />
            </div>

            {/* Combos (max 3) */}
            <div>
              <label className="block text-xs text-muted font-semibold mb-1.5">Combos (max 3)</label>
              <div className="flex flex-col gap-2">
                {([0,1,2] as const).map(i => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-[11px] text-faint w-4 flex-shrink-0">{i+1}</span>
                    <SearchableSelect
                      value={comboIds[i] ?? ""}
                      onChange={v => {
                        const next = [...comboIds];
                        if (v) { next[i] = v; } else { next.splice(i, 1); }
                        setComboIds(next.filter(Boolean).slice(0, 3));
                      }}
                      options={[{ value:"", label:"(none)" }, ...comboOptions.filter(o => !comboIds.includes(o.value) || comboIds[i] === o.value)]}
                      placeholder={`Combo slot ${i+1}…`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Physics */}
            <div className="mt-5 pt-5 border-t border-border">
              <label className="block text-xs text-muted font-bold mb-3 uppercase tracking-wider">Advanced Physics</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-muted font-semibold mb-1.5">Jump Force (N, 0=off)</label>
                  <input type="number" min={0} max={2000} step={50} value={jumpForce}
                    onChange={e => setJumpForce(+e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-muted font-semibold mb-1.5">Jump Height (px, 0=off)</label>
                  <input type="number" min={0} max={500} step={10} value={jumpHeight}
                    onChange={e => setJumpHeight(+e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs text-muted font-semibold mb-1.5">Burst Resistance (0–100)</label>
                <div className="flex gap-2 items-center">
                  <input type="range" min={0} max={100} value={burstResistance}
                    onChange={e => setBurstResistance(+e.target.value)} className="flex-1 accent-yellow" />
                  <span className="text-sm text-text font-mono w-8">{burstResistance}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted font-semibold mb-1.5">Bit Beast (optional)</label>
                <SearchableSelect
                  value={bitBeastId}
                  onChange={setBitBeastId}
                  options={[{ value:"", label:"(none)" }, ...bitBeastOptions]}
                  placeholder="Select bit beast…"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-5">
        <Button variant="outline" onClick={() => step>0 ? setStep(step-1) : navigate("/admin/beyblades")}>
          {step===0 ? "Cancel" : "Back"}
        </Button>
        {step < steps.length-1 ? (
          <Button variant="primary" onClick={() => setStep(step+1)} disabled={step===0 && !form.displayName.trim()}>
            Continue
          </Button>
        ) : (
          <Button variant="success" onClick={handleSave} disabled={saving||usedPoints!==TOTAL_POINTS}>
            {saving ? "Creating..." : "Create Beyblade"}
          </Button>
        )}
      </div>
    </div>
  );
}
