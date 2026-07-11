import { createContext, useContext } from "react";

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
  showInfo: ({
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

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
