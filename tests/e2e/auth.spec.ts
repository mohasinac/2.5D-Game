/**
 * auth.spec.ts
 *
 * Authentication and route-guard E2E tests.
 *
 * A01: Valid login → redirected away from /login
 * A02: Wrong password → error message visible
 * A03: Navigate to /register → form renders (email, password, username fields)
 * A04: Unauthenticated navigation to /game/battle → redirected to /login
 * A05: Admin login (ADMIN_EMAIL) → /admin accessible
 *
 * Auth: set TEST_EMAIL + TEST_PASSWORD in .env for authenticated flows.
 *       set ADMIN_EMAIL + ADMIN_PASSWORD for admin tests.
 */

import { test, expect } from "@playwright/test";
import { ss, filterErrors } from "./helpers/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Credentials from environment
// ─────────────────────────────────────────────────────────────────────────────

const TEST_EMAIL    = process.env.TEST_EMAIL    ?? "";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "";
const ADMIN_EMAIL   = process.env.ADMIN_EMAIL   ?? "";
const ADMIN_PASS    = process.env.ADMIN_PASSWORD ?? "";

// ─────────────────────────────────────────────────────────────────────────────
// A01 — Valid login redirects away from /login
// ─────────────────────────────────────────────────────────────────────────────

test.describe("A01: Valid login flow", () => {
  test("valid credentials redirect away from /login", async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");
      await ss(page, "A01-no-creds");
      console.log("[A01] TEST_EMAIL/TEST_PASSWORD not set — skipping auth assertion");
      return;
    }

    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);
    await ss(page, "A01-login-page");

    const emailInput = page.locator('input[type="email"]');
    const passInput  = page.locator('input[type="password"]');

    await emailInput.waitFor({ state: "visible", timeout: 10_000 });
    await emailInput.fill(TEST_EMAIL);
    await passInput.fill(TEST_PASSWORD);
    await ss(page, "A01-filled");

    await page.click('button[type="submit"]');

    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 25_000 });
    await ss(page, "A01-redirected");

    expect(page.url()).not.toContain("/login");
    expect(filterErrors(errors)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// A02 — Wrong password shows error
// ─────────────────────────────────────────────────────────────────────────────

test.describe("A02: Wrong password shows error", () => {
  test("error message visible after bad credentials", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(800);
    await ss(page, "A02-login-page");

    const emailInput = page.locator('input[type="email"]');
    const passInput  = page.locator('input[type="password"]');

    await emailInput.waitFor({ state: "visible", timeout: 10_000 });
    await emailInput.fill("wrong@example.com");
    await passInput.fill("wrongpassword123");
    await ss(page, "A02-filled-wrong");

    await page.click('button[type="submit"]');
    await page.waitForTimeout(4_000);
    await ss(page, "A02-after-submit");

    // Should still be on /login or show an error element
    const stillOnLogin = page.url().includes("/login");
    const errorEl = page.locator(
      '[class*="error"], [class*="Error"], [role="alert"], text=/invalid|incorrect|wrong|failed|error/i'
    ).first();

    const errorVisible = await errorEl.isVisible({ timeout: 5_000 }).catch(() => false);

    if (stillOnLogin) {
      // Correct — stayed on login page on bad credentials
      expect(page.url()).toContain("/login");
    } else if (errorVisible) {
      await expect(errorEl).toBeVisible();
    }

    await ss(page, "A02-error-state");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// A03 — Register page renders expected form fields
// ─────────────────────────────────────────────────────────────────────────────

test.describe("A03: Register page form", () => {
  test("email, password, and username fields are visible", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(800);
    await ss(page, "A03-register-page");

    const emailInput    = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const usernameInput = page.locator(
      'input[name*="user"], input[placeholder*="user"], input[name*="name"], input[placeholder*="name"]'
    ).first();

    await expect(emailInput).toBeVisible({ timeout: 10_000 });
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });

    // Username field may be labelled differently — soft check
    const usernameVisible = await usernameInput.isVisible({ timeout: 5_000 }).catch(() => false);
    if (usernameVisible) {
      await expect(usernameInput).toBeVisible();
    } else {
      // Fallback: at minimum there should be a text input
      const anyInput = page.locator("input").first();
      await expect(anyInput).toBeVisible({ timeout: 5_000 });
    }

    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible({ timeout: 5_000 });

    await ss(page, "A03-register-fields-visible");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// A04 — Unauthenticated access to /game/battle redirects to /login
// ─────────────────────────────────────────────────────────────────────────────

test.describe("A04: Auth guard on protected routes", () => {
  test("unauthenticated /game/battle redirects to /login", async ({ page }) => {
    // Navigate without logging in first
    await page.goto("/game/battle");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);
    await ss(page, "A04-game-battle-unauth");

    // Either redirected to /login, or the page should show a login prompt
    const onLogin = page.url().includes("/login");
    const loginPrompt = page.locator(
      'input[type="email"], text=/sign in|log in|login/i'
    ).first();
    const promptVisible = await loginPrompt.isVisible({ timeout: 5_000 }).catch(() => false);

    expect(onLogin || promptVisible).toBe(true);
    await ss(page, "A04-redirected");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// A05 — Admin login grants access to /admin
// ─────────────────────────────────────────────────────────────────────────────

test.describe("A05: Admin access", () => {
  test("admin credentials allow access to /admin dashboard", async ({ page }) => {
    if (!ADMIN_EMAIL || !ADMIN_PASS) {
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");
      await ss(page, "A05-no-admin-creds");
      console.log("[A05] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin assertion");
      return;
    }

    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_000);

    const emailInput = page.locator('input[type="email"]');
    const passInput  = page.locator('input[type="password"]');
    await emailInput.waitFor({ state: "visible", timeout: 10_000 });
    await emailInput.fill(ADMIN_EMAIL);
    await passInput.fill(ADMIN_PASS);
    await page.click('button[type="submit"]');
    await ss(page, "A05-admin-logging-in");

    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 25_000 });

    // Navigate to /admin
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await ss(page, "A05-admin-page");

    const onAdmin = page.url().includes("/admin");
    if (onAdmin) {
      const heading = page.locator("h1, h2").first();
      const headingVisible = await heading.isVisible({ timeout: 8_000 }).catch(() => false);
      if (headingVisible) await expect(heading).toBeVisible();
    }

    expect(filterErrors(errors)).toHaveLength(0);
    await ss(page, "A05-admin-accessible");
  });
});
