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

    const loadingTimeout = setTimeout(() => {
      if (isMounted) setShowLoading(true);
    }, 1000);

    const checkHealth = async () => {
      try {
        await healthService.getHealth();
      } catch (error) {
        console.error("Health check failed:", error);
      } finally {
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setIsReady(true);
          setShowLoading(false);
        }
      }
    };

    checkHealth();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
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
