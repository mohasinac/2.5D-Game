// @refresh reset
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Constants ──────────────────────────────────────────────────────────────────
const BEY_RADIUS = 4;
const JUMP_V     = 140;
const TRAIL_LEN  = 1500;

// 3 KO exits at 90°/210°/330° — offset from default 0°/180° spawn
const KO_ANGLES = [Math.PI / 2, (Math.PI * 7) / 6, (Math.PI * 11) / 6];
const KO_HALF_W = Math.PI / 10;  // ±18° each = 36° gap
const RIDGE_FRAC = 0.64;         // tornado ridge at 64% of radius

const MATERIAL_COLORS: Record<string, number> = { abs: 0xd0d8e0, metal: 0xa8b4bc, rubber: 0x2e2e2e };
const MATERIAL_FR:     Record<string, number> = { abs: 0.9992,   metal: 0.9998,   rubber: 0.9968  };
const TIP_FR:          Record<string, number> = { flat: 0.9984,  sharp: 0.9999,   ball:   0.9989  };

// ── Arena cross-section profile ───────────────────────────────────────────────
// [r_fraction 0→1, height_fraction 0→1]   0 = center bottom, 1 = rim level
const ARENA_PROFILE: [number, number][] = [
  [0.00, 0.00], [0.10, 0.00], [0.20, 0.02], [0.30, 0.05],
  [0.42, 0.13], [0.52, 0.24], [0.58, 0.30], [0.62, 0.36],
  [0.64, 0.48], // ── TORNADO RIDGE peak ──
  [0.67, 0.33], [0.71, 0.30], // valley between ridge and outer wall
  [0.76, 0.41], [0.84, 0.64], [0.91, 0.84], [0.96, 0.96], [1.00, 1.00],
];

// ── Arena math ─────────────────────────────────────────────────────────────────
function arenaFloorY(px: number, pz: number, R: number, D: number): number {
  const rf = Math.min(Math.sqrt(px * px + pz * pz) / R, 1.0);
  let i = 0;
  while (i < ARENA_PROFILE.length - 2 && ARENA_PROFILE[i + 1][0] <= rf) i++;
  const [r0, y0] = ARENA_PROFILE[i];
  const [r1, y1] = ARENA_PROFILE[i + 1];
  const t = r1 > r0 ? (rf - r0) / (r1 - r0) : 0;
  return (y0 + t * (y1 - y0)) * D - D;
}

function arenaNormal(px: number, pz: number, R: number, D: number): [number, number, number] {
  const r = Math.sqrt(px * px + pz * pz);
  if (r < 0.001) return [0, 1, 0];
  const eps = 0.25, rx = px / r, rz = pz / r;
  const dY = (arenaFloorY(px + eps * rx, pz + eps * rz, R, D) -
              arenaFloorY(px - eps * rx, pz - eps * rz, R, D)) / (2 * eps);
  const nx = -dY * rx, nz = -dY * rz;
  const len = Math.sqrt(nx * nx + 1 + nz * nz);
  return [nx / len, 1 / len, nz / len];
}

function isKOAngle(px: number, pz: number): boolean {
  const a = Math.atan2(pz, px);
  return KO_ANGLES.some(ka => {
    let d = a - ka;
    d -= Math.PI * 2 * Math.round(d / (Math.PI * 2));
    return Math.abs(d) < KO_HALF_W;
  });
}

function calcLaunch(
  R: number, D: number,
  angleDeg: number, tiltDeg: number, force: number, power: number, forEnemy: boolean
) {
  const aRad = (angleDeg * Math.PI) / 180 + (forEnemy ? Math.PI : 0);
  const ca = Math.cos(aRad), sa = Math.sin(aRad);
  const sr = R * 0.90;
  const px = sr * ca, pz = sr * sa;
  const py = arenaFloorY(px, pz, R, D) + BEY_RADIUS + 1.5;
  const vMag = 60 + force * 3.9;
  const tRad = (tiltDeg * Math.PI) / 180;
  // Tangential (CCW) + tilt-induced inward component (sin(tilt) physically correct)
  const vx = (-sa) * vMag * Math.cos(tRad) + (-ca) * vMag * Math.sin(tRad);
  const vz = ( ca) * vMag * Math.cos(tRad) + (-sa) * vMag * Math.sin(tRad);
  return { px, py, pz, vx, vy: -18, vz, spinRPM: 1000 + power * 50 };
}

// ── Geometry builders ──────────────────────────────────────────────────────────
function buildBowl(R: number, D: number, color: number): THREE.Mesh {
  const pts: THREE.Vector2[] = [];
  for (const [rf, yf] of ARENA_PROFILE)
    pts.push(new THREE.Vector2(Math.max(0.01, rf * R), yf * D - D));
  pts.push(
    new THREE.Vector2(R + 2.5,  2),
    new THREE.Vector2(R + 2.5, -(D + 1.5)),
    new THREE.Vector2(0.01,    -(D + 1.5))
  );
  const geo = new THREE.LatheGeometry(pts, 72);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color, metalness: 0.1, roughness: 0.65, side: THREE.DoubleSide,
  }));
}

function buildZoneMeshes(R: number, D: number): THREE.Mesh[] {
  const defs: [number, number, number][] = [
    [0,      R * 0.30, 0xffd700],
    [R*0.30, R * 0.64, 0x44aaff],
    [R*0.64, R * 0.72, 0xff8800],
    [R*0.72, R * 0.90, 0xff3355],
  ];
  return defs.map(([r0, r1, hex]) => {
    const SEG = 64;
    const pos: number[] = [], idx: number[] = [];
    for (let ri = 0; ri <= 2; ri++) {
      const r = r0 + (r1 - r0) * (ri / 2);
      for (let si = 0; si < SEG; si++) {
        const a = (si / SEG) * Math.PI * 2, x = r * Math.cos(a), z = r * Math.sin(a);
        pos.push(x, arenaFloorY(x, z, R, D) + 0.3, z);
      }
    }
    for (let ri = 0; ri < 2; ri++)
      for (let si = 0; si < SEG; si++) {
        const a = ri*SEG+si, b = ri*SEG+(si+1)%SEG, c = (ri+1)*SEG+si, d = (ri+1)*SEG+(si+1)%SEG;
        idx.push(a,b,c, b,d,c);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: hex, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false,
    }));
  });
}

