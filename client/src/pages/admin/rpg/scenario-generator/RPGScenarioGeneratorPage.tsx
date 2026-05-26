import { useState, useCallback } from "react";
import type { ScenarioInput, ScenarioOutput } from "./parser/types";
import { parseScenario } from "./parser/parseScenario";
import { generatePlaceholders, type PlaceholderAssets } from "./placeholders/generatePlaceholders";
import { ScenarioInputStep } from "./components/ScenarioInputStep";
import { ScenarioPreviewStep } from "./components/ScenarioPreviewStep";
import { ScenarioSaveStep } from "./components/ScenarioSaveStep";

type Step = "input" | "preview" | "save";

export default function RPGScenarioGeneratorPage() {
  const [step, setStep] = useState<Step>("input");
  const [input, setInput] = useState<ScenarioInput | null>(null);
  const [output, setOutput] = useState<ScenarioOutput | null>(null);
  const [assets, setAssets] = useState<PlaceholderAssets | null>(null);

  const handleParsed = useCallback((parsed: ScenarioInput) => {
    const result = parseScenario(parsed);
    const placeholders = generatePlaceholders(parsed);
    setInput(parsed);
    setOutput(result);
    setAssets(placeholders);
    setStep("preview");
  }, []);

  const handleReset = useCallback(() => {
    setStep("input");
    setInput(null);
    setOutput(null);
    setAssets(null);
  }, []);

  return (
    <div className="p-6 w-full box-border max-w-5xl">
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-white">Scenario Generator</h1>
        <p className="text-gray-400 text-[13px] mt-1">
          Paste a JSON script to auto-generate RPG content with placeholder assets
        </p>
      </div>

      <div className="flex items-center gap-2 mb-5">
        {(["input", "preview", "save"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-gray-700" />}
            <div className={`flex items-center gap-1.5 text-xs font-medium ${step === s ? "text-blue-400" : "text-gray-500"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"}`}>
                {i + 1}
              </span>
              {s === "input" ? "Input" : s === "preview" ? "Preview" : "Save"}
            </div>
          </div>
        ))}
      </div>

      {step === "input" && (
        <ScenarioInputStep onParsed={handleParsed} />
      )}

      {step === "preview" && output && input && assets && (
        <ScenarioPreviewStep
          output={output}
          input={input}
          assets={assets}
          onBack={() => setStep("input")}
          onConfirm={() => setStep("save")}
        />
      )}

      {step === "save" && output && (
        <ScenarioSaveStep
          output={output}
          onBack={() => setStep("preview")}
          onDone={handleReset}
        />
      )}
    </div>
  );
}
