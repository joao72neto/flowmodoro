import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuDatabaseBackup } from "react-icons/lu";
import { clsx } from "clsx";

import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import { useExportBackup, useImportBackup } from "../../../local/backup/useBackup";

import Button from "../../../shared/components/buttons/Button/Button";
import ExpandableButton from "../../../shared/components/buttons/ExpandableButton";
import { useModal } from "../../../shared/contexts/modal/modal.context";
import { CiImport, CiExport } from "react-icons/ci";

function BackupMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showError } = useModal();

  const {
    mutate: upload,
    error: uploadError,
    reset: resetUpload,
    isPending: uploadIsPending,
  } = useImportBackup();

  const {
    mutate: download,
    error: downloadError,
    reset: resetDownload,
    isPending: downloadIsPending,
  } = useExportBackup();

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const errorMessage = uploadError?.message || downloadError?.message;

  if (errorMessage) {
    showError({
      title: "Erro ao realizar backup",
      message: errorMessage,
      action: () => {},
    });

    resetUpload();
    resetDownload();
  }

  return (
    <div ref={containerRef} className="relative flex flex-col items-start">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute bottom-full left-0 flex flex-col gap-3 pb-3 overflow-hidden px-1 pt-1"
          >
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                icon={<CiImport />}
                variant="secondary"
                className="rounded-full"
                loading={uploadIsPending}
                disabled={downloadIsPending}
                onClick={() => fileInputRef.current?.click()}
              >
                Importar
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Button
                icon={<CiExport />}
                variant="secondary"
                className="rounded-full"
                loading={downloadIsPending}
                disabled={uploadIsPending}
                onClick={() => download()}
              >
                Exportar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExpandableButton
        variant="secondary"
        disableExpansion={isOpen}
        icon={
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <LuDatabaseBackup size={25} />
          </motion.span>
        }
        className={clsx("rounded-full! ml-1!", { "bg-neutral-60!": isOpen })}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Backup dos Dados
      </ExpandableButton>
    </div>
  );
}

export default BackupMenu;
