import { ModalProvider } from "../shared/contexts/ModalContext";
import { SessionProvider } from "../features/session/contexts/SessionContext";
import { TaskProvider } from "../features/task/contexts/TaskContext";
import { TimerProvider } from "../features/home/contexts/TimerContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
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
