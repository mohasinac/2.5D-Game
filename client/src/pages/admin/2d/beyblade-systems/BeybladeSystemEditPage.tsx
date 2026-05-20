import { useParams, Link } from "react-router-dom";
import { C } from "@/styles/theme";
import { BeybladeSystemEditor } from "@/components/admin/beyblade-system/BeybladeSystemEditor";

export function BeybladeSystemEditPage() {
  const { id = "" } = useParams<{ id: string }>();

  if (!id) return <div style={{ padding: 32, color: C.muted }}>Missing system ID.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0 }}>
        <Link to="/admin/2d/beyblade-systems" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
          Beyblade Systems
        </Link>
        <span style={{ color: C.faint }}>›</span>
        <span style={{ color: C.text, fontSize: 12 }}>Edit</span>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <BeybladeSystemEditor systemId={id} />
      </div>
    </div>
  );
}
