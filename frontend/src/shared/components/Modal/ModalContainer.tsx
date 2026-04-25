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
        "fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4",
      )}
      onClick={() => close?.()}
    >
      <div
        className={clsx(
          "flex flex-col gap-8 text-center",
          "p-6 rounded-xl w-full relative max-h-[90vh] animate-fade-in bg-white/10",
          "overflow-auto overscroll-contain backdrop-blur-2xl border border-white/10",
          "shadow-2xl",
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
