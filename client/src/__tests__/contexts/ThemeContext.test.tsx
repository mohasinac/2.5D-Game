// Tests for ThemeContext: provider applies data-theme + persists; useTheme
// outside a provider returns a safe default. See Phase 10.

import { describe, it, expect, beforeEach } from "vitest";
import { act, render, screen, renderHook } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function Display() {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="t">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>toggle</button>
      <button data-testid="set-light" onClick={() => setTheme("light")}>light</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  it("applies the initial theme to <html data-theme=...>", () => {
    render(<ThemeProvider><Display /></ThemeProvider>);
    const t = screen.getByTestId("t").textContent;
    expect(t === "light" || t === "dark").toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe(t);
  });

  it("toggleTheme flips theme and persists to localStorage", () => {
    render(<ThemeProvider><Display /></ThemeProvider>);
    const initial = screen.getByTestId("t").textContent;
    act(() => screen.getByTestId("toggle").click());
    const after = screen.getByTestId("t").textContent;
    expect(after).not.toBe(initial);
    expect(window.localStorage.getItem("beyblade.theme")).toBe(after);
    expect(document.documentElement.getAttribute("data-theme")).toBe(after);
  });

  it("setTheme overrides the persisted value", () => {
    render(<ThemeProvider><Display /></ThemeProvider>);
    act(() => screen.getByTestId("set-light").click());
    expect(screen.getByTestId("t").textContent).toBe("light");
    expect(window.localStorage.getItem("beyblade.theme")).toBe("light");
  });

  it("useTheme without a provider returns a safe dark default and no-op setters", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(typeof result.current.setTheme).toBe("function");
    expect(typeof result.current.toggleTheme).toBe("function");
    // setters do not crash
    expect(() => result.current.toggleTheme()).not.toThrow();
    expect(() => result.current.setTheme("light")).not.toThrow();
  });
});
