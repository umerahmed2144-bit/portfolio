import { useEffect, useState } from "react";

// True one frame after mount, so CSS transitions run from their initial state.
export default function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);
  return mounted;
}
