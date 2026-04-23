import BaseModal from "./BaseModal";
import { modalConfig } from "../../../configs/modal.config";
import type { ModalType, VariantType } from "../../globals.types";

const Modal = ({
  type = "default",
  title,
  closeButtonText,
  confirmButtonVariant,
  confirmButtonText,
  closeButtonVariant,
  children,
  onClose,
  onConfirm,
}: {
  type?: ModalType;
  title?: string;
  closeButtonText?: string;
  confirmButtonVariant?: VariantType;
  confirmButtonText?: string;
  closeButtonVariant?: VariantType;
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
      confirmButtonVariant={confirmButtonVariant ?? config.confirmButtonVariant}
      closeButtonVariant={closeButtonVariant ?? config.closeButtonVariant}
    >
      {children ?? config.children}
    </BaseModal>
  );
};

export default Modal;
