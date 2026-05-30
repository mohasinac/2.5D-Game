import { useState, useCallback } from "react";

export interface RPGFieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "array" | "boolean" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: unknown;
  hint?: string;
}

type FieldValues = Record<string, unknown>;

interface UseFormStateResult {
  values: FieldValues;
  setValue: (key: string, value: unknown) => void;
  reset: (initial?: FieldValues) => void;
  isDirty: boolean;
  errors: Record<string, string>;
  validate: () => boolean;
  setValues: (newValues: FieldValues) => void;
}

function buildDefaults(fields: RPGFieldDef[]): FieldValues {
  const out: FieldValues = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) { out[f.key] = f.defaultValue; continue; }
    if (f.type === "number") { out[f.key] = 0; continue; }
    if (f.type === "boolean") { out[f.key] = false; continue; }
    if (f.type === "array") { out[f.key] = ""; continue; } // stored as comma-sep string in form
    out[f.key] = "";
  }
  return out;
}

export function useFormState(fields: RPGFieldDef[], initialValues?: FieldValues): UseFormStateResult {
  const defaults = buildDefaults(fields);
  const [values, setValuesState] = useState<FieldValues>({ ...defaults, ...initialValues });
  const [original] = useState<FieldValues>({ ...defaults, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = useCallback((key: string, value: unknown) => {
    setValuesState(prev => ({ ...prev, [key]: value }));
  }, []);

  const setValues = useCallback((newValues: FieldValues) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const reset = useCallback((initial?: FieldValues) => {
    setValuesState({ ...defaults, ...(initial ?? original) });
    setErrors({});
  }, [defaults, original]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(original);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.required) {
        const v = values[f.key];
        if (v === "" || v === null || v === undefined) {
          errs[f.key] = `${f.label} is required`;
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fields, values]);

  return { values, setValue, reset, isDirty, errors, validate, setValues };
}

/** Convert form values to Firestore data, applying array parsing */
export function formValuesToData(fields: RPGFieldDef[], values: FieldValues): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = values[f.key];
    if (f.type === "array" && typeof v === "string") {
      out[f.key] = v.split(",").map(s => s.trim()).filter(Boolean);
    } else if (f.type === "number") {
      out[f.key] = Number(v) || 0;
    } else {
      out[f.key] = v;
    }
  }
  return out;
}

/** Convert Firestore data to form values (arrays become comma-sep strings) */
export function dataToFormValues(fields: RPGFieldDef[], data: Record<string, unknown>): FieldValues {
  const out: FieldValues = {};
  for (const f of fields) {
    const v = data[f.key];
    if (f.type === "array" && Array.isArray(v)) {
      out[f.key] = v.join(", ");
    } else if (v !== undefined) {
      out[f.key] = v;
    } else {
      out[f.key] = buildDefaults([f])[f.key];
    }
  }
  return out;
}
