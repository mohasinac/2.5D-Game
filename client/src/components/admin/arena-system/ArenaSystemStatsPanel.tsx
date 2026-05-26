import { ArenaSystem } from "@/types/arenaSystem";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemStatsPanel({ arenaSystem }: Props) {
  const { elevationMap, wallProfile, slopePhysics } = arenaSystem;

  const stats = [
    {
      label: "Shape",
      value: arenaSystem.shape,
    },
    {
      label: "Theme",
      value: arenaSystem.theme,
    },
    {
      label: "Difficulty",
      value: arenaSystem.difficulty || "—",
    },
    {
      label: "Dimensions",
      value: `${arenaSystem.width}×${arenaSystem.height}px`,
    },
    {
      label: "Elevation Type",
      value: elevationMap.type,
    },
    {
      label: "Tilt Angle",
      value: elevationMap.tiltAngle ? `${elevationMap.tiltAngle}°` : "—",
    },
    {
      label: "Tilt Direction",
      value: elevationMap.tiltDirection ? `${elevationMap.tiltDirection}°` : "—",
    },
    {
      label: "Wall Height",
      value: `${wallProfile.baseHeight}mm`,
    },
    {
      label: "Gravity Strength",
      value: `${(slopePhysics.gravityStrength * 100).toFixed(0)}%`,
    },
    {
      label: "Friction Zones",
      value: `${slopePhysics.frictionMap?.length ?? 0}`,
    },
  ];

  return (
    <div className="bg-bg1 rounded-lg border border-border-c p-4">
      <h3 className="text-theme-text text-[14px] font-semibold mb-3 mt-0">
        Arena Properties
      </h3>
      <div className="grid gap-3 [grid-template-columns:1fr_1fr]">
        {stats.map((stat) => (
          <div key={stat.label} className="pb-2 border-b border-border-c">
            <div className="text-[11px] text-theme-muted mb-0.5">{stat.label}</div>
            <div className="text-[12px] text-theme-text font-mono font-semibold">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {slopePhysics.frictionMap && slopePhysics.frictionMap.length > 0 && (
        <>
          <h3 className="text-theme-text text-[12px] font-semibold mt-4 mb-2">
            Friction Zones
          </h3>
          <div className="bg-bg0 rounded-md p-2 max-h-[200px] overflow-y-auto text-[10px]">
            {slopePhysics.frictionMap.map((zone, idx) => (
              <div
                key={idx}
                className="grid gap-2 pb-1.5 border-b border-border-c [grid-template-columns:auto_1fr]"
              >
                <span className="text-theme-muted">Zone {idx + 1}</span>
                <div>
                  <div>Pos: ({zone.x.toFixed(0)}, {zone.y.toFixed(0)})</div>
                  <div>Radius: {zone.radius.toFixed(0)}px</div>
                  <div className={zone.frictionMultiplier > 1 ? "text-[#ff8844]" : "text-[#44ff88]"}>
                    Friction: ×{zone.frictionMultiplier.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
