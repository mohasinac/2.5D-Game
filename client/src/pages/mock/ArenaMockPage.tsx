// @refresh reset
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Constants ──────────────────────────────────────────────────────────────────
const BEY_RADIUS = 4;     // cm — bounding sphere used for physics
const JUMP_V     = 140;   // cm/s — upward impulse on jump

// ── Math helpers ───────────────────────────────────────────────────────────────
function bowlFloorY(px: number, pz: number, R: number, D: number): number {
  const r2 = px * px + pz * pz;
  if (r2 >= R * R) return 0;
  return D * r2 / (R * R) - D;
}

// Numerical surface normal (accounts for ridges automatically)
function bowlNormal(px: number, pz: number, R: number, D: number): [number, number, number] {
  const r = Math.sqrt(px * px + pz * pz);
  if (r < 0.001) return [0, 1, 0];
  const eps = 0.15;
  const rx = px / r, rz = pz / r;
  const dY = (bowlFloorY(px + eps * rx, pz + eps * rz, R, D) -
              bowlFloorY(px - eps * rx, pz - eps * rz, R, D)) / (2 * eps);
  const nx = -dY * rx, nz = -dY * rz;
  const len = Math.sqrt(nx * nx + 1 + nz * nz);
  return [nx / len, 1 / len, nz / len];
}

// ── Geometry / mesh builders ───────────────────────────────────────────────────
function buildBowl(R: number, D: number): THREE.Mesh {
  const N = 96;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const r = Math.max(0.01, t * R);
    pts.push(new THREE.Vector2(r, D * t * t - D));
  }
  pts.push(new THREE.Vector2(R + 2,   1.8));
  pts.push(new THREE.Vector2(R + 2,   -(D + 1)));
  pts.push(new THREE.Vector2(0.01,    -(D + 1)));
  const geo = new THREE.LatheGeometry(pts, 64);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1e2a3a, metalness: 0.25, roughness: 0.75, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}

function buildZoneRing(r0: number, r1: number, R: number, D: number, hex: number): THREE.Mesh {
  const SEG = 64, RINGS = 3;
  const pos: number[] = [], idx: number[] = [];
  for (let ri = 0; ri <= RINGS; ri++) {
    const r = r0 + (r1 - r0) * (ri / RINGS);
    for (let si = 0; si < SEG; si++) {
      const a = (si / SEG) * Math.PI * 2;
      const x = r * Math.cos(a), z = r * Math.sin(a);
      pos.push(x, bowlFloorY(x, z, R, D) + 0.25, z);
    }
  }
  for (let ri = 0; ri < RINGS; ri++) {
    for (let si = 0; si < SEG; si++) {
      const a = ri * SEG + si, b = ri * SEG + (si + 1) % SEG;
      const c = (ri + 1) * SEG + si, d = (ri + 1) * SEG + (si + 1) % SEG;
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: hex, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false,
  }));
}


function buildBeyObject(): THREE.Group {
  const root = new THREE.Group();
  // Main body: cone — wide circle at top, sharp point at bottom (touching arena)
  // CylinderGeometry(radiusTop, radiusBottom, height) — radiusBottom=0 gives the point
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, 0, BEY_RADIUS * 2, 48),
    new THREE.MeshStandardMaterial({ color: 0xe0e0f5, metalness: 0.8, roughness: 0.15 })
  );
  body.castShadow = true;
  root.add(body);
  // Flat top cap disc
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, BEY_RADIUS * 0.92, 0.5, 48),
    new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.5, roughness: 0.4 })
  );
  cap.position.y = BEY_RADIUS;
  root.add(cap);
  // Direction arrow on top cap (green, points local +Z)
  const arr = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 1.3, 5),
    new THREE.MeshBasicMaterial({ color: 0x00ffaa })
  );
  arr.rotation.x = Math.PI / 2;
  arr.position.set(0, BEY_RADIUS + 0.15, BEY_RADIUS * 0.58);
  root.add(arr);
  return root;
}

function buildEnemyBeyObject(): THREE.Group {
  const root = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, 0, BEY_RADIUS * 2, 48),
    new THREE.MeshStandardMaterial({ color: 0xff3322, metalness: 0.7, roughness: 0.2 })
  );
  body.castShadow = true;
  root.add(body);
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(BEY_RADIUS * 0.92, BEY_RADIUS * 0.92, 0.5, 48),
    new THREE.MeshStandardMaterial({ color: 0xaa2211, metalness: 0.5, roughness: 0.4 })
  );
  cap.position.y = BEY_RADIUS;
  root.add(cap);
  const arr = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 1.3, 5),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  arr.rotation.x = Math.PI / 2;
  arr.position.set(0, BEY_RADIUS + 0.15, BEY_RADIUS * 0.58);
  root.add(arr);
  return root;
}

