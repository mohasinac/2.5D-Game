// BeyLink Movement Guide — SVG diagrams explaining every group pattern,
// control mode, and 2-body auto-orbit behaviour. Rendered as a slide-in
// panel triggered by the "?" button in LinksTab.

import React, { useState } from "react";

// ─── Shared SVG primitives ────────────────────────────────────────────────────

interface BeyCircleProps {
  cx: number; cy: number; r?: number;
  color?: string; label?: string;
  labelDy?: number;
}
function BeyCircle({ cx, cy, r = 13, color = "#818cf8", label, labelDy = -18 }: BeyCircleProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color + "33"} stroke={color} strokeWidth={2} />
      {label && (
        <text x={cx} y={cy + labelDy} textAnchor="middle" fill={color}
          fontSize={10} fontWeight="bold" fontFamily="monospace">{label}</text>
      )}
    </g>
  );
}

interface ArrowProps { x1:number; y1:number; x2:number; y2:number; color?:string; dashed?:boolean }
function Arrow({ x1, y1, x2, y2, color = "#ffffff99", dashed }: ArrowProps) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const tip = { x: x2, y: y2 };
  const base = { x: x2 - ux * 14, y: y2 - uy * 14 };
  const perp = { x: -uy * 5, y: ux * 5 };
  return (
    <g>
      <line x1={x1} y1={y1} x2={base.x} y2={base.y}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "5 3" : undefined} />
      <polygon
        points={`${tip.x},${tip.y} ${base.x + perp.x},${base.y + perp.y} ${base.x - perp.x},${base.y - perp.y}`}
        fill={color} />
    </g>
  );
}

