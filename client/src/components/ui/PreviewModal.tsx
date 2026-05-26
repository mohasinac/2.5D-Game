import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface PreviewModalProps {
  label?: string;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  buttonVariant?: "outline" | "ghost" | "default";
  children: React.ReactNode;
}

export function PreviewModal({
  label = "Preview",
  title,
  size = "xl",
  buttonVariant = "outline",
  children,
}: PreviewModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={buttonVariant} size="sm" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} size={size}>
        <div className="p-4">
          {open && children}
        </div>
      </Modal>
    </>
  );
}
