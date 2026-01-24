import BaseModal from "./BaseModal";
import { modalConfig } from "../../../config/modal.config";

const Modal = ({
  type = "default",
  title,
  buttonText,
  children,
  onClose,
}: {
  type?: "default" | "success" | "error" | "warning";
  title?: string;
  buttonText?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) => {
  const config = modalConfig[type];
  return (
    <BaseModal
      buttonText={buttonText ?? config.buttonText}
      title={title ?? config.title}
      onClose={onClose}
    >
      {children ?? config.children}
    </BaseModal>
  );
};

export default Modal;
