import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageOpen } from "lucide-react";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="Nothing here yet" />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState
        title="Empty"
        description="Create your first item to get started."
      />
    );
    expect(screen.getByText("Create your first item to get started.")).toBeInTheDocument();
  });

  it("does not render description section when omitted", () => {
    const { container } = render(<EmptyState title="Empty" />);
    // Only title div present; no description div
    expect(container.querySelectorAll("div").length).toBeLessThan(5);
  });

  it("renders action slot when provided", () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Create Item</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Create Item" })).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const { container } = render(
      <EmptyState
        title="Empty"
        icon={<PackageOpen size={40} data-testid="icon-svg" />}
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders without icon when not provided", () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
