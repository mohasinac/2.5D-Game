import { Outlet } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { Toaster } from "react-hot-toast";
import { C } from "@/styles/theme";

export function RootLayout() {
  return (
    <GameProvider>
      <div style={{ minHeight:"100vh", background:C.bg0, color:C.text }}>
        <Outlet />
      </div>
      <Toaster position="top-right" toastOptions={{ style:{ background:C.bg2, color:C.text, border:`1px solid ${C.border}` } }} />
    </GameProvider>
  );
}
