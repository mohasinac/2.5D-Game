// FeatureRenderer — draws obstacles, pits, portals, turrets, water bodies,
// loops/speed paths, and projectiles into the renderer's `featureLayer`.
// All input coords are in cm (origin at arena center). Render output is in
// world-px (cm * PX_PER_CM_BASE) which sits inside the camera-transformed
// worldRoot, so the camera handles zoom + pan automatically.
//
// See plan: Part 3 (in-match feature rendering parity), Part 12 (liquid types).

import * as PIXI from "pixi.js";
import { PX_PER_CM_BASE } from "@/constants/units";
import type {
  ServerObstacle,
  ServerPit,
  ServerTurret,
  ServerProjectile,
  ServerWaterBody,
  ServerPortal,
  ServerLoop,
} from "@/types/game";

const LIQUID_COLORS: Record<string, number> = {
  water: 0x4488ff,
  lava: 0xff5522,
  ice: 0x88ddff,
  acid: 0xaaff44,
  oil: 0x442200,
  blood: 0xaa1122,
  healing: 0x66ffaa,
  speedBoost: 0xffcc44,
  quicksand: 0xb8a36b,
  poison: 0xbb44ff,
};

const OBSTACLE_COLORS: Record<string, number> = {
  rock:     0x88837a,
  pillar:   0x9aa1ab,
  barrier:  0xc0a060,
  wall:     0x707070,
  crystal:  0x66ddff,
  box:      0xaa7a44,
  tire:     0x222222,
};

const TURRET_COLORS: Record<string, number> = {
  // Classic
  random:    0x888888,
  beam:      0xff44aa,
  periodic:  0xffaa44,
  aoe:       0xff5522,
  boomerang: 0x44aaff,
  // Phase Z
  laser_sweep:      0xee2244,
  sniper:           0xddaa00,
  shotgun:          0xcc6600,
  mine_layer:       0x888800,
  gravity_cannon:   0x884488,
  emp:              0x00ccff,
  tracking_missile: 0xff8800,
  burst_fire:       0xff6644,
  plasma_ring:      0xcc44ff,
  tractor_beam:     0x0088ff,
  // Phase ZP — Pokémon
  surf:           0x3399ff,
  hydro_pump:     0x0066dd,
  fire_spin:      0xff6600,
  thunderbolt:    0xffee00,
  psychic:        0xff44ff,
  gust:           0xaaddff,
  shadow_ball:    0x884488,
  fire_blast:     0xff3300,
  sludge_bomb:    0x88aa00,
  toxic_spikes:   0xaa44aa,
  roar:           0xddaa44,
  multi_missile:  0xff4444,
  // Phase ZP-2 — extended
  blizzard:       0xaaeeff,
  earthquake:     0xcc9944,
  flamethrower:   0xff5500,
  ice_beam:       0x88eeff,
  dragon_breath:  0x8844ff,
  confuse_ray:    0xff88cc,
  leech_seed:     0x44cc44,
  vine_whip:      0x33aa33,
  sticky_web:     0xcccc44,
  hyper_beam:     0xffff00,
  gravity_field:  0x8888ff,
  sand_tomb:      0xddaa66,
  zap_cannon:     0xffdd00,
  overheat:       0xff2200,
  chain_lightning:0xeeff44,
  spore:          0xbbee44,
  dark_void:      0x440088,
  rock_slide:     0x998877,
  whirlpool:      0x2266cc,
  stealth_rock:   0x888866,
  // ── Round 3: Type moves ──────────────────────
  ember:          0xff8844,
  magma_storm:    0xff4400,
  eruption:       0xff2200,
  bubble_beam:    0x66ccff,
  aqua_ring:      0x44aaff,
  origin_pulse:   0x0044ff,
  icicle_spear:   0xccffff,
  hail:           0xaaeeff,
  glacial_lance:  0xeeffff,
  thunder_wave:   0xffee88,
  discharge:      0xffdd00,
  bolt_strike:    0xffffff,
  air_slash:      0xddeeff,
  hurricane:      0x88bbff,
  aeroblast:      0xaaffee,
  stone_edge:     0xbbaa88,
  dig:            0xcc9944,
  tectonic_rage:  0xdd6622,
  flash_cannon:   0xddddff,
  bullet_punch:   0xcccccc,
  steel_surge:    0x8899bb,
  absorb:         0x44ff88,
  petal_dance:    0xff88cc,
  bloom_doom:     0x88ff44,
  night_shade:    0x442266,
  shadow_force:   0x6611aa,
  phantom_force:  0x220044,
  flash:          0xffffff,
  solar_beam:     0xffff44,
  solar_flare:    0xffee00,
  spark:          0xffff66,
  magnetic_field: 0x4466ff,
  thunder_storm:  0x2244cc,
  distortion:     0x442288,
  black_hole_shot:0x110022,
  spacial_rend:   0x8800ff,
  // ── Fighting / Impact ────────────────────────
  cross_slash:    0xee4488,
  impact_burst:   0xff6644,
  armor_pierce:   0xaaaaaa,
  flurry_barrage: 0xff5566,
  mach_shot:      0xffffff,
  gravity_grip:   0x4488ff,
  ram_charge:     0xdd8833,
  graviton_throw: 0x8844cc,
  // ── Close-range ──────────────────────────────
  razor_spin:     0xeeee44,
  point_blank:    0xff2244,
  static_field:   0xccee22,
  acid_spray:     0x88cc22,
  shockwave:      0xddaaff,
  spin_slash:     0xffcc22,
  guillotine:     0xff0000,
  // ── Aerial / Ground ──────────────────────────
  anti_grav:      0x88ffee,
  // ── Bug type ─────────────────────────────────
  drain_sting:    0x66cc44,
  string_shot:    0xccee88,
  silver_wind:    0xccffcc,
  // ── Dark type ────────────────────────────────
  sting_bolt:     0x884422,
  foul_play:      0x552244,
  dark_pulse:     0x330066,
  // ── Steel type ───────────────────────────────
  steel_ram:      0x9999bb,
  metal_sound:    0xccccee,
  magnet_bomb:    0x4455cc,
  // ── Normal type ──────────────────────────────
  tackle:         0xddcc88,
  drill_shot:     0xccbbaa,
  hyper_voice:    0xffeecc,
  // ── Stat-change ──────────────────────────────
  swords_dance:   0xff4400,
  tail_whip:      0xffaa44,
  growl:          0xddaa44,
  meditate:       0xaa44ff,
  nasty_plot:     0x660088,
  agility:        0x44ffcc,
  // ── Poison type ──────────────────────────────
  poison_jab:     0xaa44cc,
  venoshock:      0x882288,
  // ── Psychic extra ────────────────────────────
  psyshock:       0xff88ff,
  future_sight:   0xcc44ff,
  // ── Dragon type ──────────────────────────────
  dragon_slash:   0x8844ff,
  outrage:        0xff4444,
  // ── Ghost extra ──────────────────────────────
  hex:            0x664488,
  ghost_strike:   0x440088,
  // ── Fairy type ───────────────────────────────
  moonblast:      0xffccff,
  dazzling_gleam: 0xffffcc,
  // ── Weather / Environment ────────────────────
  sunny_day:      0xffdd44,
  rain_dance:     0x4488ff,
  sandstorm:      0xddbb66,
  hail_weather:   0xaaddff,
  misty_terrain:  0xccddff,
  grassy_terrain: 0x44cc44,
  electric_terrain:0xffff44,
  psychic_terrain:0xff88ff,
  // ── Charge moves ─────────────────────────────
  charge:         0xffcc44,
  charge_beam:    0xffee66,
  skull_bash:     0xcc6644,
  solar_charge:   0xffee88,
  // ── Speed / Power ────────────────────────────
  extreme_speed:  0xffffff,
  flare_blitz:    0xff4400,
  thunder_ram:    0xffdd00,
  thunder_drive:  0xffee44,
  power_drive:    0xddbbaa,
  // ── Launcher / Airborne ──────────────────────
  uppercut:       0xff88cc,
  launch_spike:   0xcc8833,
  sky_uppercut:   0x88eeff,
  // ── Mortal Kombat inspired ───────────────────
  spear_chain:    0xffee44,
  cryo_lance:     0xaaeeff,
  ring_blade:     0xeeee22,
  portal_strike:  0x8822ff,
  dragon_fireball:0xff6622,
  inferno_slam:   0xff2200,
  // ── Defensive self-buff ──────────────────────
  harden:         0x8899cc,
  defense_curl:   0x6677aa,
  withdraw:       0x445588,
  barrier:        0xaabbdd,
  cosmic_power:   0xccaaff,
  // ── Street Fighter ───────────────────────────────────────────────────────
  hadoken:        0x66aaff,
  shoryuken:      0xff7722,
  sonic_boom:     0xaaddff,
  flash_kick:     0xccff44,
  raging_demon:   0x880022,
  spiral_drill:   0xff44aa,
  hundred_kicks:  0xffcc00,
  electric_body:  0x44ffee,
  // ── Bleach Bankai ─────────────────────────────────────────────────────────
  tensa_zangetsu: 0x1a1a3a,
  senbonzakura:   0xffaacc,
  daiguren_ice:   0x88ddff,
  absolute_zero:  0xeefaff,
  muken_poison:   0x55cc44,
  zanka_incinerate: 0xff3300,
  suzumebachi:    0x443344,
  hihio_construct:0xcc8844,
  // ── Naruto ───────────────────────────────────────────────────────────────
  rasengan:       0x44aaff,
  chidori:        0x88ccff,
  shadow_clone:   0xffee88,
  sand_burial:    0xddaa44,
  fireball_jutsu: 0xff6600,
  eight_trigrams: 0xffffff,
  amaterasu:      0x111111,
  susanoo:        0x2244aa,
  // ── Ninja techniques ─────────────────────────────────────────────────────
  substitution:   0xaaffaa,
  shadow_shuriken:0x334433,
  kunai_barrage:  0x888866,
  smoke_bomb:     0x99aa88,
  wire_trap:      0x887744,
  exploding_tag:  0xff8800,
  // ── Transformations ──────────────────────────────────────────────────────
  ultra_form:     0xffdd00,
  demon_form:     0x660000,
  sage_mode:      0xff9933,
  bankai_release: 0x222244,
  susanoo_full:   0x1133bb,
  titan_shift:    0xcc4400,
  // ── Summons ──────────────────────────────────────────────────────────────
  summon_toad:    0x448833,
  summon_snake:   0x336611,
  summon_slug:    0x66cc88,
  summon_kirin:   0xaaddff,
  summon_eagle:   0xaaaa66,
  summon_clones:  0xffee66,
  // ── Tekken ───────────────────────────────────────────────────────────────
  devil_beam:     0x8800cc,
  wind_god_fist:  0x4488ff,
  hellsweep:      0xff2244,
  laser_scraper:  0x00ffcc,
  rage_drive:     0xff0044,
  heat_smash:     0xff6600,
  ki_charge_tek:  0xffee44,
  twin_pistols:   0xcccccc,
  // ── Time-based ───────────────────────────────────────────────────────────
  time_warp:      0x99aaff,
  time_stop:      0xddddff,
  time_loop:      0x8888cc,
  time_acceleration: 0xffcc88,
  age_drain:      0xaa7755,
  // ── Extended Bankai ───────────────────────────────────────────────────────
  gigantification: 0x885533,
  ryujin_jakka_full: 0xff5500,
  minazuki_heal:  0x44ffaa,
  katen_kyokotsu: 0xffaaee,
  senbonzakura_kageyoshi: 0xff88bb,
  daiguren_full:  0x55ccff,
  // ── Arrancar / Espada ────────────────────────────────────────────────────
  cero:           0xcc2244,
  gran_rey_cero:  0xee3355,
  cero_oscuras:   0x110011,
  bala:           0xff4466,
  hierro:         0x778899,
  sonido:         0xaaccee,
  pesquisa:       0x6699aa,
  descorrer:      0x2222aa,
  lanza_del_relampago: 0xddff00,
  santa_teresa:   0x2255cc,
  resurreccion:   0x882200,
  // ── Gotei-13 / Kido ──────────────────────────────────────────────────────
  shunpo:         0xffffff,
  reiatsu_burst:  0x8844aa,
  kido_hado_31:   0xff6644,
  kido_hado_63:   0xffee22,
  kido_hado_90:   0x221133,
  kido_bakudo_61: 0xee9933,
  kido_bakudo_99: 0xcc5500,
  roar_of_seireitei: 0xff2200,
  // ── Visored / Hollowification ────────────────────────────────────────────
  mask_on:        0xffffff,
  hollow_cero:    0x660011,
  inner_hollow:   0x440011,
  getsuga_tensho: 0x2233aa,
  mugetsu:        0x000011,
  fullbring_boost: 0x44ddcc,
  // ── Itachi / Genjutsu ────────────────────────────────────────────────────
  tsukuyomi:      0x440022,
  amaterasu_mark: 0x110000,
  izanagi:        0xffeedd,
  izanami:        0x332244,
  sharingan_lock: 0xcc2200,
  crow_genjutsu:  0x223322,
  susanoo_itachi: 0x0022aa,
  // ── Extended summons ─────────────────────────────────────────────────────
  summon_ryuchi:  0x224411,
  summon_myoboku: 0x558833,
  summon_slugs_army: 0x44bb66,
  summon_garuda:  0xccbb55,
  summon_enma:    0x664433,
  summon_gamaken: 0x447755,
  edo_tensei:     0x88aa88,
  // ── Size & Weight ─────────────────────────────────────────────────────────
  enlarge:        0xff9944,
  shrink:         0x44ddff,
  mass_shift:     0x888844,
  density_crush:  0x444422,
  // ── Full Transformations ──────────────────────────────────────────────────
  hollow_transform: 0xffffff,
  kyuubi_mode:    0xff4400,
  bijuu_mode:     0xff6600,
  tailed_beast_bomb: 0x000033,
  curse_mark_2:   0x330022,
  six_paths_mode: 0xffeebb,
  ten_tails_jinchuriki: 0x110022,
  berserk_hollow: 0xcc0022,
  // ── Deidara ───────────────────────────────────────────────────────────────
  clay_spider:    0xddaa55,
  clay_dragon:    0xcc7733,
  clay_bomb:      0xcc5500,
  clay_clones_c4: 0xffaa00,
  katsu:          0xff6600,
  // ── Akatsuki ─────────────────────────────────────────────────────────────
  shinra_tensei:  0xaaccff,
  chibaku_tensei: 0x222266,
  samehada_drain: 0x226633,
  shark_bomb:     0x1144aa,
  earth_grudge_fear: 0x334422,
  jashin_ritual:  0x880011,
  paper_bomb_storm: 0xffeedd,
  kamui:          0x003355,
  limbo_hengoku:  0x001133,
  wood_dragon:    0x335522,
  // Obito moves
  spiral_eye:          0x0077cc,
  phantom_pass:        0xaaeeff,
  black_zetsu_bind:    0x111133,
  orange_mask_dash:    0xff6600,
  ten_tails_bijuudama: 0x000000,
  truth_seeker_orbs:   0x888855,
  // Rinnegan / Pain paths
  bansho_tenin:        0x88aadd,
  human_path:          0x992222,
  preta_path:          0x2244aa,
  asura_path:          0xcc8833,
  // Minato / Advanced Naruto
  flying_thunder_god:  0xffff22,
  rasenshuriken:       0x88ccff,
  odama_rasengan:      0x3399ff,
  sage_mode:           0x557733,
  // Eight Gates
  eight_gates_release: 0xff2200,
  evening_elephant:    0xff4400,
  night_guy:           0xff0000,
  // Legendary / Otsutsuki
  tengai_shinsei:      0x553300,
  kaguya_bones:        0xddddcc,
  // Bleach additions
  kyoka_suigetsu:      0x9955cc,
  respira:             0x663300,
  desgarron:           0x0099dd,
  // Dragon Ball
  kamehameha:          0x4488ff,
  spirit_bomb:         0xaaccff,
  final_flash:         0xffffaa,
  death_beam:          0xcc2222,
  // Illusion moves
  mirror_world:        0xcc88ff,
  perfect_mirage:      0xeeeeff,
  broken_reality:      0xff44ff,
  phantasmal_shift:    0xaaaaee,
  echo_image:          0x88aacc,
  genjutsu_veil:       0x553377,
  false_flag:          0xff8800,
  mind_fracture:       0xff00aa,
  // Contra bey power-ups
  spread_bey:          0xffcc00,
  railbey:             0x00ffff,
  minigun_bey:         0xffaa00,
  heat_seeker_bey:     0xff4422,
  bomb_bey:            0xff6600,
  shield_bey:          0x00ff88,
  turbo_bey:           0xff2244,
  cannon_bey:          0xddaa00,
};

