import Modal from "./components/Modal/Modal";
import { createContext, useContext, useState, useCallback } from "react";
import type { ModalType } from "./globals.types";

interface IModalContext {
  showError: ({
    title,
    message,
    action,
    cancel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
  }) => void;
  showWarning: ({
    title,
    message,
    action,
    cancel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
  }) => void;
  showSuccess: ({
    title,
    message,
    action,
    cancel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
  }) => void;
  showDefault: ({
    title,
    message,
    action,
    cancel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
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
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(
    null,
  );

  const showModal = useCallback(
    ({
      type,
      title,
      message,
      onConfirm,
      onCancel,
    }: {
      type: ModalType;
      title: string;
      message: string;
      onConfirm?: () => void;
      onCancel?: () => void;
    }) => {
      setModalType(type);
      setTitle(title);
      setModalMessage(message);
      setOnConfirmCallback(() => onConfirm || (() => {}));
      setOnCancelCallback(() => onCancel || null);
    },
    [],
  );

  const showDefault = useCallback(
    ({
      title,
      message,
      action,
      cancel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
    }) => {
      showModal({
        type: "default",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
      });
    },
    [showModal],
  );

  const showError = useCallback(
    ({
      title,
      message,
      action,
      cancel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
    }) => {
      showModal({
        type: "error",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
      });
    },
    [showModal],
  );

  const showWarning = useCallback(
    ({
      title,
      message,
      action,
      cancel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
    }) => {
      showModal({
        type: "warning",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
      });
    },
    [showModal],
  );

  const showSuccess = useCallback(
    ({
      title,
      message,
      action,
      cancel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
    }) => {
      showModal({
        type: "success",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
      });
    },
    [showModal],
  );

  const hideModal = useCallback(() => {
    setModalType(null);
    setOnConfirmCallback(() => () => {});
    setOnCancelCallback(null);
  }, []);

  const handleConfirm = () => {
    onConfirmCallback();
  };

  const handleCancel = () => {
    if (onCancelCallback) {
      onCancelCallback();
    }
    hideModal();
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
          onClose={handleCancel}
          title={modalTitle}
        >
          {modalMessage}
        </Modal>
      ) : (
        modalType &&
        ["warning"].includes(modalType) && (
          <Modal
            type={modalType}
            onClose={handleCancel}
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
