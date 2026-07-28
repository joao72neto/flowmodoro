import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiUpload, FiDownload } from "react-icons/fi";
import { LuDatabaseBackup } from "react-icons/lu";
import { clsx } from "clsx";
import { useClickOutside } from "../../shared/hooks/useClickOutside";
import Button from "../../shared/components/buttons/Button/Button";
import ExpandableButton from "../../shared/components/buttons/ExpandableButton";

type BackupMenuProps = {
  onUpload?: () => void;
  onDownload?: () => void;
};

const menuItems = (onUpload?: () => void, onDownload?: () => void) => [
  { icon: <FiUpload />, label: "Upload", onClick: onUpload },
  { icon: <FiDownload />, label: "Download", onClick: onDownload },
];

const BackupMenu = ({ onUpload, onDownload }: BackupMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 p-4 flex flex-col items-start"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-3 pb-3"
          >
            {menuItems(onUpload, onDownload).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Button
                  icon={item.icon}
                  variant="secondary"
                  className="rounded-full"
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
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
        className={clsx("rounded-full!", { "bg-secondary/70!": isOpen })}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Backup dos Dados
      </ExpandableButton>
    </div>
  );
};

export default BackupMenu;
