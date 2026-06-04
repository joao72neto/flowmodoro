import clsx from "clsx";
import { useEffect } from "react";
import { createPortal } from "react-dom";

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
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  close?: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const modalRoot = document.body;

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center z-50 bg-black/60 p-4 backdrop-blur-lg",
      )}
      onClick={() => close?.()}
    >
      <div
        className={clsx(
          "flex flex-col gap-8 text-center",
          "p-6 sm:p-8 rounded-3xl w-full relative max-h-[90vh] animate-fade-in bg-neutral-100",
          "overflow-auto overscroll-contain border border-border",
          "shadow-xl",
          sizes[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

export default ModalContainer;
