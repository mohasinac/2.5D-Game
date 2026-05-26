import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeSystem } from "@/types/beybladeSystem";
import toast from "react-hot-toast";

export function BeybladeSystemCreatePage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [spinDirection, setSpinDirection] = useState<"right" | "left">("right");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!displayName.trim()) { toast.error("Display name required"); return; }
    setSaving(true);
    try {
      const initial: Omit<BeybladeSystem, "id"> = {
        displayName: displayName.trim(),
        spinDirection,
        attackRingId: "",
        attackRingFlipped: false,
        weightDiskId: "",
        tipId: "",
        casingId: "",
        subPartAttachments: [],
        gearAttachments: [],
        activeConfigs: {},
        comboSlots: [],
        createdAt: serverTimestamp() as unknown as undefined,
        updatedAt: serverTimestamp() as unknown as undefined,
      };
      const ref = await addDoc(collection(db, COLLECTIONS.BEYBLADE_SYSTEMS), initial);
      toast.success("System created");
      navigate(`/admin/2d/beyblade-systems/edit/${ref.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create system");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-[520px]">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Link to="/admin/2d/beyblade-systems" className="text-theme-muted text-[12px] no-underline">
            Beyblade Systems
          </Link>
          <span className="text-theme-faint">›</span>
          <span className="text-theme-text text-[12px]">New</span>
        </div>
        <h1 className="text-[22px] font-bold text-theme-text m-0">New Beyblade System</h1>
        <p className="text-theme-muted text-[13px] mt-1">
          Give it a name and spin direction — you'll assemble the parts on the next screen.
        </p>
      </div>

      <div className="bg-bg1 border border-border-c rounded-[10px] p-6 flex flex-col gap-[18px]">
        <div>
          <label className="block text-[12px] text-theme-muted mb-1.5">Display Name *</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Wolborg 4 Custom"
            className="w-full px-3 py-[9px] bg-bg2 border border-border-c rounded-[7px] text-theme-text text-[13px] box-border"
          />
        </div>

        <div>
          <label className="block text-[12px] text-theme-muted mb-2">Spin Direction</label>
          <div className="flex gap-2">
            {(["right", "left"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setSpinDirection(dir)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-150 border ${
                  spinDirection === dir
                    ? dir === "right"
                      ? "bg-blue-13 text-theme-blue border-blue-40"
                      : "bg-red-13 text-theme-red border-red-30"
                    : "bg-bg2 text-theme-muted border-border-c"
                }`}
              >
                {dir === "right" ? "↻ Right" : "↺ Left"}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-theme-faint mt-1.5">
            Spin direction affects collision type — opposite-spin beyblades trigger spin-steal amplification.
          </div>
        </div>

        <div className="flex gap-2.5 mt-1">
          <button
            onClick={handleCreate}
            disabled={saving}
            className={`flex-1 py-2.5 border-none rounded-lg text-[13px] font-semibold text-white ${saving ? "bg-bg3 cursor-not-allowed" : "bg-theme-blue cursor-pointer"}`}
          >
            {saving ? "Creating…" : "Create & Assemble Parts →"}
          </button>
          <button
            onClick={() => navigate("/admin/2d/beyblade-systems")}
            className="px-[18px] py-2.5 bg-bg2 text-theme-muted border border-border-c rounded-lg text-[13px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
