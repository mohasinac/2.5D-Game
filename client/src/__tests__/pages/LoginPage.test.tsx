import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { LoginPage } from "@/pages/LoginPage";

// useNavigate is used inside LoginPage — wrap in MemoryRouter so it works.
function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  it("renders email and password inputs", () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    renderLoginPage();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("submit button becomes enabled when both fields are filled", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/you@example\.com/i), "test@test.com");
    await user.type(screen.getByPlaceholderText(/••••••••/), "password123");

    expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled();
  });

  it('shows "Signing in…" when loading (mock a slow promise)', async () => {
    const user = userEvent.setup();

    // Return a promise that never resolves during the test
    vi.mocked(signInWithEmailAndPassword).mockReturnValueOnce(new Promise(() => {}));

    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/you@example\.com/i), "test@test.com");
    await user.type(screen.getByPlaceholderText(/••••••••/), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button", { name: /signing in/i })).toBeInTheDocument();
  });

  it("calls signInWithEmailAndPassword with email/password on submit", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/you@example\.com/i), "me@example.com");
    await user.type(screen.getByPlaceholderText(/••••••••/), "secret99");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(vi.mocked(signInWithEmailAndPassword)).toHaveBeenCalledWith(
        expect.anything(),
        "me@example.com",
        "secret99"
      );
    });
  });

  it('shows "Invalid email or password" toast on auth/wrong-password error', async () => {
    const user = userEvent.setup();

    const error: any = new Error("Wrong password");
    error.code = "auth/wrong-password";
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(error);

    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/you@example\.com/i), "bad@example.com");
    await user.type(screen.getByPlaceholderText(/••••••••/), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Invalid email or password",
        expect.anything()
      );
    });
  });

  it('has "← Back to home" link', () => {
    renderLoginPage();
    const link = screen.getByRole("link", { name: /← back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
