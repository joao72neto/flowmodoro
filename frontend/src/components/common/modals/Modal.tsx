import BaseModal from "./BaseModal";
import { modalConfig } from "../../../config/modal.config";

const Modal = ({
  type = "default",
  title,
  closeButtonText,
  confirmButtonText,
  children,
  onClose,
  onConfirm,
}: {
  type?: "default" | "success" | "error" | "warning";
  title?: string;
  closeButtonText?: string;
  confirmButtonText?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}) => {
  const config = modalConfig[type];
  return (
    <BaseModal
      closeButtonText={closeButtonText ?? config.closeButtonText}
      confirmButtonText={confirmButtonText ?? config.confirmButtonText}
      title={title ?? config.title}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {children ?? config.children}
    </BaseModal>
  );
};

export default Modal;
