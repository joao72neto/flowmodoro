import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../local/indexedDB";
import { IoLockClosedOutline } from "react-icons/io5";

import { clsx } from "clsx";
import { isNative } from "../../consts/platform";

import { useClickOutside } from "../../shared/hooks/useClickOutside";

const SyncStatus = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const queue = useLiveQuery(() => db.syncQueue.toArray(), []);

  const resetPanel = () => {
    setIsHovered(false);
  };

  useClickOutside(containerRef, () => {
    resetPanel();
  });

  if (!queue) return null;

  return (
    <div
      className="relative flex items-center"
      onClick={() => (isNative ? setIsHovered((prev) => !prev) : undefined)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg cursor-default focus:outline-none"
        aria-label="Sincronização bloqueada"
      >
        <IoLockClosedOutline size={25} className="text-neutral-40" />
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute top-full mt-1 left-0",
              "whitespace-nowrap text-left",
              "rounded-md bg-neutral-60 px-2.5 py-1.5 text-xs text-neutral-20 shadow-md z-30",
            )}
          >
            Sincronização temporariamente bloqueada.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SyncStatus;
