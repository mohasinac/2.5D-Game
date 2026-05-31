import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRPGStore } from "../stores/rpgStore";
import { useRPGEngine } from "../hooks/useRPGEngine";

import { RPGHUD } from "../components/hud/RPGHUD";
import { ReputationBadge } from "../components/hud/ReputationBadge";
import { NotificationFeed } from "../components/hud/NotificationFeed";
import { QuestTrackerHUD } from "../components/hud/QuestTrackerHUD";
import { BadgeAchievementOverlay } from "../components/hud/BadgeAchievementOverlay";
import { RPGTouchControls } from "../components/hud/RPGTouchControls";
import { DialogueBox } from "../components/overlays/DialogueBox";
import { CutsceneOverlay } from "../components/overlays/CutsceneOverlay";
import { MenuOverlay } from "../components/overlays/MenuOverlay";
import { TransitionOverlay } from "../components/overlays/TransitionOverlay";
import { RPGMiniGameOverlay } from "../components/mini-games/RPGMiniGameOverlay";
import type { Quest, MiniGameResult } from "../data/schemas";
import { saveRPGState } from "../lib/rpgSave";

// GBC = portrait (160×144 → 10:9 aspect), GBA = landscape (240×160 → 3:2 aspect).
// We detect orientation and apply the matching aspect ratio frame.

export default function RPGGamePage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const userId  = currentUser?.uid ?? "";
  const username = currentUser?.displayName ?? "Player";

  const { engine, isReady } = useRPGEngine(canvasRef, userId, username);

  const activeDialogue      = useRPGStore((s) => s.activeDialogue);
  const activeCutsceneId    = useRPGStore((s) => s.activeCutsceneId);
  const isTransitioning     = useRPGStore((s) => s.isTransitioning);
  const pendingBattleResult = useRPGStore((s) => s.pendingBattleResult);
  const pendingBattleParams = useRPGStore((s) => s.pendingBattleParams);
  const activeMiniGame      = useRPGStore((s) => s.activeMiniGame);
  const miniGameResult      = useRPGStore((s) => s.miniGameResult);

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [menuTab,     setMenuTab]     = useState<"inventory" | "quests" | "badges" | "map" | "save">("inventory");
  const [questDefs,   setQuestDefs]   = useState<Quest[]>([]);
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" ? window.innerWidth > window.innerHeight : true
  );

  // Track orientation
  useEffect(() => {
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Load quest defs for QuestTrackerHUD (lazy, once)
  useEffect(() => {
    if (!isReady || questDefs.length > 0) return;
    import("firebase/firestore").then(({ collection, getDocs }) => {
      import("@/lib/firebase").then(({ db }) => {
        getDocs(collection(db, "rpg_quests"))
          .then((snap) => setQuestDefs(snap.docs.map((d) => d.data() as Quest)))
          .catch(() => { /* non-fatal */ });
      });
    });
  }, [isReady, questDefs.length]);

  // Save pre-battle checkpoint when a battle is about to start
  useEffect(() => {
    if (pendingBattleParams && userId) {
      saveRPGState(userId).catch(() => {});
    }
  }, [pendingBattleParams, userId]);

  // Save on unmount (room exit)
  useEffect(() => {
    return () => {
      if (userId) saveRPGState(userId).catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Handle battle return + auto-save after result is processed
  useEffect(() => {
    if (pendingBattleResult && engine) {
      engine.battleTransitionSystem.handleBattleReturn(pendingBattleResult);
      if (userId) saveRPGState(userId).catch(() => {});
    }
  }, [pendingBattleResult, engine, userId]);

  // Handle mini-game completion — award XP, fire success/failure story event
  useEffect(() => {
    if (!miniGameResult || !activeMiniGame) return;
    const store = useRPGStore.getState();
    const { xpEarned, success } = miniGameResult;
    if (xpEarned > 0) store.addPlayerXP(xpEarned);
    const nextEvent = success
      ? activeMiniGame.config.onSuccess
      : activeMiniGame.config.onFailure;
    if (nextEvent && engine) {
      engine.storyEventSystem.queueEventById(nextEvent);
    }
    store.clearMiniGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [miniGameResult]);

  // Keyboard shortcuts: P = menu, M = map tab
  useEffect(() => {
    if (!isReady) return;
    const onKey = (e: KeyboardEvent) => {
      if (activeDialogue || activeCutsceneId) return;
      if (e.key === "p" || e.key === "P") {
        setMenuTab("inventory");
        setMenuOpen((prev) => !prev);
        e.preventDefault();
      } else if (e.key === "m" || e.key === "M") {
        setMenuTab("map");
        setMenuOpen(true);
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
    if (!node) useRPGStore.getState().closeDialogue();
  }, [engine]);

  const handleChoiceSelect = useCallback(
    (choiceId: string) => {
      if (!engine) return;
      const node = engine.dialogueSystem.advance(choiceId, (key, val) => {
        useRPGStore.getState().setFlag(key, val);
      });
      if (!node) useRPGStore.getState().closeDialogue();
    },
    [engine]
  );

  const handleOpenMap = useCallback(() => {
    setMenuTab("map");
    setMenuOpen(true);
  }, []);

  const currentNode = engine?.dialogueSystem?.getCurrentNode?.() ?? null;
  const choices     = engine?.dialogueSystem?.getAvailableChoices?.() ?? [];

  // GBA landscape: 3:2 aspect. GBC portrait: 10:9 aspect.
  const aspectClass = isLandscape
    ? "aspect-[3/2] max-h-[100vh] max-w-[150vh]"
    : "aspect-[10/9] max-w-[100vw] max-h-[90vh]";

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-950 flex items-center justify-center">
      <div
        className={`relative overflow-hidden bg-black rounded-lg border-2 border-gray-700 shadow-2xl ${aspectClass} w-full [image-rendering:pixelated]`}
      >
        <div ref={canvasRef} className="absolute inset-0 [image-rendering:pixelated]" />

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
            <RPGHUD onOpenMap={handleOpenMap} />
            <ReputationBadge />
            <QuestTrackerHUD questDefs={questDefs} />
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
          initialTab={menuTab}
          onClose={() => {
            setMenuOpen(false);
            if (userId) saveRPGState(userId).catch(() => {});
          }}
          onSave={() => {
            setMenuOpen(false);
            if (userId) saveRPGState(userId).catch(() => {});
          }}
        />

        {/* Transition */}
        <TransitionOverlay type={isTransitioning ? "fade" : "none"} active={isTransitioning} />

        {/* Notifications + Badge achievement */}
        <NotificationFeed />
        <BadgeAchievementOverlay />

        {/* Touch controls */}
        <RPGTouchControls />

        {/* Mini-game overlay — renders on top of everything including dialogue */}
        {activeMiniGame && (
          <RPGMiniGameOverlay
            game={activeMiniGame}
            onComplete={(result: MiniGameResult) =>
              useRPGStore.getState().completeMiniGame(result)
            }
          />
        )}
      </div>
    </div>
  );
}
