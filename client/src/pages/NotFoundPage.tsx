import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-dvh overflow-hidden bg-bg1 text-center p-6">
      <div className="text-6xl mb-4">🌀</div>
      <h1 className="text-3xl font-bold text-theme-text mb-2">Page Not Found</h1>
      <p className="text-theme-muted mb-6">This arena doesn't exist.</p>
      <button
        onClick={() => navigate("/game")}
        className="px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
      >
        Back to Game
      </button>
    </div>
  );
}
