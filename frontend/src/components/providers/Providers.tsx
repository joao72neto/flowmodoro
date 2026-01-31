import { ModalProvider } from "../../contexts/ModalContext";
import { SessionProvider } from "../../contexts/SessionContext";
import { TaskProvider } from "../../contexts/TaskContext";

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
