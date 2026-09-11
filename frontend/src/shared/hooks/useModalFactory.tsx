import type { ComponentType } from "react";
import { useState, useCallback, useRef, useMemo } from "react";

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

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const Modal = useMemo(() => {
    const Component = (props: Omit<P, keyof ModalInjectedProps>) => (
      <ModalComponent
        {...(props as P)}
        isOpen={isOpenRef.current}
        close={closeModal}
      />
    );
    return Component;
  }, [ModalComponent, closeModal]);

  return {
    openModal,
    closeModal,
    isOpen,
    Modal,
  };
};
