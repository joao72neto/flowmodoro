import Button from "../Button";

import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import ModalContainer from "./ModalContainer";
import type { VariantType } from "../../types/globals.types";

const BaseModal = ({
  title,
  children,
  closeButtonText,
  closeButtonVariant,
  confirmButtonText,
  confirmButtonVariant,
  onClose,
  onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  closeButtonVariant?: VariantType;
  closeButtonText?: string;
  confirmButtonVariant?: VariantType;
  confirmButtonText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}) => {
  return (
    <ModalContainer>
      {title && <h1 className="font-bold text-xl">{title}</h1>}

      <div className="px-5">{children}</div>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
        {onClose && (
          <Button
            icon={<MdOutlineCancel size={20} />}
            className="w-full"
            onClick={onClose}
            variant={closeButtonVariant || "danger"}
          >
            {closeButtonText ?? "Close"}
          </Button>
        )}
        {onConfirm && (
          <Button
            icon={<GiConfirmed size={20} />}
            className="w-full"
            onClick={onConfirm}
            variant={confirmButtonVariant || "primary"}
          >
            {confirmButtonText ?? "Confirm"}
          </Button>
        )}
      </div>
    </ModalContainer>
  );
};

export default BaseModal;
