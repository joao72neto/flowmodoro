import { ModalProvider } from "../shared/modal.context";
import { SessionProvider } from "../features/session/session.context";
import { TaskProvider } from "../features/task/task.context";
import { TimerProvider } from "../features/home/timer.context";

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
