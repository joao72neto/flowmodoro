import BaseModal from "./BaseModal";
import { modalConfig } from "../../../configs/modal.configs";
import type { ModalType, VariantType } from "../../global.types";

const Modal = ({
  isOpen,
  type = "default",
  title,
  closeButtonText,
  confirmButtonVariant,
  confirmButtonText,
  closeButtonVariant,
  children,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  type?: ModalType;
  title?: string;
  closeButtonText?: string;
  confirmButtonVariant?: VariantType;
  confirmButtonText?: string;
  closeButtonVariant?: VariantType;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
}) => {
  const config = modalConfig[type];
  return (
    <BaseModal
      isOpen={isOpen}
      closeButtonText={closeButtonText ?? config.closeButtonText}
      confirmButtonText={confirmButtonText ?? config.confirmButtonText}
      title={title ?? config.title}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmButtonVariant={confirmButtonVariant ?? config.confirmButtonVariant}
      closeButtonVariant={closeButtonVariant ?? config.closeButtonVariant}
      isLoading={isLoading}
    >
      {children ?? config.children}
    </BaseModal>
  );
};

export default Modal;
