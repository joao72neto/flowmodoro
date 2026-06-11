import { useEffect, useState } from "react";
import { ModalProvider } from "../shared/modal.context";
import { TimerProvider } from "../features/timer/timer.context";
import LoadingApplication from "./LoadingApplication";

import { ThemeProvider } from "../shared/contexts/theme.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "../features/sessions/sessions.context";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const loadingTimeout = setTimeout(() => {
      if (isMounted) setShowLoading(true);
    }, 1000);

    const wakeUp = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Servidor respondendo com status: ${response.status}`,
          );
        }

        if (isMounted) {
          clearTimeout(loadingTimeout);
          setIsReady(true);
          setShowLoading(false);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        console.warn(
          isAbortError
            ? "Timeout na requisição de health check. Backend ainda ocupado..."
            : "Backend ainda em cold start ou inacessível. Nova tentativa em 5s...",
        );

        if (isMounted) {
          retryTimeout = setTimeout(wakeUp, 5000);
        }
      }
    };

    wakeUp();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      clearTimeout(retryTimeout);
    };
  }, []);

  if (!isReady && showLoading) {
    return <LoadingApplication />;
  }

  if (!isReady) {
    return null;
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <ThemeProvider>
          <SessionProvider>
            <TimerProvider>{children}</TimerProvider>
          </SessionProvider>
        </ThemeProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
};

export default Providers;
