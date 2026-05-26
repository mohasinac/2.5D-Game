import { useEffect, useState } from "react";

export function useWindowWidth(): number {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const h = () => { clearTimeout(t); t = setTimeout(() => setW(window.innerWidth), 100); };
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("resize", h); clearTimeout(t); };
  }, []);
  return w;
}
