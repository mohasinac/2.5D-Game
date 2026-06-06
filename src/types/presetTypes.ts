import type { ArenaConfig } from '../utils/arenaPersistence';
import type { BeybladeBuildConfig } from './beybladeTypes';

export type BeyPartType = 'layer' | 'disc' | 'driver' | 'frame' | 'chip' | 'full_build' | 'custom';

export interface ArenaPreset {
  id: string;
  name: string;
  group: string;            // user-defined collection label, e.g. "Bridge Setups"
  description: string;
  tags: string[];
  thumbnail: string | null; // base64 PNG 128×128
  config: ArenaConfig;      // partial or full ArenaConfig snapshot
  isFull: boolean;          // true = whole scene saved; false = selection only
  createdAt: number;
  updatedAt: number;
}

export interface BeyPreset {
  id: string;
  name: string;
  group: string;            // user-defined collection label
  description: string;
  partType: BeyPartType;    // 'full_build' for whole beyblade builds
  tags: string[];
  thumbnail: string | null;
  config: BeybladeBuildConfig;
  createdAt: number;
  updatedAt: number;
}
