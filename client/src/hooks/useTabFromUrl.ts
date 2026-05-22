import { useSearchParams } from "react-router-dom";

export function useTabFromUrl(defaultTab: string): [string, (tab: string) => void] {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? defaultTab;
  const setTab = (t: string) => setParams({ tab: t }, { replace: false });
  return [tab, setTab];
}