function buildKOLines(R: number, D: number): THREE.Group {
  const g = new THREE.Group();
  for (const ka of KO_ANGLES) {
    const pts: number[] = [];
    for (let i = 0; i <= 24; i++) {
      const a = ka - KO_HALF_W + (i / 24) * KO_HALF_W * 2;
      const r = R * 0.92, x = r * Math.cos(a), z = r * Math.sin(a);
      pts.push(x, arenaFloorY(x, z, R, D) + 1.0, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    g.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xff2200 })));
  }
  return g;
}

function buildRidgeLine(R: number, D: number): THREE.Line {
  const pts: number[] = [];
  for (let i = 0; i <= 80; i++) {
    const a = (i / 80) * Math.PI * 2, r = R * RIDGE_FRAC;
    const x = r * Math.cos(a), z = r * Math.sin(a);
    pts.push(x, arenaFloorY(x, z, R, D) + 0.7, z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffee44, opacity: 0.7, transparent: true }));
}

function buildBeyObject(): THREE.Group {
  const root = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, 0, BEY_RADIUS * 2, 48),
    new THREE.MeshStandardMaterial({ color: 0xe0e0f5, metalness: 0.8, roughness: 0.15 })
  );
  body.castShadow = true; root.add(body);
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, BEY_RADIUS * 0.92, 0.5, 48),
    new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.5, roughness: 0.4 })
  );
  cap.position.y = BEY_RADIUS; root.add(cap);
  const arr = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 1.3, 5),
    new THREE.MeshBasicMaterial({ color: 0x00ffaa })
  );
  arr.rotation.x = Math.PI / 2; arr.position.set(0, BEY_RADIUS + 0.15, BEY_RADIUS * 0.58);
  root.add(arr);
  return root;
}

function buildEnemyBeyObject(): THREE.Group {
  const root = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, 0, BEY_RADIUS * 2, 48),
    new THREE.MeshStandardMaterial({ color: 0xff3322, metalness: 0.7, roughness: 0.2 })
  );
  body.castShadow = true; root.add(body);
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, BEY_RADIUS * 0.92, 0.5, 48),
    new THREE.MeshStandardMaterial({ color: 0xaa2211, metalness: 0.5, roughness: 0.4 })
  );
  cap.position.y = BEY_RADIUS; root.add(cap);
  const arr = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 1.3, 5),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  arr.rotation.x = Math.PI / 2; arr.position.set(0, BEY_RADIUS + 0.15, BEY_RADIUS * 0.58);
  root.add(arr);
  return root;
}

// ── Action effects ─────────────────────────────────────────────────────────────
function fxAttack(pos: THREE.Vector3): THREE.Group {
  const g = new THREE.Group(); g.position.copy(pos);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(BEY_RADIUS*1.5, 0.3, 6, 32), new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true }));
  ring.rotation.x = Math.PI / 2; g.add(ring);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.28, BEY_RADIUS*2.2, 4), new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true }));
    spike.position.set(Math.cos(a)*BEY_RADIUS*2, 0, Math.sin(a)*BEY_RADIUS*2);
    spike.rotation.z = Math.PI / 2; spike.rotation.y = a; g.add(spike);
  }
  return g;
}
function fxDefend(pos: THREE.Vector3): THREE.Group {
  const g = new THREE.Group(); g.position.copy(pos);
  g.add(new THREE.Mesh(new THREE.OctahedronGeometry(BEY_RADIUS*2.0), new THREE.MeshBasicMaterial({ color: 0x0088ff, wireframe: true, transparent: true, opacity: 0.6 })));
  return g;
}
function fxDodge(pos: THREE.Vector3, heading: number): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const t = (i + 1) / 5;
    const ghost = new THREE.Mesh(new THREE.OctahedronGeometry(BEY_RADIUS*(1-t*0.25)), new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.5*(1-t) }));
    ghost.position.set(pos.x - Math.sin(heading)*i*3.5, pos.y, pos.z - Math.cos(heading)*i*3.5);
    g.add(ghost);
  }
  return g;
}
function fxSpecial(pos: THREE.Vector3): THREE.Group {
  const g = new THREE.Group(); g.position.copy(pos);
  g.add(new THREE.Mesh(new THREE.OctahedronGeometry(BEY_RADIUS*2.4), new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.7 })));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.05, BEY_RADIUS*4.5, 4), new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true }));
    ray.rotation.z = Math.PI/2; ray.rotation.y = a;
    ray.position.set(Math.cos(a)*BEY_RADIUS*2.8, 0, Math.sin(a)*BEY_RADIUS*2.8);
    g.add(ray);
  }
  return g;
}

// ── Types ──────────────────────────────────────────────────────────────────────
type TipType      = "flat" | "sharp" | "ball";
type ArenaMaterial = "abs" | "metal" | "rubber";

interface Cfg {
  bowlRadius: number; bowlDepth: number; arenaMaterial: ArenaMaterial; gravity: number;
  camDist: number; camPitch: number;
  playerTipType: TipType; launchAngle: number; launchTilt: number; launchForce: number; launchPower: number;
  enemyTipType: TipType; enemyLaunchTilt: number; enemyLaunchForce: number; enemyLaunchPower: number;
  showEnemy: boolean; showZones: boolean; showGrid: boolean; showWireframe: boolean;
}

const LS_KEY = "arena_v2";  // v2 clears old data automatically

function loadCfg(): Cfg {
  const def: Cfg = {
    bowlRadius: 30, bowlDepth: 10, arenaMaterial: "abs", gravity: 490,
    camDist: 72, camPitch: 38,
    playerTipType: "flat", launchAngle: 0, launchTilt: 0, launchForce: 55, launchPower: 75,
    enemyTipType: "flat", enemyLaunchTilt: 5, enemyLaunchForce: 55, enemyLaunchPower: 75,
    showEnemy: true, showZones: true, showGrid: false, showWireframe: false,
  };
  try { const s = localStorage.getItem(LS_KEY); if (s) return { ...def, ...JSON.parse(s) }; } catch { /* */ }
  return def;
}
function saveCfg(cfg: Cfg) { try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch { /* */ } }

interface Eff { obj: THREE.Object3D; life: number; max: number; type: "attack"|"defend"|"dodge"|"special"; }

