'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a debounced wrapper around `fn`. Rapid calls collapse into a single
 * trailing invocation after `delay` ms of quiet. Useful for coalescing bursts
 * of SSE/socket events that each want to trigger the same refetch.
 *
 * The latest `fn` is always used (kept in a ref), so callers can pass an inline
 * closure without resetting the timer or busting effect deps.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300
): (...args: Args) => void {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return useCallback(
    (...args: Args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay]
  );
}
