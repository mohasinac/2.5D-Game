/**
 * generate-report.ts — HTML report generator
 *
 * Reads tests/reports/puppeteer-results.json and writes
 * tests/reports/puppeteer-report.html with a summary table and
 * inline screenshot thumbnails.
 *
 * Usage: ts-node --project tsconfig.json tests/reports/generate-report.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import type { StepResult } from '../puppeteer/helpers/base';

interface Results {
  steps: StepResult[];
  summary: { passed: number; failed: number; total: number };
}

const RESULTS_PATH = path.resolve('tests/reports/puppeteer-results.json');
const REPORT_PATH  = path.resolve('tests/reports/puppeteer-report.html');

function statusBadge(status: 'pass' | 'fail' | 'skip'): string {
  const map = {
    pass: '<span style="color:#22c55e;font-weight:700;">PASS</span>',
    fail: '<span style="color:#ef4444;font-weight:700;">FAIL</span>',
    skip: '<span style="color:#f59e0b;font-weight:700;">SKIP</span>',
  };
  return map[status] ?? status;
}

function screenshotCell(screenshotPath: string): string {
  if (!screenshotPath || !fs.existsSync(screenshotPath)) {
    return '<td style="color:#6b7280;font-size:11px;">—</td>';
  }
  const rel = path.relative(path.dirname(REPORT_PATH), screenshotPath).replace(/\\/g, '/');
  return `<td><a href="${rel}" target="_blank"><img src="${rel}" alt="screenshot" style="max-width:160px;max-height:90px;border-radius:4px;border:1px solid #374151;" /></a></td>`;
}

function buildHTML(data: Results): string {
  const { steps, summary } = data;

  // Group by suite
  const suites = new Map<string, StepResult[]>();
  for (const s of steps) {
    if (!suites.has(s.suite)) suites.set(s.suite, []);
    suites.get(s.suite)!.push(s);
  }

  let rows = '';
  for (const [suite, suiteSteps] of suites) {
    const suitePassed = suiteSteps.filter(s => s.status === 'pass').length;
    const suiteFailed = suiteSteps.filter(s => s.status === 'fail').length;
    const suiteSkipped = suiteSteps.filter(s => s.status === 'skip').length;
    rows += `
      <tr style="background:#1f2937;">
        <td colspan="5" style="padding:8px 12px;font-weight:700;color:#e5e7eb;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;">
          ${suite}
          <span style="margin-left:12px;font-weight:400;font-size:11px;color:#9ca3af;">
            ${suitePassed} pass / ${suiteFailed} fail / ${suiteSkipped} skip
          </span>
        </td>
      </tr>`;

    for (const s of suiteSteps) {
      rows += `
        <tr style="border-bottom:1px solid #374151;${s.status === 'fail' ? 'background:#2d1515;' : ''}">
          <td style="padding:6px 12px;font-family:monospace;color:#818cf8;">${s.code}</td>
          <td style="padding:6px 12px;color:#e5e7eb;">${s.desc}</td>
          <td style="padding:6px 12px;text-align:center;">${statusBadge(s.status)}</td>
          <td style="padding:6px 12px;color:#9ca3af;font-size:11px;max-width:320px;word-break:break-word;">${s.error ?? ''}</td>
          ${screenshotCell(s.screenshotPath)}
        </tr>`;
    }
  }

  const passRate = summary.total > 0
    ? Math.round((summary.passed / summary.total) * 100)
    : 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Puppeteer Test Report — Beyblade Game</title>
<style>
  body { font-family: system-ui, sans-serif; background: #111827; color: #d1d5db; margin: 0; padding: 24px; }
  h1   { color: #f9fafb; font-size: 22px; margin-bottom: 4px; }
  .summary { display: flex; gap: 20px; margin: 16px 0 28px; flex-wrap: wrap; }
  .card { background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 12px 20px; min-width: 120px; text-align: center; }
  .card .num { font-size: 28px; font-weight: 900; }
  .card .lbl { font-size: 11px; color: #9ca3af; margin-top: 2px; letter-spacing: 0.08em; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th    { text-align: left; padding: 10px 12px; background: #111827; color: #6b7280; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid #374151; }
</style>
</head>
<body>
<h1>🌀 Beyblade Game — Puppeteer Test Report</h1>
<p style="color:#9ca3af;font-size:13px;">Generated: ${new Date().toLocaleString()}</p>

<div class="summary">
  <div class="card"><div class="num">${summary.total}</div><div class="lbl">Total</div></div>
  <div class="card"><div class="num" style="color:#22c55e;">${summary.passed}</div><div class="lbl">Passed</div></div>
  <div class="card"><div class="num" style="color:#ef4444;">${summary.failed}</div><div class="lbl">Failed</div></div>
  <div class="card"><div class="num" style="color:#f59e0b;">${summary.total - summary.passed - summary.failed}</div><div class="lbl">Skipped</div></div>
  <div class="card"><div class="num">${passRate}%</div><div class="lbl">Pass Rate</div></div>
</div>

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Description</th>
      <th style="text-align:center;">Status</th>
      <th>Notes</th>
      <th>Screenshot</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>
</body>
</html>`;
}

function main(): void {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error(`Results file not found: ${RESULTS_PATH}`);
    console.error('Run `npm run test:puppeteer` first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(RESULTS_PATH, 'utf-8');
  const data: Results = JSON.parse(raw);

  const html = buildHTML(data);
  fs.writeFileSync(REPORT_PATH, html, 'utf-8');

  console.log(`Report written to: ${REPORT_PATH}`);
  console.log(`Summary: ${data.summary.passed} passed, ${data.summary.failed} failed, ${data.summary.total} total`);
}

main();
