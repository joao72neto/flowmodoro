import clsx from "clsx";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lockScroll, unlockScroll } from "../../utils/scroll-lock.utils";

const sizes = {
  sm: "max-w-md",
  md: "max-w-[600px]",
  lg: "max-w-[800px]",
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

const panelVariantsLight = {
  hidden: { scale: 0.98 },
  visible: { scale: 1 },
};

const ModalContainer = ({
  children,
  className,
  size = "sm",
  close,
  isOpen,
  enableHeavyAnimations = true,
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  close?: () => void;
  isOpen: boolean;
  enableHeavyAnimations?: boolean;
}) => {
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  const modalRoot = document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            "fixed inset-0 flex items-center justify-center z-50 bg-black/60 p-4",
            enableHeavyAnimations ? "backdrop-blur-lg" : "backdrop-blur-xs",
          )}
          onClick={() => close?.()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: enableHeavyAnimations ? 0.2 : 0.15,
            ease: "easeOut",
          }}
        >
          <motion.div
            layout={enableHeavyAnimations ? "position" : false}
            className={clsx(
              "flex flex-col gap-8 text-center",
              "p-6 sm:p-8 rounded-3xl w-full relative max-h-[90vh] bg-neutral-100",
              "overflow-auto overscroll-contain border border-border",
              "shadow-xl",
              sizes[size],
              className,
            )}
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={
              enableHeavyAnimations ? panelVariants : panelVariantsLight
            }
            transition={{
              duration: enableHeavyAnimations ? 0.2 : 0.15,
              ease: "easeOut",
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot,
  );
};

export default ModalContainer;
