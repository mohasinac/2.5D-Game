import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface TutorialStep {
  title: string;
  key: string;
  description: string;
  hint: string;
}

const STEPS: TutorialStep[] = [
  {
    title: "Charge Power",
    key: "Space",
    description:
      "Hold the Space bar to charge your launch power. Release at the right moment for maximum spin speed.",
    hint: "A longer hold charges more power, but watch the gauge -- overcharging can reduce accuracy.",
  },
  {
    title: "Move Your Bey",
    key: "W / A / S / D",
    description:
      "Use WASD to steer your beyblade around the arena. Push toward opponents to initiate contact.",
    hint: "Stay near the center to avoid ring-outs. Use short taps for precise positioning.",
  },
  {
    title: "Attack!",
    key: "J",
    description:
      "Press J to perform a direct attack. Attacking costs a small amount of spin but deals damage on contact.",
    hint: "Time your attacks when close to an opponent for maximum impact.",
  },
  {
    title: "Use Special",
    key: "K",
    description:
      "Press K to activate your special move when your power meter is full. Each beyblade type has a unique special.",
    hint: "Specials cost ~100 power. Save them for critical moments to turn the tide of battle.",
  },
];

export default function TutorialPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem("tutorialProgress");
    const parsed = saved ? parseInt(saved, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 && parsed < STEPS.length ? parsed : 0;
  });
  const [completed, setCompleted] = useState(
    () => localStorage.getItem("tutorialComplete") === "true"
  );

  function goToStep(index: number) {
    setCurrentStep(index);
    localStorage.setItem("tutorialProgress", String(index));
  }

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      // Complete the tutorial
      setCompleted(true);
      localStorage.setItem("tutorialComplete", "true");
      localStorage.setItem("tutorialProgress", String(STEPS.length - 1));
    }
  }

  function handleRestart() {
    setCompleted(false);
    localStorage.removeItem("tutorialComplete");
    goToStep(0);
  }

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-bg0 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="py-2 px-4 bg-bg2 rounded-xl border border-border-c text-theme-muted text-sm no-underline hover:border-theme-blue transition-colors"
          >
            Back
          </Link>
          <h1 className="text-3xl font-bold text-theme-text">Tutorial</h1>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => goToStep(i)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i <= currentStep ? "bg-blue-500" : "bg-bg2"
              }`}
              aria-label={`Go to step ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        {completed ? (
          <div className="bg-bg2 rounded-2xl border border-theme-green p-10 text-center">
            <div className="text-5xl mb-4">*</div>
            <h2 className="text-2xl font-bold text-theme-text mb-2">Tutorial Complete</h2>
            <p className="text-theme-muted mb-6">
              You have learned the basics. Jump into a battle and put your skills to the test!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="py-2.5 px-6 rounded-xl bg-bg0 text-theme-muted text-sm border border-border-c hover:border-theme-blue transition-colors"
              >
                Restart Tutorial
              </button>
              <button
                onClick={() => navigate("/game")}
                className="py-2.5 px-6 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Play Now
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-bg2 rounded-2xl border border-border-c overflow-hidden">
            {/* Step header */}
            <div className="px-6 py-4 border-b border-border-c flex items-center justify-between">
              <span className="text-xs text-theme-muted font-medium">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-xs text-theme-faint">{step.title}</span>
            </div>

            {/* Step content */}
            <div className="p-8 text-center">
              {/* Key indicator */}
              <div className="inline-flex items-center gap-1.5 mb-5">
                {step.key.split(" / ").map((k) => (
                  <kbd
                    key={k}
                    className="inline-block px-3 py-1.5 bg-bg0 border border-border-c rounded-lg text-theme-text text-lg font-mono font-bold shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-theme-text mb-3">{step.title}</h2>
              <p className="text-theme-muted mb-4 leading-relaxed">{step.description}</p>
              <p className="text-sm text-theme-faint italic">{step.hint}</p>
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 border-t border-border-c flex items-center justify-between">
              <button
                onClick={() => goToStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="py-2 px-5 rounded-xl text-sm text-theme-muted bg-bg0 border border-border-c hover:border-theme-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="py-2 px-5 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {currentStep === STEPS.length - 1 ? "Complete" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
