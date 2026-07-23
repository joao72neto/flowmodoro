import { AnimatePresence, motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

type LayoutMode = boolean | "position" | "size" | "preserve-aspect";

interface AnimatedListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  children: (item: T) => ReactNode;
  className?: string;
  transition?: Transition;
  enableLayoutAnimation?: LayoutMode;
}

export function AnimatedList<T>({
  items,
  getKey,
  children,
  className,
  transition = { duration: 0.25 },
  enableLayoutAnimation = true,
}: AnimatedListProps<T>) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {items.map((item) => (
        <motion.div
          key={getKey(item)}
          layout={enableLayoutAnimation}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={transition}
          className={className}
        >
          {children(item)}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
