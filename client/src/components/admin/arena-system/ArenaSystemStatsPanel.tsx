import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";

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
    <div
      style={{
        background: C.bg1,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        padding: 16,
      }}
    >
      <h3 style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>
        Arena Properties
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: C.text, fontFamily: "monospace", fontWeight: 600 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {slopePhysics.frictionMap && slopePhysics.frictionMap.length > 0 && (
        <>
          <h3 style={{ color: C.text, fontSize: 12, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>
            Friction Zones
          </h3>
          <div
            style={{
              background: C.bg0,
              borderRadius: 6,
              padding: 8,
              maxHeight: 200,
              overflowY: "auto",
              fontSize: 10,
            }}
          >
            {slopePhysics.frictionMap.map((zone, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 8,
                  paddingBottom: 6,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span style={{ color: C.muted }}>Zone {idx + 1}</span>
                <div>
                  <div>Pos: ({zone.x.toFixed(0)}, {zone.y.toFixed(0)})</div>
                  <div>Radius: {zone.radius.toFixed(0)}px</div>
                  <div style={{ color: zone.frictionMultiplier > 1 ? "#ff8844" : "#44ff88" }}>
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
