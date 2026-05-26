import { useParams, Link } from "react-router-dom";
import { BeybladeSystemEditor } from "@/components/admin/beyblade-system/BeybladeSystemEditor";

export function BeybladeSystemEditPage() {
  const { id = "" } = useParams<{ id: string }>();

  if (!id) return <div className="p-8 text-theme-muted">Missing system ID.</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border-c bg-bg1 shrink-0">
        <Link to="/admin/2d/beyblade-systems" className="text-theme-muted text-[12px] no-underline">
          Beyblade Systems
        </Link>
        <span className="text-theme-faint">›</span>
        <span className="text-theme-text text-[12px]">Edit</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <BeybladeSystemEditor systemId={id} />
      </div>
    </div>
  );
}