// ── Action effect factories ────────────────────────────────────────────────────
function fxAttack(pos: THREE.Vector3): THREE.Group {
  const g = new THREE.Group(); g.position.copy(pos);
  // Expanding ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(BEY_RADIUS * 1.5, 0.3, 6, 32),
    new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true })
  );
  ring.rotation.x = Math.PI / 2; g.add(ring);
  // 4 spikes
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, BEY_RADIUS * 2.2, 4),
      new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true })
    );
    spike.position.set(Math.cos(a) * BEY_RADIUS * 2, 0, Math.sin(a) * BEY_RADIUS * 2);
    spike.rotation.z = Math.PI / 2; spike.rotation.y = a; g.add(spike);
  }
  return g;
}

function fxDefend(pos: THREE.Vector3): THREE.Group {
  const g = new THREE.Group(); g.position.copy(pos);
  g.add(new THREE.Mesh(
    new THREE.OctahedronGeometry(BEY_RADIUS * 2.0),
    new THREE.MeshBasicMaterial({ color: 0x0088ff, wireframe: true, transparent: true, opacity: 0.6 })
  ));
  return g;
}

function fxDodge(pos: THREE.Vector3, heading: number): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const t = (i + 1) / 5;
    const ghost = new THREE.Mesh(
      new THREE.OctahedronGeometry(BEY_RADIUS * (1 - t * 0.25)),
      new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.5 * (1 - t) })
    );
    ghost.position.set(
      pos.x - Math.sin(heading) * i * 3.5,
      pos.y,
      pos.z - Math.cos(heading) * i * 3.5
    );
    g.add(ghost);
  }
  return g;
}

function fxSpecial(pos: THREE.Vector3): THREE.Group {
  const g = new THREE.Group(); g.position.copy(pos);
  g.add(new THREE.Mesh(
    new THREE.OctahedronGeometry(BEY_RADIUS * 2.4),
    new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.7 })
  ));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const ray = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.05, BEY_RADIUS * 4.5, 4),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true })
    );
    ray.rotation.z = Math.PI / 2; ray.rotation.y = a;
    ray.position.set(Math.cos(a) * BEY_RADIUS * 2.8, 0, Math.sin(a) * BEY_RADIUS * 2.8);
    g.add(ray);
  }
  return g;
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface Cfg {
  bowlRadius: number; bowlDepth: number;
  gravity: number; moveForce: number; friction: number;
  camDist: number; camPitch: number;
  spawnRadiusFrac: number; spawnVTangent: number; spawnVDown: number;
  showZones: boolean; showGrid: boolean; showWireframe: boolean; showEnemy: boolean;
}

const LS_KEY = "arena_mock_cfg";

function loadCfg(): Cfg {
  const defaults: Cfg = {
    bowlRadius: 30, bowlDepth: 15, gravity: 490, moveForce: 200, friction: 0.9995,
    camDist: 72, camPitch: 40,
    spawnRadiusFrac: 0.92, spawnVTangent: 130, spawnVDown: 60,
    showZones: true, showGrid: true, showWireframe: false, showEnemy: true,
  };
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) return { ...defaults, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return defaults;
}

function saveCfg(cfg: Cfg) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
}

interface Eff {
  obj: THREE.Object3D; life: number; max: number;
  type: "attack" | "defend" | "dodge" | "special";
}

interface G {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  bey: THREE.Group; enemy: THREE.Group; bowl: THREE.Group; zones: THREE.Group; grid: THREE.GridHelper;
  trail: THREE.Line; trailPts: Float32Array; trailHead: number;
  etrail: THREE.Line; etrailPts: Float32Array; etrailHead: number;
  effects: Eff[];
  // player
  px: number; py: number; pz: number;
  vx: number; vy: number; vz: number;
  heading: number; spinDeg: number; spinRPM: number;
  // enemy
  epx: number; epy: number; epz: number;
  evx: number; evy: number; evz: number;
  espinDeg: number; espinRPM: number;
  camFocX: number; camFocY: number; camFocZ: number;
  camYaw: number; isDrag: boolean; lastMx: number; lastMy: number;
  keys: Set<string>;
  animId: number; hudTimer: number;
}