function ArcArrow({ cx, cy, r, fromDeg, toDeg, color = "#818cf866", cw = true }:
  { cx:number; cy:number; r:number; fromDeg:number; toDeg:number; color?:string; cw?:boolean }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(fromDeg));
  const sy = cy + r * Math.sin(toRad(fromDeg));
  const ex = cx + r * Math.cos(toRad(toDeg));
  const ey = cy + r * Math.sin(toRad(toDeg));
  const sweep = cw ? 1 : 0;
  return (
    <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 ${sweep} ${ex} ${ey}`}
      stroke={color} strokeWidth={1.5} fill="none" strokeDasharray="5 3" markerEnd="url(#ah)" />
  );
}

function OrbitCircle({ cx, cy, r, color = "#ffffff11" }: { cx:number; cy:number; r:number; color?:string }) {
  return <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={1} fill="none" strokeDasharray="4 4" />;
}

function Label({ x, y, text, color = "var(--muted)" }: { x:number; y:number; text:string; color?:string }) {
  return <text x={x} y={y} textAnchor="middle" fill={color} fontSize={9} fontFamily="system-ui">{text}</text>;
}

// ─── Diagram definitions ──────────────────────────────────────────────────────

const DG_W = 220, DG_H = 150;

function DiagramWrapper({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg3 border border-border-c rounded-[10px] overflow-hidden flex flex-col">
      <svg viewBox={`0 0 ${DG_W} ${DG_H}`} width="100%" className="block bg-[#08080f]">
        <defs>
          <marker id="ah" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#ffffff88" />
          </marker>
        </defs>
        {children}
      </svg>
      <div className="px-[10px] py-2">
        <div className="text-[11px] font-bold text-theme-text mb-[2px]">{title}</div>
        <div className="text-[10px] text-theme-muted leading-[1.5]">{desc}</div>
      </div>
    </div>
  );
}

// ── tip_stack ─────────────────────────────────────────────────────────────────
function DiagTipStack() {
  return (
    <DiagramWrapper
      title="tip_stack — Driller"
      desc="Attacker A orbits defender D at ~1.5 cm, drilling tight clockwise circles. Force is applied tangentially each tick to maintain the orbit.">
      <OrbitCircle cx={110} cy={75} r={36} color="#ef444433" />
      <BeyCircle cx={110} cy={75} color="#ef4444" label="D" labelDy={5} />
      {/* attacker at 3 o'clock position */}
      <BeyCircle cx={146} cy={75} color="#818cf8" label="A" labelDy={5} />
      {/* orbit arc CCW from right, going up */}
      <ArcArrow cx={110} cy={75} r={36} fromDeg={5} toDeg={-70} color="#818cf8aa" cw={false} />
      <Label x={110} y={142} text="A orbits D — tangential nudge each tick" />
    </DiagramWrapper>
  );
}

// ── top_mount (friendly) ─────────────────────────────────────────────────────
function DiagTopMountFriendly() {
  return (
    <DiagramWrapper
      title="top_mount — Friendly Co-spin"
      desc="Both beys orbit their shared midpoint clockwise at the same angular speed (0.04 rad/tick). Spin is transferred between them each tick.">
      <OrbitCircle cx={110} cy={75} r={38} color="#14b8a633" />
      {/* midpoint cross */}
      <line x1={107} y1={75} x2={113} y2={75} stroke="#14b8a666" strokeWidth={1.5} />
      <line x1={110} y1={72} x2={110} y2={78} stroke="#14b8a666" strokeWidth={1.5} />
      <BeyCircle cx={110} cy={37} color="#14b8a6" label="A" labelDy={5} />
      <BeyCircle cx={110} cy={113} color="#14b8a6" label="B" labelDy={5} />
      <ArcArrow cx={110} cy={75} r={38} fromDeg={-85} toDeg={10} color="#14b8a6aa" cw={true} />
      <ArcArrow cx={110} cy={75} r={38} fromDeg={95} toDeg={170} color="#14b8a6aa" cw={true} />
      <Label x={110} y={142} text="Both orbit midpoint CW — spin equalises" />
    </DiagramWrapper>
  );
}

// ── top_mount (hostile) ──────────────────────────────────────────────────────
function DiagTopMountHostile() {
  return (
    <DiagramWrapper
      title="top_mount — Hostile Counter-spin"
      desc="Same orbit pattern but counter-clockwise (−0.04 rad/tick). The opposing rotation generates friction, draining the victim's spin each tick.">
      <OrbitCircle cx={110} cy={75} r={38} color="#ef444433" />
      <line x1={107} y1={75} x2={113} y2={75} stroke="#ef444466" strokeWidth={1.5} />
      <line x1={110} y1={72} x2={110} y2={78} stroke="#ef444466" strokeWidth={1.5} />
      <BeyCircle cx={110} cy={37} color="#ef4444" label="A" labelDy={5} />
      <BeyCircle cx={110} cy={113} color="#818cf8" label="B" labelDy={5} />
      <ArcArrow cx={110} cy={75} r={38} fromDeg={-85} toDeg={-170} color="#ef4444aa" cw={false} />
      <ArcArrow cx={110} cy={75} r={38} fromDeg={95} toDeg={10} color="#ef4444aa" cw={false} />
      <Label x={110} y={142} text="Both orbit midpoint CCW — friction drains B" />
    </DiagramWrapper>
  );
}

// ── side_spin (friendly) ─────────────────────────────────────────────────────
function DiagSideSpinFriendly() {
  return (
    <DiagramWrapper
      title="side_spin — Circus Formation"
      desc="Beys maintain ~2 cm side-by-side separation. Pull force closes gap when too far; push force prevents overlap. Both drift slowly around the arena.">
      <BeyCircle cx={82} cy={75} color="#14b8a6" label="A" labelDy={5} />
      <BeyCircle cx={138} cy={75} color="#14b8a6" label="B" labelDy={5} />
      {/* separation bracket */}
      <line x1={95} y1={68} x2={125} y2={68} stroke="#14b8a655" strokeWidth={1} />
      <line x1={95} y1={64} x2={95} y2={72} stroke="#14b8a655" strokeWidth={1} />
      <line x1={125} y1={64} x2={125} y2={72} stroke="#14b8a655" strokeWidth={1} />
      <text x={110} y={63} textAnchor="middle" fill="#14b8a6" fontSize={8} fontFamily="monospace">≈2 cm</text>
      {/* drift arrow */}
      <Arrow x1={60} y1={75} x2={25} y2={50} color="#14b8a644" />
      <Label x={110} y={128} text="Pull when too far · push when too close" />
      <Label x={110} y={141} text="Pair drifts as a unit around the arena" />
    </DiagramWrapper>
  );
}

// ── side_spin (hostile / dogfight) ───────────────────────────────────────────
function DiagSideSpinHostile() {
  return (
    <DiagramWrapper
      title="side_spin — Dogfight"
      desc="Each tick a perpendicular force is applied in alternating directions (±1.8 N). A and B circle each other trying to attack from behind. Sparks broadcast every 5 ticks.">
      <BeyCircle cx={85} cy={75} color="#818cf8" label="A" labelDy={5} />
      <BeyCircle cx={135} cy={75} color="#ef4444" label="B" labelDy={5} />
      {/* tick-even: A up, B down */}
      <Arrow x1={85} y1={62} x2={85} y2={38} color="#818cf8aa" />
      <Arrow x1={135} y1={88} x2={135} y2={112} color="#ef4444aa" />
      <text x={60} y={35} fill="#818cf8" fontSize={8} fontFamily="monospace">tick even</text>
      {/* tick-odd: A down, B up */}
      <Arrow x1={170} y1={88} x2={170} y2={62} color="#ef444466" dashed />
      <Arrow x1={155} y1={115} x2={155} y2={88} color="#818cf866" dashed />
      <text x={175} y={125} fill="#ffffff44" fontSize={8} fontFamily="monospace">tick odd</text>
      <text x={110} y={132} textAnchor="middle" fill="#f59e0b" fontSize={8} fontFamily="monospace">★ sparks every 5 ticks ★</text>
      <Label x={110} y={143} text="Alternating ⊥ push — dogfight spiral" />
    </DiagramWrapper>
  );
}

// ── chain ─────────────────────────────────────────────────────────────────────
function DiagChain() {
  const beys = [30, 80, 130, 180];
  return (
    <DiagramWrapper
      title="chain — Snake / Train"
      desc="Each follower targets a point directly behind the bey ahead (distance = entryRadiusCm). Leader (A) is steered by the control mode. The tail naturally curves through turns.">
      {beys.map((x, i) => (
        <g key={i}>
          <BeyCircle cx={x} cy={75} color={i === 0 ? "#f59e0b" : "#818cf8"} label={["A","B","C","D"][i]} labelDy={5} />
          {i > 0 && (
            <Arrow x1={beys[i] - 14} y1={75} x2={beys[i - 1] + 14} y2={75} color="#818cf855" dashed />
          )}
        </g>
      ))}
      <Arrow x1={16} y1={75} x2={2} y2={60} color="#f59e0b" />
      <text x={30} y={42} textAnchor="middle" fill="#f59e0b" fontSize={9} fontFamily="monospace">leader</text>
      <Label x={110} y={128} text="A steers · B trails A · C trails B · D trails C" />
      <Label x={110} y={141} text="Formation curves naturally through turns" />
    </DiagramWrapper>
  );
}

// ── star ─────────────────────────────────────────────────────────────────────
function DiagStar() {
  const hub = { x: 110, y: 75 };
  const r = 48;
  const followers = [
    { x: hub.x + r * Math.cos(-Math.PI / 2), y: hub.y + r * Math.sin(-Math.PI / 2), label: "F1" },
    { x: hub.x + r * Math.cos(-Math.PI / 2 + (2 * Math.PI) / 3), y: hub.y + r * Math.sin(-Math.PI / 2 + (2 * Math.PI) / 3), label: "F2" },
    { x: hub.x + r * Math.cos(-Math.PI / 2 + (4 * Math.PI) / 3), y: hub.y + r * Math.sin(-Math.PI / 2 + (4 * Math.PI) / 3), label: "F3" },
  ];
  return (
    <DiagramWrapper
      title="star — Hub + Orbit"
      desc="Highest-spin bey becomes the hub (H). N followers orbit at 2π/N spacing, radius = entryRadiusCm. Orbit speed 0.04 rad/tick. Hub moves via control mode.">
      <OrbitCircle cx={hub.x} cy={hub.y} r={r} color="#f59e0b55" />
      <BeyCircle cx={hub.x} cy={hub.y} color="#f59e0b" label="H" labelDy={5} />
      {followers.map((f, i) => (
        <g key={i}>
          <line x1={hub.x} y1={hub.y} x2={f.x} y2={f.y} stroke="#818cf822" strokeWidth={1} strokeDasharray="4 3" />
          <BeyCircle cx={f.x} cy={f.y} color="#818cf8" label={f.label} labelDy={-16} />
        </g>
      ))}
      <ArcArrow cx={hub.x} cy={hub.y} r={r} fromDeg={-88} toDeg={-30} color="#818cf8aa" cw={true} />
      <Label x={110} y={143} text="H = highest spin · followers orbit at 120° steps" />
    </DiagramWrapper>
  );
}

// ── wedge ─────────────────────────────────────────────────────────────────────
function DiagWedge() {
  const L = { x: 110, y: 38 };
  const W1 = { x: 68, y: 105 };
  const W2 = { x: 152, y: 105 };
  return (
    <DiagramWrapper
      title="wedge — V-Formation"
      desc="Leader (L) at front-center. Left/right wings hold ±45° behind at entryRadiusCm distance. Extra beys form a second row. Formation advances in leader's velocity direction.">
      {/* V lines */}
      <line x1={L.x} y1={L.y + 13} x2={W1.x + 9} y2={W1.y - 10} stroke="#14b8a633" strokeWidth={1} strokeDasharray="5 3" />
      <line x1={L.x} y1={L.y + 13} x2={W2.x - 9} y2={W2.y - 10} stroke="#14b8a633" strokeWidth={1} strokeDasharray="5 3" />
      {/* angle labels */}
      <text x={88} y={68} fill="#14b8a688" fontSize={8} fontFamily="monospace">−45°</text>
      <text x={122} y={68} fill="#14b8a688" fontSize={8} fontFamily="monospace">+45°</text>
      <BeyCircle cx={L.x} cy={L.y} color="#f59e0b" label="L" labelDy={5} />
      <BeyCircle cx={W1.x} cy={W1.y} color="#14b8a6" label="W1" labelDy={5} />
      <BeyCircle cx={W2.x} cy={W2.y} color="#14b8a6" label="W2" labelDy={5} />
      {/* movement arrow */}
      <Arrow x1={110} y1={22} x2={110} y2={6} color="#f59e0b" />
      <text x={132} y={10} fill="#f59e0b" fontSize={8} fontFamily="monospace">advance</text>
      <Label x={110} y={143} text="L steers · wings snap to ±45° offset behind leader" />
    </DiagramWrapper>
  );
}

// ── rigid ─────────────────────────────────────────────────────────────────────
function DiagRigid() {
  const beys = [{ x: 78, y: 58 }, { x: 142, y: 58 }, { x: 78, y: 108 }, { x: 142, y: 108 }];
  return (
    <DiagramWrapper
      title="rigid — Locked Formation"
      desc="At stack-entry each bey's offset from the centroid is snapped. Every tick a corrective force restores that offset. All members share the same group velocity vector.">
      {/* bounding box */}
      <rect x={62} y={43} width={96} height={80} rx={6}
        fill="#818cf808" stroke="#818cf855" strokeWidth={1.5} strokeDasharray="6 3" />
      {/* centroid cross */}
      <line x1={107} y1={83} x2={113} y2={83} stroke="#ffffff33" strokeWidth={1} />
      <line x1={110} y1={80} x2={110} y2={86} stroke="#ffffff33" strokeWidth={1} />
      {beys.map((b, i) => (
        <g key={i}>
          <line x1={b.x} y1={b.y} x2={110} y2={83} stroke="#818cf822" strokeWidth={1} strokeDasharray="3 2" />
          <BeyCircle cx={b.x} cy={b.y} color="#818cf8" label={["A","B","C","D"][i]} labelDy={5} r={11} />
        </g>
      ))}
      {/* group movement arrow */}
      <Arrow x1={158} y1={83} x2={205} y2={83} color="#818cf8aa" />
      <text x={185} y={77} fill="#818cf8" fontSize={8} fontFamily="monospace">group</text>
      <text x={185} y={87} fill="#818cf8" fontSize={8} fontFamily="monospace">velocity</text>
      <Label x={110} y={143} text="Offsets locked at stack-entry · corrective force each tick" />
    </DiagramWrapper>
  );
}

// ── Control mode diagrams ─────────────────────────────────────────────────────
function DiagControlAuto() {
  return (
    <DiagramWrapper
      title="auto control"
      desc="No player override. The link type (tip_stack / top_mount / side_spin) decides movement. Physics runs autonomously each tick.">
      <BeyCircle cx={90} cy={75} color="#6b7280" label="A" labelDy={5} />
      <BeyCircle cx={140} cy={60} color="#6b7280" label="B" labelDy={5} />
      <ArcArrow cx={90} cy={75} r={32} fromDeg={-40} toDeg={30} color="#6b728088" cw={true} />
      <text x={110} y={115} textAnchor="middle" fill="#6b7280" fontSize={9} fontFamily="monospace">orbit / dogfight</text>
      <text x={110} y={128} textAnchor="middle" fill="#6b728066" fontSize={9} fontFamily="monospace">per linkType rules</text>
    </DiagramWrapper>
  );
}

function DiagControlInitiator() {
  const beys = [{ x: 50, y: 75 }, { x: 105, y: 50 }, { x: 105, y: 100 }, { x: 160, y: 75 }];
  return (
    <DiagramWrapper
      title="initiator control"
      desc="sidA's live WASD bitmask is read every tick. The decomposed direction vector is applied as a 0.6-force nudge to the leader, propagating through the chain/star/wedge.">
      {/* WASD icon */}
      {["W","A","S","D"].map((k, i) => {
        const kx = [18, 6, 18, 30][i], ky = [14, 26, 26, 26][i];
        return <rect key={k} x={kx} y={ky} width={11} height={11} rx={2} fill="#f59e0b22" stroke="#f59e0b88" strokeWidth={1} />;
      })}
      {["W","A","S","D"].map((k, i) => {
        const kx = [23, 11, 23, 35][i], ky = [19, 31, 31, 31][i];
        return <text key={k} x={kx} y={ky} textAnchor="middle" fill="#f59e0b" fontSize={7} fontFamily="monospace">{k}</text>;
      })}
      <BeyCircle cx={beys[0].x} cy={beys[0].y} color="#f59e0b" label="A" labelDy={5} />
      {beys.slice(1).map((b, i) => (
        <g key={i}>
          <BeyCircle cx={b.x} cy={b.y} color="#818cf8" label={["B","C","D"][i]} labelDy={5} />
          <Arrow x1={beys[0].x + 13} y1={beys[0].y} x2={b.x - 13} y2={b.y} color="#f59e0b44" dashed />
        </g>
      ))}
      <Arrow x1={beys[0].x - 13} y1={beys[0].y} x2={beys[0].x - 28} y2={beys[0].y - 15} color="#f59e0b" />
      <Label x={125} y={128} text="A's WASD steers formation" />
      <Label x={125} y={141} text="Force propagates to B · C · D" />
    </DiagramWrapper>
  );
}

function DiagControlPlayer() {
  return (
    <DiagramWrapper
      title="player control"
      desc="Any human bey in the group contributes WASD input. Inputs are OR-unioned and normalised to a unit vector. Falls back to 'auto' if no human is present in the cluster.">
      <BeyCircle cx={75} cy={75} color="#14b8a6" label="P1" labelDy={5} />
      <BeyCircle cx={145} cy={75} color="#14b8a6" label="P2" labelDy={5} />
      {/* WASD on both */}
      {[65, 135].map((bx, bi) => (
        <g key={bi}>
          {["▲","◀","▼","▶"].map((k, i) => {
            const ox = [5, -7, 5, 17][i], oy = [-18, -6, 6, -6][i];
            return (
              <text key={k} x={bx + ox} y={75 + oy} textAnchor="middle" fill="#14b8a688" fontSize={7} fontFamily="monospace">{k}</text>
            );
          })}
        </g>
      ))}
      <Arrow x1={75} y1={62} x2={75} y2={38} color="#14b8a6aa" />
      <Arrow x1={145} y1={62} x2={145} y2={38} color="#14b8a6aa" />
      <text x={110} y={30} textAnchor="middle" fill="#14b8a6" fontSize={9} fontFamily="monospace">union → normalise</text>
      <Label x={110} y={128} text="Both players' inputs are OR-combined" />
      <Label x={110} y={141} text="Normalised vector steers whole group" />
    </DiagramWrapper>
  );
}

// ── Hijack flow diagram ───────────────────────────────────────────────────────
function DiagHijackFlow() {
  return (
    <DiagramWrapper
      title="hijack flow"
      desc="Victim initiates → block window opens. Attacker must press the keyed button before expiry. On success: sidA/sidB swap in beyStackState; effects invert; cooldown applied to both.">
      {/* Step boxes */}
      {[
        { x: 15, y: 20, w: 54, h: 32, label: "1. Victim\nattempts", color: "#818cf8" },
        { x: 83, y: 20, w: 54, h: 32, label: "2. Block\nwindow", color: "#f59e0b" },
        { x: 151, y: 20, w: 54, h: 32, label: "3a. Success\nroles swap", color: "#14b8a6" },
      ].map(({ x, y, w, h, label, color }) => (
        <g key={label}>
          <rect x={x} y={y} width={w} height={h} rx={5} fill={color + "22"} stroke={color + "88"} strokeWidth={1} />
          {label.split("\n").map((line, li) => (
            <text key={li} x={x + w / 2} y={y + 14 + li * 12} textAnchor="middle" fill={color} fontSize={8} fontFamily="monospace">{line}</text>
          ))}
        </g>
      ))}
      <Arrow x1={69} y1={36} x2={83} y2={36} color="#ffffff66" />
      <Arrow x1={137} y1={36} x2={151} y2={36} color="#ffffff66" />
      {/* 3b. Blocked */}
      <rect x={151} y={72} width={54} height={32} rx={5} fill="#ef444422" stroke="#ef444488" strokeWidth={1} />
      <text x={178} y={84} textAnchor="middle" fill="#ef4444" fontSize={8} fontFamily="monospace">3b. Blocked</text>
      <text x={178} y={96} textAnchor="middle" fill="#ef4444" fontSize={8} fontFamily="monospace">CD on victim</text>
      <line x1={178} y1={52} x2={178} y2={72} stroke="#ef444455" strokeWidth={1} strokeDasharray="4 2" />
      {/* swap arrows */}
      <Arrow x1={65} y1={108} x2={145} y2={108} color="#14b8a6aa" />
      <Arrow x1={145} y1={118} x2={65} y2={118} color="#ef4444aa" />
      <BeyCircle cx={50} cy={113} color="#818cf8" label="A" labelDy={5} r={11} />
      <BeyCircle cx={160} cy={113} color="#ef4444" label="B" labelDy={5} r={11} />
      <text x={105} y={108} textAnchor="middle" fill="#14b8a6" fontSize={7} fontFamily="monospace">A now victim</text>
      <text x={105} y={122} textAnchor="middle" fill="#ef4444" fontSize={7} fontFamily="monospace">B now initiator</text>
    </DiagramWrapper>
  );
}

// ─── Guide panel ─────────────────────────────────────────────────────────────

type Tab = "2body" | "group" | "control" | "hijack";

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: "2body", label: "2-Body Auto" },
  { key: "group", label: "Group Patterns" },
  { key: "control", label: "Control Modes" },
  { key: "hijack", label: "Hijack" },
];

export function BeyLinkMovementGuide({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("2body");

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/75 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-bg1 border border-border-c rounded-[14px] w-[min(96vw,840px)] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-border-c">
          <div>
            <div className="text-sm font-bold text-theme-text">BeyLink Movement Guide</div>
            <div className="text-[11px] text-theme-muted mt-[2px]">Visual reference for all movement patterns, control modes, and hijack flow</div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-theme-muted text-[18px] cursor-pointer leading-none"
          >✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-[2px] px-[18px] py-2 bg-bg2 border-b border-border-c">
          {TAB_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={
                tab === key
                  ? "px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer bg-[#818cf8] border border-[#818cf8] text-white"
                  : "px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer bg-transparent border border-border-c text-theme-muted"
              }
            >{label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-[18px] py-4 flex-1">

          {tab === "2body" && (
            <>
              <div className="text-[11px] text-theme-muted mb-3">
                These patterns run every tick for <strong className="text-theme-text">any 2-bey stack</strong> regardless of control mode.
                They maintain contact geometry while effects fire independently.
              </div>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                <DiagTipStack />
                <DiagTopMountFriendly />
                <DiagTopMountHostile />
                <DiagSideSpinFriendly />
                <DiagSideSpinHostile />
              </div>
            </>
          )}

          {tab === "group" && (
            <>
              <div className="text-[11px] text-theme-muted mb-3">
                Group patterns activate when <strong className="text-theme-text">3 or more beys share the same linkId</strong>. Set via
                <code className="text-[#818cf8] bg-[#818cf811] px-1 rounded-[3px]"> groupPattern</code> on the link.
                The 2-body orbit still runs for each pair; group forces are applied on top.
              </div>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                <DiagChain />
                <DiagStar />
                <DiagWedge />
                <DiagRigid />
              </div>

              {/* Formation comparison table */}
              <div className="mt-4 text-[11px] text-theme-muted border-t border-border-c pt-3">
                <div className="font-bold text-theme-text mb-2">Pattern comparison</div>
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="text-theme-muted">
                      {["Pattern", "Leader", "Followers", "Predicted path", "Collision footprint"].map(h => (
                        <td key={h} className="px-2 py-1 border-b border-border-c font-semibold">{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["chain", "sidA (initiator)", "Trail leader at entryR spacing", "Arc / pursuit curve", "Narrow — single file"],
                      ["star", "Highest-spin bey", "Orbit hub at 2π/N radians", "Hub path + orbit halos", "Wide radial disc"],
                      ["wedge", "sidA (initiator)", "Hold ±45° offset per row", "V advances in leader direction", "Wide front, narrow rear"],
                      ["rigid", "—", "Maintain centroid offsets", "Drifts by inertia", "Fixed bounding box"],
                    ].map(([pat, ...rest]) => (
                      <tr key={pat} className="text-theme-text">
                        <td className="px-2 py-1 border-b border-border-c/[0.07] font-mono text-[#818cf8]">{pat}</td>
                        {rest.map((v, i) => (
                          <td key={i} className="px-2 py-1 border-b border-border-c/[0.07]">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "control" && (
            <>
              <div className="text-[11px] text-theme-muted mb-3">
                <code className="text-[#818cf8] bg-[#818cf811] px-1 rounded-[3px]">movementControl</code> determines
                {" "}who steers the formation's velocity vector. The orbit pattern for the link type still applies; control adds a
                <strong className="text-theme-text"> 0.6-force directional nudge</strong> on top.
              </div>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                <DiagControlAuto />
                <DiagControlInitiator />
                <DiagControlPlayer />
              </div>

              <div className="mt-4 text-[11px] text-theme-muted border-t border-border-c pt-3">
                <div className="font-bold text-theme-text mb-2">Control mode × group pattern matrix</div>
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="text-theme-muted">
                      {["Mode \\ Pattern", "chain", "star", "wedge", "rigid"].map(h => (
                        <td key={h} className="px-2 py-1 border-b border-border-c font-semibold font-mono">{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["auto", "sidA orbits sidB naturally", "Hub chosen by spin", "Not applicable (auto only)", "Offsets drift by physics"],
                      ["initiator", "sidA WASD steers leader → chain follows", "sidA WASD steers hub → orbit shifts", "sidA WASD steers leader → wings track", "sidA WASD steers whole mass"],
                      ["player", "Any human steers leader", "Any human steers hub", "Any human steers leader", "Any human steers mass"],
                    ].map(([mode, ...cells]) => (
                      <tr key={mode} className="text-theme-text">
                        <td className="px-2 py-1 border-b border-border-c/[0.07] font-mono text-[#818cf8]">{mode}</td>
                        {cells.map((v, i) => (
                          <td key={i} className="px-2 py-1 border-b border-border-c/[0.07] text-theme-muted">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "hijack" && (
            <>
              <div className="text-[11px] text-theme-muted mb-3">
                Hijack reverses the <strong className="text-theme-text">sidA / sidB roles</strong> in an active hostile or neutral stack.
                The former victim becomes the new initiator. Enable per-link with
                <code className="text-[#f43f5e] bg-[#f43f5e11] px-1 rounded-[3px]"> hijackable: true</code>.
              </div>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                <DiagHijackFlow />
              </div>

              <div className="mt-4 grid gap-3 text-[11px] [grid-template-columns:1fr_1fr]">
                {/* Victim panel mock */}
                <div className="border border-[#818cf8] rounded-[10px] p-3 bg-[#818cf808]">
                  <div className="text-[10px] font-bold text-[#818cf8] mb-2 tracking-[1px]">VICTIM HUD (in-game)</div>
                  <div className="bg-[#0a0a14] rounded-lg p-[10px] border border-[#818cf844]">
                    <div className="flex items-center gap-2 mb-[6px]">
                      <div className="w-2 h-2 rounded-full bg-[#818cf8] shadow-[0_0_6px_#818cf8]" />
                      <span className="text-[#818cf8] font-bold text-[11px]">HIJACK INITIATED</span>
                    </div>
                    <div className="text-theme-muted text-[10px] mb-[6px]">Waiting for attacker response...</div>
                    <div className="h-[3px] bg-white/[0.07] rounded-[2px]">
                      <div className="w-[60%] h-full bg-[#818cf8] rounded-[2px]" />
                    </div>
                    <div className="text-theme-faint text-[9px] mt-1">Window closes in ~1.5s</div>
                  </div>
                </div>

                {/* Attacker panel mock */}
                <div className="border border-[#ef4444] rounded-[10px] p-3 bg-[#ef444408]">
                  <div className="text-[10px] font-bold text-[#ef4444] mb-2 tracking-[1px]">ATTACKER HUD (in-game)</div>
                  <div className="bg-[#0a0a14] rounded-lg p-[10px] border border-[#ef444444]">
                    <div className="flex items-center gap-2 mb-[6px]">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444]" />
                      <span className="text-[#ef4444] font-bold text-[11px]">HIJACK INCOMING!</span>
                    </div>
                    <div className="flex items-center gap-2 mb-[6px]">
                      <div className="w-7 h-7 rounded-md bg-[#ef444422] border-2 border-[#ef4444] flex items-center justify-center text-[#ef4444] font-black text-sm font-mono">K</div>
                      <span className="text-theme-text text-[10px]">Press to block takeover</span>
                    </div>
                    <div className="h-[3px] bg-white/[0.07] rounded-[2px]">
                      <div className="w-[60%] h-full bg-[#ef4444] rounded-[2px]" />
                    </div>
                    <div className="text-theme-faint text-[9px] mt-1">Miss the window → roles reverse</div>
                  </div>
                </div>
              </div>

              {/* Hijack rules summary */}
              <div className="mt-[14px] text-[10px] text-theme-muted bg-bg3 rounded-lg px-3 py-[10px]">
                <div className="font-bold text-theme-text mb-[6px]">Rules</div>
                {[
                  ["Only active on", "hostile or neutral links with hijackable: true"],
                  ["Trigger", "Victim sends bey-link-hijack-attempt while stack is active and no cooldown"],
                  ["Block window", "hijackWindowTicks (default 90 ticks ≈ 1.5 s) for attacker to press the keyed button"],
                  ["On success", "Stack key inverts (sidB:sidA:linkId). Effects invert. Rigid offsets cleared. hijackCooldownTicks on both."],
                  ["On block", "hijackCooldownTicks on victim only. Attacker retains control."],
                  ["Expiry", "Window expiry auto-executes hijack (attacker failed to respond)."],
                  ["Duration", "Hijacked stack runs until normal break conditions (maxDuration / ringOut / collision threshold)."],
                ].map(([key, val]) => (
                  <div key={key as string} className="flex gap-2 mb-1">
                    <span className="text-[#818cf8] font-mono min-w-[110px]">{key}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
