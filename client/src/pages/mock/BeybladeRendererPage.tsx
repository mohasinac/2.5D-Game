// @refresh reset
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 1 unit = 1 cm,  0.1 unit = 1 mm
const CM = 1;
const MM = 0.1;
const GRID = 8 * CM; // 8 cm total

function makeLabel(text: string, color = "#88aaff", size = 128): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${size / 4}px monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.6, 0.3, 1);
  return sprite;
}

export function BeybladeRendererPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111118);

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.01, 100);
    camera.position.set(0, 0.8, 1.5);
    camera.lookAt(0, 0, 0);

    // ── Orbit controls ────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.5;
    controls.maxDistance = 30;
    controls.target.set(0, CM, 0); // orbit around cylinder mid-height (1 cm)
    controls.update();

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(6, 12, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.4);
    fill.position.set(-4, 3, -3);
    scene.add(fill);

    // ── Grid: minor 1 mm lines + major 1 cm lines ─────────────────────────────
    // Minor: 8 cm / 80 divisions = 1 division per mm
    const gridMinor = new THREE.GridHelper(GRID, 80, 0x1a1a2e, 0x1a1a2e);
    (gridMinor.material as THREE.LineBasicMaterial).opacity = 0.6;
    (gridMinor.material as THREE.LineBasicMaterial).transparent = true;
    scene.add(gridMinor);

    // Major: 8 cm / 8 divisions = 1 division per cm
    const gridMajor = new THREE.GridHelper(GRID, 8, 0x2244aa, 0x2244aa);
    (gridMajor.material as THREE.LineBasicMaterial).opacity = 0.9;
    (gridMajor.material as THREE.LineBasicMaterial).transparent = true;
    scene.add(gridMajor);

    // ── Axis lines ────────────────────────────────────────────────────────────
    const line = (a: THREE.Vector3, b: THREE.Vector3, color: number) =>
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([a, b]),
        new THREE.LineBasicMaterial({ color, depthTest: false })
      );

    const half = GRID / 2;
    scene.add(line(new THREE.Vector3(-half, 0.002, 0), new THREE.Vector3(half, 0.002, 0), 0x4466ff));  // X
    scene.add(line(new THREE.Vector3(0, 0.002, -half), new THREE.Vector3(0, 0.002, half), 0x44bb88));  // Z
    scene.add(line(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 8 * CM, 0), 0xff5555));            // Y

    // ── X-axis labels (every 1 cm) ────────────────────────────────────────────
    for (let x = -4; x <= 4; x++) {
      if (x === 0) continue;
      const lbl = makeLabel(`${x}`, "#5577ff");
      lbl.position.set(x * CM, 0.01, half + 0.55);
      scene.add(lbl);
      // tick
      scene.add(line(
        new THREE.Vector3(x * CM, 0.002, -0.08),
        new THREE.Vector3(x * CM, 0.002, 0.08),
        0x4466ff
      ));
    }

    // ── Z-axis labels (every 1 cm) ────────────────────────────────────────────
    for (let z = -4; z <= 4; z++) {
      if (z === 0) continue;
      const lbl = makeLabel(`${z}`, "#44cc99");
      lbl.position.set(-(half + 0.55), 0.01, z * CM);
      scene.add(lbl);
      scene.add(line(
        new THREE.Vector3(-0.08, 0.002, z * CM),
        new THREE.Vector3(0.08, 0.002, z * CM),
        0x44bb88
      ));
    }

    // origin
    const orig = makeLabel("0", "#aaaaaa");
    orig.position.set(-(half + 0.55), 0.01, half + 0.55);
    scene.add(orig);

    // ── Y-axis labels: tick every 5 mm, label every 1 cm ─────────────────────
    for (let mm = 0; mm <= 80; mm += 5) {
      const y = mm * MM;
      const isCm = mm % 10 === 0;
      scene.add(line(
        new THREE.Vector3(-0.12, y, 0),
        new THREE.Vector3(0.12, y, 0),
        isCm ? 0xff5555 : 0x883333
      ));
      if (isCm && mm > 0) {
        const lbl = makeLabel(`${mm / 10}cm`, "#ff8888");
        lbl.position.set(-0.65, y, 0);
        scene.add(lbl);
      }
    }

    // ── Azure cylinder ────────────────────────────────────────────────────────
    const CYL_R = 1 * MM;   // 1 mm radius
    const CYL_H = 7 * CM;   // 7 cm height

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(CYL_R, CYL_R, CYL_H, 64),
      new THREE.MeshStandardMaterial({ color: 0x007fff, metalness: 0.2, roughness: 0.35 })
    );
    mesh.position.set(0, CYL_H / 2, 0);
    mesh.castShadow = true;
    scene.add(mesh);

    const ringMat = new THREE.MeshStandardMaterial({ color: 0x55bbff, metalness: 0.5, roughness: 0.2 });
    [0, CYL_H].forEach((y) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(CYL_R, CYL_R * 0.3, 16, 64), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      scene.add(ring);
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Loop ─────────────────────────────────────────────────────────────────
    let id: number;
    const tick = () => {
      id = requestAnimationFrame(tick);
      mesh.rotation.y += 0.008;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#111118" }} />
      <div style={{
        position: "fixed", top: 14, left: 18,
        color: "#88aaff", fontFamily: "monospace", fontSize: 11,
        pointerEvents: "none", userSelect: "none", opacity: 0.75,
        lineHeight: 1.8,
      }}>
        /mock/beyblade &nbsp;·&nbsp; 1 unit = 1 cm &nbsp;·&nbsp; grid 8×8 cm &nbsp;·&nbsp; minor lines 1 mm<br />
        <span style={{ color: "#4466ff" }}>━</span> X &nbsp;
        <span style={{ color: "#44bb88" }}>━</span> Z &nbsp;
        <span style={{ color: "#ff5555" }}>━</span> Y (height)
      </div>
    </>
  );
}
