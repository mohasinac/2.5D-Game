import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "firebase/auth";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/styles/theme", () => ({
  C: {
    bg0: "#000",
    purple: "#800080",
    white: "#fff",
    muted: "#aaa",
  },
}));

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div>Admin Content</div>
            </AdminRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminRoute", () => {
  it("shows a loading spinner when loading=true", () => {
    mockUseAuth.mockReturnValue({ currentUser: null, isAdmin: false, loading: true });

    const { container } = renderAdminRoute();

    const spinner = container.querySelector(".spin");
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("redirects to /login when currentUser=null", () => {
    mockUseAuth.mockReturnValue({ currentUser: null, isAdmin: false, loading: false });

    renderAdminRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("redirects to / when currentUser is present but isAdmin=false", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: "user-uid", email: "user@example.com" } as User,
      isAdmin: false,
      loading: false,
    });

    renderAdminRoute();

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("renders children when currentUser is present and isAdmin=true", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: "admin-uid", email: "admin@example.com" } as User,
      isAdmin: true,
      loading: false,
    });

    renderAdminRoute();

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
