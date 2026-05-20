import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  it('renders "Beyblade Game" heading', () => {
    renderHomePage();
    expect(screen.getByRole("heading", { name: /beyblade game/i })).toBeInTheDocument();
  });

  it("has a link to /game", () => {
    renderHomePage();
    const link = screen.getByRole("link", { name: /play game/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/game");
  });

  it("has a link to /admin", () => {
    renderHomePage();
    const link = screen.getByRole("link", { name: /admin panel/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin");
  });

  it('"Game Server Ready" text is visible', () => {
    renderHomePage();
    expect(screen.getByText(/game server ready/i)).toBeInTheDocument();
  });
});