// ── Sub-components (module-level to avoid identity churn) ──────────────────────
interface SliderProps {
  cfg: Cfg; setCfg: React.Dispatch<React.SetStateAction<Cfg>>;
  label: string; field: keyof Cfg; min: number; max: number; step: number; unit: string;
}
function Slider({ cfg, setCfg, label, field, min, max, step, unit }: SliderProps) {
  const v = cfg[field] as number;
  const dec = step < 0.01 ? 3 : step < 1 ? 1 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aabbcc", marginBottom: 3 }}>
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
    <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer", color: "#aabbcc", fontSize: 12 }}>
      <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
      {label}
    </label>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ArenaMockPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gRef         = useRef<G | null>(null);
  const cfgRef       = useRef<Cfg>(loadCfg());
  const bowlGeoRef   = useRef({ R: cfgRef.current.bowlRadius, D: cfgRef.current.bowlDepth });

  // DOM refs for HUD (avoids setState in the 60Hz loop)
  const speedDomRef  = useRef<HTMLSpanElement>(null);
  const airDomRef    = useRef<HTMLSpanElement>(null);
  const rpmDomRef    = useRef<HTMLSpanElement>(null);
  const vxDomRef     = useRef<HTMLSpanElement>(null);
  const vyDomRef     = useRef<HTMLSpanElement>(null);
  const vzDomRef     = useRef<HTMLSpanElement>(null);
  const actionDomRef = useRef<HTMLDivElement>(null);
  const actionTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef    = useRef(true); // start paused — user must click Launch
  const [paused, setPaused] = useState(true);

  // Panel state — all persisted via cfg
  const [cfg, setCfg] = useState<Cfg>(cfgRef.current);

  // Keep cfgRef in sync and persist to localStorage
  useEffect(() => { cfgRef.current = cfg; saveCfg(cfg); }, [cfg]);

  // Rebuild bowl when shape changes
  useEffect(() => {
    const g = gRef.current;
    if (!g) return;
    const { bowlRadius: R, bowlDepth: D } = cfg;
    bowlGeoRef.current = { R, D };

    while (g.bowl.children.length)  g.bowl.remove(g.bowl.children[0]);
    while (g.zones.children.length) g.zones.remove(g.zones.children[0]);

    const bowlMesh = buildBowl(R, D);
    (bowlMesh.material as THREE.MeshStandardMaterial).wireframe = cfg.showWireframe;
    g.bowl.add(bowlMesh);
    g.zones.add(buildZoneRing(0,      R * 0.3, R, D, 0xffd700));
    g.zones.add(buildZoneRing(R*0.3,  R * 0.6, R, D, 0x00aaff));
    g.zones.add(buildZoneRing(R*0.6,  R * 0.9, R, D, 0xff6680));
    g.zones.visible = cfg.showZones;

    const { spawnRadiusFrac: srf } = cfgRef.current;
    g.px = R * srf; g.py = bowlFloorY(R * srf, 0, R, D) + BEY_RADIUS; g.pz = 0;
    g.vx = 0; g.vy = 0; g.vz = 0; g.spinRPM = 0;
    g.epx = -R * srf; g.epy = bowlFloorY(-R * srf, 0, R, D) + BEY_RADIUS; g.epz = 0;
    g.evx = 0; g.evy = 0; g.evz = 0; g.espinRPM = 0;
    pausedRef.current = true; setPaused(true);
  }, [cfg.bowlRadius, cfg.bowlDepth]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const g = gRef.current; if (!g || !g.bowl.children[0]) return;
    (g.bowl.children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>).material.wireframe = cfg.showWireframe;
  }, [cfg.showWireframe]);

  useEffect(() => { if (gRef.current) gRef.current.zones.visible  = cfg.showZones;  }, [cfg.showZones]);
  useEffect(() => { if (gRef.current) gRef.current.grid.visible   = cfg.showGrid;   }, [cfg.showGrid]);
  useEffect(() => { if (gRef.current) gRef.current.enemy.visible  = cfg.showEnemy;  }, [cfg.showEnemy]);

  // ── One-time scene setup ─────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth  || 800;
    const h = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);
    scene.fog = new THREE.FogExp2(0x0a0a12, 0.004);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000);
    camera.position.set(0, 45, 72);
    camera.lookAt(0, -8, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x334466, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(30, 80, 30); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 250;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -65;
    sun.shadow.camera.right = sun.shadow.camera.top    =  65;
    scene.add(sun);
    const fill = new THREE.PointLight(0x4488ff, 1.5, 120);
    fill.position.set(0, 12, 0);
    scene.add(fill);

    // Bowl + zones
    const { bowlRadius: R, bowlDepth: D } = cfgRef.current;
    bowlGeoRef.current = { R, D };

    const bowl = new THREE.Group();
    bowl.add(buildBowl(R, D));
    scene.add(bowl);

    const zones = new THREE.Group();
    zones.add(buildZoneRing(0,     R * 0.3, R, D, 0xffd700));
    zones.add(buildZoneRing(R*0.3, R * 0.6, R, D, 0x00aaff));
    zones.add(buildZoneRing(R*0.6, R * 0.9, R, D, 0xff6680));
    scene.add(zones);

    // Grid (at rim level)
    const grid = new THREE.GridHelper(R * 2.6, Math.round(R / 5) * 2, 0x334466, 0x1a2233);
    grid.position.y = 2;
    scene.add(grid);

    // Apply initial visibility from saved cfg (effects fire before gRef is set, so do it here)
    zones.visible = cfgRef.current.showZones;
    grid.visible  = cfgRef.current.showGrid;

    // Axis helper
    scene.add(new THREE.AxesHelper(6));

    // Player bey
    const bey = buildBeyObject();
    bey.position.set(0, -D + BEY_RADIUS, 0);
    scene.add(bey);

    // Enemy bey — spawns on the opposite side with mirrored tangential velocity
    const enemy = buildEnemyBeyObject();
    enemy.position.set(0, -D + BEY_RADIUS, 0);
    enemy.visible = cfgRef.current.showEnemy;
    scene.add(enemy);

    // Trails — ring buffer of positions shown as a coloured line
    const TRAIL_LEN = 800;
    function makeTrail(color: number): [THREE.Line, Float32Array] {
      const pts = new Float32Array(TRAIL_LEN * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, opacity: 0.7, transparent: true }));
      scene.add(line);
      return [line, pts];
    }
    const [trail,  trailPts]  = makeTrail(0x44aaff);
    const [etrail, etrailPts] = makeTrail(0xff4422);

    const { spawnRadiusFrac: srf } = cfgRef.current;
    const g: G = {
      scene, camera, renderer, bey, enemy, bowl, zones, grid, effects: [],
      trail, trailPts, trailHead: 0,
      etrail, etrailPts, etrailHead: 0,
      // Start stationary — user clicks Launch to apply velocities
      px: R * srf,  py: bowlFloorY(R * srf, 0, R, D)  + BEY_RADIUS, pz: 0, vx: 0, vy: 0, vz: 0,
      heading: 0, spinDeg: 0, spinRPM: 0,
      epx: -R * srf, epy: bowlFloorY(-R * srf, 0, R, D) + BEY_RADIUS, epz: 0, evx: 0, evy: 0, evz: 0,
      espinDeg: 0, espinRPM: 0,
      camFocX: 0, camFocY: 0, camFocZ: 0,
      camYaw: 0, isDrag: false, lastMx: 0, lastMy: 0,
      keys: new Set<string>(),
      animId: 0, hudTimer: 0,
    };
    gRef.current = g;

    // ── Action flash helper ──────────────────────────────────────────────────
    function flash(text: string) {
      if (!actionDomRef.current) return;
      actionDomRef.current.textContent = text;
      actionDomRef.current.style.opacity = "1";
      if (actionTimer.current) clearTimeout(actionTimer.current);
      actionTimer.current = setTimeout(() => {
        if (actionDomRef.current) actionDomRef.current.style.opacity = "0";
      }, 900);
    }

    // ── Input ────────────────────────────────────────────────────────────────
    const GAME_KEYS = [" ", "w", "a", "s", "d", "i", "j", "k", "l", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key === " " ? " " : e.key.toLowerCase();
      if (GAME_KEYS.includes(key)) e.preventDefault();
      const g2 = gRef.current; if (!g2) return;
      g2.keys.add(key);

      if (key === "j") {
        const eff = fxAttack(new THREE.Vector3(g2.px, g2.py, g2.pz));
        g2.scene.add(eff); g2.effects.push({ obj: eff, life: 0.5, max: 0.5, type: "attack" });
        flash("⚔️  ATTACK");
      } else if (key === "k") {
        const eff = fxDefend(new THREE.Vector3(g2.px, g2.py, g2.pz));
        g2.scene.add(eff); g2.effects.push({ obj: eff, life: 1.0, max: 1.0, type: "defend" });
        flash("🛡️  DEFEND");
      } else if (key === "l") {
        const boost = cfgRef.current.moveForce * 0.018;
        g2.vx += Math.sin(g2.heading) * boost;
        g2.vz += Math.cos(g2.heading) * boost;
        const eff = fxDodge(new THREE.Vector3(g2.px, g2.py, g2.pz), g2.heading);
        g2.scene.add(eff); g2.effects.push({ obj: eff, life: 0.35, max: 0.35, type: "dodge" });
        flash("💨  DODGE");
      } else if (key === "i") {
        const eff = fxSpecial(new THREE.Vector3(g2.px, g2.py, g2.pz));
        g2.scene.add(eff); g2.effects.push({ obj: eff, life: 0.9, max: 0.9, type: "special" });
        flash("✨  SPECIAL");
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      gRef.current?.keys.delete(e.key === " " ? " " : e.key.toLowerCase());
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const g2 = gRef.current; if (!g2) return;
      g2.isDrag = true; g2.lastMx = e.clientX; g2.lastMy = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      const g2 = gRef.current; if (!g2?.isDrag) return;
      g2.camYaw += (e.clientX - g2.lastMx) * 0.4 * (Math.PI / 180);
      g2.lastMx = e.clientX; g2.lastMy = e.clientY;
    };
    const onMouseUp   = () => { if (gRef.current) gRef.current.isDrag = false; };
    const onWheel     = (e: WheelEvent) => {
      cfgRef.current.camDist = Math.max(25, Math.min(160, cfgRef.current.camDist + e.deltaY * 0.06));
      saveCfg(cfgRef.current);
    };
    const onUnload = () => saveCfg(cfgRef.current);
    window.addEventListener("beforeunload", onUnload);
    const onResize    = () => {
      const g2 = gRef.current; if (!g2 || !container) return;
      const w2 = container.clientWidth, h2 = container.clientHeight;
      g2.camera.aspect = w2 / h2;
      g2.camera.updateProjectionMatrix();
      g2.renderer.setSize(w2, h2);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    // ── Game loop ────────────────────────────────────────────────────────────
    const camTarget = new THREE.Vector3();
    let lastT = performance.now();

    function tick() {
      const g2 = gRef.current; if (!g2) return;
      g2.animId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt  = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      if (pausedRef.current) {
        g2.renderer.render(g2.scene, g2.camera);
        return;
      }

      const c        = cfgRef.current;
      const { R, D } = bowlGeoRef.current;

      // Input → lateral force
      const fwdX = Math.sin(g2.camYaw), fwdZ = Math.cos(g2.camYaw);
      const rgtX = Math.cos(g2.camYaw), rgtZ = -Math.sin(g2.camYaw);
      let ax = 0, az = 0;
      if (g2.keys.has("w") || g2.keys.has("arrowup"))    { ax -= fwdX; az -= fwdZ; }
      if (g2.keys.has("s") || g2.keys.has("arrowdown"))  { ax += fwdX; az += fwdZ; }
      if (g2.keys.has("a") || g2.keys.has("arrowleft"))  { ax -= rgtX; az -= rgtZ; }
      if (g2.keys.has("d") || g2.keys.has("arrowright")) { ax += rgtX; az += rgtZ; }
      const aLen = Math.sqrt(ax * ax + az * az);
      if (aLen > 0) {
        ax /= aLen; az /= aLen;
        g2.vx += ax * c.moveForce * dt;
        g2.vz += az * c.moveForce * dt;
        g2.heading = Math.atan2(ax, az);
      }

      // Gravity
      g2.vy -= c.gravity * dt;

      // Friction (normalised to 60 fps)
      const fr = Math.pow(c.friction, dt * 60);
      g2.vx *= fr; g2.vz *= fr;

      // Integrate
      g2.px += g2.vx * dt;
      g2.py += g2.vy * dt;
      g2.pz += g2.vz * dt;

      // Bowl floor collision
      const floorY  = bowlFloorY(g2.px, g2.pz, R, D) + BEY_RADIUS;
      let grounded  = false;
      if (g2.py <= floorY) {
        g2.py = floorY; grounded = true;
        const [nx, ny, nz] = bowlNormal(g2.px, g2.pz, R, D);
        const vn = g2.vx * nx + g2.vy * ny + g2.vz * nz;
        if (vn < 0) {
          g2.vx -= 2 * vn * nx * 0.35;
          g2.vy -= 2 * vn * ny * 0.35;
          g2.vz -= 2 * vn * nz * 0.35;
        }
      }

      // Jump
      if (g2.keys.has(" ") && grounded) {
        g2.vy += JUMP_V;
        g2.keys.delete(" ");
      }

      // Rim collision
      const rimR = R - BEY_RADIUS;
      const r2   = g2.px * g2.px + g2.pz * g2.pz;
      if (r2 > rimR * rimR) {
        const rm = Math.sqrt(r2);
        g2.px = (g2.px / rm) * rimR;
        g2.pz = (g2.pz / rm) * rimR;
        const rnx = g2.px / rimR, rnz = g2.pz / rimR;
        const vr  = g2.vx * rnx + g2.vz * rnz;
        if (vr > 0) { g2.vx -= 2 * vr * rnx * 0.5; g2.vz -= 2 * vr * rnz * 0.5; }
      }

      // Fixed-rate spin decay
      g2.spinRPM = Math.max(0, g2.spinRPM - 60 * dt);
      g2.spinDeg += (g2.spinRPM / 60) * 360 * dt;

      g2.bey.position.set(g2.px, g2.py, g2.pz);
      g2.bey.rotation.y = (g2.spinDeg * Math.PI) / 180;

      // ── Player trail ─────────────────────────────────────────────────────────
      {
        const tPts = g2.trailPts;
        if (g2.trailHead < TRAIL_LEN) {
          const ti = g2.trailHead * 3;
          tPts[ti] = g2.px; tPts[ti+1] = g2.py + 0.4; tPts[ti+2] = g2.pz;
          g2.trailHead++;
        } else {
          tPts.copyWithin(0, 3);
          const ti = (TRAIL_LEN - 1) * 3;
          tPts[ti] = g2.px; tPts[ti+1] = g2.py + 0.4; tPts[ti+2] = g2.pz;
        }
        g2.trail.geometry.attributes.position.needsUpdate = true;
        g2.trail.geometry.setDrawRange(0, Math.min(g2.trailHead, TRAIL_LEN));
      }

      // ── Enemy physics (same bowl rules) ──────────────────────────────────────
      if (!c.showEnemy) { g2.enemy.visible = false; } else {
      g2.evy -= c.gravity * dt;
      g2.evx *= fr; g2.evz *= fr;
      g2.epx += g2.evx * dt; g2.epy += g2.evy * dt; g2.epz += g2.evz * dt;

      const eFloorY = bowlFloorY(g2.epx, g2.epz, R, D) + BEY_RADIUS;
      if (g2.epy <= eFloorY) {
        g2.epy = eFloorY;
        const [enx, eny, enz] = bowlNormal(g2.epx, g2.epz, R, D);
        const evn = g2.evx * enx + g2.evy * eny + g2.evz * enz;
        if (evn < 0) {
          g2.evx -= 2 * evn * enx * 0.35;
          g2.evy -= 2 * evn * eny * 0.35;
          g2.evz -= 2 * evn * enz * 0.35;
        }
      }
      const er2 = g2.epx * g2.epx + g2.epz * g2.epz;
      if (er2 > rimR * rimR) {
        const erm = Math.sqrt(er2);
        g2.epx = (g2.epx / erm) * rimR; g2.epz = (g2.epz / erm) * rimR;
        const ernx = g2.epx / rimR, ernz = g2.epz / rimR;
        const evr  = g2.evx * ernx + g2.evz * ernz;
        if (evr > 0) { g2.evx -= 2 * evr * ernx * 0.5; g2.evz -= 2 * evr * ernz * 0.5; }
      }

      g2.espinRPM = Math.max(0, g2.espinRPM - 60 * dt);
      g2.espinDeg += (g2.espinRPM / 60) * 360 * dt;

      g2.enemy.position.set(g2.epx, g2.epy, g2.epz);
      g2.enemy.rotation.y = (g2.espinDeg * Math.PI) / 180;

      // ── Enemy trail ───────────────────────────────────────────────────────────
      {
        const ePts = g2.etrailPts;
        if (g2.etrailHead < TRAIL_LEN) {
          const eti = g2.etrailHead * 3;
          ePts[eti] = g2.epx; ePts[eti+1] = g2.epy + 0.4; ePts[eti+2] = g2.epz;
          g2.etrailHead++;
        } else {
          ePts.copyWithin(0, 3);
          const eti = (TRAIL_LEN - 1) * 3;
          ePts[eti] = g2.epx; ePts[eti+1] = g2.epy + 0.4; ePts[eti+2] = g2.epz;
        }
        g2.etrail.geometry.attributes.position.needsUpdate = true;
        g2.etrail.geometry.setDrawRange(0, Math.min(g2.etrailHead, TRAIL_LEN));
      }

      } // end showEnemy physics

      // ── Bey-to-bey collision ─────────────────────────────────────────────────
      if (c.showEnemy) {
        const cdx = g2.epx - g2.px, cdy = g2.epy - g2.py, cdz = g2.epz - g2.pz;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy + cdz * cdz);
        const minDist = BEY_RADIUS * 2;
        if (cdist < minDist && cdist > 0.001) {
          const cnx = cdx / cdist, cny = cdy / cdist, cnz = cdz / cdist;
          const rvx = g2.evx - g2.vx, rvy = g2.evy - g2.vy, rvz = g2.evz - g2.vz;
          const rv = rvx * cnx + rvy * cny + rvz * cnz;
          if (rv < 0) {
            const impulse = -(1 + 0.6) * rv / 2;
            g2.vx -= impulse * cnx; g2.vy -= impulse * cny; g2.vz -= impulse * cnz;
            g2.evx += impulse * cnx; g2.evy += impulse * cny; g2.evz += impulse * cnz;
            const spinDiff = (g2.espinRPM - g2.spinRPM) * 0.15;
            g2.spinRPM += spinDiff; g2.espinRPM -= spinDiff;
          }
          const overlap = (minDist - cdist) * 0.5;
          g2.px -= cnx * overlap; g2.py -= cny * overlap; g2.pz -= cnz * overlap;
          g2.epx += cnx * overlap; g2.epy += cny * overlap; g2.epz += cnz * overlap;
        }
      }

      // Effects lifecycle
      g2.effects = g2.effects.filter(eff => {
        eff.life -= dt;
        if (eff.life <= 0) {
          g2.scene.remove(eff.obj);
          eff.obj.traverse(o => {
            const m = o as THREE.Mesh;
            if (m.isMesh) {
              m.geometry?.dispose();
              const mat = m.material;
              if (Array.isArray(mat)) mat.forEach(x => x.dispose()); else mat?.dispose();
            }
          });
          return false;
        }
        const t = 1 - eff.life / eff.max;
        if (eff.type === "attack") {
          eff.obj.scale.setScalar(1 + t * 2.8);
          eff.obj.traverse(o => { const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial; if (mat?.transparent) mat.opacity = 1 - t; });
        } else if (eff.type === "defend") {
          eff.obj.position.set(g2.px, g2.py, g2.pz);
          eff.obj.traverse(o => { const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial; if (mat?.transparent) mat.opacity = 0.6 * (1 - t * 0.8); });
        } else if (eff.type === "dodge") {
          eff.obj.traverse(o => { const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial; if (mat?.transparent) mat.opacity = Math.max(0, mat.opacity - dt * 2.5); });
        } else if (eff.type === "special") {
          eff.obj.scale.setScalar(1 + t * 4.5);
          eff.obj.traverse(o => { const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial; if (mat?.transparent) mat.opacity = 0.7 * (1 - t); });
        }
        return true;
      });

      // Camera follow — smooth both the orbit position and the look target
      // to prevent flicker when the bey bounces at the bowl bottom
      const focAlpha = 1 - Math.pow(0.01, dt); // very slow focus lerp
      g2.camFocX += (g2.px - g2.camFocX) * focAlpha;
      g2.camFocY += (g2.py - g2.camFocY) * focAlpha;
      g2.camFocZ += (g2.pz - g2.camFocZ) * focAlpha;

      const pitch = (c.camPitch * Math.PI) / 180;
      const cd    = c.camDist;
      camTarget.set(
        g2.camFocX + Math.sin(g2.camYaw) * cd * Math.cos(pitch),
        g2.camFocY + Math.sin(pitch) * cd,
        g2.camFocZ + Math.cos(g2.camYaw) * cd * Math.cos(pitch)
      );
      g2.camera.position.lerp(camTarget, 1 - Math.pow(0.04, dt));
      g2.camera.lookAt(g2.camFocX, g2.camFocY + 2, g2.camFocZ);

      // HUD DOM update (throttled to 10 Hz)
      g2.hudTimer += dt;
      if (g2.hudTimer >= 0.1) {
        g2.hudTimer = 0;
        const spd3 = Math.sqrt(g2.vx * g2.vx + g2.vy * g2.vy + g2.vz * g2.vz);
        const air  = Math.max(0, g2.py - (bowlFloorY(g2.px, g2.pz, R, D) + BEY_RADIUS));
        if (speedDomRef.current) speedDomRef.current.textContent = spd3.toFixed(1);
        if (airDomRef.current)   airDomRef.current.textContent   = air.toFixed(1);
        if (rpmDomRef.current)   rpmDomRef.current.textContent   = Math.round(g2.spinRPM).toString();
        if (vxDomRef.current)    vxDomRef.current.textContent    = g2.vx.toFixed(1);
        if (vyDomRef.current)    vyDomRef.current.textContent    = g2.vy.toFixed(1);
        if (vzDomRef.current)    vzDomRef.current.textContent    = g2.vz.toFixed(1);
      }

      g2.renderer.render(g2.scene, g2.camera);
    }
    tick();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      const g2 = gRef.current;
      if (g2) {
        cancelAnimationFrame(g2.animId);
        for (const eff of g2.effects) g2.scene.remove(eff.obj);
        gRef.current = null;
      }
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("resize",      onResize);
      window.removeEventListener("beforeunload", onUnload);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("wheel",     onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (actionTimer.current) clearTimeout(actionTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ───────────────────────────────────────────────────────────────────
  const PANEL_L: React.CSSProperties = { width: 210, background: "#0d1520", borderRight: "1px solid #1a2a3a", padding: 14, overflowY: "auto", flexShrink: 0, fontSize: 12, fontFamily: "monospace" };
  const PANEL_R: React.CSSProperties = { width: 210, background: "#0d1520", borderLeft:  "1px solid #1a2a3a", padding: 14, overflowY: "auto", flexShrink: 0, fontSize: 12, fontFamily: "monospace" };
  const SECTION: React.CSSProperties = { color: "#556677", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 8px" };
  const RESET_BTN: React.CSSProperties = { width: "100%", padding: "6px 0", marginTop: 8, background: "#1a3a5f", border: "1px solid #2a5080", color: "#88bbff", borderRadius: 4, cursor: "pointer", fontSize: 12 };

  const toggle = (field: "showZones" | "showGrid" | "showWireframe" | "showEnemy") =>
    setCfg(c => ({ ...c, [field]: !c[field] }));

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "#0a0a12", fontFamily: "monospace" }}>

      {/* ── LEFT panel — Launch ── */}
      <div style={PANEL_L}>
        <div style={{ fontWeight: "bold", color: "#aaccee", marginBottom: 14, fontSize: 13 }}>Launch</div>

        <div style={SECTION}>Spawn</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Radius"     field="spawnRadiusFrac" min={0.3}  max={0.97} step={0.01} unit="×R"   />
        <Slider cfg={cfg} setCfg={setCfg} label="Fwd speed" field="spawnVTangent"   min={50}   max={500}  step={10}   unit=" cm/s" />
        <Slider cfg={cfg} setCfg={setCfg} label="Down push" field="spawnVDown" min={0} max={400} step={10} unit=" cm/s" />
        <Toggle label="Spawn enemy" val={cfg.showEnemy} set={() => toggle("showEnemy")} />

        <button
          onClick={() => {
            const g2 = gRef.current; if (!g2) return;
            const { bowlRadius: R, bowlDepth: D, spawnRadiusFrac: srf, spawnVTangent: svt, spawnVDown: svd } = cfgRef.current;
            // Player spawns at angle 0 (positive X), travels tangentially in -Z
            g2.px = R * srf; g2.py = bowlFloorY(R * srf, 0, R, D) + BEY_RADIUS + 2; g2.pz = 0;
            g2.vx = 0; g2.vy = -svd; g2.vz = -svt; g2.spinRPM = 6000;
            g2.trailHead = 0; g2.trail.geometry.setDrawRange(0, 0);
            // Enemy spawns at a random angle with tangential velocity
            const eAngle = Math.random() * Math.PI * 2;
            const eCos = Math.cos(eAngle), eSin = Math.sin(eAngle);
            const eSpin = Math.random() < 0.5 ? 1 : -1;
            g2.epx = R * srf * eCos; g2.epy = bowlFloorY(R * srf * eCos, R * srf * eSin, R, D) + BEY_RADIUS + 2; g2.epz = R * srf * eSin;
            g2.evx = svt * -eSin * eSpin; g2.evy = -svd; g2.evz = svt * eCos * eSpin; g2.espinRPM = 6000;
            g2.etrailHead = 0; g2.etrail.geometry.setDrawRange(0, 0);
            pausedRef.current = false; setPaused(false);
          }}
          style={{ ...RESET_BTN, background: "#1a5f2a", borderColor: "#2a8040", color: "#88ffaa" }}
        >
          Launch
        </button>

        <button
          onClick={() => {
            pausedRef.current = !pausedRef.current;
            setPaused(pausedRef.current);
          }}
          style={{ ...RESET_BTN, marginTop: 6, background: paused ? "#3a2800" : "#1a2a3a", borderColor: paused ? "#806020" : "#2a3a50", color: paused ? "#ffcc44" : "#8899bb" }}
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>

        <div style={{ marginTop: 18, borderTop: "1px solid #1a2a3a", paddingTop: 14, color: "#556677", fontSize: 11, lineHeight: 1.95 }}>
          <div style={{ color: "#88aacc", fontWeight: "bold", marginBottom: 6 }}>CONTROLS</div>
          {([
            ["WASD",   "Move"],
            ["Space",  "Jump"],
            ["J",      "Attack"],
            ["K",      "Defend"],
            ["L",      "Dodge"],
            ["I",      "Special"],
            ["Drag",   "Rotate cam"],
            ["Scroll", "Zoom"],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#aabbcc" }}>{k}</span><span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── THREE.js canvas ── */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* HUD */}
        <div style={{ position: "absolute", top: 14, left: 14, fontSize: 12, color: "#8899aa", pointerEvents: "none", lineHeight: 2, fontFamily: "monospace" }}>
          <div>Speed <span ref={speedDomRef} style={{ color: "#88ddff" }}>0.0</span> cm/s</div>
          <div>Air&nbsp;&nbsp;<span ref={airDomRef}   style={{ color: "#88ddff" }}>0.0</span> cm</div>
          <div>RPM&nbsp;&nbsp;<span ref={rpmDomRef}   style={{ color: "#ffcc44" }}>6000</span></div>
          <div style={{ marginTop: 6, borderTop: "1px solid #1a2a3a", paddingTop: 6 }}>
            <div>Vx <span ref={vxDomRef} style={{ color: "#aaffaa" }}>0.0</span></div>
            <div>Vy <span ref={vyDomRef} style={{ color: "#ffaaaa" }}>0.0</span></div>
            <div>Vz <span ref={vzDomRef} style={{ color: "#aaaaff" }}>0.0</span></div>
          </div>
        </div>
        {/* Action flash */}
        <div ref={actionDomRef}
          style={{ position: "absolute", top: 78, left: 14, fontSize: 17, fontWeight: "bold", color: "#ffdd44", opacity: 0, transition: "opacity 0.15s", pointerEvents: "none" }}
        />
        {/* Key hint footer */}
        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", color: "#445566", fontSize: 11, pointerEvents: "none", whiteSpace: "nowrap" }}>
          WASD move · SPACE jump · J attack · K defend · L dodge · I special · drag cam
        </div>
      </div>

      {/* ── RIGHT panel — Arena / Camera / Display ── */}
      <div style={PANEL_R}>
        <div style={{ fontWeight: "bold", color: "#aaccee", marginBottom: 14, fontSize: 13 }}>Arena</div>

        <div style={SECTION}>Camera</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Distance" field="camDist"  min={20}  max={160} step={5}   unit=" cm" />
        <Slider cfg={cfg} setCfg={setCfg} label="Pitch"    field="camPitch" min={10}  max={80}  step={5}   unit="°"   />

        <div style={SECTION}>Shape</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Radius" field="bowlRadius" min={15}  max={55}  step={1}   unit=" cm" />
        <Slider cfg={cfg} setCfg={setCfg} label="Depth"  field="bowlDepth"  min={5}   max={30}  step={0.5} unit=" cm" />

        <div style={SECTION}>Physics</div>
        <Slider cfg={cfg} setCfg={setCfg} label="Gravity"  field="gravity"   min={200}  max={2000}  step={50}    unit=" cm/s²" />
        <Slider cfg={cfg} setCfg={setCfg} label="Force"    field="moveForce" min={50}   max={800}   step={10}    unit=" cm/s²" />
        <Slider cfg={cfg} setCfg={setCfg} label="Friction" field="friction"  min={0.85} max={0.999} step={0.001} unit=""       />

        <div style={SECTION}>Display</div>
        <Toggle label="Zone Rings"   val={cfg.showZones}     set={() => toggle("showZones")}     />
        <Toggle label="Grid"         val={cfg.showGrid}      set={() => toggle("showGrid")}      />
        <Toggle label="Wireframe"    val={cfg.showWireframe} set={() => toggle("showWireframe")} />

        <div style={{ marginTop: 16, borderTop: "1px solid #1a2a3a", paddingTop: 14, color: "#556677", fontSize: 10, lineHeight: 1.7 }}>
          <div style={{ color: "#88aacc", marginBottom: 4 }}>ZONES</div>
          <div><span style={{ color: "#ffd700" }}>■</span> Flat Defense (30%)</div>
          <div><span style={{ color: "#00aaff" }}>■</span> Climb (60%)</div>
          <div><span style={{ color: "#ff6680" }}>■</span> Recoil Wall (90%)</div>
        </div>
      </div>
    </div>
  );
}
