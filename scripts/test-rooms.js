#!/usr/bin/env node
// scripts/test-rooms.js
// Integration test — verifies Colyseus rooms respond correctly over HTTP.
// Does NOT require a WebSocket library; uses the Colyseus HTTP matchmaking API
// (POST /matchmake/joinOrCreate/:roomName) which is available in Colyseus 0.15.
//
// Usage:
//   node scripts/test-rooms.js                         # uses localhost:2567
//   node scripts/test-rooms.js https://my.server.com   # test remote
//
// Exit code 0 = all checks passed, 1 = one or more failed.

require("dotenv").config();

const BASE_URL = process.argv[2] || process.env.RAILWAY_URL || "http://localhost:2567";
const TIMEOUT  = 8000;

const GREEN  = "\x1b[32m✔\x1b[0m";
const RED    = "\x1b[31m✘\x1b[0m";
const YELLOW = "\x1b[33m~\x1b[0m";
const BOLD   = s => `\x1b[1m${s}\x1b[0m`;
const DIM    = s => `\x1b[2m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

function ok(label, detail = "") {
  passed++;
  console.log(`  ${GREEN} ${BOLD(label)} ${DIM(detail)}`);
}
function fail(label, reason) {
  failed++;
  console.log(`  ${RED} ${BOLD(label)}`);
  console.log(`     ${DIM(String(reason?.message ?? reason))}`);
}
function info(msg) {
  console.log(`  ${YELLOW} ${DIM(msg)}`);
}

async function fetchJSON(path, opts = {}) {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res  = await fetch(`${BASE_URL}${path}`, { ...opts, signal: ctrl.signal });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }
    return { ok: res.ok, status: res.status, json, text };
  } finally {
    clearTimeout(timer);
  }
}

// ─── 1. Health check ─────────────────────────────────────────────────────────

async function checkHealth() {
  console.log(`\n${BOLD("1. Health & server availability")}`);
  info(`GET ${BASE_URL}/health`);
  try {
    const r = await fetchJSON("/health");
    if (r.ok) ok("/health", `HTTP ${r.status} — ${r.text.slice(0, 80)}`);
    else       fail("/health", `HTTP ${r.status}`);
  } catch (e) {
    fail("/health", e.name === "AbortError" ? `Timed out after ${TIMEOUT}ms` : e);
  }
}

// ─── 2. Colyseus monitor reachable ───────────────────────────────────────────

async function checkMonitor() {
  console.log(`\n${BOLD("2. Colyseus monitor")}`);
  info("GET /colyseus");
  try {
    const r = await fetchJSON("/colyseus");
    if (r.ok || r.status === 302 || r.status === 200)
      ok("/colyseus", `HTTP ${r.status}`);
    else
      fail("/colyseus", `HTTP ${r.status}`);
  } catch (e) {
    fail("/colyseus", e.name === "AbortError" ? `Timed out after ${TIMEOUT}ms` : e);
  }
}

// ─── 3. Room matchmaking — tryout_room ───────────────────────────────────────

async function checkTryoutRoom() {
  console.log(`\n${BOLD("3. tryout_room — matchmaking")}`);

  // Colyseus 0.15 HTTP matchmaking endpoint
  const path = "/matchmake/joinOrCreate/tryout_room";
  info(`POST ${path}`);

  const body = JSON.stringify({
    beybladeId: "flame-sagittario",
    arenaId:    "bey-stadium-classic",
    username:   "TestBot",
    userId:     "test-bot-001",
  });

  let roomId;
  try {
    const r = await fetchJSON(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (r.ok && r.json?.room?.roomId) {
      roomId = r.json.room.roomId;
      ok("joinOrCreate", `roomId=${roomId}  sessionId=${r.json.sessionId ?? "?"}`);
    } else if (r.status === 404) {
      fail("joinOrCreate", "404 — room type not registered (is the server running? check src/index.ts)");
      return;
    } else {
      fail("joinOrCreate", `HTTP ${r.status}: ${r.text.slice(0, 120)}`);
      return;
    }
  } catch (e) {
    fail("joinOrCreate", e.name === "AbortError" ? `Timed out after ${TIMEOUT}ms` : e);
    return;
  }

  // Verify the room now appears in the room list
  info(`GET /matchmake/query/tryout_room`);
  try {
    const r2 = await fetchJSON("/matchmake/query/tryout_room");
    if (r2.ok && Array.isArray(r2.json) && r2.json.length > 0) {
      ok("query rooms", `${r2.json.length} room(s) listed`);
    } else {
      fail("query rooms", `Expected array, got: ${r2.text?.slice(0, 80)}`);
    }
  } catch (e) {
    fail("query rooms", e);
  }
}

// ─── 4. Room matchmaking — ai_battle_room ────────────────────────────────────

async function checkAIRoom() {
  console.log(`\n${BOLD("4. ai_battle_room — matchmaking")}`);
  const path = "/matchmake/joinOrCreate/ai_battle_room";
  info(`POST ${path}`);

  const body = JSON.stringify({
    beybladeId:   "storm-pegasus",
    aiBeybladeId: "rock-leone",
    arenaId:      "bey-stadium-classic",
    aiDifficulty: "medium",
    username:     "TestBot",
    userId:       "test-bot-002",
  });

  try {
    const r = await fetchJSON(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (r.ok && r.json?.room?.roomId) {
      ok("ai joinOrCreate", `roomId=${r.json.room.roomId}`);
    } else if (r.status === 404) {
      fail("ai joinOrCreate", "404 — ai_battle_room not registered (check src/index.ts)");
    } else {
      fail("ai joinOrCreate", `HTTP ${r.status}: ${r.text.slice(0, 120)}`);
    }
  } catch (e) {
    fail("ai joinOrCreate", e.name === "AbortError" ? `Timed out after ${TIMEOUT}ms` : e);
  }
}

// ─── 5. Input validation — missing required field ────────────────────────────

async function checkBadInput() {
  console.log(`\n${BOLD("5. Input validation")}`);
  info("POST tryout_room with empty body — expect rejection or graceful fallback");

  try {
    const r = await fetchJSON("/matchmake/joinOrCreate/tryout_room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    // Server may reject (4xx) or fallback to defaults — both are acceptable;
    // a 500 or hang is not acceptable.
    if (r.status < 500) {
      ok("empty body handled gracefully", `HTTP ${r.status}`);
    } else {
      fail("empty body → server crash", `HTTP ${r.status}: ${r.text.slice(0, 80)}`);
    }
  } catch (e) {
    fail("empty body", e.name === "AbortError" ? "Server hung (timeout)" : e);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log(BOLD(`\n══════════════════════════════════════`));
  console.log(BOLD(`  Beyblade Game — Room Integration Test`));
  console.log(BOLD(`  ${DIM(BASE_URL)}`));
  console.log(BOLD(`══════════════════════════════════════`));

  await checkHealth();
  await checkMonitor();
  await checkTryoutRoom();
  await checkAIRoom();
  await checkBadInput();

  console.log(`\n${"─".repeat(38)}`);
  console.log(`  ${GREEN} Passed: ${BOLD(passed)}   ${failed > 0 ? RED : GREEN} Failed: ${BOLD(failed)}`);
  console.log(`${"─".repeat(38)}\n`);

  process.exit(failed > 0 ? 1 : 0);
})();
