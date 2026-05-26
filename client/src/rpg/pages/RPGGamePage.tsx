import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRPGStore } from "../stores/rpgStore";
import { useRPGEngine } from "../hooks/useRPGEngine";

import { RPGHUD } from "../components/hud/RPGHUD";
import { ReputationBadge } from "../components/hud/ReputationBadge";
import { NotificationFeed } from "../components/hud/NotificationFeed";
import { RPGTouchControls } from "../components/hud/RPGTouchControls";
import { DialogueBox } from "../components/overlays/DialogueBox";
import { CutsceneOverlay } from "../components/overlays/CutsceneOverlay";
import { MenuOverlay } from "../components/overlays/MenuOverlay";
import { TransitionOverlay } from "../components/overlays/TransitionOverlay";

// GBC = portrait (160×144 → 10:9 aspect), GBA = landscape (240×160 → 3:2 aspect).
// We detect orientation and apply the matching aspect ratio frame.

export default function RPGGamePage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const userId = currentUser?.uid ?? "";
  const username = currentUser?.displayName ?? "Player";

  const { engine, isReady } = useRPGEngine(canvasRef, userId, username);

  const activeDialogue = useRPGStore((s) => s.activeDialogue);
  const activeCutsceneId = useRPGStore((s) => s.activeCutsceneId);
  const isTransitioning = useRPGStore((s) => s.isTransitioning);
  const pendingBattleResult = useRPGStore((s) => s.pendingBattleResult);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" ? window.innerWidth > window.innerHeight : true
  );

  // Track orientation
  useEffect(() => {
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Handle battle return
  useEffect(() => {
    if (pendingBattleResult && engine) {
      engine.battleTransitionSystem.handleBattleReturn(pendingBattleResult);
    }
  }, [pendingBattleResult, engine]);

  // Menu toggle
  useEffect(() => {
    if (!isReady) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "p" || e.key === "P") && !activeDialogue && !activeCutsceneId) {
        setMenuOpen((prev) => !prev);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeDialogue, activeCutsceneId, isReady]);

  const handleDialogueAdvance = useCallback(() => {
    if (!engine) return;
    const node = engine.dialogueSystem.advance(undefined, (key, val) => {
      useRPGStore.getState().setFlag(key, val);
    });
    if (!node) {
      useRPGStore.getState().closeDialogue();
    }
  }, [engine]);

  const handleChoiceSelect = useCallback(
    (choiceId: string) => {
      if (!engine) return;
      const node = engine.dialogueSystem.advance(choiceId, (key, val) => {
        useRPGStore.getState().setFlag(key, val);
      });
      if (!node) {
        useRPGStore.getState().closeDialogue();
      }
    },
    [engine]
  );

  const currentNode = engine?.dialogueSystem?.getCurrentNode?.() ?? null;
  const choices = engine?.dialogueSystem?.getAvailableChoices?.() ?? [];

  // GBA landscape: 3:2 aspect. GBC portrait: 10:9 aspect.
  // On desktop, we always use landscape GBA-style.
  const aspectClass = isLandscape
    ? "aspect-[3/2] max-h-[100vh] max-w-[150vh]"
    : "aspect-[10/9] max-w-[100vw] max-h-[90vh]";

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-950 flex items-center justify-center">
      {/* GBA/GBC bezel frame */}
      <div
        className={`relative overflow-hidden bg-black rounded-lg border-2 border-gray-700 shadow-2xl ${aspectClass} w-full`}
        style={{
          imageRendering: "pixelated",
        }}
      >
        {/* PixiJS canvas container */}
        <div ref={canvasRef} className="absolute inset-0" style={{ imageRendering: "pixelated" }} />

        {/* Loading screen */}
        {!isReady && (
          <div className="absolute inset-0 z-[70] bg-black flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-amber-400 text-sm font-mono">Loading RPG World...</p>
          </div>
        )}

        {/* HUD */}
        {isReady && !activeCutsceneId && (
          <>
            <RPGHUD />
            <ReputationBadge />
          </>
        )}

        {/* Dialogue */}
        {activeDialogue && currentNode && (
          <DialogueBox
            speakerName={currentNode.speakerId}
            text={currentNode.text}
            portraitUrl={null}
            portraitState={currentNode.portraitState}
            onAdvance={handleDialogueAdvance}
            onChoiceSelect={handleChoiceSelect}
            choices={
              currentNode.type === "choice" && choices.length > 0
                ? choices.map((c) => ({ id: c.id, label: c.label }))
                : undefined
            }
            shake={currentNode.shake}
          />
        )}

        {/* Cutscene overlay */}
        <CutsceneOverlay active={!!activeCutsceneId} />

        {/* Menu */}
        <MenuOverlay
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onSave={() => setMenuOpen(false)}
        />

        {/* Transition */}
        <TransitionOverlay type={isTransitioning ? "fade" : "none"} active={isTransitioning} />

        {/* Notifications */}
        <NotificationFeed />

        {/* Touch controls: D-pad + A/B + Start (GBA-style, below the viewport frame) */}
        <RPGTouchControls />
      </div>
    </div>
  );
}
