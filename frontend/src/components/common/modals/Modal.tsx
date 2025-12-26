import BaseModal from "./BaseModal";
import { modalConfig } from "../../../config/modal.config";

const Modal = ({
  type = "default",
  title,
  buttonText,
  children,
}: {
  type?: "default" | "success" | "error" | "warning";
  title?: string;
  buttonText?: string;
  children?: React.ReactNode;
}) => {
  const config = modalConfig[type];
  return (
    <BaseModal
      buttonText={buttonText ?? config.buttonText}
      title={title ?? config.title}
    >
      {children ?? config.children}
    </BaseModal>
  );
};

export default Modal;
