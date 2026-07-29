import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../local/indexedDB";
import { IoSyncOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { BsCloudCheck } from "react-icons/bs";

import { clsx } from "clsx";

type SyncStatusState = "synced" | "syncing" | "error";

const iconMap: Record<
  SyncStatusState,
  { icon: React.ReactNode; label: string }
> = {
  synced: {
    icon: <BsCloudCheck size={25} className="text-success" />,
    label: "Sincronizado",
  },
  syncing: {
    icon: <IoSyncOutline size={25} className="text-primary animate-spin" />,
    label: "Sincronizando...",
  },
  error: {
    icon: <MdErrorOutline size={25} className="text-danger" />,
    label: "Falha ao sincronizar",
  },
};

const SyncStatus = () => {
  const [isHovered, setIsHovered] = useState(false);
  const queue = useLiveQuery(() => db.syncQueue.toArray(), []);

  if (!queue) return null;

  const failedCount = queue.filter((item) => item.status === "failed").length;
  const pendingCount = queue.filter(
    (item) => item.status === "pending" || item.status === "processing",
  ).length;

  const status: SyncStatusState =
    failedCount > 0 ? "error" : pendingCount > 0 ? "syncing" : "synced";

  const { icon, label } = iconMap[status];

  const detail =
    status === "syncing"
      ? `${pendingCount} ${pendingCount === 1 ? "item pendente" : "itens pendentes"}`
      : status === "error"
        ? `${failedCount} ${failedCount === 1 ? "item falhou" : "itens falharam"}`
        : null;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute top-full mt-1 left-0",
              "max-w-[200px] whitespace-normal break-words text-left",
              "rounded-md bg-neutral-60 px-2 py-1 text-xs text-white shadow-md z-30",
            )}
          >
            {label}
            {detail && <span className="opacity-70"> · {detail}</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SyncStatus;
