import { ModalProvider } from "../../contexts/ModalContext";
import { SessionProvider } from "../../features/session/contexts/SessionContext";
import { TaskProvider } from "../../features/task/contexts/TaskContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <SessionProvider>
        <TaskProvider>{children}</TaskProvider>
      </SessionProvider>
    </ModalProvider>
  );
};

export default Providers;
