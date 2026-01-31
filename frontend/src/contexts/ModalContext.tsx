import Modal from "../components/common/modals/Modal";
import { createContext, useContext, useState } from "react";
import type { ModalType } from "../types/globals.types";

interface IModalContext {
  showError: (title: string, message: string, action: () => void) => void;
  showWarning: (title: string, message: string, action: () => void) => void;
  showSuccess: (title: string, message: string, action: () => void) => void;
  hideModal: () => void;
}

export const ModalContext = createContext<IModalContext | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setTitle] = useState<string>("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => {},
  );

  const showModal = (
    type: ModalType,
    title: string,
    msg: string,
    onConfirm?: () => void,
  ) => {
    setModalType(type);
    setTitle(title);
    setModalMessage(msg);
    setOnConfirmCallback(() => onConfirm || (() => {}));
  };

  const showError = (title: string, msg: string, action: () => void) => {
    showModal("error", title, msg, action);
  };

  const showWarning = (title: string, msg: string, action: () => void) => {
    showModal("warning", title, msg, action);
  };

  const showSuccess = (title: string, msg: string, action: () => void) => {
    showModal("success", title, msg, action);
  };

  const hideModal = () => {
    setModalType(null);
    setOnConfirmCallback(() => () => {});
  };

  const handleConfirm = () => {
    onConfirmCallback();
  };

  return (
    <ModalContext.Provider
      value={{
        showError,
        showWarning,
        showSuccess,
        hideModal,
      }}
    >
      {children}
      {modalType && (
        <Modal
          type={modalType}
          onClose={hideModal}
          onConfirm={handleConfirm}
          title={modalTitle}
        >
          {modalMessage}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
