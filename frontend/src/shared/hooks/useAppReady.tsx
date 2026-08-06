import { useEffect, useState } from "react";
import { db } from "../../local/indexedDB";

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const MIN_LOADING_MS = 1500;

    async function bootstrap() {
      const start = Date.now();
      try {
        await db.open();
      } finally {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        setTimeout(() => {
          if (!cancelled) setIsReady(true);
        }, remaining);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return isReady;
}
