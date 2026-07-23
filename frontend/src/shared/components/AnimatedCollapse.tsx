import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCollapseProps {
  show: boolean;
  children: ReactNode;
}

export const AnimatedCollapse = ({ show, children }: AnimatedCollapseProps) => {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="collapse-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-full overflow-hidden px-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
