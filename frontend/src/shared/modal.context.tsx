import Modal from "./components/Modal/Modal";
import { createContext, useContext, useState, useCallback } from "react";
import type { ModalType } from "./globals.types";

interface IModalContext {
  showError: ({
    title,
    message,
    action,
  }: {
    title: string;
    message: string;
    action: () => void;
  }) => void;
  showWarning: ({
    title,
    message,
    action,
  }: {
    title: string;
    message: string;
    action: () => void;
  }) => void;
  showSuccess: ({
    title,
    message,
    action,
  }: {
    title: string;
    message: string;
    action: () => void;
  }) => void;
  showDefault: ({
    title,
    message,
    action,
  }: {
    title: string;
    message: string;
    action: () => void;
  }) => void;
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

  const showModal = useCallback(
    ({
      type,
      title,
      message,
      onConfirm,
    }: {
      type: ModalType;
      title: string;
      message: string;
      onConfirm?: () => void;
    }) => {
      setModalType(type);
      setTitle(title);
      setModalMessage(message);
      setOnConfirmCallback(() => onConfirm || (() => {}));
    },
    [],
  );

  const showDefault = useCallback(
    ({
      title,
      message,
      action,
    }: {
      title: string;
      message: string;
      action: () => void;
    }) => {
      showModal({ type: "default", title, message, onConfirm: action });
    },
    [showModal],
  );

  const showError = useCallback(
    ({
      title,
      message,
      action,
    }: {
      title: string;
      message: string;
      action: () => void;
    }) => {
      showModal({ type: "error", title, message, onConfirm: action });
    },
    [showModal],
  );

  const showWarning = useCallback(
    ({
      title,
      message,
      action,
    }: {
      title: string;
      message: string;
      action: () => void;
    }) => {
      showModal({ type: "warning", title, message, onConfirm: action });
    },
    [showModal],
  );

  const showSuccess = useCallback(
    ({
      title,
      message,
      action,
    }: {
      title: string;
      message: string;
      action: () => void;
    }) => {
      showModal({ type: "success", title, message, onConfirm: action });
    },
    [showModal],
  );

  const hideModal = useCallback(() => {
    setModalType(null);
    setOnConfirmCallback(() => () => {});
  }, []);

  const handleConfirm = () => {
    onConfirmCallback();
  };

  return (
    <ModalContext.Provider
      value={{
        showError,
        showWarning,
        showSuccess,
        showDefault,
        hideModal,
      }}
    >
      {children}
      {modalType && ["success", "default", "error"].includes(modalType) ? (
        <Modal
          closeButtonText="Fechar"
          type={modalType}
          onClose={hideModal}
          title={modalTitle}
        >
          {modalMessage}
        </Modal>
      ) : (
        modalType &&
        ["warning"].includes(modalType) && (
          <Modal
            type={modalType}
            onClose={hideModal}
            onConfirm={handleConfirm}
            title={modalTitle}
          >
            {modalMessage}
          </Modal>
        )
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