const DIRECTIONAL_ZONE_COLORS: Record<string, number> = {
  wind_corridor: 0xaaddff,
  tornado:       0x66bbff,
  vortex:        0x8844ff,
  updraft:       0x44ffcc,
  downdraft:     0x334455,
  slipstream:    0x44ddff,
  dust_devil:    0xddaa66,
};

const cmToWorldPx = (cm: number) => cm * PX_PER_CM_BASE;

export class FeatureRenderer {
  private layer: PIXI.Container;

  // Per-feature graphics caches keyed by id.
  private obstacleGfx = new Map<string, PIXI.Graphics>();
  private obstacleHealthGfx = new Map<string, PIXI.Graphics>();
  private pitGfx = new Map<string, PIXI.Graphics>();
  private turretGfx = new Map<string, PIXI.Container>(); // base + barrel
  private projectileGfx = new Map<string, PIXI.Graphics>();
  private waterGfx = new Map<string, PIXI.Graphics>();
  private portalGfx = new Map<string, PIXI.Container>();
  private loopGfx = new Map<string, PIXI.Graphics>();
  private directionalZoneGfx = new Map<string, PIXI.Graphics>();

  constructor(featureLayer: PIXI.Container) {
    this.layer = featureLayer;
  }

  /** Render one frame of features. Called from PixiRenderer.render(). */
  sync(opts: {
    obstacles?: Map<string, ServerObstacle>;
    pits?: Map<string, ServerPit>;
    turrets?: Map<string, ServerTurret>;
    projectiles?: Map<string, ServerProjectile>;
    waterBodies?: Map<string, ServerWaterBody>;
    portals?: Map<string, ServerPortal>;
    loops?: Map<string, ServerLoop>;
    directionalZones?: Array<{ id: string; type: string; x_cm: number; y_cm: number; radius_cm?: number; width_cm?: number; length_cm?: number; angleDeg?: number }>;
    nowMs: number;
    /** Optional viewport rect in cm — when set, all entities are toggled
     *  visible only if they intersect (with `marginCm` slack). Reduces
     *  per-frame draw work on large arenas. */
    viewportCm?: { x: number; y: number; w: number; h: number } | null;
    marginCm?: number;
  }) {
    this.viewport = opts.viewportCm ?? null;
    this.viewMarginCm = opts.marginCm ?? 4;
    this.syncObstacles(opts.obstacles);
    this.syncWaterBodies(opts.waterBodies);
    this.syncPits(opts.pits);
    this.syncLoops(opts.loops);
    this.syncPortals(opts.portals, opts.nowMs);
    this.syncDirectionalZones(opts.directionalZones, opts.nowMs);
    this.syncTurrets(opts.turrets);
    this.syncProjectiles(opts.projectiles);
  }

  private viewport: { x: number; y: number; w: number; h: number } | null = null;
  private viewMarginCm = 4;

  /**
   * True when a feature at (x_cm, y_cm) with `radiusCm` overlaps the viewport
   * (or when no viewport is set — feature is always drawn).
   */
  private isVisible(x_cm: number, y_cm: number, radiusCm: number): boolean {
    const v = this.viewport;
    if (!v) return true;
    const m = this.viewMarginCm + radiusCm;
    return !(
      x_cm + m < v.x ||
      x_cm - m > v.x + v.w ||
      y_cm + m < v.y ||
      y_cm - m > v.y + v.h
    );
  }

  // ─── Obstacles ──────────────────────────────────────────────────────────

  private syncObstacles(map?: Map<string, ServerObstacle>) {
    this.diffSync(this.obstacleGfx, map, (o, g) => {
      g.visible = this.isVisible(o.x, o.y, o.radius);
      if (g.visible) this.drawObstacle(o, g); else g.clear();
    });
    // Health bars for damaged destructibles
    this.diffSync(this.obstacleHealthGfx, map, (o, g) => {
      g.visible = this.isVisible(o.x, o.y, o.radius);
      g.clear();
      if (!g.visible) return;
      if (o.destructible && !o.isDestroyed && o.health < o.maxHealth) {
        const r = cmToWorldPx(o.radius);
        const w = r * 1.6;
        const x = cmToWorldPx(o.x) - w / 2;
        const y = cmToWorldPx(o.y) - r - 4;
        const pct = Math.max(0, Math.min(1, o.health / Math.max(1, o.maxHealth)));
        g.rect(x, y, w, 3).fill({ color: 0x000000, alpha: 0.6 });
        g.rect(x, y, w * pct, 3).fill({ color: pct > 0.4 ? 0x44ff44 : 0xff4444 });
      }
    });
  }

  private drawObstacle(o: ServerObstacle, g: PIXI.Graphics) {
    g.clear();
    if (o.isDestroyed) return;
    const x = cmToWorldPx(o.x);
    const y = cmToWorldPx(o.y);
    const r = cmToWorldPx(o.radius);
    const color = OBSTACLE_COLORS[o.type] ?? 0x808080;

    // Drop shadow (height illusion).
    g.circle(x + 2, y + 3, r).fill({ color: 0x000000, alpha: 0.4 });
    // Body.
    g.circle(x, y, r).fill({ color, alpha: o.destructible ? 0.88 : 0.95 });
    // Highlight ring.
    g.circle(x, y, r).stroke({ color: 0xffffff, width: 1.5, alpha: 0.35 });
    // Indestructible chevron — small steel ring.
    if (!o.destructible) {
      g.circle(x, y, r * 0.75).stroke({ color: 0xeeeeee, width: 1, alpha: 0.5 });
    }
  }

  // ─── Pits ───────────────────────────────────────────────────────────────

  private syncPits(map?: Map<string, ServerPit>) {
    this.diffSync(this.pitGfx, map, (p, g) => {
      g.visible = this.isVisible(p.x, p.y, p.radius);
      g.clear();
      if (!g.visible) return;
      const x = cmToWorldPx(p.x);
      const y = cmToWorldPx(p.y);
      const r = cmToWorldPx(p.radius);
      // Outer rim.
      g.circle(x, y, r * 1.05).fill({ color: 0x000000, alpha: 0.5 });
      // Inner dark gradient (faked w/ two stacked circles).
      g.circle(x, y, r).fill({ color: 0x0a0d18 });
      g.circle(x, y, r * 0.6).fill({ color: 0x000000, alpha: 0.6 });
      // Warning ring (orange) when a bey is trapped.
      if (p.trappedBeybladeId) {
        g.circle(x, y, r * 1.08).stroke({ color: 0xff8844, width: 2, alpha: 0.9 });
      } else {
        g.circle(x, y, r).stroke({ color: 0x333344, width: 1, alpha: 0.6 });
      }
    });
  }

  // ─── Water bodies ───────────────────────────────────────────────────────

  private syncWaterBodies(map?: Map<string, ServerWaterBody>) {
    this.diffSync(this.waterGfx, map, (w, g) => {
      // Use a permissive radius — water can be large rectangles.
      const r = Math.max(w.radius ?? 0, w.outerRadius ?? 0, w.width ?? 0, w.height ?? 0, 8);
      g.visible = this.isVisible(w.x ?? 0, w.y ?? 0, r);
      g.clear();
      if (!g.visible) return;
      const color = LIQUID_COLORS[w.liquidType] ?? 0x4488ff;
      const fillAlpha = w.liquidType === "ice" ? 0.4 : 0.55;
      const x = cmToWorldPx(w.x ?? 0);
      const y = cmToWorldPx(w.y ?? 0);

      // Determine geometry from the available fields.
      const shape = w.shape || (w.type === "moat" ? "annulus" : "circle");
      if (shape === "annulus" && w.innerRadius != null && w.outerRadius != null) {
        const ri = cmToWorldPx(w.innerRadius);
        const ro = cmToWorldPx(w.outerRadius);
        // Approximate annulus with two filled circles via even-odd-ish trick:
        // draw outer ring then knock out interior using black-alpha overlay.
        g.circle(x, y, ro).fill({ color, alpha: fillAlpha });
        g.circle(x, y, ri).cut?.();
        if (!(g as any).cut) {
          // PIXI 8 has no native hole; emulate with a same-color-as-floor disk.
          g.circle(x, y, ri).fill({ color: 0x000000, alpha: 0 });
        }
        g.circle(x, y, ro).stroke({ color, width: 2, alpha: 0.85 });
        g.circle(x, y, ri).stroke({ color, width: 1, alpha: 0.5 });
      } else if (shape === "rectangle" || shape === "square") {
        const ww = cmToWorldPx(w.width ?? (w.radius ?? 4) * 2);
        const hh = cmToWorldPx(w.height ?? (w.radius ?? 4) * 2);
        g.rect(x - ww / 2, y - hh / 2, ww, hh).fill({ color, alpha: fillAlpha });
        g.rect(x - ww / 2, y - hh / 2, ww, hh).stroke({ color, width: 2, alpha: 0.85 });
      } else if (shape === "oval") {
        const rx = cmToWorldPx(w.width ?? (w.radius ?? 4));
        const ry = cmToWorldPx(w.height ?? (w.radius ?? 4));
        g.ellipse(x, y, rx, ry).fill({ color, alpha: fillAlpha });
        g.ellipse(x, y, rx, ry).stroke({ color, width: 2, alpha: 0.85 });
      } else {
        const r = cmToWorldPx(w.radius ?? 4);
        g.circle(x, y, r).fill({ color, alpha: fillAlpha });
        g.circle(x, y, r).stroke({ color, width: 2, alpha: 0.85 });
      }
    });
  }

  // ─── Loops / speed paths ────────────────────────────────────────────────

  private syncLoops(map?: Map<string, ServerLoop>) {
    this.diffSync(this.loopGfx, map, (l, g) => {
      g.visible = this.isVisible(l.x ?? 0, l.y ?? 0, l.radius);
      g.clear();
      if (!g.visible) return;
      const x = cmToWorldPx(l.x ?? 0);
      const y = cmToWorldPx(l.y ?? 0);
      const r = cmToWorldPx(l.radius);
      const color = l.speedBoost > 1 ? 0xffcc44 : 0x88aaff;
      g.circle(x, y, r).stroke({ color, width: 3, alpha: 0.7 });
      // Direction arrows (cosmetic).
      const arrowCount = 6;
      for (let i = 0; i < arrowCount; i++) {
        const a = (i / arrowCount) * Math.PI * 2;
        const ax = x + Math.cos(a) * r;
        const ay = y + Math.sin(a) * r;
        g.circle(ax, ay, 2).fill({ color, alpha: 0.6 });
      }
    });
  }

  // ─── Portals ────────────────────────────────────────────────────────────

  private syncPortals(map: Map<string, ServerPortal> | undefined, nowMs: number) {
    this.diffSyncContainer(this.portalGfx, map, (p) => this.createPortal(p), (p, c) => this.updatePortal(p, c, nowMs));
  }

  private createPortal(p: ServerPortal): PIXI.Container {
    const c = new PIXI.Container();
    const inRing = new PIXI.Graphics();
    const inInner = new PIXI.Graphics();
    const outRing = new PIXI.Graphics();
    const outInner = new PIXI.Graphics();
    c.addChild(inRing, inInner, outRing, outInner);
    (c as any)._portal_inRing = inRing;
    (c as any)._portal_inInner = inInner;
    (c as any)._portal_outRing = outRing;
    (c as any)._portal_outInner = outInner;
    return c;
  }

  private updatePortal(p: ServerPortal, c: PIXI.Container, nowMs: number) {
    // Portal pair spans inPoint→outPoint; if neither endpoint is visible, skip the redraw.
    const visIn = this.isVisible(p.inPointX, p.inPointY, p.radius);
    const visOut = this.isVisible(p.outPointX, p.outPointY, p.radius);
    c.visible = visIn || visOut;
    if (!c.visible) return;
    const inRing = (c as any)._portal_inRing as PIXI.Graphics;
    const inInner = (c as any)._portal_inInner as PIXI.Graphics;
    const outRing = (c as any)._portal_outRing as PIXI.Graphics;
    const outInner = (c as any)._portal_outInner as PIXI.Graphics;
    const r = cmToWorldPx(p.radius);
    const pulse = 0.7 + 0.3 * Math.sin(nowMs / 300);
    const color = p.isOnCooldown ? 0x666666 : 0x9944ff;
    const drawRing = (g: PIXI.Graphics, x: number, y: number) => {
      g.clear();
      g.circle(x, y, r).stroke({ color, width: 3, alpha: 0.85 });
      g.circle(x, y, r * 1.2).stroke({ color, width: 1, alpha: 0.45 * pulse });
    };
    const drawInner = (g: PIXI.Graphics, x: number, y: number) => {
      g.clear();
      // Rotating inner accents.
      const rot = (nowMs / 800) % (Math.PI * 2);
      for (let i = 0; i < 4; i++) {
        const a = rot + (i / 4) * Math.PI * 2;
        const px = x + Math.cos(a) * r * 0.55;
        const py = y + Math.sin(a) * r * 0.55;
        g.circle(px, py, 3).fill({ color, alpha: 0.85 * pulse });
      }
    };
    drawRing(inRing, cmToWorldPx(p.inPointX), cmToWorldPx(p.inPointY));
    drawInner(inInner, cmToWorldPx(p.inPointX), cmToWorldPx(p.inPointY));
    drawRing(outRing, cmToWorldPx(p.outPointX), cmToWorldPx(p.outPointY));
    drawInner(outInner, cmToWorldPx(p.outPointX), cmToWorldPx(p.outPointY));
  }

  // ─── Turrets ────────────────────────────────────────────────────────────

  private syncTurrets(map?: Map<string, ServerTurret>) {
    this.diffSyncContainer(this.turretGfx, map, (t) => this.createTurret(t), (t, c) => this.updateTurret(t, c));
  }

  private createTurret(_t: ServerTurret): PIXI.Container {
    const c = new PIXI.Container();
    const base = new PIXI.Graphics();
    const barrel = new PIXI.Graphics();
    c.addChild(base, barrel);
    (c as any)._turret_base = base;
    (c as any)._turret_barrel = barrel;
    return c;
  }

