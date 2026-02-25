import { useRef, useEffect, useState, useCallback } from "react";

/**
 * Observe an element's size with ResizeObserver.
 * Returns [ref, size] where size is { width, height } in CSS pixels.
 */
export function useResizeObserver<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  { width: number; height: number } | null
] {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const nodeRef = useRef<T | null>(null);

  const setRef = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    nodeRef.current = node;
    if (!node) {
      setSize(null);
      return;
    }
    observerRef.current = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observerRef.current.observe(node);
    setSize({ width: node.offsetWidth, height: node.offsetHeight });
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return [setRef, size];
}
