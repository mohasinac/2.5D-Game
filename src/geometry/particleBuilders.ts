import * as THREE from 'three';
import type { ParticlePreset, ParticleConfig, ParticleSystem } from '../types/sharedTypes';

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number;
}

function _randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function _randInDisk(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function _spawnParticle(preset: ParticlePreset, cx: number, cz: number, radius: number, rimY: number, depth: number): Particle {
  const floor = rimY - depth;
  const [dx, dz] = _randInDisk(radius);
  switch (preset) {
    case 'embers':
      return { x: cx + dx, y: floor + _randRange(0, depth * 0.2), z: cz + dz, vx: _randRange(-0.5, 0.5), vy: _randRange(2, 6), vz: _randRange(-0.5, 0.5), life: 0, maxLife: _randRange(1.5, 3.5) };
    case 'snow':
      return { x: cx + dx, y: rimY + _randRange(5, 20), z: cz + dz, vx: _randRange(-0.3, 0.3), vy: _randRange(-6, -3), vz: _randRange(-0.3, 0.3), life: 0, maxLife: _randRange(3, 7) };
    case 'sparks':
      return { x: cx + dx * 0.4, y: floor + _randRange(0, depth * 0.15), z: cz + dz * 0.4, vx: _randRange(-8, 8), vy: _randRange(8, 18), vz: _randRange(-8, 8), life: 0, maxLife: _randRange(0.3, 0.8) };
    case 'dust':
      return { x: cx + dx, y: floor + _randRange(0, depth), z: cz + dz, vx: _randRange(-2, 2), vy: _randRange(-0.3, 0.3), vz: _randRange(-2, 2), life: 0, maxLife: _randRange(3, 7) };
    case 'bubbles':
      return { x: cx + dx, y: floor + _randRange(0, depth * 0.4), z: cz + dz, vx: _randRange(-0.3, 0.3), vy: _randRange(1, 4), vz: _randRange(-0.3, 0.3), life: 0, maxLife: _randRange(2, 6) };
    case 'void_motes': {
      const angle = Math.random() * Math.PI * 2;
      const r = _randRange(radius * 0.2, radius * 0.9);
      return { x: cx + Math.cos(angle) * r, y: floor + _randRange(depth * 0.1, depth * 0.85), z: cz + Math.sin(angle) * r, vx: 0, vy: 0, vz: 0, life: 0, maxLife: _randRange(3, 8) };
    }
    case 'rain':
      return { x: cx + dx, y: rimY + _randRange(10, 30), z: cz + dz, vx: _randRange(-1, 1), vy: _randRange(-30, -20), vz: _randRange(-1, 1), life: 0, maxLife: _randRange(1, 2) };
    case 'fog':
      return { x: cx + dx, y: rimY + _randRange(-2, 5), z: cz + dz, vx: _randRange(-1, 1), vy: _randRange(-0.2, 0.2), vz: _randRange(-1, 1), life: 0, maxLife: _randRange(5, 12) };
    case 'ash':
      return { x: cx + dx, y: rimY + _randRange(5, 15), z: cz + dz, vx: _randRange(-2, 2), vy: _randRange(-3, -1), vz: _randRange(-2, 2), life: 0, maxLife: _randRange(4, 9) };
    case 'leaves':
      return { x: cx + dx, y: rimY + _randRange(5, 20), z: cz + dz, vx: _randRange(-3, 3), vy: _randRange(-5, -1), vz: _randRange(-3, 3), life: 0, maxLife: _randRange(3, 8) };
    case 'fireflies':
      return { x: cx + dx, y: floor + _randRange(depth * 0.2, depth + 5), z: cz + dz, vx: _randRange(-1, 1), vy: _randRange(-0.5, 0.5), vz: _randRange(-1, 1), life: 0, maxLife: _randRange(2, 6) };
    case 'steam':
      return { x: cx + dx * 0.3, y: floor, z: cz + dz * 0.3, vx: _randRange(-1, 1), vy: _randRange(3, 8), vz: _randRange(-1, 1), life: 0, maxLife: _randRange(1.5, 4) };
    default:
      return { x: cx, y: floor, z: cz, vx: 0, vy: 1, vz: 0, life: 0, maxLife: 2 };
  }
}

function _presetColor(preset: ParticlePreset): number {
  switch (preset) {
    case 'embers':    return 0xff6600;
    case 'snow':      return 0xddeeff;
    case 'sparks':    return 0xffdd44;
    case 'dust':      return 0xaa8866;
    case 'bubbles':   return 0x44cccc;
    case 'void_motes': return 0x9900ff;
    case 'rain':      return 0x99ccff;
    case 'fog':       return 0xccddee;
    case 'ash':       return 0x888888;
    case 'leaves':    return 0x44aa22;
    case 'fireflies': return 0xffee88;
    case 'steam':     return 0xdddddd;
    default:          return 0xffffff;
  }
}

function _emptySystem(): ParticleSystem {
  const geo = new THREE.BufferGeometry();
  const mat = new THREE.PointsMaterial({ size: 0.5, transparent: true, opacity: 0 });
  const points = new THREE.Points(geo, mat);
  return {
    points,
    tick(_dt: number) {},
    dispose() { geo.dispose(); mat.dispose(); },
  };
}

/**
 * Build an ambient particle system for an arena bowl or similar volume.
 * `config.density` (particles per cm²) determines particle count from area.
 * `config.preset === 'none'` is handled by callers — this always builds.
 */
export function buildParticleSystem(
  config: ParticleConfig,
  cx: number,
  cz: number,
  radius: number,
  rimY: number,
  depth: number,
): ParticleSystem {
  const preset = config.preset;
  const area = Math.PI * radius * radius;
  const count = Math.max(10, Math.min(5000, Math.round(area * config.density)));

  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const color = _presetColor(preset);
  const mat = new THREE.PointsMaterial({
    color,
    size: preset === 'sparks' ? 0.8 : preset === 'void_motes' ? 1.2 : preset === 'fog' || preset === 'steam' ? 2.0 : 0.5,
    transparent: true,
    opacity: preset === 'bubbles' || preset === 'fog' || preset === 'steam' ? 0.35 : preset === 'fireflies' ? 0.9 : 0.85,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);

  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const p = _spawnParticle(preset, cx, cz, radius, rimY, depth);
    p.life = Math.random() * p.maxLife;
    particles.push(p);
    positions[i * 3]     = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  }
  geo.attributes.position.needsUpdate = true;

  const GRAVITY = -9.8;

  return {
    points,

    tick(dt: number) {
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          const fresh = _spawnParticle(preset, cx, cz, radius, rimY, depth);
          particles[i] = fresh;
          positions[i * 3]     = fresh.x;
          positions[i * 3 + 1] = fresh.y;
          positions[i * 3 + 2] = fresh.z;
          continue;
        }

        if (preset === 'void_motes') {
          const dx = p.x - cx;
          const dz = p.z - cz;
          const r = Math.sqrt(dx * dx + dz * dz) || 1;
          const currentAngle = Math.atan2(dz, dx);
          const newAngle = currentAngle + dt * 0.4;
          p.x = cx + Math.cos(newAngle) * r;
          p.z = cz + Math.sin(newAngle) * r;
          p.y += Math.sin(p.life * 1.5) * dt * 0.5;
        } else {
          if (preset === 'sparks') {
            p.vy += GRAVITY * dt;
          }
          if (preset === 'embers') {
            p.vx *= Math.pow(0.99, dt * 60); p.vz *= Math.pow(0.99, dt * 60);
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
        }

        positions[i * 3]     = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }
      geo.attributes.position.needsUpdate = true;
    },

    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
}

/** Build particles projected onto a triangle list (arena surface, step faces). */
export function buildSurfaceParticleSystem(
  triangleVertices: THREE.Vector3[],
  config: ParticleConfig,
): ParticleSystem {
  if (triangleVertices.length === 0 || config.preset === 'none') return _emptySystem();
  const cx = triangleVertices.reduce((s, v) => s + v.x, 0) / triangleVertices.length;
  const cy = triangleVertices.reduce((s, v) => s + v.y, 0) / triangleVertices.length;
  const cz = triangleVertices.reduce((s, v) => s + v.z, 0) / triangleVertices.length;
  let maxR = 0;
  for (const v of triangleVertices) {
    const dx = v.x - cx; const dz = v.z - cz;
    maxR = Math.max(maxR, Math.sqrt(dx * dx + dz * dz));
  }
  return buildParticleSystem(config, cx, cz, maxR || 5, cy + 0.5, 1);
}

/** Build particles along the inner surface of a wall arc. */
export function buildWallParticleSystem(
  rimPts: THREE.Vector2[],
  rimY: number,
  height: number,
  config: ParticleConfig,
): ParticleSystem {
  if (rimPts.length === 0 || config.preset === 'none') return _emptySystem();
  const cx = rimPts.reduce((s, p) => s + p.x, 0) / rimPts.length;
  const cz = rimPts.reduce((s, p) => s + p.y, 0) / rimPts.length;
  return buildParticleSystem(config, cx, cz, 5, rimY + height, height);
}

/** Build particles sampled from a bridge deck mesh bounding box. */
export function buildBridgeParticleSystem(
  mesh: THREE.Mesh,
  config: ParticleConfig,
): ParticleSystem {
  if (config.preset === 'none') return _emptySystem();
  const box = new THREE.Box3().setFromObject(mesh);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);
  return buildParticleSystem(
    config,
    center.x, center.z,
    Math.max(size.x, size.z) * 0.5,
    center.y + size.y * 0.5,
    size.y * 0.5 || 1,
  );
}

/** Build a glow particle trail along a speed line path. */
export function buildSpeedLineParticleGlow(
  path: THREE.Vector3[],
  config: ParticleConfig,
): ParticleSystem {
  if (path.length === 0 || config.preset === 'none') return _emptySystem();
  const cx = path.reduce((s, v) => s + v.x, 0) / path.length;
  const cz = path.reduce((s, v) => s + v.z, 0) / path.length;
  const cy = path.reduce((s, v) => s + v.y, 0) / path.length;
  return buildParticleSystem(config, cx, cz, 5, cy + 1, 2);
}
