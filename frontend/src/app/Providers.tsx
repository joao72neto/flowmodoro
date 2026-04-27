import { useEffect, useState } from "react";
import { ModalProvider } from "../shared/modal.context";
import { SessionProvider } from "../features/session/session.context";
import { TaskProvider } from "../features/task/task.context";
import { TimerProvider } from "../features/home/timer.context";
import LoadingApplication from "./LoadingApplication";

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
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/health`, {
          signal: AbortSignal.timeout(10000),
        });

        if (isMounted) {
          clearTimeout(loadingTimeout);
          setIsReady(true);
          setShowLoading(false);
        }
      } catch (error) {
        console.warn(
          "Backend ainda em cold start ou timeout atingido. Nova tentativa em 3s...",
        );

        if (isMounted) {
          retryTimeout = setTimeout(wakeUp, 3000);
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

  return (
    <ModalProvider>
      <SessionProvider>
        <TaskProvider>
          <TimerProvider>{children}</TimerProvider>
        </TaskProvider>
      </SessionProvider>
    </ModalProvider>
  );
};

export default Providers;