interface G {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  bey: THREE.Group; enemy: THREE.Group;
  bowl: THREE.Group; zones: THREE.Group; grid: THREE.GridHelper;
  trail: THREE.Line; trailPts: Float32Array; trailHead: number;
  etrail: THREE.Line; etrailPts: Float32Array; etrailHead: number;
  effects: Eff[];
  px: number; py: number; pz: number; vx: number; vy: number; vz: number;
  heading: number; spinDeg: number; spinRPM: number; prevRF: number; playerKO: boolean;
  epx: number; epy: number; epz: number; evx: number; evy: number; evz: number;
  espinDeg: number; espinRPM: number; eprevRF: number; enemyKO: boolean;
  camFocX: number; camFocY: number; camFocZ: number;
  camYaw: number; isDrag: boolean; lastMx: number; lastMy: number;
  keys: Set<string>; animId: number; hudTimer: number;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
interface SliderProps { cfg: Cfg; setCfg: React.Dispatch<React.SetStateAction<Cfg>>; label: string; field: keyof Cfg; min: number; max: number; step: number; unit: string; }
function Slider({ cfg, setCfg, label, field, min, max, step, unit }: SliderProps) {
  const v = cfg[field] as number;
  const dec = step < 0.01 ? 3 : step < 1 ? 1 : 0;
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aabbcc", marginBottom: 2 }}>
        <span>{label}</span><span>{v.toFixed(dec)}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v}
        onChange={e => setCfg(c => ({ ...c, [field]: parseFloat(e.target.value) }))}
        style={{ width: "100%", accentColor: "#4488ff" }}
      />
    </div>
  );
}
function Toggle({ label, val, set }: { label: string; val: boolean; set: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, cursor: "pointer", color: "#aabbcc", fontSize: 12 }}>
      <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />{label}
    </label>
  );
}
const PICK_BTN: React.CSSProperties = { flex: 1, padding: "4px 0", fontSize: 11, fontFamily: "monospace", cursor: "pointer", borderRadius: 3, border: "1px solid #1a2a3a" };
function TipPicker({ value, onChange }: { value: TipType; onChange: (t: TipType) => void }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 9 }}>
      {(["flat", "sharp", "ball"] as TipType[]).map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          ...PICK_BTN,
          background: value === t ? "#183a5f" : "#0d1520",
          color: value === t ? "#88ddff" : "#445566",
          borderColor: value === t ? "#2a6090" : "#1a2a3a",
        }}>{t}</button>
      ))}
    </div>
  );
}
function MatPicker({ value, onChange }: { value: ArenaMaterial; onChange: (m: ArenaMaterial) => void }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 9 }}>
      {(["abs", "metal", "rubber"] as ArenaMaterial[]).map(m => (
        <button key={m} onClick={() => onChange(m)} style={{
          ...PICK_BTN,
          background: value === m ? "#3a2a10" : "#0d1520",
          color: value === m ? "#ffcc88" : "#445566",
          borderColor: value === m ? "#705020" : "#1a2a3a",
        }}>{m}</button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ArenaMockPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gRef         = useRef<G | null>(null);
  const cfgRef       = useRef<Cfg>(loadCfg());
  const bowlGeoRef   = useRef({ R: cfgRef.current.bowlRadius, D: cfgRef.current.bowlDepth });

  const speedDomRef  = useRef<HTMLSpanElement>(null);
  const rpmDomRef    = useRef<HTMLSpanElement>(null);
  const erpmDomRef   = useRef<HTMLSpanElement>(null);
  const vxDomRef     = useRef<HTMLSpanElement>(null);
  const vyDomRef     = useRef<HTMLSpanElement>(null);
  const vzDomRef     = useRef<HTMLSpanElement>(null);
  const actionDomRef = useRef<HTMLDivElement>(null);
  const actionTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef    = useRef(true);

  const [paused, setPaused]   = useState(true);
  const [koState, setKoState] = useState({ player: false, enemy: false });
  const [cfg, setCfg]         = useState<Cfg>(cfgRef.current);

  useEffect(() => { cfgRef.current = cfg; saveCfg(cfg); }, [cfg]);

  // ── Bowl rebuild when shape/material changes ───────────────────────────────
  useEffect(() => {
    const g = gRef.current; if (!g) return;
    const { bowlRadius: R, bowlDepth: D, arenaMaterial: mat } = cfg;
    bowlGeoRef.current = { R, D };

    g.bowl.children.slice().forEach(c => g.bowl.remove(c));
    const mesh = buildBowl(R, D, MATERIAL_COLORS[mat]);
    (mesh.material as THREE.MeshStandardMaterial).wireframe = cfg.showWireframe;
    g.bowl.add(mesh);
    g.bowl.add(buildKOLines(R, D));
    g.bowl.add(buildRidgeLine(R, D));

    g.zones.children.slice().forEach(c => g.zones.remove(c));
    buildZoneMeshes(R, D).forEach(m => g.zones.add(m));
    g.zones.visible = cfg.showZones;

    // Reset beys to pre-launch positions
    const p = calcLaunch(R, D, cfgRef.current.launchAngle, 0, 0, 0, false);
    const e = calcLaunch(R, D, cfgRef.current.launchAngle, 0, 0, 0, true);
    g.px = p.px; g.py = p.py; g.pz = p.pz; g.vx = 0; g.vy = 0; g.vz = 0; g.spinRPM = 0;
    g.epx = e.px; g.epy = e.py; g.epz = e.pz; g.evx = 0; g.evy = 0; g.evz = 0; g.espinRPM = 0;
    g.playerKO = false; g.enemyKO = false;
    g.bey.visible = true; g.enemy.visible = cfgRef.current.showEnemy;
    setKoState({ player: false, enemy: false });
    pausedRef.current = true; setPaused(true);
  }, [cfg.bowlRadius, cfg.bowlDepth, cfg.arenaMaterial]); // eslint-disable-line

  useEffect(() => {
    const g = gRef.current; if (!g || !g.bowl.children[0]) return;
    (g.bowl.children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>).material.wireframe = cfg.showWireframe;
  }, [cfg.showWireframe]);
  useEffect(() => { if (gRef.current) gRef.current.zones.visible = cfg.showZones; },  [cfg.showZones]);
  useEffect(() => { if (gRef.current) gRef.current.grid.visible  = cfg.showGrid;  },  [cfg.showGrid]);
  useEffect(() => { if (gRef.current) gRef.current.enemy.visible = cfg.showEnemy && !gRef.current.enemyKO; }, [cfg.showEnemy]);

  // ── One-time scene setup ───────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    const w = container.clientWidth || 800, h = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);
    scene.fog = new THREE.FogExp2(0x0a0a12, 0.004);

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000);
    camera.position.set(0, 45, 72);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x334466, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(30, 80, 30); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 250;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -70;
    sun.shadow.camera.right = sun.shadow.camera.top   =  70;
    scene.add(sun);
    scene.add(Object.assign(new THREE.PointLight(0x4488ff, 1.5, 120), { position: new THREE.Vector3(0, 12, 0) }));

    const { bowlRadius: R, bowlDepth: D, arenaMaterial: mat } = cfgRef.current;
    bowlGeoRef.current = { R, D };

    const bowl = new THREE.Group();
    bowl.add(buildBowl(R, D, MATERIAL_COLORS[mat]));
    bowl.add(buildKOLines(R, D));
    bowl.add(buildRidgeLine(R, D));
    scene.add(bowl);

    const zones = new THREE.Group();
    buildZoneMeshes(R, D).forEach(m => zones.add(m));
    zones.visible = cfgRef.current.showZones;
    scene.add(zones);

    const grid = new THREE.GridHelper(R * 2.6, Math.round(R / 5) * 2, 0x334466, 0x1a2233);
    grid.position.y = 2; grid.visible = cfgRef.current.showGrid;
    scene.add(grid);

    scene.add(new THREE.AxesHelper(5));

    const bey = buildBeyObject();
    const enemy = buildEnemyBeyObject();
    enemy.visible = cfgRef.current.showEnemy;
    scene.add(bey); scene.add(enemy);

    // Trails
    const TLEN = TRAIL_LEN;
    function makeTrail(color: number): [THREE.Line, Float32Array] {
      const pts = new Float32Array(TLEN * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, opacity: 0.75, transparent: true }));
      scene.add(line);
      return [line, pts];
    }
    const [trail,  trailPts]  = makeTrail(0x44aaff);
    const [etrail, etrailPts] = makeTrail(0xff4422);

    const p0 = calcLaunch(R, D, cfgRef.current.launchAngle, 0, 0, 0, false);
    const e0 = calcLaunch(R, D, cfgRef.current.launchAngle, 0, 0, 0, true);

    const g: G = {
      scene, camera, renderer, bey, enemy, bowl, zones, grid, effects: [],
      trail, trailPts, trailHead: 0,
      etrail, etrailPts, etrailHead: 0,
      px: p0.px, py: p0.py, pz: p0.pz, vx: 0, vy: 0, vz: 0,
      heading: 0, spinDeg: 0, spinRPM: 0, prevRF: 0, playerKO: false,
      epx: e0.px, epy: e0.py, epz: e0.pz, evx: 0, evy: 0, evz: 0,
      espinDeg: 0, espinRPM: 0, eprevRF: 0, enemyKO: false,
      camFocX: 0, camFocY: 0, camFocZ: 0,
      camYaw: 0, isDrag: false, lastMx: 0, lastMy: 0,
      keys: new Set<string>(), animId: 0, hudTimer: 0,
    };
    gRef.current = g;

    function flash(text: string) {
      if (!actionDomRef.current) return;
      actionDomRef.current.textContent = text;
      actionDomRef.current.style.opacity = "1";
      if (actionTimer.current) clearTimeout(actionTimer.current);
      actionTimer.current = setTimeout(() => {
        if (actionDomRef.current) actionDomRef.current.style.opacity = "0";
      }, 1200);
    }

    const GAME_KEYS = [" ","w","a","s","d","i","j","k","l","arrowup","arrowdown","arrowleft","arrowright"];
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key === " " ? " " : e.key.toLowerCase();
      if (GAME_KEYS.includes(key)) e.preventDefault();
      const g2 = gRef.current; if (!g2) return;
      g2.keys.add(key);
      if (key === "j") { const eff = fxAttack(new THREE.Vector3(g2.px, g2.py, g2.pz)); g2.scene.add(eff); g2.effects.push({ obj: eff, life: 0.5, max: 0.5, type: "attack" }); flash("⚔️  ATTACK"); }
      else if (key === "k") { const eff = fxDefend(new THREE.Vector3(g2.px, g2.py, g2.pz)); g2.scene.add(eff); g2.effects.push({ obj: eff, life: 1.0, max: 1.0, type: "defend" }); flash("🛡️  DEFEND"); }
      else if (key === "l") { const boost = 200 * 0.018; g2.vx += Math.sin(g2.heading)*boost; g2.vz += Math.cos(g2.heading)*boost; const eff = fxDodge(new THREE.Vector3(g2.px, g2.py, g2.pz), g2.heading); g2.scene.add(eff); g2.effects.push({ obj: eff, life: 0.35, max: 0.35, type: "dodge" }); flash("💨  DODGE"); }
      else if (key === "i") { const eff = fxSpecial(new THREE.Vector3(g2.px, g2.py, g2.pz)); g2.scene.add(eff); g2.effects.push({ obj: eff, life: 0.9, max: 0.9, type: "special" }); flash("✨  SPECIAL"); }
    };
    const onKeyUp   = (e: KeyboardEvent) => { gRef.current?.keys.delete(e.key === " " ? " " : e.key.toLowerCase()); };
    const onMouseDown = (e: MouseEvent) => { if (e.button !== 0) return; const g2 = gRef.current; if (!g2) return; g2.isDrag = true; g2.lastMx = e.clientX; g2.lastMy = e.clientY; };
    const onMouseMove = (e: MouseEvent) => { const g2 = gRef.current; if (!g2?.isDrag) return; g2.camYaw += (e.clientX - g2.lastMx) * 0.4 * (Math.PI/180); g2.lastMx = e.clientX; g2.lastMy = e.clientY; };
    const onMouseUp   = () => { if (gRef.current) gRef.current.isDrag = false; };
    const onWheel = (e: WheelEvent) => { cfgRef.current.camDist = Math.max(20, Math.min(160, cfgRef.current.camDist + e.deltaY * 0.06)); saveCfg(cfgRef.current); };
    const onResize = () => { const g2 = gRef.current; if (!g2||!container) return; const w2=container.clientWidth, h2=container.clientHeight; g2.camera.aspect=w2/h2; g2.camera.updateProjectionMatrix(); g2.renderer.setSize(w2,h2); };
    const onUnload = () => saveCfg(cfgRef.current);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("beforeunload", onUnload);

    // ── Game loop ──────────────────────────────────────────────────────────────
    const camTarget = new THREE.Vector3();
    let lastT = performance.now();

    function tick() {
      const g2 = gRef.current; if (!g2) return;
      g2.animId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt  = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      if (pausedRef.current) { g2.renderer.render(g2.scene, g2.camera); return; }

      const c        = cfgRef.current;
      const { R, D } = bowlGeoRef.current;
      const rimR     = R - BEY_RADIUS;

      // ── Player physics ────────────────────────────────────────────────────
      if (!g2.playerKO) {
        // WASD input
        const fwdX = Math.sin(g2.camYaw), fwdZ = Math.cos(g2.camYaw);
        const rgtX = Math.cos(g2.camYaw), rgtZ = -Math.sin(g2.camYaw);
        let ax = 0, az = 0;
        if (g2.keys.has("w")||g2.keys.has("arrowup"))    { ax -= fwdX; az -= fwdZ; }
        if (g2.keys.has("s")||g2.keys.has("arrowdown"))  { ax += fwdX; az += fwdZ; }
        if (g2.keys.has("a")||g2.keys.has("arrowleft"))  { ax -= rgtX; az -= rgtZ; }
        if (g2.keys.has("d")||g2.keys.has("arrowright")) { ax += rgtX; az += rgtZ; }
        const aLen = Math.sqrt(ax*ax + az*az);
        if (aLen > 0) { ax /= aLen; az /= aLen; g2.vx += ax*200*dt; g2.vz += az*200*dt; g2.heading = Math.atan2(ax, az); }

        // Gravity
        g2.vy -= c.gravity * dt;

        // Material × tip friction
        const fr = Math.pow(MATERIAL_FR[c.arenaMaterial] * TIP_FR[c.playerTipType], dt * 60);
        g2.vx *= fr; g2.vz *= fr;

        // Integrate
        g2.px += g2.vx * dt; g2.py += g2.vy * dt; g2.pz += g2.vz * dt;

        // Bowl floor collision
        const floorY = arenaFloorY(g2.px, g2.pz, R, D) + BEY_RADIUS;
        let grounded = false;
        if (g2.py <= floorY) {
          g2.py = floorY; grounded = true;
          const [nx, ny, nz] = arenaNormal(g2.px, g2.pz, R, D);
          const vn = g2.vx*nx + g2.vy*ny + g2.vz*nz;
          if (vn < 0) { g2.vx -= 2*vn*nx*0.3; g2.vy -= 2*vn*ny*0.3; g2.vz -= 2*vn*nz*0.3; }
        }

        // Jump
        if (g2.keys.has(" ") && grounded) { g2.vy += JUMP_V; g2.keys.delete(" "); }

        // Ball tip: roll toward center
        if (c.playerTipType === "ball" && grounded) {
          const rm = Math.sqrt(g2.px*g2.px + g2.pz*g2.pz);
          if (rm > 1) { g2.vx -= (g2.px/rm)*15*dt; g2.vz -= (g2.pz/rm)*15*dt; }
        }

        // Tornado ridge hop
        const curRF = Math.sqrt(g2.px*g2.px + g2.pz*g2.pz) / R;
        if (grounded && Math.abs(curRF - RIDGE_FRAC) < 0.06 && Math.abs(g2.prevRF - RIDGE_FRAC) > 0.06) g2.vy += 10;
        g2.prevRF = curRF;

        // KO / wall rim
        const r2 = g2.px*g2.px + g2.pz*g2.pz;
        if (r2 > rimR * rimR) {
          if (isKOAngle(g2.px, g2.pz)) {
            g2.playerKO = true;
            setKoState(s => ({ ...s, player: true }));
            g2.bey.visible = false;
            flash("💥 PLAYER KO!");
          } else {
            const rm = Math.sqrt(r2);
            g2.px = (g2.px/rm)*rimR; g2.pz = (g2.pz/rm)*rimR;
            const rnx = g2.px/rimR, rnz = g2.pz/rimR;
            const vr = g2.vx*rnx + g2.vz*rnz;
            if (vr > 0) { g2.vx -= 2*vr*rnx*0.55; g2.vz -= 2*vr*rnz*0.55; }
          }
        }

        g2.spinRPM = Math.max(0, g2.spinRPM - 60*dt);
        g2.spinDeg += (g2.spinRPM / 60) * 360 * dt;
        g2.bey.position.set(g2.px, g2.py, g2.pz);
        g2.bey.rotation.y = (g2.spinDeg * Math.PI) / 180;

        // Player trail
        const tp = g2.trailPts;
        if (g2.trailHead < TRAIL_LEN) {
          const ti = g2.trailHead * 3; tp[ti]=g2.px; tp[ti+1]=g2.py+0.4; tp[ti+2]=g2.pz; g2.trailHead++;
        } else { tp.copyWithin(0, 3); const ti=(TRAIL_LEN-1)*3; tp[ti]=g2.px; tp[ti+1]=g2.py+0.4; tp[ti+2]=g2.pz; }
        g2.trail.geometry.attributes.position.needsUpdate = true;
        g2.trail.geometry.setDrawRange(0, Math.min(g2.trailHead, TRAIL_LEN));
      }

      // ── Enemy physics ─────────────────────────────────────────────────────
      if (!g2.enemyKO && c.showEnemy) {
        g2.evy -= c.gravity * dt;
        const efr = Math.pow(MATERIAL_FR[c.arenaMaterial] * TIP_FR[c.enemyTipType], dt * 60);
        g2.evx *= efr; g2.evz *= efr;
        g2.epx += g2.evx*dt; g2.epy += g2.evy*dt; g2.epz += g2.evz*dt;

        const eFloorY = arenaFloorY(g2.epx, g2.epz, R, D) + BEY_RADIUS;
        let egrounded = false;
        if (g2.epy <= eFloorY) {
          g2.epy = eFloorY; egrounded = true;
          const [enx, eny, enz] = arenaNormal(g2.epx, g2.epz, R, D);
          const evn = g2.evx*enx + g2.evy*eny + g2.evz*enz;
          if (evn < 0) { g2.evx -= 2*evn*enx*0.3; g2.evy -= 2*evn*eny*0.3; g2.evz -= 2*evn*enz*0.3; }
        }

        if (c.enemyTipType === "ball" && egrounded) {
          const erm = Math.sqrt(g2.epx*g2.epx + g2.epz*g2.epz);
          if (erm > 1) { g2.evx -= (g2.epx/erm)*15*dt; g2.evz -= (g2.epz/erm)*15*dt; }
        }

        const ecurRF = Math.sqrt(g2.epx*g2.epx + g2.epz*g2.epz) / R;
        if (egrounded && Math.abs(ecurRF - RIDGE_FRAC) < 0.06 && Math.abs(g2.eprevRF - RIDGE_FRAC) > 0.06) g2.evy += 10;
        g2.eprevRF = ecurRF;

        const er2 = g2.epx*g2.epx + g2.epz*g2.epz;
        if (er2 > rimR * rimR) {
          if (isKOAngle(g2.epx, g2.epz)) {
            g2.enemyKO = true;
            setKoState(s => ({ ...s, enemy: true }));
            g2.enemy.visible = false;
            flash("💥 ENEMY KO!");
          } else {
            const erm2 = Math.sqrt(er2);
            g2.epx = (g2.epx/erm2)*rimR; g2.epz = (g2.epz/erm2)*rimR;
            const ernx = g2.epx/rimR, ernz = g2.epz/rimR;
            const evr = g2.evx*ernx + g2.evz*ernz;
            if (evr > 0) { g2.evx -= 2*evr*ernx*0.55; g2.evz -= 2*evr*ernz*0.55; }
          }
        }

        g2.espinRPM = Math.max(0, g2.espinRPM - 60*dt);
        g2.espinDeg += (g2.espinRPM / 60) * 360 * dt;
        g2.enemy.position.set(g2.epx, g2.epy, g2.epz);
        g2.enemy.rotation.y = (g2.espinDeg * Math.PI) / 180;

        // Enemy trail
        const ep = g2.etrailPts;
        if (g2.etrailHead < TRAIL_LEN) {
          const eti = g2.etrailHead * 3; ep[eti]=g2.epx; ep[eti+1]=g2.epy+0.4; ep[eti+2]=g2.epz; g2.etrailHead++;
        } else { ep.copyWithin(0, 3); const eti=(TRAIL_LEN-1)*3; ep[eti]=g2.epx; ep[eti+1]=g2.epy+0.4; ep[eti+2]=g2.epz; }
        g2.etrail.geometry.attributes.position.needsUpdate = true;
        g2.etrail.geometry.setDrawRange(0, Math.min(g2.etrailHead, TRAIL_LEN));
      }

      // ── Bey-to-bey collision ──────────────────────────────────────────────
      if (!g2.playerKO && !g2.enemyKO && c.showEnemy) {
        const cdx=g2.epx-g2.px, cdy=g2.epy-g2.py, cdz=g2.epz-g2.pz;
        const cdist = Math.sqrt(cdx*cdx+cdy*cdy+cdz*cdz);
        if (cdist < BEY_RADIUS*2 && cdist > 0.001) {
          const cnx=cdx/cdist, cny=cdy/cdist, cnz=cdz/cdist;
          const rvx=g2.evx-g2.vx, rvy=g2.evy-g2.vy, rvz=g2.evz-g2.vz;
          const rv=rvx*cnx+rvy*cny+rvz*cnz;
          if (rv < 0) {
            const imp = -(1+0.6)*rv/2;
            g2.vx -= imp*cnx; g2.vy -= imp*cny; g2.vz -= imp*cnz;
            g2.evx += imp*cnx; g2.evy += imp*cny; g2.evz += imp*cnz;
            const sd = (g2.espinRPM - g2.spinRPM) * 0.12;
            g2.spinRPM += sd; g2.espinRPM -= sd;
          }
          const ov = (BEY_RADIUS*2 - cdist) * 0.5;
          g2.px -= cnx*ov; g2.py -= cny*ov; g2.pz -= cnz*ov;
          g2.epx += cnx*ov; g2.epy += cny*ov; g2.epz += cnz*ov;
        }
      }

      // ── Effects lifecycle ─────────────────────────────────────────────────
      g2.effects = g2.effects.filter(eff => {
        eff.life -= dt;
        if (eff.life <= 0) {
          g2.scene.remove(eff.obj);
          eff.obj.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry?.dispose(); const mat = m.material; if (Array.isArray(mat)) mat.forEach(x => x.dispose()); else mat?.dispose(); } });
          return false;
        }
        const t = 1 - eff.life / eff.max;
        if (eff.type === "attack")  { eff.obj.scale.setScalar(1+t*2.8); eff.obj.traverse(o => { const mat=(o as THREE.Mesh).material as THREE.MeshBasicMaterial; if(mat?.transparent) mat.opacity=1-t; }); }
        if (eff.type === "defend")  { eff.obj.position.set(g2.px,g2.py,g2.pz); eff.obj.traverse(o => { const mat=(o as THREE.Mesh).material as THREE.MeshBasicMaterial; if(mat?.transparent) mat.opacity=0.6*(1-t*0.8); }); }
        if (eff.type === "dodge")   { eff.obj.traverse(o => { const mat=(o as THREE.Mesh).material as THREE.MeshBasicMaterial; if(mat?.transparent) mat.opacity=Math.max(0,mat.opacity-dt*2.5); }); }
        if (eff.type === "special") { eff.obj.scale.setScalar(1+t*4.5); eff.obj.traverse(o => { const mat=(o as THREE.Mesh).material as THREE.MeshBasicMaterial; if(mat?.transparent) mat.opacity=0.7*(1-t); }); }
        return true;
      });

      // ── Camera ────────────────────────────────────────────────────────────
      const focAlpha = 1 - Math.pow(0.01, dt);
      g2.camFocX += (g2.px - g2.camFocX) * focAlpha;
      g2.camFocY += (g2.py - g2.camFocY) * focAlpha;
      g2.camFocZ += (g2.pz - g2.camFocZ) * focAlpha;
      const pitch = (c.camPitch * Math.PI) / 180, cd = c.camDist;
      camTarget.set(
        g2.camFocX + Math.sin(g2.camYaw)*cd*Math.cos(pitch),
        g2.camFocY + Math.sin(pitch)*cd,
        g2.camFocZ + Math.cos(g2.camYaw)*cd*Math.cos(pitch)
      );
      g2.camera.position.lerp(camTarget, 1 - Math.pow(0.04, dt));
      g2.camera.lookAt(g2.camFocX, g2.camFocY + 2, g2.camFocZ);

      // ── HUD ───────────────────────────────────────────────────────────────
      g2.hudTimer += dt;
      if (g2.hudTimer >= 0.1) {
        g2.hudTimer = 0;
        const spd = Math.sqrt(g2.vx*g2.vx+g2.vy*g2.vy+g2.vz*g2.vz);
        if (speedDomRef.current) speedDomRef.current.textContent = spd.toFixed(1);
        if (rpmDomRef.current)   rpmDomRef.current.textContent   = Math.round(g2.spinRPM).toString();
        if (erpmDomRef.current)  erpmDomRef.current.textContent  = Math.round(g2.espinRPM).toString();
        if (vxDomRef.current)    vxDomRef.current.textContent    = g2.vx.toFixed(1);
        if (vyDomRef.current)    vyDomRef.current.textContent    = g2.vy.toFixed(1);
        if (vzDomRef.current)    vzDomRef.current.textContent    = g2.vz.toFixed(1);
      }
      g2.renderer.render(g2.scene, g2.camera);
    }
    tick();

    return () => {
      const g2 = gRef.current;
      if (g2) { cancelAnimationFrame(g2.animId); for (const eff of g2.effects) g2.scene.remove(eff.obj); gRef.current = null; }
      window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize); window.removeEventListener("beforeunload", onUnload);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (actionTimer.current) clearTimeout(actionTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ─────────────────────────────────────────────────────────────────
  const PL: React.CSSProperties = { width: 215, background: "#0d1520", borderRight: "1px solid #1a2a3a", padding: 14, overflowY: "auto", flexShrink: 0, fontSize: 12, fontFamily: "monospace" };
  const PR: React.CSSProperties = { width: 215, background: "#0d1520", borderLeft:  "1px solid #1a2a3a", padding: 14, overflowY: "auto", flexShrink: 0, fontSize: 12, fontFamily: "monospace" };
  const SEC: React.CSSProperties = { color: "#556677", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" };
  const BTN: React.CSSProperties = { width: "100%", padding: "7px 0", marginTop: 7, background: "#1a3a5f", border: "1px solid #2a5080", color: "#88bbff", borderRadius: 4, cursor: "pointer", fontSize: 12 };
  const SUBSEC: React.CSSProperties = { color: "#88aacc", fontSize: 11, fontWeight: "bold" as const, marginBottom: 5, marginTop: 10 };

  const setTip  = (field: "playerTipType"|"enemyTipType",  v: TipType)      => setCfg(c => ({ ...c, [field]: v }));
  const setMat  = (v: ArenaMaterial) => setCfg(c => ({ ...c, arenaMaterial: v }));
  const toggle  = (f: "showZones"|"showGrid"|"showWireframe"|"showEnemy") => setCfg(c => ({ ...c, [f]: !c[f] }));

  function doLaunch() {
    const g2 = gRef.current; if (!g2) return;
    const c = cfgRef.current;
    const { bowlRadius: R, bowlDepth: D } = c;
    // Player
    const p = calcLaunch(R, D, c.launchAngle, c.launchTilt, c.launchForce, c.launchPower, false);
    g2.px=p.px; g2.py=p.py; g2.pz=p.pz; g2.vx=p.vx; g2.vy=p.vy; g2.vz=p.vz; g2.spinRPM=p.spinRPM;
    g2.spinDeg=0; g2.playerKO=false; g2.bey.visible=true;
    g2.trailHead=0; g2.trail.geometry.setDrawRange(0,0);
    // Enemy
    const e = calcLaunch(R, D, c.launchAngle, c.enemyLaunchTilt, c.enemyLaunchForce, c.enemyLaunchPower, true);
    g2.epx=e.px; g2.epy=e.py; g2.epz=e.pz; g2.evx=e.vx; g2.evy=e.vy; g2.evz=e.vz; g2.espinRPM=e.spinRPM;
    g2.espinDeg=0; g2.enemyKO=false; g2.enemy.visible=c.showEnemy;
    g2.etrailHead=0; g2.etrail.geometry.setDrawRange(0,0);
    setKoState({ player: false, enemy: false });
    pausedRef.current=false; setPaused(false);
  }

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "#0a0a12", fontFamily: "monospace" }}>

      {/* ── LEFT — Launch ── */}
      <div style={PL}>
        <div style={{ fontWeight: "bold", color: "#aaccee", marginBottom: 12, fontSize: 13 }}>Launch</div>

        <div style={SUBSEC}>Player</div>
        <div style={{ ...SEC, marginTop: 0 }}>Tip Type</div>
        <TipPicker value={cfg.playerTipType} onChange={t => setTip("playerTipType", t)} />
        <Slider cfg={cfg} setCfg={setCfg} label="Tilt (axis from vertical)" field="launchTilt"  min={0}   max={45}  step={1}  unit="°"   />
        <Slider cfg={cfg} setCfg={setCfg} label="Force (forward speed)"     field="launchForce" min={0}   max={100} step={1}  unit=""    />
        <Slider cfg={cfg} setCfg={setCfg} label="Power (spin RPM)"          field="launchPower" min={0}   max={100} step={1}  unit=""    />
        <Slider cfg={cfg} setCfg={setCfg} label="Angle (position on rim)"   field="launchAngle" min={0}   max={360} step={5}  unit="°"   />

        <div style={{ ...SUBSEC, marginTop: 14 }}>Enemy</div>
        <div style={{ ...SEC, marginTop: 0 }}>Tip Type</div>
        <TipPicker value={cfg.enemyTipType} onChange={t => setTip("enemyTipType", t)} />
        <Slider cfg={cfg} setCfg={setCfg} label="Tilt"  field="enemyLaunchTilt"  min={0} max={45}  step={1} unit="°" />
        <Slider cfg={cfg} setCfg={setCfg} label="Force" field="enemyLaunchForce" min={0} max={100} step={1} unit=""  />
        <Slider cfg={cfg} setCfg={setCfg} label="Power" field="enemyLaunchPower" min={0} max={100} step={1} unit=""  />
        <Toggle label="Spawn enemy" val={cfg.showEnemy} set={() => toggle("showEnemy")} />

        <button onClick={() => {
          setCfg(c => ({ ...c, playerTipType: "sharp", launchTilt: 25, launchForce: 62, launchPower: 80, enemyTipType: "sharp", enemyLaunchTilt: 25, enemyLaunchForce: 58, enemyLaunchPower: 80 }));
        }} style={{ ...BTN, marginBottom: 4, background: "#1a1040", borderColor: "#5520a0", color: "#cc88ff", fontSize: 11 }}>🌸 Flower preset</button>
        <button onClick={doLaunch} style={{ ...BTN, background: "#1a5f2a", borderColor: "#2a8040", color: "#88ffaa" }}>Launch</button>
        <button onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }}
          style={{ ...BTN, marginTop: 5, background: paused ? "#3a2800" : "#1a2a3a", borderColor: paused ? "#806020" : "#2a3a50", color: paused ? "#ffcc44" : "#8899bb" }}>
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>

        {/* KO status */}
        {(koState.player || koState.enemy) && (
          <div style={{ marginTop: 12, padding: "8px 10px", background: "#2a0a0a", border: "1px solid #880000", borderRadius: 4 }}>
            {koState.player && <div style={{ color: "#ff4444", fontSize: 12 }}>💥 PLAYER KO</div>}
            {koState.enemy  && <div style={{ color: "#ff8844", fontSize: 12 }}>💥 ENEMY KO</div>}
            <div style={{ color: "#556677", fontSize: 10, marginTop: 4 }}>Click Launch to reset</div>
          </div>
        )}

        <div style={{ marginTop: 16, borderTop: "1px solid #1a2a3a", paddingTop: 12, color: "#556677", fontSize: 11, lineHeight: 1.9 }}>
          <div style={{ color: "#88aacc", fontWeight: "bold", marginBottom: 5 }}>CONTROLS</div>
          {([["WASD","Move"],["Space","Jump"],["J","Attack"],["K","Defend"],["L","Dodge"],["I","Special"],["Drag","Rotate cam"],["Scroll","Zoom"]] as [string,string][]).map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#aabbcc" }}>{k}</span><span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 14, left: 14, fontSize: 12, color: "#8899aa", pointerEvents: "none", lineHeight: 2, fontFamily: "monospace" }}>
          <div>Speed <span ref={speedDomRef} style={{ color: "#88ddff" }}>0.0</span> cm/s</div>
          <div>P-RPM <span ref={rpmDomRef}   style={{ color: "#ffcc44" }}>0</span></div>
          <div>E-RPM <span ref={erpmDomRef}  style={{ color: "#ff8844" }}>0</span></div>
          <div style={{ marginTop: 5, borderTop: "1px solid #1a2a3a", paddingTop: 5 }}>
            <div>Vx <span ref={vxDomRef} style={{ color: "#aaffaa" }}>0.0</span></div>
            <div>Vy <span ref={vyDomRef} style={{ color: "#ffaaaa" }}>0.0</span></div>
            <div>Vz <span ref={vzDomRef} style={{ color: "#aaaaff" }}>0.0</span></div>
          </div>
        </div>
        <div ref={actionDomRef} style={{ position: "absolute", top: 78, left: 14, fontSize: 17, fontWeight: "bold", color: "#ffdd44", opacity: 0, transition: "opacity 0.15s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", color: "#334455", fontSize: 11, pointerEvents: "none", whiteSpace: "nowrap" }}>
          ── TORNADO RIDGE <span style={{ color: "#ffee44" }}>●</span> ── KO EXITS <span style={{ color: "#ff2200" }}>●</span>
        </div>
      </div>

      {/* ── RIGHT — Arena ── */}
      <div style={PR}>
        <div style={{ fontWeight: "bold", color: "#aaccee", marginBottom: 12, fontSize: 13 }}>Arena</div>

        <div style={SEC}>Material (friction)</div>
        <MatPicker value={cfg.arenaMaterial} onChange={setMat} />
        <div style={{ fontSize: 10, color: "#445566", marginBottom: 8, lineHeight: 1.5 }}>
          abs 0.9992 · metal 0.9998 · rubber 0.9968
        </div>

        <div style={SEC}>Shape</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Radius" field="bowlRadius" min={15} max={55} step={1}   unit=" cm" />
        <Slider cfg={cfg} setCfg={setCfg} label="Depth"  field="bowlDepth"  min={5}  max={20} step={0.5} unit=" cm" />

        <div style={SEC}>Camera</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Distance" field="camDist"  min={20} max={160} step={5} unit=" cm" />
        <Slider cfg={cfg} setCfg={setCfg} label="Pitch"    field="camPitch" min={10} max={80}  step={5} unit="°"   />

        <div style={SEC}>Physics</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Gravity" field="gravity" min={200} max={2000} step={50} unit=" cm/s²" />

        <div style={SEC}>Display</div>
        <Toggle label="Zone rings"  val={cfg.showZones}     set={() => toggle("showZones")}     />
        <Toggle label="Grid"        val={cfg.showGrid}      set={() => toggle("showGrid")}      />
        <Toggle label="Wireframe"   val={cfg.showWireframe} set={() => toggle("showWireframe")} />

        <div style={{ marginTop: 14, borderTop: "1px solid #1a2a3a", paddingTop: 12, fontSize: 10, color: "#445566", lineHeight: 1.7 }}>
          <div style={{ color: "#88aacc", marginBottom: 4 }}>TIP TYPES</div>
          <div><span style={{ color: "#ffaaaa" }}>flat</span> — high friction, mid-radius orbit, aggressive</div>
          <div><span style={{ color: "#aaffaa" }}>sharp</span> — near-zero friction, flower pattern with tilt 20–35°</div>
          <div><span style={{ color: "#aaaaff" }}>ball</span> — medium friction, drifts to center</div>
          <div style={{ color: "#88aacc", marginBottom: 4, marginTop: 10 }}>ZONES</div>
          <div><span style={{ color: "#ffd700" }}>■</span> Center flat (0–30%)</div>
          <div><span style={{ color: "#44aaff" }}>■</span> Slope (30–64%)</div>
          <div><span style={{ color: "#ff8800" }}>■</span> Tornado ridge (64–72%)</div>
          <div><span style={{ color: "#ff3355" }}>■</span> Outer wall (72–90%)</div>
          <div style={{ marginTop: 8 }}><span style={{ color: "#ff2200" }}>─</span> KO exits (3 × 36°)</div>
          <div><span style={{ color: "#ffee44" }}>─</span> Tornado ridge ring</div>
        </div>
      </div>
    </div>
  );
}
