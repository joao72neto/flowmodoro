import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiUpload, FiDownload } from "react-icons/fi";
import { LuDatabaseBackup } from "react-icons/lu";
import { clsx } from "clsx";

import { useClickOutside } from "../../shared/hooks/useClickOutside";
import { useImportBackup } from "../../local/backup/useBackup";

import Button from "../../shared/components/buttons/Button/Button";
import ExpandableButton from "../../shared/components/buttons/ExpandableButton";
import { useModal } from "../../shared/contexts/modal/modal.context";

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

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const errorMessage = uploadError?.message;

  if (errorMessage) {
    showError({
      title: "Erro ao realizar backup",
      message: errorMessage,
      action: () => {},
    });
    resetUpload();
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 p-4 flex flex-col items-start"
    >
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
            className="flex flex-col gap-3 pb-3"
          >
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                icon={<FiUpload />}
                variant="secondary"
                className="rounded-full"
                loading={uploadIsPending}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Button
                icon={<FiDownload />}
                variant="secondary"
                className="rounded-full"
                onClick={() => {}}
              >
                Download
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
        className={clsx("rounded-full!", { "bg-neutral-60!": isOpen })}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Backup dos Dados
      </ExpandableButton>
    </div>
  );
}

export default BackupMenu;
