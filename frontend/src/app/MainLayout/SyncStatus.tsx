import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../local/indexedDB";
import { IoSyncOutline, IoRefresh, IoTrashOutline } from "react-icons/io5";
import { MdErrorOutline, MdCloudOff } from "react-icons/md";
import { BsCloudCheck } from "react-icons/bs";
import { clsx } from "clsx";
import { Network } from "@capacitor/network";
import { isNative } from "../../consts/platform";
import syncQueue from "../../local/sync/sync-queue.service";
import type { SyncQueueModel } from "../../local/sync/sync-queue.model";

type SyncStatusState = "offline" | "synced" | "syncing" | "error";

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
  offline: {
    icon: <MdCloudOff size={25} className="text-warning" />,
    label: "Sem conexão",
  },
};

const entityTypeLabels: Record<SyncQueueModel["entityType"], string> = {
  project: "Projeto",
  tag: "Tag",
  session: "Sessão",
};

const actionLabels: Record<SyncQueueModel["action"], string> = {
  CREATE: "Criar",
  UPDATE: "Atualizar",
  DELETE: "Excluir",
};

const SyncStatus = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const queue = useLiveQuery(() => db.syncQueue.toArray(), []);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (isNative) {
      Network.getStatus().then((status) => {
        setIsOnline(status.connected);
      });

      const listener = Network.addListener("networkStatusChange", (status) => {
        setIsOnline(status.connected);
      });

      return () => {
        listener.then((l) => l.remove());
      };
    }

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!queue) return null;

  const failedItems = queue.filter((item) => item.status === "failed");
  const failedCount = failedItems.length;
  const pendingCount = queue.filter(
    (item) => item.status === "pending" || item.status === "processing",
  ).length;

  const status: SyncStatusState = !isOnline
    ? "offline"
    : failedCount > 0
      ? "error"
      : pendingCount > 0
        ? "syncing"
        : "synced";

  const { icon, label } = iconMap[status];

  const detail =
    status === "syncing"
      ? `${pendingCount} ${pendingCount === 1 ? "item pendente" : "itens pendentes"}`
      : status === "error"
        ? `${failedCount} ${failedCount === 1 ? "item falhou" : "itens falharam"}`
        : null;

  const getItemName = (item: SyncQueueModel): string => {
    const payload = item.payload as { name?: string; id?: string };
    return payload.name || payload.id || "Item";
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={() => {
          if (failedCount > 0) {
            setIsPanelOpen((prev) => !prev);
          }
        }}
        className={clsx(
          "flex items-center gap-2 rounded-lg p-1.5 transition-colors focus:outline-none",
          failedCount > 0 && "cursor-pointer hover:bg-neutral-80",
        )}
        aria-label={label}
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
      </button>

      <AnimatePresence>
        {isHovered && !isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute top-full mt-2 left-0",
              "whitespace-nowrap text-left",
              "rounded-md bg-neutral-60 px-2.5 py-1.5 text-xs text-neutral-20 shadow-md z-30 flex flex-col gap-0.5",
            )}
          >
            <div>
              {label}
              {detail && <span className="opacity-70"> · {detail}</span>}
            </div>
            {failedCount > 0 && (
              <span className="text-[10px] text-danger opacity-90">
                Clique para ver os erros
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelOpen && failedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "absolute top-full mt-2 left-0 w-80 max-w-[90vw]",
              "rounded-xl bg-neutral-80 border border-neutral-60 p-4 shadow-xl z-40 text-left text-xs",
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-60">
              <div className="flex items-center gap-2 font-medium text-text-primary">
                <MdErrorOutline className="text-danger text-base" />
                <span>Erros de Sincronização ({failedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => syncQueue.retryAllFailed()}
                  className="text-primary hover:underline text-[11px] font-medium"
                  title="Tentar sincronizar tudo novamente"
                >
                  Tentar todos
                </button>
                <button
                  type="button"
                  onClick={() => syncQueue.removeAllFailed()}
                  className="text-neutral-40 hover:text-danger text-[11px]"
                  title="Remover todos da fila"
                >
                  Limpar todos
                </button>
              </div>
            </div>

            <div className="mt-3 max-h-60 overflow-y-auto flex flex-col gap-2.5 pr-1">
              {failedItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-neutral-60/50 p-2.5 flex flex-col gap-1 border border-neutral-60"
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-text-primary">
                      {entityTypeLabels[item.entityType]}: {getItemName(item)}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-80 text-neutral-40 uppercase tracking-wider">
                      {actionLabels[item.action]}
                    </span>
                  </div>

                  <p className="text-[11px] text-danger opacity-90 line-clamp-2">
                    {item.errorMessage || item.error || "Erro desconhecido"}
                  </p>

                  <div className="flex items-center justify-end gap-2 mt-1 pt-1 border-t border-neutral-60/40">
                    <button
                      type="button"
                      onClick={() => item.id && syncQueue.retryItem(item.id)}
                      className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                    >
                      <IoRefresh size={13} />
                      <span>Tentar novamente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => item.id && syncQueue.removeItem(item.id)}
                      className="flex items-center gap-1 text-[11px] text-neutral-40 hover:text-danger"
                    >
                      <IoTrashOutline size={13} />
                      <span>Ignorar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SyncStatus;
