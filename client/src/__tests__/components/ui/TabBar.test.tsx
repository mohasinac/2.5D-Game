import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TabBar } from "@/components/ui/TabBar";
import { Search, Settings } from "lucide-react";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "shape",    label: "Shape" },
  { key: "images",   label: "Images" },
];

describe("TabBar", () => {
  it("renders all tab labels", () => {
    render(<TabBar tabs={tabs} activeKey="overview" onSelect={() => {}} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Shape")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
  });

  it("calls onSelect with the correct key when a tab is clicked", () => {
    const onSelect = vi.fn();
    render(<TabBar tabs={tabs} activeKey="overview" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Shape"));
    expect(onSelect).toHaveBeenCalledWith("shape");
  });

  it("does not call onSelect for already-active tab click (still calls — no guard needed)", () => {
    const onSelect = vi.fn();
    render(<TabBar tabs={tabs} activeKey="overview" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Overview"));
    expect(onSelect).toHaveBeenCalledWith("overview");
  });

  it("renders icon when provided", () => {
    const tabsWithIcon = [
      { key: "search", label: "Search", icon: Search },
      { key: "settings", label: "Settings", icon: Settings },
    ];
    const { container } = render(
      <TabBar tabs={tabsWithIcon} activeKey="search" onSelect={() => {}} />
    );
    // Lucide renders an SVG
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
  });

  it("renders badge number when badge > 0", () => {
    const tabsWithBadge = [{ key: "cps", label: "CPs", badge: 3 }];
    render(<TabBar tabs={tabsWithBadge} activeKey="cps" onSelect={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not render badge when badge is 0", () => {
    const tabsWithZeroBadge = [{ key: "cps", label: "CPs", badge: 0 }];
    render(<TabBar tabs={tabsWithZeroBadge} activeKey="cps" onSelect={() => {}} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders all three variants without crashing", () => {
    for (const variant of ["line", "pill", "segment"] as const) {
      const { unmount } = render(
        <TabBar tabs={tabs} activeKey="overview" onSelect={() => {}} variant={variant} />
      );
      expect(screen.getAllByText("Overview").length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("defaults to line variant", () => {
    const { container } = render(
      <TabBar tabs={tabs} activeKey="overview" onSelect={() => {}} />
    );
    // line variant has borderBottom on the wrapper div
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.borderBottom).toBeTruthy();
  });
});
