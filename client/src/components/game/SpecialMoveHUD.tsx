// SpecialMoveHUD — charging/ready state display + QTE overlay for special moves.
// Charging: arc fills clockwise (blue), shows charge %, move name.
// Ready: pulsing gold glow, bounces, shows "READY!" label.
// Activation: shows AvatarAttackQTE full-screen QTE overlay.
// NOTE: The special move button itself lives in ActionBar; this component handles
// the screen flash and QTE overlay triggered by activation.

import React, { useEffect, useState } from "react";
import { AvatarAttackQTE } from "./AvatarAttackQTE";

interface SpecialMoveData {
  id: string;
  name: string;
  iconEmoji: string;
  visual: {
    screenFlashColor?: string;
    avatarImageUrl?: string;
  };
}

interface SpecialMoveHUDProps {
  myBeyblade: { power?: number; specialCooldown?: number } | null;
  specialMoveData: SpecialMoveData | null;
  /** Timestamp (ms) of latest special move fire event — changes trigger the QTE. */
  lastSpecialMoveFired: string | null;
  /** Called with QTE result (hits 0–3) when the AvatarAttackQTE completes. */
  onQTEComplete?: (hits: number) => void;
}

export function SpecialMoveHUD({
  myBeyblade,
  specialMoveData,
  lastSpecialMoveFired,
  onQTEComplete,
}: SpecialMoveHUDProps) {
  const [showQTE, setShowQTE] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [prevFired, setPrevFired] = useState<string | null>(null);

  // Detect new special fire event
  useEffect(() => {
    if (!lastSpecialMoveFired || lastSpecialMoveFired === prevFired) return;
    setPrevFired(lastSpecialMoveFired);

    // Screen flash
    const color = specialMoveData?.visual?.screenFlashColor ?? "#FFD700";
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 220);

    // Launch QTE
    setShowQTE(true);
  }, [lastSpecialMoveFired, prevFired, specialMoveData]);

  const handleQTEComplete = (hits: number) => {
    setShowQTE(false);
    onQTEComplete?.(hits);
  };

  return (
    <>
      {/* Screen flash overlay */}
      {flashColor && (
        <div
          className="absolute inset-0 z-[140] pointer-events-none"
          style={{ background: flashColor + "33", transition: "background 220ms" }}
        />
      )}

      {/* Avatar Attack QTE overlay */}
      {showQTE && specialMoveData && (
        <AvatarAttackQTE
          moveName={specialMoveData.name}
          moveEmoji={specialMoveData.iconEmoji}
          avatarImageUrl={specialMoveData.visual?.avatarImageUrl}
          onComplete={handleQTEComplete}
        />
      )}
    </>
  );
}
