/**
 * The screen table, shared by the smoke specs and (later) the demo runner.
 *
 * Every route registered in src/main.ts must appear here. When a route is added
 * there, add it here in the same change — the previous harness swept 8 screens
 * and silently missed /special-moves entirely.
 */

export interface RequiredSelector {
  sel: string;
  label: string;
}

export interface ScreenDef {
  id: string;
  path: string;
  /** Three.js sandbox — expects a canvas under .sandbox-canvas-wrap. */
  isCanvas: boolean;
  /** Has the mobile drawer sidebar at ≤768px. */
  isDrawer: boolean;
  /** Wires VirtualControlsOverlay (i.e. owns a SpawnManager). */
  hasVirtualControls: boolean;
  mustExist: RequiredSelector[];
}

const ACTIVE_SCREEN: RequiredSelector = {
  sel: '.screen:not(.hidden)',
  label: 'Active screen',
};
const CANVAS_WRAP: RequiredSelector = {
  sel: '.sandbox-canvas-wrap',
  label: 'Canvas wrap',
};

export const SCREENS: ScreenDef[] = [
  {
    id: 'landing',
    path: '/',
    isCanvas: false,
    isDrawer: false,
    hasVirtualControls: false,
    mustExist: [
      { sel: '#btn-arena', label: 'Arena button' },
      { sel: '#btn-beyblade', label: 'Beyblade button' },
      { sel: '#btn-special-moves', label: 'Special Moves button' },
    ],
  },
  {
    id: 'arena',
    path: '/arena',
    isCanvas: true,
    isDrawer: true,
    hasVirtualControls: true,
    mustExist: [CANVAS_WRAP],
  },
  {
    id: 'beyblade',
    path: '/beyblade',
    isCanvas: true,
    isDrawer: true,
    // BeybladeSandbox has no SpawnManager, so no virtual controls.
    hasVirtualControls: false,
    mustExist: [CANVAS_WRAP],
  },
  {
    id: 'preset-editor',
    path: '/preset-editor',
    isCanvas: true,
    isDrawer: true,
    // Second ArenaSandbox instance (presetEditorMode) — same wiring as /arena.
    hasVirtualControls: true,
    mustExist: [CANVAS_WRAP],
  },
  {
    id: 'special-moves',
    path: '/special-moves',
    isCanvas: true,
    isDrawer: false,
    hasVirtualControls: true,
    mustExist: [CANVAS_WRAP],
  },
  {
    id: 'arena-library',
    path: '/arena-library',
    isCanvas: false,
    isDrawer: false,
    hasVirtualControls: false,
    mustExist: [ACTIVE_SCREEN],
  },
  {
    id: 'bey-library',
    path: '/bey-library',
    isCanvas: false,
    isDrawer: false,
    hasVirtualControls: false,
    mustExist: [ACTIVE_SCREEN],
  },
  {
    id: 'rpg',
    path: '/rpg',
    isCanvas: false,
    isDrawer: false,
    hasVirtualControls: false,
    mustExist: [ACTIVE_SCREEN],
  },
  {
    id: 'admin',
    path: '/admin',
    isCanvas: false,
    isDrawer: false,
    hasVirtualControls: false,
    mustExist: [ACTIVE_SCREEN],
  },
];

/** Minimum touch target, per the responsive layout rules in CLAUDE.md. */
export const MIN_TOUCH_PX = 44;

/** Drawer sidebar media-query breakpoint. */
export const DRAWER_BREAKPOINT_PX = 768;

/** Console noise that is not worth failing or warning on. */
export function isIgnorableConsoleError(text: string): boolean {
  if (!text) return true;
  return text.includes('favicon') || text.includes('404');
}
