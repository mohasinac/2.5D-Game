import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

function TestHarness({ defaultTab }: { defaultTab: string }) {
  const [tab, setTab] = useTabFromUrl(defaultTab);
  return (
    <div>
      <span data-testid="tab">{tab}</span>
      <button onClick={() => setTab("shape")}>go-shape</button>
      <button onClick={() => setTab("images")}>go-images</button>
    </div>
  );
}

function renderWithRouter(initialPath: string, defaultTab: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<TestHarness defaultTab={defaultTab} />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("useTabFromUrl", () => {
  it("returns defaultTab when no tab param in URL", () => {
    renderWithRouter("/admin/parts/edit/flat", "overview");
    expect(screen.getByTestId("tab").textContent).toBe("overview");
  });

  it("reads tab value from ?tab= search param", () => {
    renderWithRouter("/admin/parts/edit/flat?tab=shape", "overview");
    expect(screen.getByTestId("tab").textContent).toBe("shape");
  });

  it("updates tab display when setTab is called", () => {
    renderWithRouter("/admin/parts/edit/flat", "overview");
    act(() => {
      screen.getByText("go-shape").click();
    });
    expect(screen.getByTestId("tab").textContent).toBe("shape");
  });

  it("updates to second tab correctly", () => {
    renderWithRouter("/admin/parts/edit/flat", "overview");
    act(() => {
      screen.getByText("go-images").click();
    });
    expect(screen.getByTestId("tab").textContent).toBe("images");
  });

  it("uses URL param over defaultTab when both present", () => {
    renderWithRouter("/admin?tab=dimensions", "overview");
    expect(screen.getByTestId("tab").textContent).toBe("dimensions");
  });
});
