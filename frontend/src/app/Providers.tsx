import { useEffect, useState } from "react";
import { ModalProvider } from "../shared/modal.context";
import { SessionProvider } from "../features/session/session.context";
import { TaskProvider } from "../features/task/task.context";
import { TimerProvider } from "../features/home/timer.context";
import healthService from "./health.service";
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
        await healthService.getHealth();

        if (isMounted) {
          clearTimeout(loadingTimeout);
          setIsReady(true);
          setShowLoading(false);
        }
      } catch (error) {
        console.warn(
          "Falha grave ao acordar o backend ou timeout de 60s estourou. Tentando novamente...",
        );

        if (isMounted) {
          retryTimeout = setTimeout(wakeUp, 2000);
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