  private updateTurret(t: ServerTurret, c: PIXI.Container) {
    // Approximate turret extent = barrel length (1.6cm) + base radius (1.2cm).
    c.visible = this.isVisible(t.x, t.y, 3);
    if (!c.visible) return;
    const base = (c as any)._turret_base as PIXI.Graphics;
    const barrel = (c as any)._turret_barrel as PIXI.Graphics;
    const color = TURRET_COLORS[t.attackType] ?? 0x888888;
    const x = cmToWorldPx(t.x);
    const y = cmToWorldPx(t.y);
    const baseR = cmToWorldPx(1.2);
    const barrelL = cmToWorldPx(1.6);

    base.clear();
    base.circle(x + 1, y + 2, baseR).fill({ color: 0x000000, alpha: 0.35 });
    base.circle(x, y, baseR).fill({ color: t.isDestroyed ? 0x444444 : 0x1f2a3a });
    base.circle(x, y, baseR).stroke({ color, width: 2, alpha: 0.9 });
    // Warmup pulse.
    if (t.isWarming) {
      base.circle(x, y, baseR * 1.3).stroke({ color, width: 1.5, alpha: 0.6 });
    }
    // Firing flash.
    if (t.isFiring) {
      base.circle(x, y, baseR * 1.6).stroke({ color, width: 2, alpha: 0.8 });
    }

    barrel.clear();
    if (!t.isDestroyed) {
      const a = (t.currentAngle * Math.PI) / 180;
      const ex = x + Math.cos(a) * barrelL;
      const ey = y + Math.sin(a) * barrelL;
      barrel.moveTo(x, y).lineTo(ex, ey).stroke({ color, width: 4, alpha: 0.95 });
      barrel.circle(ex, ey, 3).fill({ color, alpha: 0.95 });
    }
  }

  // ─── Directional Zones ──────────────────────────────────────────────────

  private syncDirectionalZones(
    zones?: Array<{ id: string; type: string; x_cm: number; y_cm: number; radius_cm?: number; width_cm?: number; length_cm?: number; angleDeg?: number }>,
    nowMs = 0,
  ) {
    const seen = new Set<string>();
    if (zones) {
      for (const zone of zones) {
        seen.add(zone.id);
        let g = this.directionalZoneGfx.get(zone.id);
        if (!g) {
          g = new PIXI.Graphics();
          this.layer.addChildAt(g, 0); // draw under everything
          this.directionalZoneGfx.set(zone.id, g);
        }
        this.drawDirectionalZone(zone, g, nowMs);
      }
    }
    this.directionalZoneGfx.forEach((g, id) => {
      if (!seen.has(id)) {
        this.layer.removeChild(g);
        g.destroy();
        this.directionalZoneGfx.delete(id);
      }
    });
  }

