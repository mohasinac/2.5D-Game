import { test, expect } from '@playwright/test';
import {
  CATALOG_PARTS, CATALOG_PART_BY_ID, CATALOG_COUNTS,
  type CatalogPart,
} from '../../src/config/beys/parts.generated';
import { SLOT_ORDER } from '../../src/bey/assembler';

/**
 * THE PART CATALOGUE, CHECKED AGAINST ITS OWN SOURCES.
 *
 * A generated catalogue fails in two directions and only one of them is
 * visible. Junk rows announce themselves the moment anyone reads the list.
 * A SHORT catalogue does not: twelve missing parts look exactly like a line
 * that was never documented, and the file still reads as complete.
 *
 * Both happened while this was being written, and neither threw:
 *
 *   · Rejecting bare numbers as list ordinals removed the entire standard
 *     MFB Spin Track line — `85`, `90`, `145`, `230` — because those tracks
 *     are NAMED for their height in millimetres. The specialty tracks
 *     survived, so the slot was populated and looked fine at a glance.
 *   · Stripping parentheses when slugging merged `Flat Core (Original)` with
 *     `Flat Core (New Revision)`, and every `(Mold 1)`/`(Mold 2)` pair with
 *     it. The de-duplicator then kept one and dropped the other.
 *
 * So these assertions are mostly about COUNTS and about the specific shapes
 * that went wrong, not about spot values.
 */

const bySlot = (slot: string): CatalogPart[] => CATALOG_PARTS.filter(p => p.slot === slot);

