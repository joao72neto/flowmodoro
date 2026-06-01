import Modal from "../components/Modal/Modal";
import { createContext, useContext, useState, useCallback } from "react";
import type { ModalType } from "../globals.types";

interface IModalContext {
  showError: ({
    title,
    message,
    action,
    cancel,
    confirmLabel,
    cancelLabel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;
  showWarning: ({
    title,
    message,
    action,
    cancel,
    confirmLabel,
    cancelLabel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;
  showSuccess: ({
    title,
    message,
    action,
    cancel,
    confirmLabel,
    cancelLabel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;
  showDefault: ({
    title,
    message,
    action,
    cancel,
    confirmLabel,
    cancelLabel,
  }: {
    title: string;
    message: string;
    action: () => void;
    cancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;
  hideModal: () => void;
  setModalLoading: (isLoading: boolean) => void;
}

export const ModalContext = createContext<IModalContext | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setTitle] = useState<string>("");
  const [confirmLabel, setConfirmLabel] = useState<string | undefined>(
    undefined,
  );
  const [cancelLabel, setCancelLabel] = useState<string | undefined>(undefined);
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => {},
  );
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(
    null,
  );
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const showModal = useCallback(
    ({
      type,
      title,
      message,
      onConfirm,
      onCancel,
      confirmLabel,
      cancelLabel,
    }: {
      type: ModalType;
      title: string;
      message: string;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }) => {
      setModalType(type);
      setTitle(title);
      setModalMessage(message);
      setConfirmLabel(confirmLabel);
      setCancelLabel(cancelLabel);
      setOnConfirmCallback(() => onConfirm || (() => {}));
      setOnCancelCallback(() => onCancel || null);
      setIsModalLoading(false);
    },
    [],
  );

  const showDefault = useCallback(
    ({
      title,
      message,
      action,
      cancel,
      confirmLabel,
      cancelLabel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }) => {
      showModal({
        type: "default",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
        confirmLabel,
        cancelLabel,
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
      confirmLabel,
      cancelLabel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }) => {
      showModal({
        type: "error",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
        confirmLabel,
        cancelLabel,
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
      confirmLabel,
      cancelLabel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }) => {
      showModal({
        type: "warning",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
        confirmLabel,
        cancelLabel,
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
      confirmLabel,
      cancelLabel,
    }: {
      title: string;
      message: string;
      action: () => void;
      cancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
    }) => {
      showModal({
        type: "success",
        title,
        message,
        onConfirm: action,
        onCancel: cancel,
        confirmLabel,
        cancelLabel,
      });
    },
    [showModal],
  );

  const hideModal = useCallback(() => {
    setModalType(null);
    setConfirmLabel(undefined);
    setCancelLabel(undefined);
    setOnConfirmCallback(() => () => {});
    setOnCancelCallback(null);
    setIsModalLoading(false);
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
        setModalLoading: setIsModalLoading,
      }}
    >
      {children}
      {modalType && (
        <Modal
          type={modalType}
          title={modalTitle}
          closeButtonText={cancelLabel}
          confirmButtonText={confirmLabel}
          onClose={handleCancel}
          onConfirm={
            modalType === "warning" || confirmLabel ? handleConfirm : undefined
          }
          isLoading={isModalLoading}
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
