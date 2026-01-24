import { useEffect } from "react";
import Button from "../Button";

import Stack from "../Stack";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

const BaseModal = ({
  title,
  children,
  closeButtonText,
  confirmButtonText,
  onClose,
  onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  closeButtonText?: string;
  confirmButtonText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex items-center justify-center absolute inset-0 overflow-hidden">
      <div className="bg-black absolute inset-0 opacity-50 z-50"></div>

      <div className="flex flex-col border border-white/10 gap-8 z-55 backdrop-blur-2xl bg-white/10 text-white max-w-[500px] min-w-[300px] rounded-xl p-6 text-center">
        {title && <h1 className="font-bold text-xl">{title}</h1>}

        <div className="px-5">{children}</div>

        <Stack wFull direction="row" gap={5}>
          {onClose && (
            <Button
              icon={<MdOutlineCancel size={20} />}
              className="w-full"
              onClick={onClose}
              variant="danger"
            >
              {closeButtonText ?? "Close"}
            </Button>
          )}
          {onConfirm && (
            <Button
              icon={<GiConfirmed size={20} />}
              className="w-full"
              onClick={onConfirm}
              variant="success"
            >
              {confirmButtonText ?? "Confirm"}
            </Button>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default BaseModal;
