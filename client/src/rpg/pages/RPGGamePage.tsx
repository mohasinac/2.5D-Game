import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRPGStore } from "../stores/rpgStore";
import { useRPGEngine } from "../hooks/useRPGEngine";

import { RPGHUD } from "../components/hud/RPGHUD";
import { ReputationBadge } from "../components/hud/ReputationBadge";
import { NotificationFeed } from "../components/hud/NotificationFeed";
import { DialogueBox } from "../components/overlays/DialogueBox";
import { CutsceneOverlay } from "../components/overlays/CutsceneOverlay";
import { MenuOverlay } from "../components/overlays/MenuOverlay";
import { TransitionOverlay } from "../components/overlays/TransitionOverlay";

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

  // Handle battle return
  useEffect(() => {
    if (pendingBattleResult && engine) {
      engine.battleTransitionSystem.handleBattleReturn(pendingBattleResult);
    }
  }, [pendingBattleResult, engine]);

  // Menu toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "p" || e.key === "P") && !activeDialogue && !activeCutsceneId) {
        setMenuOpen((prev) => !prev);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeDialogue, activeCutsceneId]);

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

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      {/* PixiJS canvas container */}
      <div ref={canvasRef} className="absolute inset-0" />

      {/* Loading screen */}
      {!isReady && (
        <div className="absolute inset-0 z-[70] bg-black flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-sm">Loading RPG World...</p>
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
        onSave={() => {
          // Save system would serialize state here
          setMenuOpen(false);
        }}
      />

      {/* Transition */}
      <TransitionOverlay type={isTransitioning ? "fade" : "none"} active={isTransitioning} />

      {/* Notifications */}
      <NotificationFeed />
    </div>
  );
}
