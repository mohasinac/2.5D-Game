import * as THREE from 'three';
import type { WeatherPreset, WeatherSystem } from '../types/sharedTypes';

/* ══════════════════════════════════════════════════════════════════════════
   Weather / wind / climate particle system.
   Changes here when a weather preset's visual or force behaviour changes.
   ══════════════════════════════════════════════════════════════════════════ */

const TWO_PI = Math.PI * 2;

interface WeatherDef {
  count:      number;
  size:       number;
  color:      number;
  opacity:    number;
  speed:      number;    // base fall/drift speed in cm/s
  spread:     number;    // horizontal wander amplitude cm
  sizeRange:  number;    // random size +/- fraction
}

const DEFS: Record<Exclude<WeatherPreset, 'none'>, WeatherDef> = {
  rain:      { count: 800,  size: 0.3,  color: 0x99ccff, opacity: 0.6, speed: 120, spread: 20,  sizeRange: 0.3 },
  snow:      { count: 500,  size: 0.8,  color: 0xffffff, opacity: 0.8, speed: 20,  spread: 40,  sizeRange: 0.5 },
  fog:       { count: 200,  size: 6,    color: 0xccddee, opacity: 0.15,speed: 8,   spread: 80,  sizeRange: 0.8 },
  sandstorm: { count: 1000, size: 0.4,  color: 0xcc9944, opacity: 0.5, speed: 80,  spread: 100, sizeRange: 0.5 },
  ash:       { count: 400,  size: 0.6,  color: 0x888888, opacity: 0.7, speed: 15,  spread: 60,  sizeRange: 0.6 },
  mist:      { count: 150,  size: 8,    color: 0xddeeff, opacity: 0.08,speed: 5,   spread: 80,  sizeRange: 1.0 },
};

export function buildWeatherSystem(
  preset:        Exclude<WeatherPreset, 'none'>,
  windEnabled:   boolean,
  windDeg:       number,
  windStrength:  number,   // cm/s²
  gustInterval:  number,   // s
  gustMult:      number,
  arenaRadius:   number,
  baseY:         number,
): WeatherSystem {
  const def = DEFS[preset];
  const N = def.count;
  const spread = Math.max(arenaRadius * 2, 100);

  const positions = new Float32Array(N * 3);
  const velocities = new Float32Array(N * 3);  // not a THREE attribute — just CPU state
  const geo = new THREE.BufferGeometry();

  const rng = () => (Math.random() - 0.5) * 2;

  for (let i = 0; i < N; i++) {
    const angle = Math.random() * TWO_PI;
    const r     = Math.sqrt(Math.random()) * spread;
    positions[i * 3]     = Math.cos(angle) * r;
    positions[i * 3 + 1] = baseY + Math.random() * 120;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    velocities[i * 3]   = rng() * def.spread * 0.2;
    velocities[i * 3 + 1] = -(def.speed * (0.7 + Math.random() * 0.6));
    velocities[i * 3 + 2] = rng() * def.spread * 0.2;
  }

  const posAttr = new THREE.BufferAttribute(positions, 3);
  geo.setAttribute('position', posAttr);

  const mat = new THREE.PointsMaterial({
    color: def.color,
    size: def.size,
    transparent: true,
    opacity: def.opacity,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;

  // Wind force vector in XZ
  const windRadians = (windDeg * Math.PI) / 180;
  const baseWindX = windEnabled ? Math.sin(windRadians) * windStrength : 0;
  const baseWindZ = windEnabled ? Math.cos(windRadians) * windStrength : 0;
  const windForce = new THREE.Vector3(baseWindX, 0, baseWindZ);

  let gustTimer = gustInterval * Math.random();
  let currentGust = 1;

  function tick(dt: number): void {
    // Gust oscillation
    if (windEnabled && gustInterval > 0) {
      gustTimer -= dt;
      if (gustTimer <= 0) {
        currentGust = 1 + (Math.random() * (gustMult - 1));
        gustTimer = gustInterval * (0.7 + Math.random() * 0.6);
      }
    }
    const wx = baseWindX * currentGust;
    const wz = baseWindZ * currentGust;
    windForce.set(wx, 0, wz);

    const pos = posAttr.array as Float32Array;
    const maxY = baseY + 120;

    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      pos[ix]     += (velocities[ix]     + wx) * dt;
      pos[ix + 1] += velocities[ix + 1]        * dt;
      pos[ix + 2] += (velocities[ix + 2] + wz) * dt;

      // Reset particles that fall below base
      if (pos[ix + 1] < baseY - 5) {
        const angle = Math.random() * TWO_PI;
        const r     = Math.sqrt(Math.random()) * spread;
        pos[ix]     = Math.cos(angle) * r;
        pos[ix + 1] = maxY;
        pos[ix + 2] = Math.sin(angle) * r;
      }
      // Keep horizontal spread clamped
      const dx = pos[ix]; const dz = pos[ix + 2];
      const d2 = dx * dx + dz * dz;
      if (d2 > spread * spread * 1.5) {
        pos[ix] *= 0.8; pos[ix + 2] *= 0.8;
      }
    }
    posAttr.needsUpdate = true;
  }

  function dispose(): void {
    geo.dispose();
    mat.dispose();
  }

  return { points, windForce, tick, dispose };
}
