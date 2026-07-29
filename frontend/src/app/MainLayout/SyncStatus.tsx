import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../local/indexedDB";
import { IoSyncOutline } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";

type SyncStatusState = "synced" | "syncing" | "error";

const SyncStatus = () => {
  const queue = useLiveQuery(() => db.syncQueue.toArray(), []);

  if (!queue) return null;

  const status: SyncStatusState = queue.some((item) => item.status === "failed")
    ? "error"
    : queue.some(
          (item) => item.status === "pending" || item.status === "processing",
        )
      ? "syncing"
      : "synced";

  const iconMap: Record<
    SyncStatusState,
    { icon: React.ReactNode; label: string }
  > = {
    synced: {
      icon: <FiCheckCircle size={20} className="text-success" />,
      label: "Sincronizado",
    },
    syncing: {
      icon: <IoSyncOutline size={22} className="text-primary animate-spin" />,
      label: "Sincronizando...",
    },
    error: {
      icon: <MdErrorOutline size={22} className="text-danger" />,
      label: "Falha ao sincronizar",
    },
  };

  const { icon, label } = iconMap[status];

  return (
    <div title={label} className="flex items-center">
      {icon}
    </div>
  );
};

export default SyncStatus;
