import { createContext, useContext, useState } from "react";
import useSessions from "../hooks/services/useSessions";
import Modal from "../components/common/modals/Modal";
import { formatToHour } from "../utils/number.utils";

interface ISessionContext {
  focus: number;
  interruptions: number;
  setFocus: (focus: number) => void;
  setInterruptions: (interruptions: number) => void;
  handleSaveSession: () => Promise<void>;
  taskId: number;
  setTaskId: (taskId: number) => void;
  showSaveSessionModal: boolean;
  setShowSaveSessionModal: (show: boolean) => void;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { createSession } = useSessions();
  const [focus, setFocus] = useState<number>(0);
  const [interruptions, setInterruptions] = useState<number>(0);
  const [taskId, setTaskId] = useState<number>(0);
  const [showSaveSessionModal, setShowSaveSessionModal] =
    useState<boolean>(false);

  const handleSaveSession = async () => {
    try {
      await createSession(taskId, { focus, interruptions });
      alert("Sessão Salva!");
    } catch (e: any) {
      console.log(e);
    }

    setFocus(0);
    setInterruptions(0);
  };

  return (
    <SessionContext.Provider
      value={{
        focus,
        interruptions,
        setFocus,
        setInterruptions,
        handleSaveSession,
        taskId,
        setTaskId,
        showSaveSessionModal,
        setShowSaveSessionModal,
      }}
    >
      {children}
      {showSaveSessionModal && (
        <Modal
          closeButtonText="Descartar"
          confirmButtonText="Salvar"
          onClose={() => setShowSaveSessionModal(false)}
          onConfirm={() => setShowSaveSessionModal(false)}
          title="Sessão Finalizada! 🎉"
        >
          Deseja salvar ou desacartar a sessão atual de {formatToHour(focus)}?
        </Modal>
      )}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSessionContext must be used within a SessionProvider");

  return context;
};
