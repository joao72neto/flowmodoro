import clsx from "clsx";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "../../utils/scroll-lock.utils";
import { usePresence } from "../../hooks/usePresence";

const sizes = {
  sm: "max-w-md",
  md: "max-w-[600px]",
  lg: "max-w-[800px]",
};

const ModalContainer = ({
  children,
  className,
  size = "sm",
  close,
  isOpen,
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  close?: () => void;
  isOpen: boolean;
}) => {
  const { mounted, visible } = usePresence(isOpen, 200);

  useEffect(() => {
    if (!mounted) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [mounted]);

  const modalRoot = document.body;

  return createPortal(
    mounted && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        onClick={() => close?.()}
      >
        <div
          className={clsx(
            "flex flex-col gap-8 text-center",
            "relative w-full max-h-[90vh] rounded-3xl bg-neutral-100 p-6 sm:p-8",
            "overflow-auto overscroll-contain border border-border",
            "shadow-xl",
            visible ? "animate-fade-in" : "animate-fade-out",
            sizes[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    ),
    modalRoot,
  );
};

export default ModalContainer;