test.describe('part catalogue', () => {
  test('the recorded counts match the array', () => {
    expect(CATALOG_COUNTS.total).toBe(CATALOG_PARTS.length);
    const byGen: Record<string, number> = {};
    for (const p of CATALOG_PARTS) byGen[p.generation] = (byGen[p.generation] ?? 0) + 1;
    expect(byGen).toEqual(CATALOG_COUNTS.byGeneration);
  });

  test('all four architectures are present, none of them thin', () => {
    /* A generation that parsed to a handful of rows is a parser failure
       wearing a plausible number. Each of these lines is documented at well
       over twenty parts in `linka/parts/`. */
    for (const gen of ['plastic', 'hms', 'mfb', 'burst', 'bx'] as const) {
      const n = CATALOG_PARTS.filter(p => p.generation === gen).length;
      expect(n, `${gen} parts`).toBeGreaterThanOrEqual(10);
    }
    expect(CATALOG_PARTS.filter(p => p.generation === 'plastic').length).toBeGreaterThanOrEqual(100);
    expect(CATALOG_PARTS.filter(p => p.generation === 'bx').length).toBeGreaterThanOrEqual(120);
  });

  test('THE WHOLE MFB SPIN TRACK LINE SURVIVED — numeric names are parts', () => {
    const tracks = bySlot('spin_track');
    /* The twelve standard heights, by name. These are exactly what the
       ordinal-rejection rule deleted. */
    for (const code of ['85', '90', '95', '100', '105', '120', '125', '130', '145', '160', '170', '230']) {
      expect(tracks.some(t => t.name === code), `track ${code}`).toBe(true);
    }
    /* And the specialty tracks, which survived the bug and so prove the
       assertion above is not just testing that SOMETHING parsed. */
    for (const code of ['BD145', 'WD145', 'C145', 'TH170']) {
      expect(tracks.some(t => t.name === code), `track ${code}`).toBe(true);
    }
    expect(tracks.length).toBeGreaterThanOrEqual(23);
  });

  test('MOULD AND REVISION VARIANTS ARE DISTINCT PARTS, not merged', () => {
    const cores = bySlot('running_core').map(c => c.name);
    expect(cores).toContain('Flat Core (Original)');
    expect(cores).toContain('Flat Core (New Revision)');
    /* Distinct ids, which is what the de-duplicator keys on. */
    const ids = new Set(CATALOG_PARTS.map(p => p.id));
    expect(ids.size).toBe(CATALOG_PARTS.length);
  });

  test('no header, category or ordinal rows leaked in', () => {
    const junk = /^(category|slot|abbrev\.?|code|type|name|weight|height|notes|tag|source|part)$/i;
    for (const p of CATALOG_PARTS) {
      expect(p.name, `"${p.name}" from ${p.sourceFile}`).not.toMatch(junk);
      /* Single digits are list ordinals — the HMS architecture table numbers
         its four slots 1-4, and those are not parts. Multi-digit names ARE
         parts (see the spin-track test above), so the rule is digit COUNT. */
      expect(p.name).not.toMatch(/^\d$/);
      expect(p.name.trim().length).toBeGreaterThan(0);
      /* A prose cell that slipped into the name column would be long. */
      expect(p.name.length).toBeLessThanOrEqual(60);
    }
  });

  test('every slot is one the assembler can stack', () => {
    const known = new Set<string>(SLOT_ORDER);
    for (const p of CATALOG_PARTS) {
      expect(known.has(p.slot), `${p.slot} (${p.name})`).toBe(true);
    }
  });

  /**
   * Parts the SOURCE states at an implausible mass.
   *
   * Listed individually rather than handled by widening the bound, because
   * a loose bound stops catching the thing the bound is for. `Bullet Griffon`
   * is given as 60.68 g and tagged FACT in `linka/parts/bx/blades.md`; every
   * other BX blade in the same table sits between 31 and 39 g, so it is most
   * likely a whole-bey figure or a transcription slip at the source.
   *
   * IT IS NOT CORRECTED HERE. The catalogue's job is to report what the
   * sources say, and silently editing a cited number is worse than carrying
   * a flagged one — the fix belongs upstream in the dossier, where the
   * citation can be rechecked.
   */
  const SOURCE_OUTLIERS = new Set(['Bullet Griffon']);

  test('stated weights are physically plausible, and traceable', () => {
    let weighed = 0;
    for (const p of CATALOG_PARTS) {
      if (p.grams == null) continue;
      weighed++;
      expect(Number.isFinite(p.grams)).toBe(true);
      /* A single part spans roughly 1 g (a bit chip) to the low 40s (a metal
         HMS attack ring, a Burst layer, the heaviest BX blade). Outside that
         is a parse error — a height read as a mass, or two figures run
         together — not a real part. */
      expect(p.grams, `${p.name} = ${p.grams}g (raw "${p.weightRaw}")`).toBeGreaterThan(0.2);
      if (!SOURCE_OUTLIERS.has(p.name)) {
        expect(p.grams, `${p.name} = ${p.grams}g (raw "${p.weightRaw}")`).toBeLessThan(45);
      }
      /* The raw cell is kept so a figure can always be audited. */
      expect(p.weightRaw.length).toBeGreaterThan(0);
    }
    expect(weighed).toBe(CATALOG_COUNTS.withWeight);
    expect(weighed).toBeGreaterThanOrEqual(90);
  });

  test('the known source outliers are still outliers, and still flagged', () => {
    /* If an upstream correction lands, this fails and the allow-list above
       should shrink — which is the point of asserting on it rather than
       letting the entry rot. */
    const griffon = CATALOG_PARTS.find(p => p.name === 'Bullet Griffon');
    expect(griffon, 'Bullet Griffon should be in the BX blade line').toBeTruthy();
    expect(griffon!.grams).toBeGreaterThan(45);
    const otherBlades = CATALOG_PARTS
      .filter(p => p.slot === 'blade' && p.grams != null && p.name !== 'Bullet Griffon')
      .map(p => p.grams as number);
    expect(otherBlades.length).toBeGreaterThan(5);
    expect(Math.max(...otherBlades)).toBeLessThan(45);
  });

  test('spot values match the sources they were cited from', () => {
    /* Hand-checked against `linka/parts/gen1/*.md`. If the column matcher
       drifts onto a neighbouring column these move, and nothing else here
       would notice — every other assertion is structural. */
    const find = (name: string) => CATALOG_PARTS.find(p => p.name === name);
    expect(find('Tiger Defenser')?.grams).toBe(3.6);     // FACT(PDB)
    expect(find('Cross Spike')?.grams).toBe(4.1);        // FACT(PDB)
    expect(find('Shield Hammer')?.grams).toBe(6.3);      // FACT(PDB)
    expect(find('Heavy')?.grams).toBe(15.3);             // FACT
    expect(find('BD145')?.heightMm).toBe(14.5);          // FACT

    /* A RANGE becomes its midpoint, with both ends kept. "5.0–5.2g". */
    const wolf = find('Upper Wolf');
    expect(wolf?.grams).toBeCloseTo(5.1, 5);
    expect(wolf?.weightVariants).toEqual([5, 5.2]);

    /* A MOULD PAIR keeps both figures: "4.7g (Mold 1) / 5.1g (Mold 2)". */
    const cracker = find('Fire Cracker');
    expect(cracker?.grams).toBe(4.7);
    expect(cracker?.weightVariants).toContain(5.1);
  });

  test('provenance is preserved, because FACT and INFERENCE are not the same', () => {
    /* The corpus distinguishes a cited weight from a reasoned estimate, and
       collapsing them is how an estimate becomes a citation. */
    expect(CATALOG_COUNTS.byTag.FACT).toBeGreaterThan(150);
    expect(CATALOG_COUNTS.byTag.INFERENCE).toBeGreaterThan(0);
    for (const p of CATALOG_PARTS) {
      expect(['FACT', 'INFERENCE', 'MIXED', 'UNTAGGED']).toContain(p.tag);
      expect(p.sourceFile).toMatch(/^linka\/parts\//);
    }
  });

  test('the id index covers every part', () => {
    expect(CATALOG_PART_BY_ID.size).toBe(CATALOG_PARTS.length);
    for (const p of CATALOG_PARTS) expect(CATALOG_PART_BY_ID.get(p.id)).toBe(p);
  });
});
