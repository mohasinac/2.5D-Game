import * as THREE from 'three';
import type { ParticlePreset, ParticleSystem } from '../types/arenaTypes';

const MAX_PARTICLES = 500;

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

function _spawnParticle(preset: ParticlePreset, cx: number, cz: number, radius: number, baseY: number): Particle {
  const [dx, dz] = _randInDisk(radius);
  switch (preset) {
    case 'embers':
      return { x: cx + dx, y: baseY, z: cz + dz, vx: _randRange(-0.5, 0.5), vy: _randRange(4, 12), vz: _randRange(-0.5, 0.5), life: 0, maxLife: _randRange(1.5, 3.5) };
    case 'snow':
      return { x: cx + dx, y: baseY + _randRange(20, 50), z: cz + dz, vx: _randRange(-0.3, 0.3), vy: _randRange(-3, -1), vz: _randRange(-0.3, 0.3), life: 0, maxLife: _randRange(4, 10) };
    case 'sparks':
      return { x: cx + dx * 0.3, y: baseY, z: cz + dz * 0.3, vx: _randRange(-8, 8), vy: _randRange(10, 20), vz: _randRange(-8, 8), life: 0, maxLife: _randRange(0.3, 0.8) };
    case 'dust':
      return { x: cx + dx, y: baseY + _randRange(0, 5), z: cz + dz, vx: _randRange(-2, 2), vy: _randRange(-0.2, 0.5), vz: _randRange(-2, 2), life: 0, maxLife: _randRange(3, 7) };
    case 'bubbles':
      return { x: cx + dx, y: baseY + _randRange(0, 10), z: cz + dz, vx: _randRange(-0.3, 0.3), vy: _randRange(1, 4), vz: _randRange(-0.3, 0.3), life: 0, maxLife: _randRange(2, 6) };
    case 'void_motes': {
      const angle = Math.random() * Math.PI * 2;
      const r = _randRange(radius * 0.2, radius);
      return { x: cx + Math.cos(angle) * r, y: baseY + _randRange(5, 25), z: cz + Math.sin(angle) * r, vx: 0, vy: 0, vz: 0, life: 0, maxLife: _randRange(3, 8) };
    }
    default:
      return { x: cx, y: baseY, z: cz, vx: 0, vy: 1, vz: 0, life: 0, maxLife: 2 };
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
    default:          return 0xffffff;
  }
}

export function buildParticleSystem(
  preset: ParticlePreset,
  cx: number,
  cz: number,
  radius: number,
  baseY: number,
): ParticleSystem {
  const count = MAX_PARTICLES;
  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const color = _presetColor(preset);
  const mat = new THREE.PointsMaterial({
    color,
    size: preset === 'sparks' ? 0.8 : preset === 'void_motes' ? 1.2 : 0.5,
    transparent: true,
    opacity: preset === 'bubbles' ? 0.5 : 0.85,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);

  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const p = _spawnParticle(preset, cx, cz, radius, baseY);
    p.life = Math.random() * p.maxLife; // stagger initial lifetimes
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
          const fresh = _spawnParticle(preset, cx, cz, radius, baseY);
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
