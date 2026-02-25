import { useRef, useEffect } from "react";

/**
 * requestAnimationFrame loop that respects tab visibility and reduced motion.
 * Callback receives elapsed time in ms and delta since last frame.
 */
export function useRaf(
  callback: (elapsed: number, delta: number) => void,
  active: boolean = true
): void {
  const rafRef = useRef<number>(0);
  const prevRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    let ticking = true;
    prevRef.current = performance.now();

    const loop = (now: number) => {
      if (!ticking) return;
      const delta = now - prevRef.current;
      prevRef.current = now;
      callbackRef.current(now, delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ticking = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);
}
