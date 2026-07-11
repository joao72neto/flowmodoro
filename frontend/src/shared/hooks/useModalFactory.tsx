import type { ComponentType } from "react";
import { useState, useCallback } from "react";

type ModalInjectedProps = {
  isOpen: boolean;
  close: () => void;
};

export const useModalFactory = <P extends ModalInjectedProps>(
  ModalComponent: ComponentType<P>,
) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const Modal = useCallback(
    (props: Omit<P, keyof ModalInjectedProps>) => {
      if (!isOpen) return null;

      return (
        <ModalComponent {...(props as P)} isOpen={isOpen} close={closeModal} />
      );
    },
    [isOpen, closeModal, ModalComponent],
  );

  return {
    openModal,
    closeModal,
    isOpen,
    Modal,
  };
};
