import { useState } from "react";
import { BTN_PRIMARY, BTN_SECONDARY } from "../../rpgAdminShared";
import { EXAMPLE_SCENARIO_JSON } from "../exampleScenario";
import type { ScenarioInput } from "../parser/types";
import { validateScenarioInput, type ValidationError } from "../parser/validation";

interface Props {
  onParsed: (input: ScenarioInput) => void;
}

export function ScenarioInputStep({ onParsed }: Props) {
  const [json, setJson] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleParse = () => {
    setErrors([]);
    let parsed: ScenarioInput;
    try {
      parsed = JSON.parse(json) as ScenarioInput;
    } catch (e) {
      setErrors([`JSON parse error: ${(e as Error).message}`]);
      return;
    }

    const validationErrors: ValidationError[] = validateScenarioInput(parsed);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((ve) => `[${ve.path}] ${ve.message}`));
      return;
    }

    onParsed(parsed);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Step 1: Paste JSON Script</h2>
        <button
          className={BTN_SECONDARY}
          onClick={() => setJson(EXAMPLE_SCENARIO_JSON)}
        >
          Load Example
        </button>
      </div>

      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder="Paste your scenario JSON here..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 font-mono"
        style={{ minHeight: "500px" }}
        spellCheck={false}
      />

      {errors.length > 0 && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
          <div className="text-red-400 text-xs font-bold mb-1">Errors:</div>
          {errors.map((err, i) => (
            <div key={i} className="text-red-300 text-xs font-mono">{err}</div>
          ))}
        </div>
      )}

      <button
        className={BTN_PRIMARY}
        onClick={handleParse}
        disabled={!json.trim()}
      >
        Parse Script
      </button>
    </div>
  );
}