  private drawDirectionalZone(
    zone: { id: string; type: string; x_cm: number; y_cm: number; radius_cm?: number; width_cm?: number; length_cm?: number; angleDeg?: number },
    g: PIXI.Graphics,
    nowMs: number,
  ) {
    g.clear();
    const x = cmToWorldPx(zone.x_cm);
    const y = cmToWorldPx(zone.y_cm);
    const color: number = (DIRECTIONAL_ZONE_COLORS as any)[zone.type] ?? 0x88ccff;
    const pulse = 0.55 + 0.2 * Math.sin(nowMs / 900);

    switch (zone.type) {
      case "wind_corridor":
      case "slipstream": {
        const halfW = cmToWorldPx((zone.width_cm ?? 8) / 2);
        const halfL = cmToWorldPx((zone.length_cm ?? 20) / 2);
        const aRad = ((zone.angleDeg ?? 0) * Math.PI) / 180;
        const cosA = Math.cos(aRad), sinA = Math.sin(aRad);
        // Draw rotated rectangle by transforming all corners manually
        const corners = [[-halfL, -halfW], [halfL, -halfW], [halfL, halfW], [-halfL, halfW]] as const;
        const wx = corners.map(([lx, ly]) => x + lx * cosA - ly * sinA);
        const wy = corners.map(([lx, ly]) => y + lx * sinA + ly * cosA);
        g.poly([wx[0], wy[0], wx[1], wy[1], wx[2], wy[2], wx[3], wy[3]]).fill({ color, alpha: 0.12 * pulse });
        g.poly([wx[0], wy[0], wx[1], wy[1], wx[2], wy[2], wx[3], wy[3]]).stroke({ color, width: 1.5, alpha: 0.5 * pulse });
        // Animated flow arrows (drawn in rotated space via manual transform)
        const arrowSpacing = halfL / 3;
        const arrowPhase = ((nowMs / 400) % 1) * arrowSpacing;
        for (let lax = -halfL + arrowPhase; lax < halfL; lax += arrowSpacing) {
          const ah = halfW * 0.4;
          const toWorld = (lx: number, ly: number) => ({ x: x + lx * cosA - ly * sinA, y: y + lx * sinA + ly * cosA });
          const p0 = toWorld(lax - 6, -ah * 0.5);
          const p1 = toWorld(lax, 0);
          const p2 = toWorld(lax - 6, ah * 0.5);
          g.moveTo(p0.x, p0.y).lineTo(p1.x, p1.y).lineTo(p2.x, p2.y)
            .stroke({ color, width: 2, alpha: 0.7 * pulse });
        }
        break;
      }
      case "tornado": {
        const r = cmToWorldPx(zone.radius_cm ?? 8);
        // Outer ring
        g.circle(x, y, r).stroke({ color, width: 2, alpha: 0.45 * pulse });
        g.circle(x, y, r).fill({ color, alpha: 0.07 * pulse });
        // Spiral arms (3 arcs)
        for (let arm = 0; arm < 3; arm++) {
          const startAngle = ((nowMs / 1200) + arm * (Math.PI * 2 / 3)) % (Math.PI * 2);
          for (let t = 0; t < 1; t += 0.05) {
            const a = startAngle + t * Math.PI * 1.5;
            const rr = r * (0.2 + t * 0.8);
            const px2 = x + Math.cos(a) * rr;
            const py2 = y + Math.sin(a) * rr;
            g.circle(px2, py2, 2.5).fill({ color, alpha: (1 - t) * 0.6 * pulse });
          }
        }
        // Eye
        g.circle(x, y, r * 0.18).fill({ color, alpha: 0.25 * pulse });
        break;
      }
      case "vortex": {
        const r = cmToWorldPx(zone.radius_cm ?? 8);
        g.circle(x, y, r).fill({ color: 0x000000, alpha: 0.18 });
        g.circle(x, y, r).stroke({ color, width: 2.5, alpha: 0.6 * pulse });
        // Concentric rings fading inward
        for (let i = 1; i <= 4; i++) {
          const ri = r * (i / 4);
          g.circle(x, y, ri).stroke({ color, width: 1, alpha: 0.25 * (i / 4) * pulse });
        }
        // Dense inward arrows
        const numArrows = 6;
        for (let i = 0; i < numArrows; i++) {
          const a = (nowMs / 800 + (i / numArrows) * Math.PI * 2) % (Math.PI * 2);
          const arrowR = r * 0.65;
          const ax2 = x + Math.cos(a) * arrowR;
          const ay2 = y + Math.sin(a) * arrowR;
          const ia = Math.atan2(y - ay2, x - ax2);
          g.moveTo(ax2, ay2).lineTo(ax2 + Math.cos(ia) * 10, ay2 + Math.sin(ia) * 10)
            .stroke({ color, width: 2, alpha: 0.7 * pulse });
        }
        break;
      }
      case "updraft": {
        const r = cmToWorldPx(zone.radius_cm ?? 8);
        g.circle(x, y, r).fill({ color, alpha: 0.1 * pulse });
        g.circle(x, y, r).stroke({ color, width: 1.5, alpha: 0.4 * pulse });
        // Rising bubbles
        for (let i = 0; i < 5; i++) {
          const phase = ((nowMs / 600 + i * 0.2) % 1);
          const bx2 = x + (i - 2) * r * 0.22;
          const by2 = y + r * 0.5 - phase * r;
          const brad = 3 + i % 2 * 2;
          g.circle(bx2, by2, brad).fill({ color, alpha: (1 - phase) * 0.6 * pulse });
        }
        break;
      }
      case "downdraft": {
        const r = cmToWorldPx(zone.radius_cm ?? 8);
        g.circle(x, y, r).fill({ color: 0x334455, alpha: 0.18 });
        g.circle(x, y, r).stroke({ color: 0x6688aa, width: 2, alpha: 0.5 * pulse });
        // Downward arrows
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          const ax2 = x + Math.cos(a) * r * 0.5;
          const ay2 = y + Math.sin(a) * r * 0.5;
          g.moveTo(ax2, ay2 - 8).lineTo(ax2, ay2 + 8).lineTo(ax2 - 4, ay2 + 3)
            .stroke({ color: 0x6688aa, width: 2, alpha: 0.7 * pulse });
        }
        break;
      }
      case "dust_devil": {
        const r = cmToWorldPx(zone.radius_cm ?? 5);
        // Chaotic spinning particles
        for (let i = 0; i < 8; i++) {
          const a = (nowMs / 300 + (i / 8) * Math.PI * 2) % (Math.PI * 2);
          const pr = r * (0.3 + (i % 3) * 0.25);
          g.circle(x + Math.cos(a) * pr, y + Math.sin(a) * pr, 2).fill({ color, alpha: 0.7 * pulse });
        }
        g.circle(x, y, r).stroke({ color, width: 1, alpha: 0.3 * pulse });
        break;
      }
    }
  }

  // ─── Projectiles ────────────────────────────────────────────────────────

  private syncProjectiles(map?: Map<string, ServerProjectile>) {
    this.diffSync(this.projectileGfx, map, (p, g) => {
      g.visible = p.isActive && this.isVisible(p.x, p.y, 1);
      g.clear();
      if (!g.visible) return;
      const x = cmToWorldPx(p.x);
      const y = cmToWorldPx(p.y);
      const color =
        p.type === "missile" ? 0xff5522 :
        p.type === "boomerang" ? 0x44aaff :
        p.type === "beam" ? 0xff44aa :
        p.type === "wave" ? 0x3399ff :       // surf
        p.type === "hydro" ? 0x0066dd :      // hydro_pump
        p.type === "fire_ring" ? 0xff6600 :  // fire_spin
        p.type === "thunder" ? 0xffee00 :    // thunderbolt
        p.type === "psychic" ? 0xff44ff :    // psychic
        p.type === "shadow" ? 0x884488 :     // shadow_ball
        p.type === "fire_petal" ? 0xff3300 : // fire_blast
        p.type === "sludge" ? 0x88aa00 :     // sludge_bomb
        p.type === "spike" ? 0xaa44aa :       // toxic_spikes
        p.type === "sonic" ? 0xddaa44 :      // roar
        // Phase ZP-2
        p.type === "blizzard" ? 0xaaeeff :
        p.type === "quake" ? 0xcc9944 :      // earthquake ring
        p.type === "flame" ? 0xff5500 :      // flamethrower beam
        p.type === "ice" ? 0x88eeff :        // ice_beam
        p.type === "dragon" ? 0x8844ff :
        p.type === "confuse" ? 0xff88cc :
        p.type === "leech" ? 0x44cc44 :
        p.type === "vine" ? 0x33aa33 :
        p.type === "web" ? 0xcccc44 :
        p.type === "hyper" ? 0xffff00 :
        p.type === "gravity" ? 0x8888ff :
        p.type === "sand" ? 0xddaa66 :
        p.type === "zap" ? 0xffdd00 :
        p.type === "overheat_blast" ? 0xff2200 :
        p.type === "chain_arc" ? 0xeeff44 :
        p.type === "spore_cloud" ? 0xbbee44 :
        p.type === "void_ball" ? 0x440088 :
        p.type === "boulder" ? 0x998877 :
        p.type === "whirl" ? 0x2266cc :
        p.type === "stealth" ? 0x888866 :
        0xffaa44;
      if (p.type === "beam" && p.beamEndX != null && p.beamEndY != null) {
        const ex = cmToWorldPx(p.beamEndX);
        const ey = cmToWorldPx(p.beamEndY);
        const w = Math.max(2, cmToWorldPx(p.beamWidth ?? 0.5));
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color, width: w, alpha: 0.8 });
      } else if (p.type === "thunder") {
        // Thunderbolt — jagged line
        const ex = cmToWorldPx((p as any).beamEndX ?? p.x + 1);
        const ey = cmToWorldPx((p as any).beamEndY ?? p.y + 1);
        const segments = 6;
        const pts: Array<{x: number; y: number}> = [{x, y}];
        for (let s = 1; s < segments; s++) {
          const t2 = s / segments;
          const jx = x + (ex - x) * t2 + (Math.random() - 0.5) * 18;
          const jy = y + (ey - y) * t2 + (Math.random() - 0.5) * 18;
          pts.push({x: jx, y: jy});
        }
        pts.push({x: ex, y: ey});
        for (let s = 0; s < pts.length - 1; s++) {
          g.moveTo(pts[s].x, pts[s].y).lineTo(pts[s+1].x, pts[s+1].y)
            .stroke({ color, width: 3, alpha: 0.9 });
        }
        g.circle(ex, ey, 6).fill({ color, alpha: 0.8 });
      } else if (p.type === "wave") {
        // Surf wave — wide oval
        g.ellipse(x, y, 18, 8).fill({ color, alpha: 0.75 });
        g.ellipse(x, y, 18, 8).stroke({ color: 0xffffff, width: 1, alpha: 0.4 });
      } else if (p.type === "fire_ring") {
        // Fire spin ring indicator
        const ringR = cmToWorldPx((p as any).ringRadius ?? 2.5);
        g.circle(x, y, ringR).stroke({ color, width: 3, alpha: 0.7 });
        g.circle(x, y, ringR * 0.8).stroke({ color: 0xff9900, width: 1.5, alpha: 0.4 });
      } else if (p.type === "shadow") {
        // Shadow ball — dark pulsing orb
        const nowPulse = 0.7 + 0.3 * Math.sin(Date.now() / 150);
        g.circle(x, y, 8).fill({ color, alpha: 0.85 * nowPulse });
        g.circle(x, y, 12).stroke({ color, width: 2, alpha: 0.4 * nowPulse });
      } else if (p.type === "sludge") {
        // Sludge bomb — dripping oval
        g.ellipse(x, y, 9, 12).fill({ color, alpha: 0.85 });
        g.ellipse(x, y, 9, 12).stroke({ color: 0x446600, width: 1, alpha: 0.6 });
      } else if (p.type === "sonic") {
        // Roar — expanding ring
        const nowR = 5 + ((Date.now() / 80) % 12);
        g.circle(x, y, nowR).stroke({ color, width: 2, alpha: 0.6 });
      } else if (p.type === "blizzard") {
        // Blizzard — snowflake-like burst
        for (let arm = 0; arm < 6; arm++) {
          const a = (arm / 6) * Math.PI * 2;
          g.moveTo(x, y).lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10)
            .stroke({ color, width: 2, alpha: 0.85 });
        }
        g.circle(x, y, 4).fill({ color, alpha: 0.7 });
      } else if (p.type === "quake") {
        // Earthquake ring — arc stroke only
        const qr = (p as any).ringRadius ?? 8;
        g.circle(x, y, cmToWorldPx(qr)).stroke({ color, width: 4, alpha: 0.55 });
      } else if (p.type === "flame") {
        // Flamethrower beam endpoint glow
        g.circle(x, y, 7).fill({ color, alpha: 0.75 });
        g.circle(x, y, 11).stroke({ color, width: 2, alpha: 0.4 });
      } else if (p.type === "ice") {
        // Ice beam — hexagonal crystal
        for (let s = 0; s < 6; s++) {
          const a0 = (s / 6) * Math.PI * 2;
          const a1 = ((s + 1) / 6) * Math.PI * 2;
          g.moveTo(x + Math.cos(a0) * 8, y + Math.sin(a0) * 8)
            .lineTo(x + Math.cos(a1) * 8, y + Math.sin(a1) * 8)
            .stroke({ color, width: 2, alpha: 0.9 });
        }
        g.circle(x, y, 4).fill({ color: 0xffffff, alpha: 0.7 });
      } else if (p.type === "dragon") {
        // Dragon breath — purple-fire teardrop
        g.ellipse(x, y, 6, 10).fill({ color, alpha: 0.8 });
        g.circle(x, y, 10).stroke({ color: 0xff6600, width: 1.5, alpha: 0.4 });
      } else if (p.type === "confuse") {
        // Confuse ray — spinning ??? spiral
        const nowA = Date.now() / 200;
        for (let s = 0; s < 3; s++) {
          const sa = nowA + (s / 3) * Math.PI * 2;
          g.circle(x + Math.cos(sa) * 6, y + Math.sin(sa) * 6, 3).fill({ color, alpha: 0.8 });
        }
      } else if (p.type === "leech") {
        // Leech seed — green seed pod
        g.ellipse(x, y, 5, 8).fill({ color, alpha: 0.85 });
        g.ellipse(x, y, 5, 8).stroke({ color: 0x228822, width: 1, alpha: 0.6 });
      } else if (p.type === "vine") {
        // Vine whip — line with nodes
        const ex = cmToWorldPx((p as any).beamEndX ?? p.x);
        const ey = cmToWorldPx((p as any).beamEndY ?? p.y);
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color, width: 3, alpha: 0.8 });
        for (let n = 0; n < 4; n++) {
          const t = n / 4;
          g.circle(x + (ex - x) * t, y + (ey - y) * t, 3).fill({ color, alpha: 0.7 });
        }
      } else if (p.type === "web") {
        // Sticky web — asterisk pattern
        for (let l = 0; l < 4; l++) {
          const a = (l / 4) * Math.PI;
          g.moveTo(x - Math.cos(a) * 9, y - Math.sin(a) * 9)
            .lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9)
            .stroke({ color, width: 2, alpha: 0.7 });
        }
        g.circle(x, y, 3).fill({ color, alpha: 0.6 });
      } else if (p.type === "hyper") {
        // Hyper beam — massive glowing sphere
        const hp = 0.6 + 0.4 * Math.sin(Date.now() / 60);
        g.circle(x, y, 14).fill({ color, alpha: 0.9 * hp });
        g.circle(x, y, 20).stroke({ color: 0xffffff, width: 3, alpha: 0.5 * hp });
      } else if (p.type === "gravity") {
        // Gravity field — pulsing ring with inward arrows
        const gr = 12 + 4 * Math.sin(Date.now() / 250);
        g.circle(x, y, gr).stroke({ color, width: 2, alpha: 0.6 });
        for (let d = 0; d < 4; d++) {
          const a = (d / 4) * Math.PI * 2;
          g.moveTo(x + Math.cos(a) * gr, y + Math.sin(a) * gr)
            .lineTo(x + Math.cos(a) * 4, y + Math.sin(a) * 4)
            .stroke({ color, width: 1.5, alpha: 0.5 });
        }
      } else if (p.type === "sand") {
        // Sand tomb — grainy spiral
        const sr = 8 + 3 * Math.sin(Date.now() / 200);
        g.circle(x, y, sr).stroke({ color, width: 3, alpha: 0.55 });
        g.circle(x, y, sr * 0.5).fill({ color, alpha: 0.35 });
      } else if (p.type === "zap") {
        // Zap cannon — slow electric orb with ring
        const zp = 0.7 + 0.3 * Math.sin(Date.now() / 100);
        g.circle(x, y, 8).fill({ color, alpha: 0.85 * zp });
        g.circle(x, y, 13).stroke({ color, width: 2, alpha: 0.5 * zp });
        // Spark arms
        for (let s = 0; s < 4; s++) {
          const a = (s / 4) * Math.PI * 2 + Date.now() / 300;
          g.moveTo(x, y).lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14)
            .stroke({ color: 0xffffff, width: 1, alpha: 0.6 * zp });
        }
      } else if (p.type === "overheat_blast") {
        // Overheat — expanding fireball
        const op = 0.8 + 0.2 * Math.sin(Date.now() / 50);
        g.circle(x, y, 12).fill({ color, alpha: 0.9 * op });
        g.circle(x, y, 18).fill({ color: 0xff8800, alpha: 0.5 * op });
        g.circle(x, y, 22).stroke({ color: 0xffff00, width: 2, alpha: 0.35 * op });
      } else if (p.type === "chain_arc") {
        // Chain lightning bolt indicator
        g.circle(x, y, 5).fill({ color, alpha: 0.9 });
        g.circle(x, y, 9).stroke({ color, width: 2, alpha: 0.5 });
      } else if (p.type === "spore_cloud") {
        // Spore cloud — pollen-like blobs
        for (let s = 0; s < 5; s++) {
          const sa = (s / 5) * Math.PI * 2 + Date.now() / 500;
          g.circle(x + Math.cos(sa) * 7, y + Math.sin(sa) * 7, 4).fill({ color, alpha: 0.6 });
        }
        g.circle(x, y, 5).fill({ color, alpha: 0.4 });
      } else if (p.type === "void_ball") {
        // Dark void — deep purple orb with dark halo
        const vp = 0.6 + 0.3 * Math.sin(Date.now() / 180);
        g.circle(x, y, 7).fill({ color: 0x220044, alpha: 0.9 });
        g.circle(x, y, 11).stroke({ color, width: 2.5, alpha: 0.7 * vp });
        g.circle(x, y, 15).stroke({ color: 0x8800cc, width: 1, alpha: 0.4 * vp });
      } else if (p.type === "boulder") {
        // Rock slide boulder — rough circle
        g.circle(x, y, 7).fill({ color, alpha: 0.85 });
        g.circle(x, y, 7).stroke({ color: 0x665544, width: 1.5, alpha: 0.7 });
      } else if (p.type === "whirl") {
        // Whirlpool indicator — water spiral
        const wa = Date.now() / 400;
        for (let s = 0; s < 3; s++) {
          const a = wa + (s / 3) * Math.PI * 2;
          g.circle(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 3).fill({ color, alpha: 0.7 });
        }
        g.circle(x, y, 5).fill({ color, alpha: 0.5 });
      } else if (p.type === "stealth") {
        // Stealth rock — semi-transparent jagged shape
        g.circle(x, y, 6).fill({ color, alpha: 0.35 });
        g.circle(x, y, 6).stroke({ color, width: 1, alpha: 0.5 });
      // ── Round 3 type move visuals ─────────────────────
      } else if (p.type === "ember") {
        // Ember — small orange spark
        g.circle(x, y, 5).fill({ color: 0xff8844, alpha: 0.95 });
        g.circle(x, y, 8).stroke({ color: 0xff4400, width: 1, alpha: 0.4 });
      } else if (p.type === "geyser") {
        // Eruption geyser — upward spike indicator
        g.rect(x - 4, y - 14, 8, 14).fill({ color: 0xff3300, alpha: 0.8 });
        g.circle(x, y - 14, 10).fill({ color: 0xff6600, alpha: 0.6 });
      } else if (p.type === "bubble") {
        // Bubble beam — translucent circle
        g.circle(x, y, 7).fill({ color: 0x66ccff, alpha: 0.4 });
        g.circle(x, y, 7).stroke({ color: 0xffffff, width: 1.5, alpha: 0.6 });
        g.circle(x + 2, y - 2, 2).fill({ color: 0xffffff, alpha: 0.5 });
      } else if (p.type === "aqua_ring_proj") {
        // Aqua ring — water circle orbiting
        const aq = Date.now() / 300;
        g.circle(x, y, 10).stroke({ color: 0x44aaff, width: 2.5, alpha: 0.7 });
        g.circle(x + Math.cos(aq) * 6, y + Math.sin(aq) * 6, 3).fill({ color: 0xaaddff, alpha: 0.8 });
      } else if (p.type === "icicle") {
        // Icicle spear — thin pointed shard
        g.rect(x - 2, y - 12, 4, 12).fill({ color: 0xccffff, alpha: 0.9 });
        g.circle(x, y - 14, 3).fill({ color: 0xeeffff, alpha: 0.8 });
      } else if (p.type === "thunder_wave_ring") {
        // Thunder wave — yellow AoE ring
        const tw = (p as any).ringRadius ?? 8;
        g.circle(x, y, cmToWorldPx(tw)).stroke({ color: 0xffee88, width: 3, alpha: 0.55 });
      } else if (p.type === "bolt") {
        // Bolt strike — instant vertical lightning
        const bp = 0.7 + 0.3 * Math.sin(Date.now() / 80);
        g.circle(x, y, 8).fill({ color: 0xffffff, alpha: 0.9 * bp });
        g.circle(x, y, 14).stroke({ color: 0xffdd00, width: 3, alpha: 0.6 * bp });
      } else if (p.type === "air_slash_proj") {
        // Air slash — crescent blade
        const as = Date.now() / 150;
        for (let c = 0; c < 3; c++) {
          const ca = as + (c / 3) * Math.PI * 2;
          g.moveTo(x + Math.cos(ca) * 4, y + Math.sin(ca) * 4)
            .lineTo(x + Math.cos(ca + 0.8) * 10, y + Math.sin(ca + 0.8) * 10)
            .stroke({ color: 0xddeeff, width: 2, alpha: 0.7 });
        }
      } else if (p.type === "hurricane_proj") {
        // Hurricane — spinning tornado funnel
        const ha = Date.now() / 200;
        for (let s = 0; s < 3; s++) {
          const sa = ha + (s / 3) * Math.PI * 2;
          g.circle(x + Math.cos(sa) * 7, y + Math.sin(sa) * 7, 3).fill({ color: 0x88bbff, alpha: 0.7 });
        }
        g.circle(x, y, 4).fill({ color: 0xaaddff, alpha: 0.5 });
      } else if (p.type === "shard") {
        // Stone edge shard — angled jagged fragment
        g.rect(x - 3, y - 3, 6, 6).fill({ color: 0xbbaa88, alpha: 0.9 });
        g.moveTo(x, y - 8).lineTo(x + 4, y + 4).lineTo(x - 4, y + 4).lineTo(x, y - 8)
          .fill({ color: 0xaa9977, alpha: 0.7 });
      } else if (p.type === "fissure") {
        // Tectonic rage fissure — long thin crack
        const fx = cmToWorldPx((p as any).beamEndX ?? p.x);
        const fy = cmToWorldPx((p as any).beamEndY ?? p.y);
        g.moveTo(x, y).lineTo(fx, fy).stroke({ color: 0xdd6622, width: 5, alpha: 0.7 });
        g.moveTo(x, y).lineTo(fx, fy).stroke({ color: 0xff4400, width: 2, alpha: 0.9 });
      } else if (p.type === "steel_beam") {
        // Flash cannon — precise metallic beam
        const ex = cmToWorldPx((p as any).beamEndX ?? p.x);
        const ey = cmToWorldPx((p as any).beamEndY ?? p.y);
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color: 0xddddff, width: 4, alpha: 0.9 });
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color: 0xffffff, width: 1, alpha: 0.6 });
      } else if (p.type === "steel_spike") {
        // Bullet punch bolt — tiny fast square
        g.rect(x - 3, y - 3, 6, 6).fill({ color: 0xcccccc, alpha: 0.9 });
      } else if (p.type === "surge_front") {
        // Steel surge front — expanding ring of spikes
        const sr2 = (p as any).ringRadius ?? 5;
        const srPx = cmToWorldPx(sr2);
        g.circle(x, y, srPx).stroke({ color: 0x8899bb, width: 4, alpha: 0.7 });
        for (let s = 0; s < 8; s++) {
          const a = (s / 8) * Math.PI * 2;
          g.moveTo(x + Math.cos(a) * srPx, y + Math.sin(a) * srPx)
            .lineTo(x + Math.cos(a) * (srPx + 7), y + Math.sin(a) * (srPx + 7))
            .stroke({ color: 0xaabbcc, width: 2, alpha: 0.6 });
        }
      } else if (p.type === "petal") {
        // Petal dance — pink petal
        g.ellipse(x, y, 4, 8).fill({ color: 0xff88cc, alpha: 0.8 });
      } else if (p.type === "bloom_charge") {
        // Bloom doom charge — glowing green vortex
        const bc = 0.5 + 0.5 * Math.sin(Date.now() / 120);
        g.circle(x, y, 12 * bc).fill({ color: 0x88ff44, alpha: 0.5 * bc });
        g.circle(x, y, 18 * bc).stroke({ color: 0x44cc00, width: 2, alpha: 0.4 * bc });
      } else if (p.type === "night_shade_proj") {
        // Night shade — dark crescent
        const np = 0.6 + 0.3 * Math.sin(Date.now() / 200);
        g.circle(x, y, 7).fill({ color: 0x220033, alpha: 0.95 });
        g.circle(x, y, 10).stroke({ color: 0x442266, width: 2, alpha: 0.6 * np });
      } else if (p.type === "solar_charge_proj") {
        // Solar beam charging — growing bright sphere
        const sc = 0.5 + 0.5 * Math.sin(Date.now() / 80);
        g.circle(x, y, 8 + 4 * sc).fill({ color: 0xffff44, alpha: 0.8 });
        g.circle(x, y, 16 + 4 * sc).stroke({ color: 0xffffff, width: 2, alpha: 0.5 * sc });
      } else if (p.type === "solar_beam_ray") {
        // Solar beam fire — massive bright beam
        const ex = cmToWorldPx((p as any).beamEndX ?? p.x);
        const ey = cmToWorldPx((p as any).beamEndY ?? p.y);
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color: 0xffff00, width: 8, alpha: 0.9 });
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color: 0xffffff, width: 3, alpha: 0.6 });
      } else if (p.type === "spark_proj") {
        // Spark — small yellow zap
        g.circle(x, y, 4).fill({ color: 0xffff66, alpha: 0.9 });
        const sa = Date.now() / 100;
        g.moveTo(x, y).lineTo(x + Math.cos(sa) * 8, y + Math.sin(sa) * 8)
          .stroke({ color: 0xffffff, width: 1, alpha: 0.6 });
      } else if (p.type === "mag_field") {
        // Magnetic field — orbit ring with arrows
        const mf = (p as any).ringRadius ?? 6;
        const mfR = cmToWorldPx(mf);
        g.circle(x, y, mfR).stroke({ color: 0x4466ff, width: 2, alpha: 0.5 });
        const ma = Date.now() / 400;
        g.moveTo(x + Math.cos(ma) * mfR, y + Math.sin(ma) * mfR)
          .lineTo(x + Math.cos(ma + 0.5) * (mfR - 4), y + Math.sin(ma + 0.5) * (mfR - 4))
          .stroke({ color: 0x8899ff, width: 2, alpha: 0.7 });
      } else if (p.type === "storm_bolt") {
        // Thunder storm strike — tall lightning
        g.circle(x, y, 6).fill({ color: 0x2244cc, alpha: 0.9 });
        for (let i = 0; i < 3; i++) {
          const a = ((i / 3) * Math.PI * 2) + Date.now() / 200;
          g.moveTo(x, y).lineTo(x + Math.cos(a) * 12, y + Math.sin(a) * 12)
            .stroke({ color: 0xaabbff, width: 1.5, alpha: 0.7 });
        }
      } else if (p.type === "void_distort") {
        // Distortion — reality-warping swirl
        const vd = Date.now() / 300;
        for (let s = 0; s < 6; s++) {
          const sa = vd + (s / 6) * Math.PI * 2;
          const r = 4 + s * 1.5;
          g.circle(x + Math.cos(sa) * r, y + Math.sin(sa) * r, 2).fill({ color: 0x8800ff, alpha: 0.7 });
        }
      } else if (p.type === "singularity") {
        // Black hole — dark pulsing void
        const sp = 0.6 + 0.4 * Math.sin(Date.now() / 150);
        g.circle(x, y, 10).fill({ color: 0x000011, alpha: 0.95 });
        g.circle(x, y, 14).stroke({ color: 0x440088, width: 3, alpha: 0.7 * sp });
        g.circle(x, y, 20).stroke({ color: 0x8800ff, width: 1, alpha: 0.4 * sp });
      // ── Fighting / Impact visuals ────────────────────
      } else if (p.type === "slash") {
        // Cross slash — X shape
        const sz = 8;
        g.moveTo(x - sz, y - sz).lineTo(x + sz, y + sz).stroke({ color: 0xee4488, width: 3, alpha: 0.9 });
        g.moveTo(x + sz, y - sz).lineTo(x - sz, y + sz).stroke({ color: 0xee4488, width: 3, alpha: 0.9 });
      } else if (p.type === "impact") {
        // Impact burst — shockwave ring
        const ip = 0.7 + 0.3 * Math.sin(Date.now() / 80);
        g.circle(x, y, 9 * ip).fill({ color: 0xff6644, alpha: 0.8 });
        g.circle(x, y, 14 * ip).stroke({ color: 0xffaa66, width: 2, alpha: 0.5 });
      } else if (p.type === "chain_proj") {
        // Spear chain — chain link series
        const cp = 0.7 + 0.3 * Math.sin(Date.now() / 100);
        g.circle(x, y, 5).fill({ color: 0xffee44, alpha: 0.9 });
        g.circle(x, y, 8).stroke({ color: 0xcccc00, width: 2, alpha: 0.6 * cp });
      } else if (p.type === "cryo_proj") {
        // Cryo lance — ice lance spike
        g.rect(x - 3, y - 14, 6, 14).fill({ color: 0xaaeeff, alpha: 0.9 });
        g.circle(x, y - 15, 4).fill({ color: 0xeeffff, alpha: 0.8 });
      } else if (p.type === "ring_slice") {
        // Ring blade — spinning metallic ring
        const ra = Date.now() / 100;
        g.circle(x, y, 10).stroke({ color: 0xeeee22, width: 3, alpha: 0.9 });
        g.circle(x + Math.cos(ra) * 5, y + Math.sin(ra) * 5, 3).fill({ color: 0xffffff, alpha: 0.8 });
      } else if (p.type === "portal_burst") {
        // Portal strike — electric void circle
        const pa = 0.6 + 0.4 * Math.sin(Date.now() / 120);
        g.circle(x, y, 12 * pa).fill({ color: 0x220044, alpha: 0.8 });
        g.circle(x, y, 16 * pa).stroke({ color: 0x8822ff, width: 3, alpha: 0.7 * pa });
      } else if (p.type === "fireball") {
        // Dragon fireball — rolling flaming ball
        const fp = 0.7 + 0.3 * Math.sin(Date.now() / 60);
        g.circle(x, y, 9).fill({ color: 0xff4400, alpha: 0.9 });
        g.circle(x, y, 13).fill({ color: 0xff8800, alpha: 0.5 * fp });
        g.circle(x, y, 17).stroke({ color: 0xffcc00, width: 1, alpha: 0.3 * fp });
      } else if (p.type === "inferno_burst") {
        // Inferno slam — ground fire zone
        g.circle(x, y, 14).fill({ color: 0xff2200, alpha: 0.7 });
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2 + Date.now() / 300;
          g.moveTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14)
            .lineTo(x + Math.cos(a) * 20, y + Math.sin(a) * 20)
            .stroke({ color: 0xff6600, width: 3, alpha: 0.6 });
        }
      // ── Defensive buff visuals ───────────────────────
      } else if (p.type === "harden_shield") {
        // Harden — steel blue diamond shield
        const hs = 12;
        g.moveTo(x, y - hs).lineTo(x + hs, y).lineTo(x, y + hs).lineTo(x - hs, y).lineTo(x, y - hs)
          .fill({ color: 0x8899cc, alpha: 0.6 });
        g.moveTo(x, y - hs).lineTo(x + hs, y).lineTo(x, y + hs).lineTo(x - hs, y).lineTo(x, y - hs)
          .stroke({ color: 0xaabbdd, width: 2, alpha: 0.8 });
      } else if (p.type === "weather_icon") {
        // Weather/terrain indicator — colored cloud puff
        g.circle(x, y, 8).fill({ color, alpha: 0.5 });
        g.circle(x - 5, y + 3, 5).fill({ color, alpha: 0.4 });
        g.circle(x + 5, y + 3, 5).fill({ color, alpha: 0.4 });
      } else if (p.type === "uppercut_trail") {
        // Uppercut — upward energy trail
        g.rect(x - 4, y - 14, 8, 14).fill({ color: 0xff88cc, alpha: 0.7 });
        g.circle(x, y - 16, 6).fill({ color: 0xffccee, alpha: 0.8 });
      } else if (p.type === "drain_proj") {
        // Drain sting — green parasite beam
        const dp = 0.7 + 0.3 * Math.sin(Date.now() / 120);
        g.circle(x, y, 5).fill({ color: 0x66cc44, alpha: 0.9 * dp });
        g.circle(x, y, 8).stroke({ color: 0x44aa22, width: 1.5, alpha: 0.5 * dp });
      } else if (p.type === "fairy_orb") {
        // Moonblast / dazzling gleam — sparkly pastel orb
        const fp2 = 0.7 + 0.3 * Math.sin(Date.now() / 180);
        g.circle(x, y, 7).fill({ color: 0xffccff, alpha: 0.85 * fp2 });
        g.circle(x, y, 11).stroke({ color: 0xffffff, width: 1.5, alpha: 0.5 * fp2 });
        for (let s = 0; s < 4; s++) {
          const a = (s / 4) * Math.PI * 2 + Date.now() / 300;
          g.circle(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 2).fill({ color: 0xffeecc, alpha: 0.6 });
        }
      } else if (p.type === "hadoken_orb") {
        // Hadoken — blue energy sphere with rotating ring
        const hp = 0.8 + 0.2 * Math.sin(Date.now() / 100);
        g.circle(x, y, 9).fill({ color: 0x4488ff, alpha: 0.9 * hp });
        g.circle(x, y, 13).stroke({ color: 0xaaccff, width: 2, alpha: 0.6 * hp });
        g.circle(x, y, 4).fill({ color: 0xffffff, alpha: 0.7 });
      } else if (p.type === "shoryuken_trail") {
        // Shoryuken — orange rising energy trail
        g.rect(x - 5, y - 18, 10, 18).fill({ color: 0xff7722, alpha: 0.7 });
        g.circle(x, y - 20, 7).fill({ color: 0xffcc88, alpha: 0.85 });
        g.circle(x, y - 20, 11).stroke({ color: 0xff4400, width: 1.5, alpha: 0.4 });
      } else if (p.type === "sonic_boom_blade") {
        // Sonic Boom — horizontal compressed air slash
        const sbp = 0.7 + 0.3 * Math.sin(Date.now() / 80);
        g.rect(x - 18, y - 3, 36, 6).fill({ color: 0xaaddff, alpha: 0.8 * sbp });
        g.rect(x - 14, y - 1, 28, 2).fill({ color: 0xffffff, alpha: 0.6 * sbp });
      } else if (p.type === "spiral_drill_proj") {
        // Spiral Drill — spinning corkscrew
        const sda = Date.now() / 80;
        for (let i = 0; i < 3; i++) {
          const sa = sda + (i / 3) * Math.PI * 2;
          g.circle(x + Math.cos(sa) * 6, y + Math.sin(sa) * 6, 3).fill({ color: 0xff44aa, alpha: 0.8 });
        }
        g.circle(x, y, 5).fill({ color: 0xffaadd, alpha: 0.6 });
      } else if (p.type === "tensa_beam") {
        // Tensa Zangetsu — dark compressed beam
        const tb = 0.85 + 0.15 * Math.sin(Date.now() / 60);
        g.rect(x - 4, y - 40, 8, 40).fill({ color: 0x1a1a3a, alpha: 0.95 * tb });
        g.rect(x - 2, y - 40, 4, 40).fill({ color: 0x6644aa, alpha: 0.7 * tb });
      } else if (p.type === "senbonzakura_petal") {
        // Senbonzakura — pink floating petal
        const sa2 = Date.now() / 200;
        g.rect(x - 2, y - 5, 4, 10).fill({ color: 0xffaacc, alpha: 0.85 });
        g.circle(x + Math.cos(sa2) * 2, y + Math.sin(sa2) * 2, 2).fill({ color: 0xffffff, alpha: 0.6 });
      } else if (p.type === "daiguren_front") {
        // Daiguren — expanding ice dragon freeze ring
        const dg = 0.6 + 0.4 * Math.sin(Date.now() / 150);
        g.circle(x, y, (p.radius ?? 30)).stroke({ color: 0x88ddff, width: 4, alpha: 0.7 * dg });
        g.circle(x, y, (p.radius ?? 30) * 0.6).fill({ color: 0xccf5ff, alpha: 0.2 * dg });
      } else if (p.type === "absolute_zero_ring") {
        // Absolute Zero — white freeze pulse
        const azp = 0.9 + 0.1 * Math.sin(Date.now() / 50);
        g.circle(x, y, 20).fill({ color: 0xeefaff, alpha: 0.5 * azp });
        g.circle(x, y, 20).stroke({ color: 0xffffff, width: 3, alpha: 0.8 * azp });
      } else if (p.type === "muken_cloud") {
        // Muken Poison — expanding purple-green toxic cloud
        const mp = 0.5 + 0.3 * Math.sin(Date.now() / 200);
        g.circle(x, y, (p.radius ?? 30)).fill({ color: 0x55cc44, alpha: 0.25 * mp });
        g.circle(x, y, (p.radius ?? 30)).stroke({ color: 0x33aa22, width: 2, alpha: 0.4 * mp });
      } else if (p.type === "zanka_field") {
        // Zanka Incinerate — scorched earth fire field
        const zp = 0.6 + 0.4 * Math.sin(Date.now() / 100);
        g.circle(x, y, (p.radius ?? 40)).fill({ color: 0xff3300, alpha: 0.3 * zp });
        for (let i = 0; i < 4; i++) {
          const za = (i / 4) * Math.PI * 2 + Date.now() / 200;
          g.circle(x + Math.cos(za) * 20, y + Math.sin(za) * 20, 5).fill({ color: 0xff8800, alpha: 0.7 * zp });
        }
      } else if (p.type === "rasengan_sphere") {
        // Rasengan — spinning chakra sphere
        const rp = Date.now() / 60;
        g.circle(x, y, 14).fill({ color: 0x44aaff, alpha: 0.85 });
        for (let i = 0; i < 5; i++) {
          const ra = rp + (i / 5) * Math.PI * 2;
          g.circle(x + Math.cos(ra) * 10, y + Math.sin(ra) * 10, 3).fill({ color: 0xffffff, alpha: 0.7 });
        }
      } else if (p.type === "chidori_bolt") {
        // Chidori — electric lightning thrust
        const cp2 = 0.7 + 0.3 * Math.sin(Date.now() / 50);
        g.rect(x - 3, y - 25, 6, 25).fill({ color: 0x88ccff, alpha: 0.9 * cp2 });
        g.circle(x, y - 26, 5).fill({ color: 0xffffff, alpha: 0.8 * cp2 });
        for (let i = 0; i < 3; i++) {
          const ca = (Math.random() - 0.5) * 20;
          g.rect(x + ca - 1, y - 25 + i * 8, 2, 6).fill({ color: 0xaaddff, alpha: 0.6 });
        }
      } else if (p.type === "sand_cage") {
        // Sand Burial — swirling sand cage
        const scp = Date.now() / 150;
        g.circle(x, y, (p.radius ?? 40)).stroke({ color: 0xddaa44, width: 3, alpha: 0.6 });
        for (let i = 0; i < 6; i++) {
          const sa3 = scp + (i / 6) * Math.PI * 2;
          g.circle(x + Math.cos(sa3) * (p.radius ?? 40) * 0.8, y + Math.sin(sa3) * (p.radius ?? 40) * 0.8, 4).fill({ color: 0xcc9933, alpha: 0.7 });
        }
      } else if (p.type === "amaterasu_flame") {
        // Amaterasu — black flame field
        const ap = 0.8 + 0.2 * Math.sin(Date.now() / 120);
        g.circle(x, y, (p.radius ?? 25)).fill({ color: 0x111111, alpha: 0.85 * ap });
        g.circle(x, y, (p.radius ?? 25)).stroke({ color: 0x330000, width: 2, alpha: 0.6 * ap });
      } else if (p.type === "susanoo_shield") {
        // Susanoo — blue armored shield aura
        const sp2 = 0.6 + 0.4 * Math.sin(Date.now() / 300);
        g.circle(x, y, (p.radius ?? 60)).stroke({ color: 0x2244aa, width: 5, alpha: 0.7 * sp2 });
        g.circle(x, y, (p.radius ?? 60)).fill({ color: 0x1133bb, alpha: 0.15 * sp2 });
      } else if (p.type === "shuriken_proj") {
        // Shadow Shuriken — spinning dark star
        const shp = Date.now() / 100;
        for (let i = 0; i < 4; i++) {
          const sha = shp + (i / 4) * Math.PI * 2;
          g.rect(x + Math.cos(sha) * 4 - 1, y + Math.sin(sha) * 4 - 3, 2, 6).fill({ color: 0x334433, alpha: 0.9 });
        }
        g.circle(x, y, 3).fill({ color: 0x888866, alpha: 0.8 });
      } else if (p.type === "kunai_proj") {
        // Kunai — narrow metallic dart
        g.rect(x - 1, y - 10, 2, 10).fill({ color: 0x888866, alpha: 0.9 });
        g.circle(x, y - 11, 2).fill({ color: 0xccccaa, alpha: 0.8 });
      } else if (p.type === "smoke_cloud") {
        // Smoke Bomb — opaque grey-green cloud
        const smp = 0.4 + 0.2 * Math.sin(Date.now() / 250);
        g.circle(x, y, (p.radius ?? 35)).fill({ color: 0x99aa88, alpha: 0.45 * smp });
        g.circle(x, y, (p.radius ?? 35)).stroke({ color: 0x778866, width: 2, alpha: 0.3 * smp });
      } else if (p.type === "wire_line") {
        // Wire Trap — thin tether line
        g.rect(x - 1, y, 2, (p.length ?? 30)).fill({ color: 0x887744, alpha: 0.7 });
        g.circle(x, y + (p.length ?? 30), 4).fill({ color: 0xccaa55, alpha: 0.6 });
      } else if (p.type === "exploding_tag_mine") {
        // Exploding Tag — glowing orange mine
        const etp = 0.7 + 0.3 * Math.sin(Date.now() / 300);
        g.rect(x - 6, y - 6, 12, 12).fill({ color: 0xff8800, alpha: 0.8 * etp });
        g.rect(x - 6, y - 6, 12, 12).stroke({ color: 0xffcc00, width: 1.5, alpha: 0.6 * etp });
        g.circle(x, y, 3).fill({ color: 0xff0000, alpha: 0.9 });
      } else if (p.type === "devil_beam_ray") {
        // Devil Beam — purple eye laser
        const dbp = 0.85 + 0.15 * Math.sin(Date.now() / 70);
        g.rect(x - 5, y - 50, 10, 50).fill({ color: 0x8800cc, alpha: 0.9 * dbp });
        g.rect(x - 2, y - 50, 4, 50).fill({ color: 0xcc88ff, alpha: 0.7 * dbp });
      } else if (p.type === "wind_god_trail") {
        // Wind God Fist — electric rising fist arc
        const wgp = 0.7 + 0.3 * Math.sin(Date.now() / 90);
        g.circle(x, y, 12).fill({ color: 0x4488ff, alpha: 0.8 * wgp });
        for (let i = 0; i < 4; i++) {
          const wa = (i / 4) * Math.PI * 2 + Date.now() / 200;
          g.rect(x + Math.cos(wa) * 10 - 1, y + Math.sin(wa) * 10 - 4, 2, 8).fill({ color: 0xaaccff, alpha: 0.6 * wgp });
        }
      } else if (p.type === "laser_scraper_beam") {
        // Laser Scraper — sweeping cyan energy arc
        const lsp = 0.8 + 0.2 * Math.sin(Date.now() / 60);
        g.rect(x - 2, y - 45, 4, 45).fill({ color: 0x00ffcc, alpha: 0.9 * lsp });
        g.rect(x - 1, y - 45, 2, 45).fill({ color: 0xffffff, alpha: 0.5 * lsp });
      } else if (p.type === "bankai_pulse") {
        // Bankai Release — dark expanding energy pulse
        const bp2 = 0.7 + 0.3 * Math.sin(Date.now() / 120);
        g.circle(x, y, (p.radius ?? 80)).stroke({ color: 0x222244, width: 6, alpha: 0.8 * bp2 });
        g.circle(x, y, (p.radius ?? 80) * 0.5).fill({ color: 0x4444aa, alpha: 0.15 * bp2 });
      } else if (p.type === "titan_pulse") {
        // Titan Shift — massive AoE damage pulse
        const tp2 = 0.6 + 0.4 * Math.sin(Date.now() / 100);
        g.circle(x, y, (p.radius ?? 100)).stroke({ color: 0xcc4400, width: 7, alpha: 0.75 * tp2 });
        g.circle(x, y, (p.radius ?? 100)).fill({ color: 0xff6600, alpha: 0.1 * tp2 });
      } else if (p.type === "toad_slam") {
        // Summon Toad — massive impact shockwave
        const tsp = 0.8 + 0.2 * Math.sin(Date.now() / 80);
        g.circle(x, y, (p.radius ?? 100)).stroke({ color: 0x448833, width: 8, alpha: 0.8 * tsp });
        g.circle(x, y, (p.radius ?? 100) * 0.3).fill({ color: 0x66cc44, alpha: 0.4 * tsp });
      } else if (p.type === "eagle_dive") {
        // Summon Eagle — dive bomb AoE
        const ep = 0.75 + 0.25 * Math.sin(Date.now() / 150);
        g.circle(x, y, (p.radius ?? 60)).stroke({ color: 0xaaaa66, width: 4, alpha: 0.7 * ep });
        g.circle(x, y, 8).fill({ color: 0xddcc88, alpha: 0.9 * ep });
      } else if (p.type === "twin_bullet") {
        // Twin Pistols — metallic bullet
        g.circle(x, y, 4).fill({ color: 0xdddddd, alpha: 0.9 });
        g.circle(x, y, 4).stroke({ color: 0xffffff, width: 1, alpha: 0.5 });
      } else if (p.type === "hihio_line") {
        // Hihio Construct — bone-snake line sweep
        g.rect(x - 3, y, 6, (p.length ?? 40)).fill({ color: 0xcc8844, alpha: 0.8 });
        for (let i = 0; i < 3; i++) {
          g.circle(x, y + (p.length ?? 40) * ((i + 0.5) / 3), 4).fill({ color: 0xddaa66, alpha: 0.6 });
        }
      } else if (p.type === "time_ring") {
        // Time-based moves — clock ring with glow
        const tp = 0.6 + 0.4 * Math.sin(Date.now() / 200);
        g.circle(x, y, (p.radius ?? 30)).stroke({ color: 0x99aaff, width: 3, alpha: 0.8 * tp });
        g.circle(x, y, 5).fill({ color: 0xffffff, alpha: 0.7 * tp });
      } else if (p.type === "time_freeze_field") {
        // Time Stop — icy blue frozen field
        const tfp = 0.5 + 0.3 * Math.sin(Date.now() / 300);
        g.circle(x, y, (p.radius ?? 80)).fill({ color: 0xddddff, alpha: 0.3 * tfp });
        g.circle(x, y, (p.radius ?? 80)).stroke({ color: 0xaaaaff, width: 4, alpha: 0.7 * tfp });
      } else if (p.type === "cero_beam") {
        // Cero — red/crimson energy beam
        const cp3 = 0.85 + 0.15 * Math.sin(Date.now() / 60);
        g.rect(x - 6, y - 50, 12, 50).fill({ color: 0xcc2244, alpha: 0.9 * cp3 });
        g.rect(x - 3, y - 50, 6, 50).fill({ color: 0xff88aa, alpha: 0.6 * cp3 });
      } else if (p.type === "cero_oscuras_beam") {
        // Cero Oscuras — absolute black void beam
        const cop = 0.9 + 0.1 * Math.sin(Date.now() / 50);
        g.rect(x - 8, y - 60, 16, 60).fill({ color: 0x110011, alpha: 0.95 * cop });
        g.rect(x - 3, y - 60, 6, 60).fill({ color: 0x440044, alpha: 0.5 * cop });
      } else if (p.type === "bala_pellet") {
        // Bala — rapid energy pellet
        g.circle(x, y, 4).fill({ color: 0xff4466, alpha: 0.9 });
      } else if (p.type === "lanza_spear") {
        // Lanza del Relámpago — yellow spear
        const lp = 0.8 + 0.2 * Math.sin(Date.now() / 80);
        g.rect(x - 3, y - 30, 6, 30).fill({ color: 0xddff00, alpha: 0.9 * lp });
        g.circle(x, y - 32, 6).fill({ color: 0xffffff, alpha: 0.7 * lp });
      } else if (p.type === "santa_teresa_wave") {
        // Santa Teresa — blue water surge
        const swp = 0.7 + 0.3 * Math.sin(Date.now() / 130);
        g.rect(x - (p.width ?? 60), y - 8, (p.width ?? 60) * 2, 16).fill({ color: 0x2255cc, alpha: 0.7 * swp });
        g.rect(x - (p.width ?? 60) * 0.7, y - 4, (p.width ?? 60) * 1.4, 8).fill({ color: 0x88aaff, alpha: 0.5 * swp });
      } else if (p.type === "kido_sphere") {
        // Kido Hadō spells — glowing energy sphere
        const kp = 0.8 + 0.2 * Math.sin(Date.now() / 100);
        g.circle(x, y, 10).fill({ color: color, alpha: 0.85 * kp });
        g.circle(x, y, 14).stroke({ color: 0xffffff, width: 1.5, alpha: 0.4 * kp });
      } else if (p.type === "kido_coffin") {
        // Kurohitsugi — dark black box
        const kcp = 0.7 + 0.3 * Math.sin(Date.now() / 150);
        g.rect(x - 16, y - 20, 32, 40).fill({ color: 0x221133, alpha: 0.85 * kcp });
        g.rect(x - 16, y - 20, 32, 40).stroke({ color: 0x8844aa, width: 2, alpha: 0.6 * kcp });
      } else if (p.type === "getsuga_arc") {
        // Getsuga Tensho — dark blue crescent arc
        const gtp = 0.8 + 0.2 * Math.sin(Date.now() / 90);
        g.circle(x, y, (p.radius ?? 60)).stroke({ color: 0x2233aa, width: 6, alpha: 0.8 * gtp });
        g.circle(x, y, (p.radius ?? 60) * 0.6).fill({ color: 0x1122aa, alpha: 0.2 * gtp });
      } else if (p.type === "mugetsu_strip") {
        // Mugetsu — total black energy strip
        const mp3 = 0.9 + 0.1 * Math.sin(Date.now() / 40);
        g.rect(x - 6, y - 80, 12, 80).fill({ color: 0x000011, alpha: 0.98 * mp3 });
        g.rect(x - 3, y - 80, 6, 80).fill({ color: 0x220044, alpha: 0.6 * mp3 });
      } else if (p.type === "tsukuyomi_field") {
        // Tsukuyomi — blood-red genjutsu field
        const tkp = 0.4 + 0.3 * Math.sin(Date.now() / 250);
        g.circle(x, y, (p.radius ?? 50)).fill({ color: 0x440022, alpha: 0.6 * tkp });
        g.circle(x, y, (p.radius ?? 50)).stroke({ color: 0xcc2244, width: 3, alpha: 0.5 * tkp });
      } else if (p.type === "crow_swarm") {
        // Crow Genjutsu — dark feather scatter
        for (let i = 0; i < 6; i++) {
          const ca = Date.now() / 100 + (i / 6) * Math.PI * 2;
          const cr = 15 + i * 5;
          g.circle(x + Math.cos(ca) * cr, y + Math.sin(ca) * cr, 2).fill({ color: 0x223322, alpha: 0.7 });
        }
      } else if (p.type === "enlarge_ring") {
        // Enlarge — expanding orange aura ring
        const ep = 0.6 + 0.4 * Math.sin(Date.now() / 200);
        g.circle(x, y, (p.radius ?? 40)).stroke({ color: 0xff9944, width: 5, alpha: 0.8 * ep });
        g.circle(x, y, (p.radius ?? 40)).fill({ color: 0xff9944, alpha: 0.1 * ep });
      } else if (p.type === "shrink_ring") {
        // Shrink — compressed cyan ring
        const sp3 = 0.7 + 0.3 * Math.sin(Date.now() / 150);
        g.circle(x, y, (p.radius ?? 20)).stroke({ color: 0x44ddff, width: 3, alpha: 0.9 * sp3 });
      } else if (p.type === "kyuubi_cloak") {
        // Kyuubi Mode — orange chakra flame cloak
        const kp2 = 0.6 + 0.4 * Math.sin(Date.now() / 80);
        g.circle(x, y, (p.radius ?? 60)).fill({ color: 0xff4400, alpha: 0.35 * kp2 });
        for (let i = 0; i < 6; i++) {
          const ka = (i / 6) * Math.PI * 2 + Date.now() / 150;
          g.circle(x + Math.cos(ka) * (p.radius ?? 60) * 0.9, y + Math.sin(ka) * (p.radius ?? 60) * 0.9, 5).fill({ color: 0xff8800, alpha: 0.7 * kp2 });
        }
      } else if (p.type === "bijuu_aura") {
        // Bijuu Mode — massive beast form aura
        const bp3 = 0.5 + 0.3 * Math.sin(Date.now() / 120);
        g.circle(x, y, (p.radius ?? 90)).fill({ color: 0xff6600, alpha: 0.25 * bp3 });
        g.circle(x, y, (p.radius ?? 90)).stroke({ color: 0xff4400, width: 6, alpha: 0.5 * bp3 });
      } else if (p.type === "bijuudama_sphere") {
        // Tailed Beast Bomb — black+white sphere
        const bts = 0.85 + 0.15 * Math.sin(Date.now() / 60);
        g.circle(x, y, 22).fill({ color: 0x111133, alpha: 0.95 * bts });
        g.circle(x, y, 14).fill({ color: 0xffffff, alpha: 0.6 * bts });
        g.circle(x, y, 22).stroke({ color: 0x8888ff, width: 2, alpha: 0.5 * bts });
      } else if (p.type === "curse_wings") {
        // Curse Mark 2 — dark purple wing silhouettes
        const cwp = 0.7 + 0.3 * Math.sin(Date.now() / 180);
        g.rect(x - 20, y - 5, 18, 10).fill({ color: 0x330022, alpha: 0.8 * cwp });
        g.rect(x + 2, y - 5, 18, 10).fill({ color: 0x330022, alpha: 0.8 * cwp });
      } else if (p.type === "clay_piece") {
        // Deidara clay — beige bouncing lump
        g.circle(x, y, 7).fill({ color: 0xddaa55, alpha: 0.9 });
        g.circle(x, y, 7).stroke({ color: 0xcc8833, width: 1.5, alpha: 0.6 });
      } else if (p.type === "clay_explosion") {
        // Deidara detonation — expanding clay blast
        const ce = 0.8 + 0.2 * Math.sin(Date.now() / 60);
        g.circle(x, y, (p.radius ?? 50)).fill({ color: 0xcc5500, alpha: 0.5 * ce });
        g.circle(x, y, (p.radius ?? 50)).stroke({ color: 0xff8800, width: 4, alpha: 0.8 * ce });
      } else if (p.type === "shinra_wave") {
        // Shinra Tensei — outward gravity wave ring
        const sw = 0.7 + 0.3 * Math.sin(Date.now() / 80);
        g.circle(x, y, (p.radius ?? 80)).stroke({ color: 0xaaccff, width: 5, alpha: 0.8 * sw });
        g.circle(x, y, (p.radius ?? 80) * 0.5).stroke({ color: 0xffffff, width: 2, alpha: 0.4 * sw });
      } else if (p.type === "chibaku_sphere") {
        // Chibaku Tensei — dark gravity orb
        const cs = 0.7 + 0.3 * Math.sin(Date.now() / 100);
        g.circle(x, y, 18).fill({ color: 0x222266, alpha: 0.9 * cs });
        g.circle(x, y, 24).stroke({ color: 0x4444aa, width: 3, alpha: 0.6 * cs });
      } else if (p.type === "kamui_vortex") {
        // Kamui — dimensional spiral vortex
        const kv = Date.now() / 80;
        for (let i = 0; i < 6; i++) {
          const ka = kv + (i / 6) * Math.PI * 2;
          const kr = 8 + i * 3;
          g.circle(x + Math.cos(ka) * kr, y + Math.sin(ka) * kr, 3).fill({ color: 0x003355, alpha: 0.8 });
        }
        g.circle(x, y, 6).fill({ color: 0x0077aa, alpha: 0.9 });
      } else if (p.type === "wood_tendrils") {
        // Wood Dragon — green wooden tendrils
        for (let i = 0; i < 4; i++) {
          const wa = (i / 4) * Math.PI * 2 + Date.now() / 300;
          g.rect(x + Math.cos(wa) * 8 - 2, y + Math.sin(wa) * 8 - 8, 4, 18).fill({ color: 0x335522, alpha: 0.8 });
        }
      } else if (p.type === "paper_storm_shred") {
        // Konan paper storm — scattered white rectangles
        for (let i = 0; i < 8; i++) {
          const pa = (i / 8) * Math.PI * 2 + Date.now() / 120;
          const pr = 10 + i * 4;
          g.rect(x + Math.cos(pa) * pr - 2, y + Math.sin(pa) * pr - 4, 4, 8).fill({ color: 0xffeedd, alpha: 0.85 });
        }
      } else if (p.type === "hollow_mask") {
        // Full hollow transform — white hollow mask flash
        const hp = 0.7 + 0.3 * Math.sin(Date.now() / 100);
        g.circle(x, y, 14).fill({ color: 0xffffff, alpha: 0.8 * hp });
        g.circle(x, y, 10).fill({ color: 0x000000, alpha: 0.3 * hp });
      } else if (p.type === "rasengan_sphere") {
        // Duplicate guard handled above — this entry is a fallthrough
        const rp = Date.now() / 60;
        g.circle(x, y, 14).fill({ color: 0x44aaff, alpha: 0.85 });
        for (let i = 0; i < 5; i++) {
          const ra = rp + (i / 5) * Math.PI * 2;
          g.circle(x + Math.cos(ra) * 10, y + Math.sin(ra) * 10, 3).fill({ color: 0xffffff, alpha: 0.7 });
        }
      } else if (p.type === "spiral_vortex") {
        // Spiral Eye — concentric rotating rings converging to center
        const sv = Date.now() / 70;
        for (let i = 0; i < 4; i++) {
          const sr = 6 + i * 10;
          const sa = sv + (i / 4) * Math.PI * 2;
          g.circle(x + Math.cos(sa) * sr * 0.3, y + Math.sin(sa) * sr * 0.3, 3 + i).stroke({ color: 0x0077cc, width: 2, alpha: 0.85 - i * 0.15 });
        }
        g.circle(x, y, 5).fill({ color: 0x00aaff, alpha: 0.95 });
      } else if (p.type === "phantom_shimmer") {
        // Phantom Pass — ghostly fading shimmer
        const pp = 0.5 + 0.5 * Math.sin(Date.now() / 80);
        g.circle(x, y, 16).fill({ color: 0xaaeeff, alpha: 0.35 * pp });
        g.circle(x, y, 12).stroke({ color: 0xffffff, width: 2, alpha: 0.7 * pp });
      } else if (p.type === "zetsu_wrap") {
        // Black Zetsu Bind — dark writhing tendrils
        const zw = Date.now() / 150;
        for (let i = 0; i < 5; i++) {
          const za = zw + (i / 5) * Math.PI * 2;
          const zr = 6 + i * 3;
          g.circle(x + Math.cos(za) * zr, y + Math.sin(za) * zr, 2).fill({ color: 0x111133, alpha: 0.9 });
        }
        g.circle(x, y, 5).fill({ color: 0x2222aa, alpha: 0.8 });
      } else if (p.type === "orb_sphere") {
        // Truth-Seeking Orbs — black metallic sphere with golden ring
        g.circle(x, y, 8).fill({ color: 0x111100, alpha: 0.95 });
        g.circle(x, y, 10).stroke({ color: 0x888833, width: 2, alpha: 0.8 });
        g.circle(x, y, 13).stroke({ color: 0xaaaa55, width: 1, alpha: 0.4 });
      } else if (p.type === "bansho_wave") {
        // Bansho Tenin — inward gravity ring
        const bw = 0.7 + 0.3 * Math.sin(Date.now() / 90);
        g.circle(x, y, (p.radius ?? 70)).stroke({ color: 0x88aadd, width: 4, alpha: 0.7 * bw });
        g.circle(x, y, (p.radius ?? 70) * 0.4).stroke({ color: 0xaaccff, width: 2, alpha: 0.5 * bw });
      } else if (p.type === "soul_rip_beam") {
        // Human Path — dark red soul extraction beam
        const sp = Date.now() / 60;
        for (let i = 0; i < 3; i++) {
          const sa2 = sp + (i / 3) * Math.PI * 2;
          g.circle(x + Math.cos(sa2) * 6, y + Math.sin(sa2) * 6, 3).fill({ color: 0x992222, alpha: 0.85 });
        }
        g.circle(x, y, 7).fill({ color: 0xff2222, alpha: 0.9 });
      } else if (p.type === "preta_shield") {
        // Preta Path — blue absorption bubble
        const pr2 = 0.6 + 0.4 * Math.sin(Date.now() / 120);
        g.circle(x, y, 18).stroke({ color: 0x2244aa, width: 3, alpha: 0.75 * pr2 });
        g.circle(x, y, 14).fill({ color: 0x3366cc, alpha: 0.25 * pr2 });
      } else if (p.type === "asura_missile") {
        // Asura Path — orange mechanical missile
        g.rect(x - 3, y - 8, 6, 16).fill({ color: 0xcc8833, alpha: 0.95 });
        g.circle(x, y + 8, 4).fill({ color: 0xff6600, alpha: 0.8 });
      } else if (p.type === "ftg_flash") {
        // Flying Thunder God — yellow teleport flash marker
        const ft = 0.6 + 0.4 * Math.sin(Date.now() / 50);
        g.circle(x, y, 14).fill({ color: 0xffff22, alpha: 0.8 * ft });
        for (let i = 0; i < 4; i++) {
          const fa = (i / 4) * Math.PI * 2 + Date.now() / 100;
          g.rect(x + Math.cos(fa) * 12 - 1, y + Math.sin(fa) * 12 - 5, 2, 10).fill({ color: 0xffffff, alpha: 0.7 * ft });
        }
      } else if (p.type === "wind_shuriken") {
        // Rasenshuriken — spinning cyan wind star
        const ws = Date.now() / 40;
        for (let i = 0; i < 4; i++) {
          const wa = ws + (i / 4) * Math.PI * 2;
          g.rect(x + Math.cos(wa) * 6 - 2, y + Math.sin(wa) * 6 - 8, 4, 16).fill({ color: 0x88ccff, alpha: 0.85 });
        }
        g.circle(x, y, 6).fill({ color: 0xffffff, alpha: 0.9 });
      } else if (p.type === "sage_aura") {
        // Sage Mode — green toad sage energy ring
        const sa = 0.6 + 0.4 * Math.sin(Date.now() / 200);
        g.circle(x, y, 20).stroke({ color: 0x557733, width: 3, alpha: 0.7 * sa });
        g.circle(x, y, 12).fill({ color: 0x88aa55, alpha: 0.25 * sa });
      } else if (p.type === "gates_aura") {
        // Eight Gates — burning red energy rings
        const ga = Date.now() / 60;
        for (let i = 0; i < 3; i++) {
          const gr = 8 + i * 6;
          g.circle(x, y, gr).stroke({ color: i === 0 ? 0xff2200 : 0xff6600, width: 2, alpha: 0.8 - i * 0.2 });
        }
        g.circle(x, y, 5).fill({ color: 0xff0000, alpha: 0.95 });
        const gf = Math.sin(ga * 3);
        g.circle(x + gf * 2, y, 3).fill({ color: 0xffffff, alpha: 0.6 });
      } else if (p.type === "meteor_shadow") {
        // Tengai Shinsei — dark falling rock shadow
        const ms = 0.6 + 0.4 * Math.sin(Date.now() / 150);
        g.circle(x, y, 22).fill({ color: 0x553300, alpha: 0.6 * ms });
        g.circle(x, y, 14).fill({ color: 0x331100, alpha: 0.8 * ms });
        g.circle(x, y, 6).fill({ color: 0xaa6600, alpha: 0.9 });
      } else if (p.type === "bone_spear") {
        // Kaguya Ash Bones — white bone spike
        g.rect(x - 2, y - 12, 4, 24).fill({ color: 0xddddcc, alpha: 0.95 });
        g.circle(x, y - 12, 3).fill({ color: 0xffffff, alpha: 0.9 });
      } else if (p.type === "hypno_spiral") {
        // Kyoka Suigetsu — rotating purple hypnosis spiral (shown on turret or cast point)
        const hs = Date.now() / 80;
        for (let i = 0; i < 5; i++) {
          const ha = hs + (i / 5) * Math.PI * 2;
          const hr = 4 + i * 4;
          g.circle(x + Math.cos(ha) * hr, y + Math.sin(ha) * hr, 3).fill({ color: 0x9955cc, alpha: 0.8 - i * 0.1 });
        }
      } else if (p.type === "kyoka_ghost") {
        // Kyoka Suigetsu ghost — pulsing translucent bey shadow at false position
        const kg = 0.4 + 0.3 * Math.sin(Date.now() / 90);
        g.circle(x, y, (p.radius ?? 18)).fill({ color: 0x9955cc, alpha: 0.25 * kg });
        g.circle(x, y, (p.radius ?? 18)).stroke({ color: 0xcc88ff, width: 2, alpha: 0.55 * kg });
        // inner shimmer
        const ks = Date.now() / 60;
        for (let i = 0; i < 3; i++) {
          const ka = ks + (i / 3) * Math.PI * 2;
          g.circle(x + Math.cos(ka) * 6, y + Math.sin(ka) * 6, 3).fill({ color: 0xffffff, alpha: 0.3 * kg });
        }
      } else if (p.type === "decay_cloud") {
        // Respira — brownish aging cloud
        const dc = 0.5 + 0.4 * Math.sin(Date.now() / 180);
        g.circle(x, y, (p.radius ?? 18)).fill({ color: 0x663300, alpha: 0.4 * dc });
        g.circle(x, y, (p.radius ?? 18)).stroke({ color: 0x884400, width: 2, alpha: 0.6 * dc });
      } else if (p.type === "claw_arc") {
        // Desgarron — 5 parallel blue claw arcs
        for (let i = 0; i < 5; i++) {
          const ca = -Math.PI / 4 + (i / 5) * Math.PI / 2;
          const cr = 14 + i * 4;
          g.arc(x, y, cr, ca - 0.3, ca + 0.3).stroke({ color: 0x0099dd, width: 3, alpha: 0.85 });
        }
      } else if (p.type === "kame_beam") {
        // Kamehameha — blue energy beam strip
        const kb2 = 0.8 + 0.2 * Math.sin(Date.now() / 50);
        g.rect(x - 5, y - (p.radius ?? 80), 10, (p.radius ?? 80) * 2).fill({ color: 0x4488ff, alpha: 0.8 * kb2 });
        g.rect(x - 2, y - (p.radius ?? 80), 4, (p.radius ?? 80) * 2).fill({ color: 0xffffff, alpha: 0.5 * kb2 });
      } else if (p.type === "spirit_orb") {
        // Spirit Bomb — glowing white gathering orb
        const so = 0.7 + 0.3 * Math.sin(Date.now() / 120);
        const sr = p.radius ?? 20;
        g.circle(x, y, sr).fill({ color: 0xaaccff, alpha: 0.4 * so });
        g.circle(x, y, sr).stroke({ color: 0xffffff, width: 3, alpha: 0.8 * so });
        g.circle(x, y, sr * 0.5).fill({ color: 0xffffff, alpha: 0.6 * so });
      } else if (p.type === "final_flash_beam") {
        // Final Flash — bright yellow beam
        const ff = 0.8 + 0.2 * Math.sin(Date.now() / 40);
        g.rect(x - 8, y - (p.radius ?? 60), 16, (p.radius ?? 60) * 2).fill({ color: 0xffffaa, alpha: 0.85 * ff });
        g.rect(x - 3, y - (p.radius ?? 60), 6, (p.radius ?? 60) * 2).fill({ color: 0xffffff, alpha: 0.6 * ff });
      } else if (p.type === "death_ray") {
        // Death Beam — thin red piercing ray
        const dr = 0.9 + 0.1 * Math.sin(Date.now() / 30);
        g.rect(x - 2, y - (p.radius ?? 100), 4, (p.radius ?? 100) * 2).fill({ color: 0xcc2222, alpha: 0.9 * dr });
        g.circle(x, y, 4).fill({ color: 0xff4444, alpha: 0.95 });
      } else if (p.type === "illusion_shimmer" || p.type === "mirror_ghost") {
        // Mirror World / ghost duplicate — pulsing translucent purple ring
        const t2 = Date.now() / 500;
        const alpha = 0.3 + 0.2 * Math.sin(t2);
        const r2 = (p.radius ?? 18) * (0.9 + 0.1 * Math.sin(t2 * 1.3));
        g.circle(x, y, r2).fill({ color: 0xcc88ff, alpha });
        g.circle(x, y, r2 + 4).stroke({ color: 0xffffff, width: 1, alpha: alpha * 0.6 });
      } else if (p.type === "mirage_invisible") {
        // Perfect Mirage — faint ghostly white shimmer (target invisible)
        const t2 = Date.now() / 300;
        const alpha = 0.05 + 0.08 * Math.sin(t2);
        g.circle(x, y, p.radius ?? 16).fill({ color: 0xeeeeff, alpha });
      } else if (p.type === "reality_scatter") {
        // Broken Reality — chaotic multi-colored scatter sparks
        const t2 = Date.now() / 120;
        for (let i = 0; i < 5; i++) {
          const ang = (i / 5) * Math.PI * 2 + t2;
          const cx2 = x + Math.cos(ang) * 12;
          const cy2 = y + Math.sin(ang) * 12;
          g.circle(cx2, cy2, 3).fill({ color: [0xff44ff, 0xffaa00, 0x00ff88, 0x4488ff, 0xff4444][i], alpha: 0.9 });
        }
      } else if (p.type === "phantasm_ghost") {
        // Phantasmal Shift — ghostly translucent aura
        const t2 = Date.now() / 400;
        const alpha = 0.2 + 0.15 * Math.sin(t2);
        g.circle(x, y, p.radius ?? 20).fill({ color: 0xaaaaee, alpha });
        g.circle(x, y, (p.radius ?? 20) + 6).stroke({ color: 0xddddff, width: 1, alpha: alpha * 0.5 });
      } else if (p.type === "echo_decoy") {
        // Echo Image — faint blue-grey decoy ring
        const t2 = Date.now() / 600;
        const alpha = 0.4 + 0.15 * Math.sin(t2);
        g.circle(x, y, p.radius ?? 18).stroke({ color: 0x88aacc, width: 2, alpha });
        g.circle(x, y, 4).fill({ color: 0x88aacc, alpha: alpha * 0.8 });
      } else if (p.type === "veil_drift") {
        // Genjutsu Veil — dark purple swirling fog
        const t2 = Date.now() / 700;
        const alpha = 0.25 + 0.1 * Math.sin(t2);
        g.circle(x, y, p.radius ?? 22).fill({ color: 0x553377, alpha });
      } else if (p.type === "false_id") {
        // False Flag — orange identity-swap marker
        const t2 = Date.now() / 300;
        const alpha = 0.7 + 0.3 * Math.sin(t2);
        g.rect(x - 6, y - 2, 12, 4).fill({ color: 0xff8800, alpha });
        g.rect(x - 2, y - 6, 4, 12).fill({ color: 0xff8800, alpha });
      } else if (p.type === "mind_fracture_fx") {
        // Mind Fracture — hot pink cracked aura
        const t2 = Date.now() / 200;
        const alpha = 0.6 + 0.3 * Math.sin(t2);
        g.circle(x, y, (p.radius ?? 18) + 3).stroke({ color: 0xff00aa, width: 2, alpha });
        g.circle(x, y, 5).fill({ color: 0xff00aa, alpha: 0.9 });
      } else if (p.type === "spread_bey_fx") {
        // Spread Bey — golden fan arrow burst
        const t2 = Date.now() / 200;
        const alpha = 0.85 + 0.15 * Math.sin(t2);
        for (let i = -2; i <= 2; i++) {
          const ang = (i * 12) * (Math.PI / 180);
          const len = 20;
          g.moveTo(x, y).lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
          g.stroke({ color: 0xffcc00, width: 2, alpha });
        }
      } else if (p.type === "railbey_trail") {
        // Railbey — cyan speed trail
        const t2 = Date.now() / 100;
        const alpha = 0.8 + 0.2 * Math.sin(t2);
        g.rect(x - 2, y - (p.radius ?? 30), 4, (p.radius ?? 30) * 2).fill({ color: 0x00ffff, alpha: alpha * 0.7 });
        g.circle(x, y, 5).fill({ color: 0x00ffff, alpha: 0.95 });
      } else if (p.type === "minigun_bey_pulse") {
        // Minigun Bey — rapid orange flash pulses
        const t2 = Date.now() / 80;
        const alpha = 0.5 + 0.5 * Math.abs(Math.sin(t2));
        g.circle(x, y, 4).fill({ color: 0xffaa00, alpha });
      } else if (p.type === "heat_seeker_lock") {
        // Heat Seeker Bey — red target reticle
        const r2 = p.radius ?? 16;
        g.circle(x, y, r2).stroke({ color: 0xff4422, width: 2, alpha: 0.9 });
        g.moveTo(x - r2 - 4, y).lineTo(x + r2 + 4, y).stroke({ color: 0xff4422, width: 1, alpha: 0.8 });
        g.moveTo(x, y - r2 - 4).lineTo(x, y + r2 + 4).stroke({ color: 0xff4422, width: 1, alpha: 0.8 });
      } else if (p.type === "bomb_bey_fuse") {
        // Bomb Bey — flashing orange bomb indicator
        const t2 = Date.now() / 300;
        const alpha = 0.5 + 0.5 * Math.abs(Math.sin(t2 * 2));
        g.circle(x, y, p.radius ?? 14).fill({ color: 0xff6600, alpha: alpha * 0.6 });
        g.circle(x, y, p.radius ?? 14).stroke({ color: 0xffaa00, width: 2, alpha });
      } else if (p.type === "shield_bey_bubble") {
        // Shield Bey — green energy shield dome
        const t2 = Date.now() / 500;
        const alpha = 0.4 + 0.2 * Math.sin(t2);
        g.circle(x, y, p.radius ?? 22).fill({ color: 0x00ff88, alpha: alpha * 0.35 });
        g.circle(x, y, p.radius ?? 22).stroke({ color: 0x00ff88, width: 2, alpha });
      } else if (p.type === "turbo_bey_aura") {
        // Turbo Bey — fiery red-orange speed aura
        const t2 = Date.now() / 150;
        const alpha = 0.6 + 0.3 * Math.sin(t2);
        const r2 = (p.radius ?? 20) * (1 + 0.1 * Math.sin(t2 * 2));
        g.circle(x, y, r2).stroke({ color: 0xff2244, width: 3, alpha });
        g.circle(x, y, r2 - 4).fill({ color: 0xff6600, alpha: alpha * 0.3 });
      } else if (p.type === "cannon_launch") {
        // Cannon Bey — dark gold launch trail
        const t2 = Date.now() / 200;
        const alpha = 0.8 + 0.2 * Math.sin(t2);
        g.circle(x, y, 8).fill({ color: 0xddaa00, alpha });
        g.circle(x, y, 14).stroke({ color: 0xffcc44, width: 2, alpha: alpha * 0.6 });
      } else {
        g.circle(x, y, 5).fill({ color, alpha: 0.95 });
        g.circle(x, y, 5).stroke({ color: 0xffffff, width: 1, alpha: 0.4 });
      }
    });
  }

  // ─── Diff sync helpers ──────────────────────────────────────────────────

  private diffSync<T extends { [k: string]: any }>(
    cache: Map<string, PIXI.Graphics>,
    src: Map<string, T> | undefined,
    draw: (item: T, g: PIXI.Graphics) => void,
  ) {
    const seen = new Set<string>();
    if (src) {
      src.forEach((item, id) => {
        seen.add(id);
        let g = cache.get(id);
        if (!g) {
          g = new PIXI.Graphics();
          this.layer.addChild(g);
          cache.set(id, g);
        }
        draw(item, g);
      });
    }
    cache.forEach((g, id) => {
      if (!seen.has(id)) {
        this.layer.removeChild(g);
        g.destroy();
        cache.delete(id);
      }
    });
  }

  private diffSyncContainer<T extends { [k: string]: any }>(
    cache: Map<string, PIXI.Container>,
    src: Map<string, T> | undefined,
    create: (item: T) => PIXI.Container,
    update: (item: T, c: PIXI.Container) => void,
  ) {
    const seen = new Set<string>();
    if (src) {
      src.forEach((item, id) => {
        seen.add(id);
        let c = cache.get(id);
        if (!c) {
          c = create(item);
          this.layer.addChild(c);
          cache.set(id, c);
        }
        update(item, c);
      });
    }
    cache.forEach((c, id) => {
      if (!seen.has(id)) {
        this.layer.removeChild(c);
        c.destroy({ children: true });
        cache.delete(id);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Dashed / animated stroke helpers (Z2a, Z2b)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Z2a: Walk a polyline path and draw alternating solid/gap dashes.
   * @param points  Array of {x,y} in world-px.
   * @param dashPx  Length of each dash in px.
   * @param gapPx   Length of each gap in px.
   * @param offsetPx  Phase offset along path (used for animation).
   */
  static drawDashedPath(
    g: PIXI.Graphics,
    points: Array<{ x: number; y: number }>,
    color: number,
    alpha: number,
    width: number,
    dashPx: number,
    gapPx: number,
    offsetPx = 0,
  ): void {
    const cycle = dashPx + gapPx;
    let distAlong = (-offsetPx % cycle + cycle) % cycle;
    let drawing = distAlong < dashPx;

    for (let i = 1; i < points.length; i++) {
      const ax = points[i - 1].x, ay = points[i - 1].y;
      const bx = points[i].x,     by = points[i].y;
      const segLen = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
      if (segLen < 0.001) continue;
      const ux = (bx - ax) / segLen, uy = (by - ay) / segLen;

      let walked = 0;
      let sx = ax, sy = ay;

      while (walked < segLen) {
        const remaining = drawing ? dashPx - (distAlong % dashPx) : gapPx - (distAlong % gapPx);
        const step = Math.min(remaining, segLen - walked);
        const ex = sx + ux * step, ey = sy + uy * step;

        if (drawing) {
          g.moveTo(sx, sy).lineTo(ex, ey).stroke({ color, width, alpha });
        }
        walked += step;
        distAlong += step;
        sx = ex; sy = ey;

        if (distAlong % cycle < 0.1 || Math.abs(distAlong % cycle - dashPx) < 0.1) {
          drawing = (distAlong % cycle) < dashPx;
        }
        if (step <= 0.001) break;
      }
    }
  }

  /**
   * Z2b: Broken stroke — random gap lengths per segment.
   * @param rand  Seeded random or Math.random.
   */
  static drawBrokenPath(
    g: PIXI.Graphics,
    points: Array<{ x: number; y: number }>,
    color: number,
    alpha: number,
    width: number,
    rand: () => number,
  ): void {
    for (let i = 1; i < points.length; i++) {
      if (rand() > 0.4) {
        g.moveTo(points[i - 1].x, points[i - 1].y)
          .lineTo(points[i].x, points[i].y)
          .stroke({ color, width, alpha });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Feature animation presets (Z3b, Z3c)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Z3b: Apply a named animation preset to a Graphics/Container at `nowMs`.
   * Returns the animated alpha (used by callers to set `g.alpha`).
   */
  static applyAnimationPreset(
    preset: string,
    nowMs: number,
    periodMs = 1200,
    baseColor = 0xffffff,
    intensity = 1.0,
  ): { alpha: number; scaleX: number; scaleY: number; tintColor: number } {
    const t = (nowMs % periodMs) / periodMs; // 0→1 per cycle

    switch (preset) {
      case "pulse":
        return { alpha: 0.5 + 0.5 * Math.sin(t * Math.PI * 2) * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "scale_pulse": {
        const s = 1 + 0.15 * Math.sin(t * Math.PI * 2) * intensity;
        return { alpha: 1, scaleX: s, scaleY: s, tintColor: baseColor };
      }

      case "flicker":
        return { alpha: Math.random() > 0.15 ? 0.85 : 0.2, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "alert": {
        const flash = t < 0.5 ? 1 : 0;
        return { alpha: 0.4 + 0.6 * flash * intensity, scaleX: 1, scaleY: 1, tintColor: 0xff2222 };
      }

      case "shimmer":
        return { alpha: 0.6 + 0.4 * Math.abs(Math.sin(t * Math.PI * 4)) * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "charged": {
        const charge = (nowMs % (periodMs * 3)) / (periodMs * 3);
        return { alpha: 0.3 + 0.7 * charge * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };
      }

      case "ghost":
        return { alpha: 0.1 + 0.4 * Math.abs(Math.sin(t * Math.PI)) * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "color_cycle": {
        const h = (t * 360) | 0;
        const rgb = hslToHex(h, 0.8, 0.6);
        return { alpha: 0.85 * intensity, scaleX: 1, scaleY: 1, tintColor: rgb };
      }

      default:
        return { alpha: 1, scaleX: 1, scaleY: 1, tintColor: baseColor };
    }
  }

  /**
   * Z3c: Default animation preset per floor hazard type.
   * Used when a zone doesn't have an explicit `featureAnimation` field.
   */
  static defaultAnimationForHazard(hazardType: string): string | null {
    const defaults: Record<string, string> = {
      lava:         "pulse",
      electric:     "lightning",
      void:         "shockwave_ring",
      trampoline:   "scale_pulse",
      drain:        "ghost",
      combo_boost:  "shimmer",
      ice:          "shimmer",
    };
    return defaults[hazardType] ?? null;
  }

  /**
   * Z3c: Default animation preset per effect zone type.
   */
  static defaultAnimationForEffect(effectType: string): string | null {
    const defaults: Record<string, string> = {
      safe_zone:      "shimmer",
      power_charge:   "charged",
      spin_recovery:  "pulse",
      turbo_zone:     "alert",
      respawn_point:  "scale_pulse",
    };
    return defaults[effectType] ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Animated direction arrows on speed paths (Z6c)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draw animated arrow dots moving along a circular speed path.
   * Called each frame inside syncLoops (when showDirectionArrows is set).
   */
  private drawDirectionArrows(
    g: PIXI.Graphics,
    cx: number,
    cy: number,
    r: number,
    nowMs: number,
    arrowSpeedCmPerSec = 8,
    arrowSpacingCm = 6,
    arrowColor = 0xffffff,
  ): void {
    const circumferencePx = r * 2 * Math.PI;
    const spacingPx = arrowSpacingCm * PX_PER_CM_BASE;
    const arrowCount = Math.max(1, Math.floor(circumferencePx / spacingPx));
    const speedPx = arrowSpeedCmPerSec * PX_PER_CM_BASE;
    const phaseOffset = (nowMs / 1000) * speedPx;

    for (let i = 0; i < arrowCount; i++) {
      const pos = ((i / arrowCount) * circumferencePx + phaseOffset) % circumferencePx;
      const angle = (pos / r) - Math.PI / 2;
      const ax = cx + Math.cos(angle) * r;
      const ay = cy + Math.sin(angle) * r;
      // Draw a small forward-pointing chevron dot
      g.circle(ax, ay, 3).fill({ color: arrowColor, alpha: 0.8 });
      // Tiny directional tail
      const tailAngle = angle - 0.3;
      g.moveTo(ax, ay).lineTo(ax + Math.cos(tailAngle) * 5, ay + Math.sin(tailAngle) * 5)
        .stroke({ color: arrowColor, width: 1.5, alpha: 0.5 });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Background particles (Z8b)
  // ═══════════════════════════════════════════════════════════════════════════

  private bgParticleLayer?: PIXI.Container;
  private bgParticles: Array<{ g: PIXI.Graphics; x: number; y: number; vx: number; vy: number; life: number; maxLife: number }> = [];
  private bgParticleConfig?: { type: string; density: number; direction: number; speed: number; color: number; affectedByArenaRotation: boolean };
  private bgLastSpawn = 0;

  /**
   * Z8b: Set up background particle system.
   * Call once when arena config loads.
   */
  initBackgroundParticles(config: {
    type: string;
    density?: number;
    direction?: number;
    speed?: number;
    color?: string;
    affectedByArenaRotation?: boolean;
  }, bgLayer: PIXI.Container): void {
    this.bgParticleLayer = bgLayer;
    const colorMap: Record<string, number> = {
      snow: 0xddeeff, rain: 0x88aadd, embers: 0xff8822, leaves: 0x55aa33,
      bubbles: 0x66aaff, sparks: 0xffcc44, pollen: 0xeedd55,
      ash: 0xaaaaaa, stars: 0xffffff, glitch_pixels: 0x00ffaa,
    };
    this.bgParticleConfig = {
      type: config.type,
      density: config.density ?? 20,
      direction: config.direction ?? 0,
      speed: config.speed ?? 1.0,
      color: config.color ? parseInt(config.color.replace("#", ""), 16) : (colorMap[config.type] ?? 0xffffff),
      affectedByArenaRotation: config.affectedByArenaRotation ?? true,
    };
  }

  /**
   * Z8b: Update background particles each frame.
   */
  tickBackgroundParticles(nowMs: number, dt: number, arenaWidthPx: number, arenaHeightPx: number): void {
    if (!this.bgParticleConfig || !this.bgParticleLayer) return;
    const cfg = this.bgParticleConfig;

    // Spawn new particles
    const spawnInterval = 1000 / cfg.density;
    if (nowMs - this.bgLastSpawn > spawnInterval) {
      this.bgLastSpawn = nowMs;
      const dirRad = ((cfg.direction - 90) * Math.PI) / 180;
      const spd = (30 + Math.random() * 40) * cfg.speed;
      const perp = dirRad + Math.PI / 2;
      // Spawn along the opposite edge
      const startX = (Math.random() - 0.5) * arenaWidthPx;
      const startY = (Math.random() - 0.5) * arenaHeightPx;
      const g = new PIXI.Graphics();
      this.bgParticleLayer.addChild(g);
      this.bgParticles.push({
        g,
        x: startX, y: startY,
        vx: Math.cos(dirRad) * spd + Math.cos(perp) * (Math.random() - 0.5) * 20,
        vy: Math.sin(dirRad) * spd + Math.sin(perp) * (Math.random() - 0.5) * 20,
        life: 0,
        maxLife: 2000 + Math.random() * 3000,
      });
    }

    // Update + draw particles
    const color = cfg.color;
    for (let i = this.bgParticles.length - 1; i >= 0; i--) {
      const p = this.bgParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt * 1000;
      const lifeFrac = p.life / p.maxLife;

      p.g.clear();
      if (lifeFrac > 1 || Math.abs(p.x) > arenaWidthPx || Math.abs(p.y) > arenaHeightPx) {
        this.bgParticleLayer.removeChild(p.g);
        p.g.destroy();
        this.bgParticles.splice(i, 1);
        continue;
      }

      const alpha = Math.sin(lifeFrac * Math.PI) * 0.8;
      switch (cfg.type) {
        case "rain":
          p.g.moveTo(p.x, p.y).lineTo(p.x + p.vx * 0.04, p.y + p.vy * 0.04)
            .stroke({ color, width: 1, alpha });
          break;
        case "snow": case "pollen":
          p.g.circle(p.x, p.y, 2).fill({ color, alpha });
          break;
        case "embers": case "sparks":
          p.g.circle(p.x, p.y, 1.5 + Math.random()).fill({ color, alpha });
          break;
        case "bubbles":
          p.g.circle(p.x, p.y, 3).stroke({ color, width: 1, alpha: alpha * 0.6 });
          break;
        case "glitch_pixels":
          p.g.rect(p.x, p.y, 3, 3).fill({ color, alpha });
          break;
        default:
          p.g.circle(p.x, p.y, 2).fill({ color, alpha });
      }
    }
  }

  destroyBackgroundParticles(): void {
    for (const p of this.bgParticles) {
      this.bgParticleLayer?.removeChild(p.g);
      p.g.destroy();
    }
    this.bgParticles = [];
  }

  destroy() {
    this.layer.removeChildren();
    this.obstacleGfx.clear();
    this.obstacleHealthGfx.clear();
    this.pitGfx.clear();
    this.turretGfx.clear();
    this.projectileGfx.clear();
    this.waterGfx.clear();
    this.portalGfx.clear();
    this.loopGfx.clear();
    this.destroyBackgroundParticles();
  }
}

// ─── Helper: HSL → 0xRRGGBB ──────────────────────────────────────────────────

function hslToHex(h: number, s: number, l: number): number {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, gr = 0, b = 0;
  if (h < 60) { r = c; gr = x; }
  else if (h < 120) { r = x; gr = c; }
  else if (h < 180) { gr = c; b = x; }
  else if (h < 240) { gr = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return (((r + m) * 255) << 16) | (((gr + m) * 255) << 8) | ((b + m) * 255);
}
