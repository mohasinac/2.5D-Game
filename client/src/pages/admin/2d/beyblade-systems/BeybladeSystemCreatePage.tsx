import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeSystem } from "@/types/beybladeSystem";
import toast from "react-hot-toast";
import { C, alpha } from "@/styles/theme";

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
    <div style={{ padding: 32, maxWidth: 520 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Link to="/admin/2d/beyblade-systems" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
            Beyblade Systems
          </Link>
          <span style={{ color: C.faint }}>›</span>
          <span style={{ color: C.text, fontSize: 12 }}>New</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>New Beyblade System</h1>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
          Give it a name and spin direction — you'll assemble the parts on the next screen.
        </p>
      </div>

      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Display Name *</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Wolborg 4 Custom"
            style={{
              width: "100%", padding: "9px 12px", background: C.bg2,
              border: `1px solid ${C.border}`, borderRadius: 7, color: C.text,
              fontSize: 13, boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 8 }}>Spin Direction</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["right", "left"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setSpinDirection(dir)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 150ms",
                  background: spinDirection === dir ? alpha(dir === "right" ? C.blue : C.red, 0.13) : C.bg2,
                  color: spinDirection === dir ? (dir === "right" ? C.blue : C.red) : C.muted,
                  border: `1px solid ${spinDirection === dir ? alpha(dir === "right" ? C.blue : C.red, 0.53) : C.border}`,
                }}
              >
                {dir === "right" ? "↻ Right" : "↺ Left"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>
            Spin direction affects collision type — opposite-spin beyblades trigger spin-steal amplification.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              flex: 1, padding: "10px 0", background: saving ? C.bg3 : C.blue,
              color: "#fff", border: "none", borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Creating…" : "Create & Assemble Parts →"}
          </button>
          <button
            onClick={() => navigate("/admin/2d/beyblade-systems")}
            style={{
              padding: "10px 18px", background: C.bg2, color: C.muted,
              border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
